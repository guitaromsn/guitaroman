const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MaterialType = sequelize.define('MaterialType', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    code: {
        type: DataTypes.STRING(20),
        unique: true,
        allowNull: false
    },
    name_ar: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    name_en: {
        type: DataTypes.STRING(100)
    },
    category: {
        type: DataTypes.ENUM('ferrous', 'non_ferrous', 'mixed'),
        allowNull: false
    },
    unit_of_measure: {
        type: DataTypes.ENUM('kg', 'ton', 'piece'),
        defaultValue: 'kg'
    },
    current_price: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },
    min_stock_level: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    created_by: {
        type: DataTypes.INTEGER
    },
    updated_by: {
        type: DataTypes.INTEGER
    }
}, {
    tableName: 'material_types'
});

module.exports = MaterialType;