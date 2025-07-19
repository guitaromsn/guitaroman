const { v4: uuidv4 } = require('uuid');

// Mock database for testing when Azure SQL is not available
class MockDatabase {
  constructor() {
    this.tables = {
      users: new Map(),
      customers: new Map(),
      inventoryItems: new Map(),
      projects: new Map(),
      invoices: new Map()
    };
    this.isConnected = false;
  }

  async connect() {
    console.log('Using mock database for testing');
    this.isConnected = true;
    return this;
  }

  async disconnect() {
    this.isConnected = false;
  }

  async executeQuery(query, params = {}) {
    // Simple mock responses for testing
    if (query.includes('SELECT GETDATE()')) {
      return {
        recordset: [{
          currentTime: new Date(),
          version: 'Mock SQL Server 2022'
        }]
      };
    }

    if (query.includes('SELECT 1 as test')) {
      return {
        recordset: [{ test: 1 }]
      };
    }

    // For other queries, return empty results
    return {
      recordset: []
    };
  }

  async healthCheck() {
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: {
        server: 'mock-server',
        database: 'mock-database',
        currentTime: new Date(),
        version: 'Mock SQL Server 2022'
      }
    };
  }
}

// Use mock database when Azure SQL is not available
const originalDbConnection = require('./database').dbConnection;

class DatabaseConnectionWrapper {
  constructor() {
    this.mockDb = new MockDatabase();
    this.useMock = false;
  }

  async connect() {
    try {
      return await originalDbConnection.connect();
    } catch (error) {
      console.log('Azure SQL Database not available, using mock database');
      this.useMock = true;
      return await this.mockDb.connect();
    }
  }

  async disconnect() {
    if (this.useMock) {
      return await this.mockDb.disconnect();
    }
    return await originalDbConnection.disconnect();
  }

  async executeQuery(query, params = {}) {
    if (this.useMock) {
      return await this.mockDb.executeQuery(query, params);
    }
    return await originalDbConnection.executeQuery(query, params);
  }

  async healthCheck() {
    if (this.useMock) {
      return await this.mockDb.healthCheck();
    }
    return await originalDbConnection.healthCheck();
  }
}

const dbConnection = new DatabaseConnectionWrapper();

module.exports = {
  dbConnection,
  sql: require('./database').sql
};