-- Amanat Al-Kalima ERP Database Schema
-- Company: شركة أمانة الكلمة (Amanat Al-Kalima Company)
-- Business: Metal Scrap Trading and Recycling

-- Create database
CREATE DATABASE IF NOT EXISTS amanat_erp CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE amanat_erp;

-- Users table for system authentication
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    role ENUM('admin', 'manager', 'accountant', 'operator') DEFAULT 'operator',
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT,
    updated_by INT,
    FOREIGN KEY (created_by) REFERENCES users(id),
    FOREIGN KEY (updated_by) REFERENCES users(id)
);

-- Customers table
CREATE TABLE customers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    customer_code VARCHAR(20) UNIQUE NOT NULL,
    name_ar VARCHAR(200) NOT NULL,
    name_en VARCHAR(200),
    vat_number VARCHAR(15),
    commercial_register VARCHAR(20),
    phone VARCHAR(20),
    email VARCHAR(100),
    address_ar TEXT,
    address_en TEXT,
    city VARCHAR(100),
    postal_code VARCHAR(10),
    country VARCHAR(50) DEFAULT 'Saudi Arabia',
    customer_type ENUM('individual', 'company') DEFAULT 'company',
    credit_limit DECIMAL(15,2) DEFAULT 0,
    payment_terms INT DEFAULT 30,
    is_active BOOLEAN DEFAULT true,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT,
    updated_by INT,
    FOREIGN KEY (created_by) REFERENCES users(id),
    FOREIGN KEY (updated_by) REFERENCES users(id)
);

-- Suppliers table
CREATE TABLE suppliers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    supplier_code VARCHAR(20) UNIQUE NOT NULL,
    name_ar VARCHAR(200) NOT NULL,
    name_en VARCHAR(200),
    vat_number VARCHAR(15),
    commercial_register VARCHAR(20),
    phone VARCHAR(20),
    email VARCHAR(100),
    address_ar TEXT,
    address_en TEXT,
    city VARCHAR(100),
    postal_code VARCHAR(10),
    country VARCHAR(50) DEFAULT 'Saudi Arabia',
    supplier_type ENUM('individual', 'company') DEFAULT 'company',
    payment_terms INT DEFAULT 30,
    is_active BOOLEAN DEFAULT true,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT,
    updated_by INT,
    FOREIGN KEY (created_by) REFERENCES users(id),
    FOREIGN KEY (updated_by) REFERENCES users(id)
);

-- Material types for metal scrap inventory
CREATE TABLE material_types (
    id INT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(20) UNIQUE NOT NULL,
    name_ar VARCHAR(100) NOT NULL,
    name_en VARCHAR(100),
    category ENUM('ferrous', 'non_ferrous', 'mixed') NOT NULL,
    unit_of_measure ENUM('kg', 'ton', 'piece') DEFAULT 'kg',
    current_price DECIMAL(10,2) DEFAULT 0,
    min_stock_level DECIMAL(10,2) DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT,
    updated_by INT,
    FOREIGN KEY (created_by) REFERENCES users(id),
    FOREIGN KEY (updated_by) REFERENCES users(id)
);

-- Inventory tracking
CREATE TABLE inventory (
    id INT PRIMARY KEY AUTO_INCREMENT,
    material_type_id INT NOT NULL,
    location VARCHAR(100),
    current_quantity DECIMAL(12,3) DEFAULT 0,
    reserved_quantity DECIMAL(12,3) DEFAULT 0,
    available_quantity DECIMAL(12,3) GENERATED ALWAYS AS (current_quantity - reserved_quantity) STORED,
    last_purchase_price DECIMAL(10,2) DEFAULT 0,
    average_cost DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (material_type_id) REFERENCES material_types(id),
    UNIQUE KEY unique_material_location (material_type_id, location)
);

