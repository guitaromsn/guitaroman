const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
    process.env.DB_NAME || 'amanat_erp',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || '',
    {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3306,
        dialect: 'mysql',
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci',
        logging: process.env.NODE_ENV === 'development' ? console.log : false,
        pool: {
            max: 10,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        define: {
            timestamps: true,
            underscored: false,
            freezeTableName: true
        }
    }
);

// Test database connection
const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Database connection established successfully');
    } catch (error) {
        console.error('❌ Unable to connect to database:', error.message);
        // Don't exit in development, just log the error
        if (process.env.NODE_ENV === 'production') {
            process.exit(1);
        }
    }
};

testConnection();

module.exports = sequelize;