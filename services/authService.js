const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { dbConnection, sql } = require('../config/database');

class AuthService {
  async createUser(userData) {
    try {
      const { email, password, firstName, lastName, role = 'user' } = userData;

      // Check if user already exists
      const existingUser = await this.getUserByEmail(email);
      if (existingUser) {
        return { success: false, message: 'User already exists with this email' };
      }

      // Hash password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Generate user ID
      const userId = uuidv4();

      // Insert user into database
      const query = `
        INSERT INTO Users (Id, Email, PasswordHash, FirstName, LastName, Role, CreatedAt, UpdatedAt, IsActive)
        OUTPUT INSERTED.*
        VALUES (@id, @email, @passwordHash, @firstName, @lastName, @role, GETDATE(), GETDATE(), 1)
      `;

      const result = await dbConnection.executeQuery(query, {
        id: userId,
        email: email.toLowerCase(),
        passwordHash: hashedPassword,
        firstName,
        lastName,
        role
      });

      const user = result.recordset[0];
      
      // Remove sensitive data
      delete user.PasswordHash;

      // Generate tokens
      const { token, refreshToken } = await this.generateTokens(user);

      return {
        success: true,
        user,
        token,
        refreshToken
      };
    } catch (error) {
      console.error('Create user error:', error);
      return { success: false, message: 'Failed to create user' };
    }
  }

  async authenticateUser(email, password) {
    try {
      const user = await this.getUserByEmail(email, true);
      if (!user) {
        return { success: false, message: 'Invalid credentials' };
      }

      if (!user.IsActive) {
        return { success: false, message: 'Account is disabled' };
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.PasswordHash);
      if (!isValidPassword) {
        return { success: false, message: 'Invalid credentials' };
      }

      // Remove sensitive data
      delete user.PasswordHash;

      // Generate tokens
      const { token, refreshToken } = await this.generateTokens(user);

      // Update last login
      await this.updateLastLogin(user.Id);

      return {
        success: true,
        user,
        token,
        refreshToken
      };
    } catch (error) {
      console.error('Authenticate user error:', error);
      return { success: false, message: 'Authentication failed' };
    }
  }

  async getUserByEmail(email, includePassword = false) {
    try {
      const fields = includePassword 
        ? 'Id, Email, PasswordHash, FirstName, LastName, Role, CreatedAt, UpdatedAt, IsActive, LastLoginAt'
        : 'Id, Email, FirstName, LastName, Role, CreatedAt, UpdatedAt, IsActive, LastLoginAt';
      
      const query = `SELECT ${fields} FROM Users WHERE Email = @email`;
      const result = await dbConnection.executeQuery(query, { email: email.toLowerCase() });
      
      return result.recordset[0] || null;
    } catch (error) {
      console.error('Get user by email error:', error);
      return null;
    }
  }

  async getUserById(id) {
    try {
      const query = `
        SELECT Id, Email, FirstName, LastName, Role, CreatedAt, UpdatedAt, IsActive, LastLoginAt
        FROM Users 
        WHERE Id = @id AND IsActive = 1
      `;
      const result = await dbConnection.executeQuery(query, { id });
      
      return result.recordset[0] || null;
    } catch (error) {
      console.error('Get user by ID error:', error);
      return null;
    }
  }

  async updateUser(id, updateData) {
    try {
      const { firstName, lastName, email } = updateData;
      
      // Check if email is already taken by another user
      if (email) {
        const existingUser = await this.getUserByEmail(email);
        if (existingUser && existingUser.Id !== id) {
          return { success: false, message: 'Email already in use' };
        }
      }

      const query = `
        UPDATE Users 
        SET FirstName = @firstName, LastName = @lastName, Email = @email, UpdatedAt = GETDATE()
        OUTPUT INSERTED.Id, INSERTED.Email, INSERTED.FirstName, INSERTED.LastName, INSERTED.Role, INSERTED.CreatedAt, INSERTED.UpdatedAt, INSERTED.IsActive, INSERTED.LastLoginAt
        WHERE Id = @id AND IsActive = 1
      `;

      const result = await dbConnection.executeQuery(query, {
        id,
        firstName,
        lastName,
        email: email ? email.toLowerCase() : undefined
      });

      if (result.recordset.length === 0) {
        return { success: false, message: 'User not found' };
      }

      return {
        success: true,
        user: result.recordset[0]
      };
    } catch (error) {
      console.error('Update user error:', error);
      return { success: false, message: 'Failed to update user' };
    }
  }

