-- Amanat Al-Kalima ERP Database Schema for Azure SQL Database
-- This script creates all necessary tables for the ERP system

-- Users table for authentication and authorization
CREATE TABLE Users (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Email NVARCHAR(255) NOT NULL UNIQUE,
    PasswordHash NVARCHAR(255) NOT NULL,
    FirstName NVARCHAR(100) NOT NULL,
    LastName NVARCHAR(100) NOT NULL,
    Role NVARCHAR(50) NOT NULL DEFAULT 'user' CHECK (Role IN ('admin', 'manager', 'user')),
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    LastLoginAt DATETIME2 NULL
);

-- Refresh tokens for JWT authentication
CREATE TABLE RefreshTokens (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserId UNIQUEIDENTIFIER NOT NULL,
    Token NVARCHAR(500) NOT NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    ExpiresAt DATETIME2 NOT NULL,
    FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE
);

-- Customers table
CREATE TABLE Customers (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Name NVARCHAR(200) NOT NULL,
    Email NVARCHAR(255) NULL,
    Phone NVARCHAR(20) NULL,
    Address NVARCHAR(500) NULL,
    City NVARCHAR(100) NULL,
    Country NVARCHAR(100) NULL,
    VatNumber NVARCHAR(50) NULL,
    CommercialRegistration NVARCHAR(50) NULL,
    PaymentTerms INT NOT NULL DEFAULT 30,
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    CreatedBy UNIQUEIDENTIFIER NOT NULL,
    FOREIGN KEY (CreatedBy) REFERENCES Users(Id)
);

-- Inventory items/products table
CREATE TABLE InventoryItems (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Name NVARCHAR(200) NOT NULL,
    Description NVARCHAR(1000) NULL,
    SKU NVARCHAR(100) NOT NULL UNIQUE,
    Category NVARCHAR(100) NULL,
    UnitPrice DECIMAL(18,2) NOT NULL,
    Quantity INT NOT NULL DEFAULT 0,
    MinStockLevel INT NOT NULL DEFAULT 0,
    MaxStockLevel INT NULL,
    Unit NVARCHAR(20) NOT NULL DEFAULT 'piece',
    VatRate DECIMAL(5,2) NOT NULL DEFAULT 15.00,
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    CreatedBy UNIQUEIDENTIFIER NOT NULL,
    FOREIGN KEY (CreatedBy) REFERENCES Users(Id)
);

-- Projects table
CREATE TABLE Projects (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Name NVARCHAR(200) NOT NULL,
    Description NVARCHAR(2000) NULL,
    CustomerId UNIQUEIDENTIFIER NOT NULL,
    StartDate DATE NULL,
    EndDate DATE NULL,
    Status NVARCHAR(50) NOT NULL DEFAULT 'planning' CHECK (Status IN ('planning', 'active', 'on-hold', 'completed', 'cancelled')),
    Budget DECIMAL(18,2) NULL,
    Currency NVARCHAR(3) NOT NULL DEFAULT 'SAR',
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    CreatedBy UNIQUEIDENTIFIER NOT NULL,
    FOREIGN KEY (CustomerId) REFERENCES Customers(Id),
    FOREIGN KEY (CreatedBy) REFERENCES Users(Id)
);

