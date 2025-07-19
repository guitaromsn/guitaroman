const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING(50),
        unique: true,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(100),
        unique: true,
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    password_hash: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    first_name: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    last_name: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('admin', 'manager', 'accountant', 'operator'),
        defaultValue: 'operator'
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    last_login: {
        type: DataTypes.DATE
    },
    created_by: {
        type: DataTypes.INTEGER
    },
    updated_by: {
        type: DataTypes.INTEGER
    }
}, {
    tableName: 'users',
    hooks: {
        beforeCreate: async (user) => {
            if (user.password_hash) {
                user.password_hash = await bcrypt.hash(user.password_hash, 12);
            }
        },
        beforeUpdate: async (user) => {
            if (user.changed('password_hash')) {
                user.password_hash = await bcrypt.hash(user.password_hash, 12);
            }
        }
    }
});

// Instance methods
User.prototype.checkPassword = async function(password) {
    return await bcrypt.compare(password, this.password_hash);
};

User.prototype.getFullName = function() {
    return `${this.first_name} ${this.last_name}`;
};

module.exports = User;