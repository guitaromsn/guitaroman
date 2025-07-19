const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Login endpoint
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Username and password are required'
            });
        }

        // Find user by username or email
        const user = await User.findOne({
            where: {
                [require('sequelize').Op.or]: [
                    { username: username },
                    { email: username }
                ]
            }
        });

        if (!user || !user.is_active) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check password
        const isPasswordValid = await user.checkPassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Update last login
        await user.update({ last_login: new Date() });

        // Generate JWT token
        const token = jwt.sign(
            { 
                userId: user.id, 
                username: user.username,
                role: user.role 
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE || '7d' }
        );

        res.json({
            success: true,
            message: 'Login successful',
            data: {
                token,
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    role: user.role,
                    last_login: user.last_login
                }
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Login failed',
            error: error.message
        });
    }
});

// Get current user profile
router.get('/profile', authenticateToken, async (req, res) => {
    try {
        res.json({
            success: true,
            data: {
                user: {
                    id: req.user.id,
                    username: req.user.username,
                    email: req.user.email,
                    first_name: req.user.first_name,
                    last_name: req.user.last_name,
                    role: req.user.role,
                    is_active: req.user.is_active,
                    last_login: req.user.last_login,
                    createdAt: req.user.createdAt,
                    updatedAt: req.user.updatedAt
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch profile',
            error: error.message
        });
    }
});

// Refresh token
router.post('/refresh', authenticateToken, async (req, res) => {
    try {
        const newToken = jwt.sign(
            { 
                userId: req.user.id, 
                username: req.user.username,
                role: req.user.role 
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE || '7d' }
        );

        res.json({
            success: true,
            message: 'Token refreshed successfully',
            data: { token: newToken }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Token refresh failed',
            error: error.message
        });
    }
});

// Logout (client-side token removal, no server-side action needed with JWT)
router.post('/logout', authenticateToken, (req, res) => {
    res.json({
        success: true,
        message: 'Logout successful'
    });
});

module.exports = router;