-- Invoices table
CREATE TABLE Invoices (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    InvoiceNumber NVARCHAR(50) NOT NULL UNIQUE,
    CustomerId UNIQUEIDENTIFIER NOT NULL,
    ProjectId UNIQUEIDENTIFIER NULL,
    InvoiceDate DATE NOT NULL,
    DueDate DATE NULL,
    SubTotal DECIMAL(18,2) NOT NULL DEFAULT 0,
    DiscountRate DECIMAL(5,2) NOT NULL DEFAULT 0,
    DiscountAmount DECIMAL(18,2) NOT NULL DEFAULT 0,
    VatAmount DECIMAL(18,2) NOT NULL DEFAULT 0,
    TotalAmount DECIMAL(18,2) NOT NULL DEFAULT 0,
    Currency NVARCHAR(3) NOT NULL DEFAULT 'SAR',
    Status NVARCHAR(50) NOT NULL DEFAULT 'draft' CHECK (Status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled')),
    Notes NVARCHAR(2000) NULL,
    Terms NVARCHAR(2000) NULL,
    -- ZATCA specific fields
    QRCode NVARCHAR(MAX) NULL,
    ZatcaHash NVARCHAR(500) NULL,
    ZatcaStatus NVARCHAR(50) NULL,
    ZatcaSubmittedAt DATETIME2 NULL,
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    CreatedBy UNIQUEIDENTIFIER NOT NULL,
    FOREIGN KEY (CustomerId) REFERENCES Customers(Id),
    FOREIGN KEY (ProjectId) REFERENCES Projects(Id),
    FOREIGN KEY (CreatedBy) REFERENCES Users(Id)
);

-- Invoice items table
CREATE TABLE InvoiceItems (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    InvoiceId UNIQUEIDENTIFIER NOT NULL,
    InventoryItemId UNIQUEIDENTIFIER NULL,
    Description NVARCHAR(500) NOT NULL,
    Quantity DECIMAL(10,3) NOT NULL,
    UnitPrice DECIMAL(18,2) NOT NULL,
    DiscountRate DECIMAL(5,2) NOT NULL DEFAULT 0,
    DiscountAmount DECIMAL(18,2) NOT NULL DEFAULT 0,
    VatRate DECIMAL(5,2) NOT NULL DEFAULT 15.00,
    VatAmount DECIMAL(18,2) NOT NULL DEFAULT 0,
    LineTotal DECIMAL(18,2) NOT NULL DEFAULT 0,
    SortOrder INT NOT NULL DEFAULT 0,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    FOREIGN KEY (InvoiceId) REFERENCES Invoices(Id) ON DELETE CASCADE,
    FOREIGN KEY (InventoryItemId) REFERENCES InventoryItems(Id)
);

-- Inventory transactions table for stock movements
CREATE TABLE InventoryTransactions (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    InventoryItemId UNIQUEIDENTIFIER NOT NULL,
    TransactionType NVARCHAR(50) NOT NULL CHECK (TransactionType IN ('purchase', 'sale', 'adjustment', 'return')),
    Quantity INT NOT NULL,
    UnitCost DECIMAL(18,2) NULL,
    TotalCost DECIMAL(18,2) NULL,
    ReferenceType NVARCHAR(50) NULL, -- 'invoice', 'purchase_order', 'adjustment'
    ReferenceId UNIQUEIDENTIFIER NULL,
    Notes NVARCHAR(500) NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    CreatedBy UNIQUEIDENTIFIER NOT NULL,
    FOREIGN KEY (InventoryItemId) REFERENCES InventoryItems(Id),
    FOREIGN KEY (CreatedBy) REFERENCES Users(Id)
);

-- Audit log table for tracking changes
CREATE TABLE AuditLog (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    TableName NVARCHAR(100) NOT NULL,
    RecordId UNIQUEIDENTIFIER NOT NULL,
    Action NVARCHAR(50) NOT NULL CHECK (Action IN ('CREATE', 'UPDATE', 'DELETE')),
    OldValues NVARCHAR(MAX) NULL,
    NewValues NVARCHAR(MAX) NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    CreatedBy UNIQUEIDENTIFIER NOT NULL,
    FOREIGN KEY (CreatedBy) REFERENCES Users(Id)
);

-- ZATCA compliance settings
CREATE TABLE ZatcaSettings (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    SettingKey NVARCHAR(100) NOT NULL UNIQUE,
    SettingValue NVARCHAR(MAX) NOT NULL,
    Description NVARCHAR(500) NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    UpdatedBy UNIQUEIDENTIFIER NOT NULL,
    FOREIGN KEY (UpdatedBy) REFERENCES Users(Id)
);

-- Create indexes for better performance
CREATE INDEX IX_Users_Email ON Users(Email);
CREATE INDEX IX_RefreshTokens_UserId ON RefreshTokens(UserId);
CREATE INDEX IX_RefreshTokens_ExpiresAt ON RefreshTokens(ExpiresAt);
CREATE INDEX IX_Customers_Name ON Customers(Name);
CREATE INDEX IX_Customers_CreatedBy ON Customers(CreatedBy);
CREATE INDEX IX_InventoryItems_SKU ON InventoryItems(SKU);
CREATE INDEX IX_InventoryItems_Category ON InventoryItems(Category);
CREATE INDEX IX_InventoryItems_CreatedBy ON InventoryItems(CreatedBy);
CREATE INDEX IX_Projects_CustomerId ON Projects(CustomerId);
CREATE INDEX IX_Projects_Status ON Projects(Status);
CREATE INDEX IX_Projects_CreatedBy ON Projects(CreatedBy);
CREATE INDEX IX_Invoices_InvoiceNumber ON Invoices(InvoiceNumber);
CREATE INDEX IX_Invoices_CustomerId ON Invoices(CustomerId);
CREATE INDEX IX_Invoices_ProjectId ON Invoices(ProjectId);
CREATE INDEX IX_Invoices_Status ON Invoices(Status);
CREATE INDEX IX_Invoices_InvoiceDate ON Invoices(InvoiceDate);
CREATE INDEX IX_Invoices_CreatedBy ON Invoices(CreatedBy);
CREATE INDEX IX_InvoiceItems_InvoiceId ON InvoiceItems(InvoiceId);
CREATE INDEX IX_InvoiceItems_InventoryItemId ON InvoiceItems(InventoryItemId);
CREATE INDEX IX_InventoryTransactions_InventoryItemId ON InventoryTransactions(InventoryItemId);
CREATE INDEX IX_InventoryTransactions_CreatedAt ON InventoryTransactions(CreatedAt);
CREATE INDEX IX_InventoryTransactions_CreatedBy ON InventoryTransactions(CreatedBy);
CREATE INDEX IX_AuditLog_TableName ON AuditLog(TableName);
CREATE INDEX IX_AuditLog_RecordId ON AuditLog(RecordId);
CREATE INDEX IX_AuditLog_CreatedAt ON AuditLog(CreatedAt);
CREATE INDEX IX_AuditLog_CreatedBy ON AuditLog(CreatedBy);

-- Create triggers for automatic UpdatedAt timestamps
GO

CREATE TRIGGER tr_Users_UpdatedAt ON Users
AFTER UPDATE AS
BEGIN
    UPDATE Users 
    SET UpdatedAt = GETDATE()
    FROM Users u
    INNER JOIN inserted i ON u.Id = i.Id
END;
GO

CREATE TRIGGER tr_Customers_UpdatedAt ON Customers
AFTER UPDATE AS
BEGIN
    UPDATE Customers 
    SET UpdatedAt = GETDATE()
    FROM Customers c
    INNER JOIN inserted i ON c.Id = i.Id
END;
GO

CREATE TRIGGER tr_InventoryItems_UpdatedAt ON InventoryItems
AFTER UPDATE AS
BEGIN
    UPDATE InventoryItems 
    SET UpdatedAt = GETDATE()
    FROM InventoryItems ii
    INNER JOIN inserted i ON ii.Id = i.Id
END;
GO

CREATE TRIGGER tr_Projects_UpdatedAt ON Projects
AFTER UPDATE AS
BEGIN
    UPDATE Projects 
    SET UpdatedAt = GETDATE()
    FROM Projects p
    INNER JOIN inserted i ON p.Id = i.Id
END;
GO

CREATE TRIGGER tr_Invoices_UpdatedAt ON Invoices
AFTER UPDATE AS
BEGIN
    UPDATE Invoices 
    SET UpdatedAt = GETDATE()
    FROM Invoices inv
    INNER JOIN inserted i ON inv.Id = i.Id
END;
GO

-- Function to generate invoice numbers
CREATE FUNCTION dbo.GenerateInvoiceNumber()
RETURNS NVARCHAR(50)
AS
BEGIN
    DECLARE @year INT = YEAR(GETDATE())
    DECLARE @month INT = MONTH(GETDATE())
    DECLARE @sequence INT
    
    SELECT @sequence = ISNULL(MAX(CAST(RIGHT(InvoiceNumber, 4) AS INT)), 0) + 1
    FROM Invoices 
    WHERE InvoiceNumber LIKE CONCAT(@year, FORMAT(@month, '00'), '%')
    
    RETURN CONCAT(@year, FORMAT(@month, '00'), '-', FORMAT(@sequence, '0000'))
END;
GO

-- Initial ZATCA settings
INSERT INTO ZatcaSettings (SettingKey, SettingValue, Description, UpdatedBy) VALUES
('CompanyName', 'Amanat Al-Kalima', 'Company name for ZATCA compliance', '00000000-0000-0000-0000-000000000000'),
('VatNumber', '', 'Company VAT registration number', '00000000-0000-0000-0000-000000000000'),
('CommercialRegistration', '', 'Company commercial registration number', '00000000-0000-0000-0000-000000000000'),
('Address', '', 'Company address', '00000000-0000-0000-0000-000000000000'),
('Environment', 'sandbox', 'ZATCA environment (sandbox/production)', '00000000-0000-0000-0000-000000000000');

PRINT 'Amanat Al-Kalima ERP database schema created successfully!';