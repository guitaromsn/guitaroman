const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Customer = sequelize.define('Customer', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    customer_code: {
        type: DataTypes.STRING(20),
        unique: true,
        allowNull: false
    },
    name_ar: {
        type: DataTypes.STRING(200),
        allowNull: false
    },
    name_en: {
        type: DataTypes.STRING(200)
    },
    vat_number: {
        type: DataTypes.STRING(15)
    },
    commercial_register: {
        type: DataTypes.STRING(20)
    },
    phone: {
        type: DataTypes.STRING(20)
    },
    email: {
        type: DataTypes.STRING(100),
        validate: {
            isEmail: true
        }
    },
    address_ar: {
        type: DataTypes.TEXT
    },
    address_en: {
        type: DataTypes.TEXT
    },
    city: {
        type: DataTypes.STRING(100)
    },
    postal_code: {
        type: DataTypes.STRING(10)
    },
    country: {
        type: DataTypes.STRING(50),
        defaultValue: 'Saudi Arabia'
    },
    customer_type: {
        type: DataTypes.ENUM('individual', 'company'),
        defaultValue: 'company'
    },
    credit_limit: {
        type: DataTypes.DECIMAL(15, 2),
        defaultValue: 0
    },
    payment_terms: {
        type: DataTypes.INTEGER,
        defaultValue: 30
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    notes: {
        type: DataTypes.TEXT
    },
    created_by: {
        type: DataTypes.INTEGER
    },
    updated_by: {
        type: DataTypes.INTEGER
    }
}, {
    tableName: 'customers'
});

module.exports = Customer;