  async changePassword(userId, currentPassword, newPassword) {
    try {
      const user = await this.getUserByEmail((await this.getUserById(userId)).Email, true);
      if (!user) {
        return { success: false, message: 'User not found' };
      }

      // Verify current password
      const isValidPassword = await bcrypt.compare(currentPassword, user.PasswordHash);
      if (!isValidPassword) {
        return { success: false, message: 'Current password is incorrect' };
      }

      // Hash new password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

      // Update password
      const query = `
        UPDATE Users 
        SET PasswordHash = @passwordHash, UpdatedAt = GETDATE()
        WHERE Id = @id
      `;

      await dbConnection.executeQuery(query, {
        id: userId,
        passwordHash: hashedPassword
      });

      return { success: true };
    } catch (error) {
      console.error('Change password error:', error);
      return { success: false, message: 'Failed to change password' };
    }
  }

  async generateTokens(user) {
    const payload = {
      id: user.Id,
      email: user.Email,
      role: user.Role
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '24h'
    });

    const refreshToken = jwt.sign(
      { id: user.Id, type: 'refresh' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Store refresh token in database
    await this.storeRefreshToken(user.Id, refreshToken);

    return { token, refreshToken };
  }

  async refreshToken(refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
      
      if (decoded.type !== 'refresh') {
        return { success: false, message: 'Invalid token type' };
      }

      // Check if refresh token exists in database
      const isValid = await this.validateRefreshToken(decoded.id, refreshToken);
      if (!isValid) {
        return { success: false, message: 'Invalid refresh token' };
      }

      const user = await this.getUserById(decoded.id);
      if (!user) {
        return { success: false, message: 'User not found' };
      }

      // Generate new tokens
      const tokens = await this.generateTokens(user);

      // Revoke old refresh token
      await this.revokeRefreshToken(refreshToken);

      return {
        success: true,
        token: tokens.token,
        refreshToken: tokens.refreshToken
      };
    } catch (error) {
      console.error('Refresh token error:', error);
      return { success: false, message: 'Invalid refresh token' };
    }
  }

  async storeRefreshToken(userId, refreshToken) {
    try {
      const query = `
        INSERT INTO RefreshTokens (Id, UserId, Token, CreatedAt, ExpiresAt)
        VALUES (@id, @userId, @token, GETDATE(), DATEADD(day, 7, GETDATE()))
      `;

      await dbConnection.executeQuery(query, {
        id: uuidv4(),
        userId,
        token: refreshToken
      });
    } catch (error) {
      console.error('Store refresh token error:', error);
    }
  }

  async validateRefreshToken(userId, refreshToken) {
    try {
      const query = `
        SELECT Id FROM RefreshTokens 
        WHERE UserId = @userId AND Token = @token AND ExpiresAt > GETDATE()
      `;
      
      const result = await dbConnection.executeQuery(query, {
        userId,
        token: refreshToken
      });

      return result.recordset.length > 0;
    } catch (error) {
      console.error('Validate refresh token error:', error);
      return false;
    }
  }

  async revokeRefreshToken(refreshToken) {
    try {
      const query = `DELETE FROM RefreshTokens WHERE Token = @token`;
      await dbConnection.executeQuery(query, { token: refreshToken });
    } catch (error) {
      console.error('Revoke refresh token error:', error);
    }
  }

  async updateLastLogin(userId) {
    try {
      const query = `
        UPDATE Users 
        SET LastLoginAt = GETDATE()
        WHERE Id = @id
      `;
      await dbConnection.executeQuery(query, { id: userId });
    } catch (error) {
      console.error('Update last login error:', error);
    }
  }
}

module.exports = new AuthService();