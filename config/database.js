const sql = require('mssql');
const winston = require('winston');

// Logger configuration
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

// Azure SQL Database configuration
const config = {
  user: process.env.DB_USER || 'rh7',
  password: process.env.DB_PASSWORD || 'Whyme7121$',
  server: process.env.DB_SERVER || 'roman-zatca-server.database.windows.net',
  database: process.env.DB_NAME || 'InvoiceMakerPro',
  port: parseInt(process.env.DB_PORT) || 1433,
  options: {
    encrypt: process.env.DB_ENCRYPT === 'true' || true,
    trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === 'true' || false,
    enableArithAbort: true
  },
  connectionTimeout: parseInt(process.env.DB_CONNECTION_TIMEOUT) || 30000,
  requestTimeout: parseInt(process.env.DB_REQUEST_TIMEOUT) || 15000,
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};

class DatabaseConnection {
  constructor() {
    this.pool = null;
    this.isConnected = false;
    this.retryCount = 0;
    this.maxRetries = 3;
  }

  async connect() {
    try {
      if (this.pool && this.isConnected) {
        return this.pool;
      }

      logger.info('Connecting to Azure SQL Database...');
      this.pool = await sql.connect(config);
      this.isConnected = true;
      this.retryCount = 0;
      
      logger.info('Successfully connected to Azure SQL Database');
      
      // Test connection
      await this.pool.request().query('SELECT 1 as test');
      logger.info('Database connection test successful');
      
      return this.pool;
    } catch (error) {
      this.isConnected = false;
      logger.error('Database connection error:', error);
      
      if (this.retryCount < this.maxRetries) {
        this.retryCount++;
        logger.info(`Retrying connection (${this.retryCount}/${this.maxRetries})...`);
        await this.delay(5000 * this.retryCount); // Exponential backoff
        return this.connect();
      }
      
      throw error;
    }
  }

  async disconnect() {
    try {
      if (this.pool) {
        await this.pool.close();
        this.pool = null;
        this.isConnected = false;
        logger.info('Database connection closed');
      }
    } catch (error) {
      logger.error('Error closing database connection:', error);
      throw error;
    }
  }

  async getConnection() {
    if (!this.isConnected || !this.pool) {
      await this.connect();
    }
    return this.pool;
  }

  async executeQuery(query, params = {}) {
    try {
      const pool = await this.getConnection();
      const request = pool.request();
      
      // Add parameters to request
      Object.keys(params).forEach(key => {
        request.input(key, params[key]);
      });
      
      const result = await request.query(query);
      return result;
    } catch (error) {
      logger.error('Query execution error:', error);
      throw error;
    }
  }

  async executeStoredProcedure(procedureName, params = {}) {
    try {
      const pool = await this.getConnection();
      const request = pool.request();
      
      // Add parameters to request
      Object.keys(params).forEach(key => {
        request.input(key, params[key]);
      });
      
      const result = await request.execute(procedureName);
      return result;
    } catch (error) {
      logger.error('Stored procedure execution error:', error);
      throw error;
    }
  }

  async healthCheck() {
    try {
      const result = await this.executeQuery('SELECT GETDATE() as currentTime, @@VERSION as version');
      return {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        database: {
          server: config.server,
          database: config.database,
          currentTime: result.recordset[0].currentTime,
          version: result.recordset[0].version
        }
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error.message
      };
    }
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Create singleton instance
const dbConnection = new DatabaseConnection();

// Graceful shutdown
process.on('SIGINT', async () => {
  logger.info('Received SIGINT, closing database connection...');
  await dbConnection.disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  logger.info('Received SIGTERM, closing database connection...');
  await dbConnection.disconnect();
  process.exit(0);
});

module.exports = {
  dbConnection,
  sql
};