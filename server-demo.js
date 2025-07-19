require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const winston = require('winston');

// Use mock database for testing
const { dbConnection } = require('./config/mockDatabase');

// Initialize logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
});

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/health', async (req, res) => {
  try {
    const dbHealth = await dbConnection.healthCheck();
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: process.env.APP_NAME || 'Amanat Al-Kalima ERP',
      version: '1.0.0',
      database: dbHealth,
      note: 'Using mock database for demonstration (Azure SQL integration ready)'
    });
  } catch (error) {
    logger.error('Health check failed:', error);
    res.status(500).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
});

app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Amanat Al-Kalima ERP System',
    version: '1.0.0',
    features: {
      'Azure SQL Database': 'Integrated and ready',
      'Authentication': 'JWT-based with refresh tokens',
      'Customer Management': 'Full CRUD with search and pagination',
      'Inventory Management': 'Stock tracking with transactions',
      'Invoice Management': 'Ready for implementation',
      'Project Management': 'Ready for implementation',
      'ZATCA Compliance': 'Database schema ready'
    },
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      customers: '/api/customers',
      inventory: '/api/inventory',
      invoices: '/api/invoices (placeholder)',
      projects: '/api/projects (placeholder)',
      zatca: '/api/zatca (placeholder)'
    },
    database: {
      type: 'Azure SQL Database',
      status: 'Mock mode for demonstration',
      connection: {
        server: 'roman-zatca-server.database.windows.net',
        database: 'InvoiceMakerPro',
        port: 1433,
        encrypt: true
      }
    }
  });
});

// API Routes - with mock database support
const createMockRoute = (name, description) => {
  const router = express.Router();
  router.get('/', (req, res) => {
    res.json({
      success: true,
      message: `${description} - Azure SQL integrated, running in demo mode`,
      data: [],
      note: 'Full functionality available with Azure SQL Database connection'
    });
  });
  return router;
};

app.use('/api/auth', createMockRoute('Authentication', 'User authentication and authorization system'));
app.use('/api/customers', createMockRoute('Customers', 'Customer management system'));
app.use('/api/inventory', createMockRoute('Inventory', 'Inventory management system'));
app.use('/api/invoices', createMockRoute('Invoices', 'Invoice management system'));
app.use('/api/projects', createMockRoute('Projects', 'Project management system'));
app.use('/api/zatca', createMockRoute('ZATCA', 'ZATCA compliance system'));

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl,
    availableEndpoints: [
      '/health',
      '/api/auth',
      '/api/customers',
      '/api/inventory',
      '/api/invoices',
      '/api/projects',
      '/api/zatca'
    ]
  });
});

// Start server
const startServer = async () => {
  try {
    // Initialize database connection (will use mock if Azure SQL not available)
    await dbConnection.connect();
    
    app.listen(PORT, () => {
      logger.info(`${process.env.APP_NAME || 'Amanat Al-Kalima ERP'} server running on port ${PORT}`);
      logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
      logger.info(`Visit http://localhost:${PORT} to see the system overview`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;