-- Inventory movements for tracking stock changes
CREATE TABLE inventory_movements (
    id INT PRIMARY KEY AUTO_INCREMENT,
    material_type_id INT NOT NULL,
    movement_type ENUM('in', 'out', 'adjustment', 'transfer') NOT NULL,
    quantity DECIMAL(12,3) NOT NULL,
    unit_price DECIMAL(10,2) DEFAULT 0,
    total_value DECIMAL(15,2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
    reference_type ENUM('purchase', 'sale', 'adjustment', 'transfer') NOT NULL,
    reference_id INT,
    location VARCHAR(100),
    notes TEXT,
    movement_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INT,
    FOREIGN KEY (material_type_id) REFERENCES material_types(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Projects for tracking large deals or ongoing contracts
CREATE TABLE projects (
    id INT PRIMARY KEY AUTO_INCREMENT,
    project_code VARCHAR(20) UNIQUE NOT NULL,
    name_ar VARCHAR(200) NOT NULL,
    name_en VARCHAR(200),
    customer_id INT,
    project_type ENUM('purchase', 'sale', 'processing', 'transport') NOT NULL,
    status ENUM('draft', 'active', 'completed', 'cancelled') DEFAULT 'draft',
    start_date DATE,
    end_date DATE,
    estimated_value DECIMAL(15,2) DEFAULT 0,
    actual_value DECIMAL(15,2) DEFAULT 0,
    profit_margin DECIMAL(5,2) DEFAULT 0,
    description_ar TEXT,
    description_en TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT,
    updated_by INT,
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (created_by) REFERENCES users(id),
    FOREIGN KEY (updated_by) REFERENCES users(id)
);

-- Invoices
CREATE TABLE invoices (
    id INT PRIMARY KEY AUTO_INCREMENT,
    invoice_number VARCHAR(20) UNIQUE NOT NULL,
    invoice_type ENUM('standard', 'simplified', 'debit_note', 'credit_note') DEFAULT 'standard',
    customer_id INT,
    project_id INT,
    issue_date DATE NOT NULL,
    due_date DATE,
    subtotal DECIMAL(15,2) DEFAULT 0,
    discount_amount DECIMAL(15,2) DEFAULT 0,
    vat_amount DECIMAL(15,2) DEFAULT 0,
    total_amount DECIMAL(15,2) DEFAULT 0,
    paid_amount DECIMAL(15,2) DEFAULT 0,
    balance_due DECIMAL(15,2) GENERATED ALWAYS AS (total_amount - paid_amount) STORED,
    status ENUM('draft', 'sent', 'paid', 'overdue', 'cancelled') DEFAULT 'draft',
    payment_status ENUM('unpaid', 'partial', 'paid') DEFAULT 'unpaid',
    zatca_uuid VARCHAR(255),
    zatca_hash VARCHAR(255),
    zatca_qr_code TEXT,
    zatca_status ENUM('pending', 'submitted', 'approved', 'rejected') DEFAULT 'pending',
    zatca_submission_date TIMESTAMP NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT,
    updated_by INT,
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (project_id) REFERENCES projects(id),
    FOREIGN KEY (created_by) REFERENCES users(id),
    FOREIGN KEY (updated_by) REFERENCES users(id)
);

-- Invoice line items
CREATE TABLE invoice_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    invoice_id INT NOT NULL,
    material_type_id INT,
    description_ar VARCHAR(500) NOT NULL,
    description_en VARCHAR(500),
    quantity DECIMAL(12,3) NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    line_total DECIMAL(15,2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
    vat_rate DECIMAL(5,2) DEFAULT 15.00,
    vat_amount DECIMAL(15,2) GENERATED ALWAYS AS (line_total * vat_rate / 100) STORED,
    FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE,
    FOREIGN KEY (material_type_id) REFERENCES material_types(id)
);

-- Purchase orders
CREATE TABLE purchase_orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    po_number VARCHAR(20) UNIQUE NOT NULL,
    supplier_id INT NOT NULL,
    project_id INT,
    order_date DATE NOT NULL,
    expected_delivery_date DATE,
    subtotal DECIMAL(15,2) DEFAULT 0,
    vat_amount DECIMAL(15,2) DEFAULT 0,
    total_amount DECIMAL(15,2) DEFAULT 0,
    status ENUM('draft', 'sent', 'confirmed', 'delivered', 'cancelled') DEFAULT 'draft',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT,
    updated_by INT,
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id),
    FOREIGN KEY (project_id) REFERENCES projects(id),
    FOREIGN KEY (created_by) REFERENCES users(id),
    FOREIGN KEY (updated_by) REFERENCES users(id)
);

-- Purchase order items
CREATE TABLE purchase_order_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    purchase_order_id INT NOT NULL,
    material_type_id INT NOT NULL,
    description_ar VARCHAR(500) NOT NULL,
    description_en VARCHAR(500),
    quantity DECIMAL(12,3) NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    line_total DECIMAL(15,2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
    received_quantity DECIMAL(12,3) DEFAULT 0,
    FOREIGN KEY (purchase_order_id) REFERENCES purchase_orders(id) ON DELETE CASCADE,
    FOREIGN KEY (material_type_id) REFERENCES material_types(id)
);

-- Payments tracking
CREATE TABLE payments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    payment_number VARCHAR(20) UNIQUE NOT NULL,
    invoice_id INT,
    payment_method ENUM('cash', 'bank_transfer', 'check', 'card') NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    payment_date DATE NOT NULL,
    reference_number VARCHAR(100),
    bank_name VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INT,
    FOREIGN KEY (invoice_id) REFERENCES invoices(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Create indexes for performance
CREATE INDEX idx_customers_code ON customers(customer_code);
CREATE INDEX idx_customers_vat ON customers(vat_number);
CREATE INDEX idx_suppliers_code ON suppliers(supplier_code);
CREATE INDEX idx_invoices_number ON invoices(invoice_number);
CREATE INDEX idx_invoices_customer ON invoices(customer_id);
CREATE INDEX idx_invoices_date ON invoices(issue_date);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_inventory_material ON inventory(material_type_id);
CREATE INDEX idx_movements_material ON inventory_movements(material_type_id);
CREATE INDEX idx_movements_date ON inventory_movements(movement_date);
CREATE INDEX idx_projects_customer ON projects(customer_id);
CREATE INDEX idx_projects_status ON projects(status);

-- Create default admin user (password: admin123)
INSERT INTO users (username, email, password_hash, first_name, last_name, role) 
VALUES ('admin', 'admin@amanatalkalima.com', '$2a$10$rQ8K1j2nF3h5yD6mE8x3Ou1BZX4K7p3W2v5S9t8N1q7R0u6Y4z2Ac', 'مدير', 'النظام', 'admin');