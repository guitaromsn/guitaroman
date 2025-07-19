require('dotenv').config();
const fs = require('fs').promises;
const path = require('path');
const { dbConnection } = require('../config/database');

class DatabaseMigrator {
  async runMigrations() {
    try {
      console.log('Starting database migration...');
      
      // Connect to database
      await dbConnection.connect();
      console.log('Connected to Azure SQL Database');

      // Read and execute schema
      const schemaPath = path.join(__dirname, 'schema.sql');
      const schemaSQL = await fs.readFile(schemaPath, 'utf8');
      
      console.log('Executing database schema...');
      
      // Split SQL commands by GO statements
      const commands = schemaSQL.split(/\r?\nGO\r?\n/);
      
      for (let i = 0; i < commands.length; i++) {
        const command = commands[i].trim();
        if (command && !command.startsWith('--')) {
          try {
            await dbConnection.executeQuery(command);
            console.log(`Executed command ${i + 1}/${commands.length}`);
          } catch (error) {
            // Some commands might fail if objects already exist, that's okay
            if (!error.message.includes('already exists') && 
                !error.message.includes('already an object named')) {
              console.warn(`Warning executing command ${i + 1}:`, error.message);
            }
          }
        }
      }

      // Run seed data
      await this.seedInitialData();

      console.log('Database migration completed successfully!');
    } catch (error) {
      console.error('Migration failed:', error);
      throw error;
    }
  }

  async seedInitialData() {
    try {
      console.log('Seeding initial data...');

      // Create default admin user
      const adminExists = await dbConnection.executeQuery(
        "SELECT COUNT(*) as count FROM Users WHERE Email = 'admin@amanatkalima.com'"
      );

      if (adminExists.recordset[0].count === 0) {
        const bcrypt = require('bcryptjs');
        const { v4: uuidv4 } = require('uuid');
        
        const adminId = uuidv4();
        const hashedPassword = await bcrypt.hash('Admin123!', 12);

        await dbConnection.executeQuery(`
          INSERT INTO Users (Id, Email, PasswordHash, FirstName, LastName, Role, IsActive)
          VALUES (@id, @email, @password, @firstName, @lastName, @role, 1)
        `, {
          id: adminId,
          email: 'admin@amanatkalima.com',
          password: hashedPassword,
          firstName: 'System',
          lastName: 'Administrator',
          role: 'admin'
        });

        console.log('Created default admin user: admin@amanatkalima.com / Admin123!');

        // Update ZATCA settings with admin user ID
        await dbConnection.executeQuery(`
          UPDATE ZatcaSettings SET UpdatedBy = @adminId WHERE UpdatedBy = '00000000-0000-0000-0000-000000000000'
        `, { adminId });
      }

      // Seed sample inventory categories
      const sampleItems = [
        {
          name: 'Web Development Service',
          description: 'Professional web development services',
          sku: 'WEB-DEV-001',
          category: 'Services',
          unitPrice: 500.00,
          unit: 'hour',
          vatRate: 15.00
        },
        {
          name: 'Mobile App Development',
          description: 'Mobile application development services',
          sku: 'MOB-DEV-001',
          category: 'Services',
          unitPrice: 600.00,
          unit: 'hour',
          vatRate: 15.00
        },
        {
          name: 'Software Consulting',
          description: 'Software architecture and consulting services',
          sku: 'CONS-001',
          category: 'Consulting',
          unitPrice: 800.00,
          unit: 'hour',
          vatRate: 15.00
        }
      ];

      for (const item of sampleItems) {
        const exists = await dbConnection.executeQuery(
          "SELECT COUNT(*) as count FROM InventoryItems WHERE SKU = @sku",
          { sku: item.sku }
        );

        if (exists.recordset[0].count === 0) {
          const { v4: uuidv4 } = require('uuid');
          
          // Get admin user ID
          const admin = await dbConnection.executeQuery(
            "SELECT Id FROM Users WHERE Role = 'admin' AND Email = 'admin@amanatkalima.com'"
          );
          
          if (admin.recordset.length > 0) {
            await dbConnection.executeQuery(`
              INSERT INTO InventoryItems (Id, Name, Description, SKU, Category, UnitPrice, Unit, VatRate, CreatedBy)
              VALUES (@id, @name, @description, @sku, @category, @unitPrice, @unit, @vatRate, @createdBy)
            `, {
              id: uuidv4(),
              name: item.name,
              description: item.description,
              sku: item.sku,
              category: item.category,
              unitPrice: item.unitPrice,
              unit: item.unit,
              vatRate: item.vatRate,
              createdBy: admin.recordset[0].Id
            });

            console.log(`Created sample item: ${item.name}`);
          }
        }
      }

      console.log('Initial data seeding completed');
    } catch (error) {
      console.error('Error seeding initial data:', error);
      throw error;
    }
  }

  async checkDatabaseConnection() {
    try {
      const health = await dbConnection.healthCheck();
      console.log('Database health check:', health);
      return health.status === 'healthy';
    } catch (error) {
      console.error('Database health check failed:', error);
      return false;
    }
  }
}

// Run migration if called directly
if (require.main === module) {
  const migrator = new DatabaseMigrator();
  
  migrator.runMigrations()
    .then(() => {
      console.log('Migration script completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration script failed:', error);
      process.exit(1);
    });
}

module.exports = DatabaseMigrator;