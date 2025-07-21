const sql = require('mssql');

// Database configuration
const dbConfig = {
  server: 'roman-zatca-server.database.windows.net',
  database: 'InvoiceMakerPro',
  user: 'rh7',
  password: 'Whyme7121$',
  options: {
    encrypt: true, // Required for Azure SQL
    enableArithAbort: true,
    trustServerCertificate: false
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};

class DatabaseManager {
  constructor() {
    this.pool = null;
    this.isConnected = false;
  }

  async connect() {
    try {
      if (this.pool) {
        await this.pool.close();
      }
      
      this.pool = await sql.connect(dbConfig);
      this.isConnected = true;
      console.log('Connected to Azure SQL Database');
      
      // Initialize database tables if they don't exist
      await this.initializeTables();
      
      return true;
    } catch (error) {
      console.error('Database connection failed:', error);
      this.isConnected = false;
      throw error;
    }
  }

  async disconnect() {
    try {
      if (this.pool) {
        await this.pool.close();
        this.pool = null;
        this.isConnected = false;
        console.log('Disconnected from database');
      }
    } catch (error) {
      console.error('Error disconnecting from database:', error);
    }
  }

  async initializeTables() {
    const tables = [
      // Companies table
      `IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Companies' AND xtype='U')
       CREATE TABLE Companies (
         id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
         name NVARCHAR(255) NOT NULL,
         arabic_name NVARCHAR(255),
         vat_number NVARCHAR(50),
         cr_number NVARCHAR(50),
         address NVARCHAR(500),
         phone NVARCHAR(50),
         email NVARCHAR(255),
         logo_path NVARCHAR(500),
         created_at DATETIME2 DEFAULT GETDATE(),
         updated_at DATETIME2 DEFAULT GETDATE()
       )`,

      // Customers table
      `IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Customers' AND xtype='U')
       CREATE TABLE Customers (
         id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
         name NVARCHAR(255) NOT NULL,
         arabic_name NVARCHAR(255),
         vat_number NVARCHAR(50),
         address NVARCHAR(500),
         phone NVARCHAR(50),
         email NVARCHAR(255),
         customer_type NVARCHAR(50) DEFAULT 'business', -- business, individual
         created_at DATETIME2 DEFAULT GETDATE(),
         updated_at DATETIME2 DEFAULT GETDATE()
       )`,

      // Scrap Items table
      `IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='ScrapItems' AND xtype='U')
       CREATE TABLE ScrapItems (
         id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
         name NVARCHAR(255) NOT NULL,
         arabic_name NVARCHAR(255),
         category NVARCHAR(100) NOT NULL, -- ferrous, non-ferrous, e-waste, demolition
         unit NVARCHAR(50) NOT NULL, -- kg, ton, piece
         current_price DECIMAL(18,2),
         description NVARCHAR(500),
         created_at DATETIME2 DEFAULT GETDATE(),
         updated_at DATETIME2 DEFAULT GETDATE()
       )`,

      // Invoices table
      `IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Invoices' AND xtype='U')
       CREATE TABLE Invoices (
         id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
         invoice_number NVARCHAR(50) NOT NULL UNIQUE,
         customer_id UNIQUEIDENTIFIER REFERENCES Customers(id),
         invoice_date DATETIME2 NOT NULL,
         due_date DATETIME2,
         subtotal DECIMAL(18,2) NOT NULL DEFAULT 0,
         vat_amount DECIMAL(18,2) NOT NULL DEFAULT 0,
         total_amount DECIMAL(18,2) NOT NULL DEFAULT 0,
         status NVARCHAR(50) DEFAULT 'draft', -- draft, sent, paid, cancelled
         zatca_xml NTEXT,
         qr_code NTEXT,
         notes NVARCHAR(1000),
         created_at DATETIME2 DEFAULT GETDATE(),
         updated_at DATETIME2 DEFAULT GETDATE()
       )`,

      // Invoice Items table
      `IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='InvoiceItems' AND xtype='U')
       CREATE TABLE InvoiceItems (
         id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
         invoice_id UNIQUEIDENTIFIER REFERENCES Invoices(id) ON DELETE CASCADE,
         scrap_item_id UNIQUEIDENTIFIER REFERENCES ScrapItems(id),
         description NVARCHAR(255) NOT NULL,
         quantity DECIMAL(18,2) NOT NULL,
         unit_price DECIMAL(18,2) NOT NULL,
         vat_rate DECIMAL(5,2) DEFAULT 15.00,
         line_total DECIMAL(18,2) NOT NULL,
         created_at DATETIME2 DEFAULT GETDATE()
       )`,

      // Vouchers table (Receipt and Payment)
      `IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Vouchers' AND xtype='U')
       CREATE TABLE Vouchers (
         id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
         voucher_number NVARCHAR(50) NOT NULL UNIQUE,
         voucher_type NVARCHAR(20) NOT NULL, -- receipt, payment
         customer_id UNIQUEIDENTIFIER REFERENCES Customers(id),
         invoice_id UNIQUEIDENTIFIER REFERENCES Invoices(id),
         voucher_date DATETIME2 NOT NULL,
         amount DECIMAL(18,2) NOT NULL,
         payment_method NVARCHAR(50), -- cash, bank_transfer, cheque, card
         reference_number NVARCHAR(100),
         notes NVARCHAR(1000),
         status NVARCHAR(50) DEFAULT 'active', -- active, cancelled
         created_at DATETIME2 DEFAULT GETDATE(),
         updated_at DATETIME2 DEFAULT GETDATE()
       )`,

      // Quotations table
      `IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Quotations' AND xtype='U')
       CREATE TABLE Quotations (
         id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
         quotation_number NVARCHAR(50) NOT NULL UNIQUE,
         customer_id UNIQUEIDENTIFIER REFERENCES Customers(id),
         quotation_date DATETIME2 NOT NULL,
         valid_until DATETIME2,
         subtotal DECIMAL(18,2) NOT NULL DEFAULT 0,
         vat_amount DECIMAL(18,2) NOT NULL DEFAULT 0,
         total_amount DECIMAL(18,2) NOT NULL DEFAULT 0,
         status NVARCHAR(50) DEFAULT 'draft', -- draft, sent, accepted, rejected, expired
         notes NVARCHAR(1000),
         created_at DATETIME2 DEFAULT GETDATE(),
         updated_at DATETIME2 DEFAULT GETDATE()
       )`,

      // Quotation Items table
      `IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='QuotationItems' AND xtype='U')
       CREATE TABLE QuotationItems (
         id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
         quotation_id UNIQUEIDENTIFIER REFERENCES Quotations(id) ON DELETE CASCADE,
         scrap_item_id UNIQUEIDENTIFIER REFERENCES ScrapItems(id),
         description NVARCHAR(255) NOT NULL,
         quantity DECIMAL(18,2) NOT NULL,
         unit_price DECIMAL(18,2) NOT NULL,
         vat_rate DECIMAL(5,2) DEFAULT 15.00,
         line_total DECIMAL(18,2) NOT NULL,
         created_at DATETIME2 DEFAULT GETDATE()
       )`
    ];

    for (const tableQuery of tables) {
      try {
        await this.pool.request().query(tableQuery);
        console.log('Table initialized successfully');
      } catch (error) {
        console.error('Error initializing table:', error);
      }
    }

    // Insert default scrap items if table is empty
    await this.insertDefaultScrapItems();
  }

  async insertDefaultScrapItems() {
    try {
      const result = await this.pool.request().query('SELECT COUNT(*) as count FROM ScrapItems');
      if (result.recordset[0].count === 0) {
        const defaultItems = [
          // Ferrous metals
          { name: 'Steel Scrap', arabic_name: 'خردة الصلب', category: 'ferrous', unit: 'kg', price: 0.85 },
          { name: 'Iron Scrap', arabic_name: 'خردة الحديد', category: 'ferrous', unit: 'kg', price: 0.75 },
          { name: 'Cast Iron', arabic_name: 'حديد زهر', category: 'ferrous', unit: 'kg', price: 0.65 },
          
          // Non-ferrous metals
          { name: 'Aluminum Scrap', arabic_name: 'خردة الألمنيوم', category: 'non-ferrous', unit: 'kg', price: 5.50 },
          { name: 'Copper Scrap', arabic_name: 'خردة النحاس', category: 'non-ferrous', unit: 'kg', price: 28.00 },
          { name: 'Brass Scrap', arabic_name: 'خردة النحاس الأصفر', category: 'non-ferrous', unit: 'kg', price: 18.50 },
          { name: 'Lead Scrap', arabic_name: 'خردة الرصاص', category: 'non-ferrous', unit: 'kg', price: 7.25 },
          
          // E-waste
          { name: 'Computer Scrap', arabic_name: 'خردة الكمبيوتر', category: 'e-waste', unit: 'piece', price: 25.00 },
          { name: 'Mobile Phone Scrap', arabic_name: 'خردة الهواتف المحمولة', category: 'e-waste', unit: 'piece', price: 15.00 },
          { name: 'Circuit Board', arabic_name: 'لوحة الدوائر', category: 'e-waste', unit: 'kg', price: 45.00 },
          
          // Demolition
          { name: 'Structural Steel', arabic_name: 'الصلب الإنشائي', category: 'demolition', unit: 'ton', price: 850.00 },
          { name: 'Rebar', arabic_name: 'حديد التسليح', category: 'demolition', unit: 'ton', price: 750.00 },
          { name: 'Pipe Scrap', arabic_name: 'خردة الأنابيب', category: 'demolition', unit: 'kg', price: 0.80 }
        ];

        for (const item of defaultItems) {
          await this.pool.request()
            .input('name', sql.NVarChar, item.name)
            .input('arabic_name', sql.NVarChar, item.arabic_name)
            .input('category', sql.NVarChar, item.category)
            .input('unit', sql.NVarChar, item.unit)
            .input('current_price', sql.Decimal(18,2), item.price)
            .query(`INSERT INTO ScrapItems (name, arabic_name, category, unit, current_price)
                   VALUES (@name, @arabic_name, @category, @unit, @current_price)`);
        }
        console.log('Default scrap items inserted successfully');
      }
    } catch (error) {
      console.error('Error inserting default scrap items:', error);
    }
  }

  async executeQuery(query, inputs = {}) {
    try {
      if (!this.isConnected) {
        await this.connect();
      }
      
      const request = this.pool.request();
      
      // Add input parameters
      Object.keys(inputs).forEach(key => {
        request.input(key, inputs[key]);
      });
      
      const result = await request.query(query);
      return result;
    } catch (error) {
      console.error('Query execution failed:', error);
      throw error;
    }
  }

  async getScrapItems() {
    const query = `SELECT * FROM ScrapItems ORDER BY category, name`;
    const result = await this.executeQuery(query);
    return result.recordset;
  }

  async getCustomers() {
    const query = `SELECT * FROM Customers ORDER BY name`;
    const result = await this.executeQuery(query);
    return result.recordset;
  }

  async getInvoices(limit = 50, offset = 0) {
    const query = `
      SELECT i.*, c.name as customer_name
      FROM Invoices i
      LEFT JOIN Customers c ON i.customer_id = c.id
      ORDER BY i.created_at DESC
      OFFSET @offset ROWS
      FETCH NEXT @limit ROWS ONLY
    `;
    const result = await this.executeQuery(query, { 
      limit: sql.Int, 
      offset: sql.Int 
    });
    return result.recordset;
  }

  // Health check
  async testConnection() {
    try {
      const result = await this.executeQuery('SELECT 1 as test');
      return result.recordset.length > 0;
    } catch (error) {
      return false;
    }
  }
}

// Export singleton instance
const dbManager = new DatabaseManager();

module.exports = {
  dbManager,
  sql
};
