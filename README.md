# Amanat Al-Kalima ERP System

A comprehensive Enterprise Resource Planning (ERP) system integrated with Azure SQL Database, designed with ZATCA compliance for Saudi Arabian businesses.

## Features

### ✅ Implemented
- **Azure SQL Database Integration**: Complete connection management with retry logic and pooling
- **Authentication System**: JWT-based authentication with refresh tokens
- **Customer Management**: Full CRUD operations with search and pagination
- **Inventory Management**: Stock tracking with transaction history
- **Database Schema**: Complete SQL Server schema for all ERP modules
- **Health Monitoring**: Database health checks and monitoring
- **Security**: Input validation, role-based access control
- **Audit Logging**: Complete audit trail for all operations

### 🚧 Ready for Implementation
- **Invoice Management**: Database schema ready, endpoints planned
- **Project Management**: Database schema ready, endpoints planned
- **ZATCA Compliance**: Database structure ready for e-invoicing

## Technology Stack

- **Backend**: Node.js with Express.js
- **Database**: Azure SQL Database (SQL Server)
- **Authentication**: JWT with refresh tokens
- **Security**: Helmet, CORS, bcryptjs
- **Validation**: Joi validation library
- **Logging**: Winston logger
- **Environment**: dotenv configuration

## Quick Start

### Prerequisites
- Node.js 16+
- Access to Azure SQL Database
- Environment variables configured

### Installation

```bash
npm install
```

### Configuration

1. Copy environment example:
```bash
cp .env.example .env
```

2. Update `.env` with your Azure SQL Database credentials:
```env
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_SERVER=your_server.database.windows.net
DB_NAME=your_database_name
JWT_SECRET=your_jwt_secret_key
```

### Database Setup

Run the migration script to set up the database schema:
```bash
npm run migrate
```

### Start the Server

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/refresh` - Refresh JWT token
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/logout` - User logout
- `POST /api/auth/change-password` - Change password

### Customer Management
- `GET /api/customers` - List customers with search and pagination
- `GET /api/customers/:id` - Get customer by ID
- `POST /api/customers` - Create new customer
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer (soft delete)
- `GET /api/customers/:id/projects` - Get customer projects
- `GET /api/customers/:id/invoices` - Get customer invoices
- `GET /api/customers/:id/summary` - Get customer summary

### Inventory Management
- `GET /api/inventory` - List inventory items with filtering
- `GET /api/inventory/:id` - Get inventory item by ID
- `POST /api/inventory` - Create new inventory item
- `PUT /api/inventory/:id` - Update inventory item
- `DELETE /api/inventory/:id` - Delete inventory item
- `GET /api/inventory/:id/transactions` - Get item transaction history
- `POST /api/inventory/:id/transactions` - Create stock transaction
- `GET /api/inventory/reports/low-stock` - Get low stock items
- `GET /api/inventory/reports/categories` - Get category summary
- `GET /api/inventory/reports/movements` - Get stock movements

### System
- `GET /health` - Health check endpoint
- `GET /` - System overview and documentation

## Database Schema

### Core Tables
- **Users**: Authentication and user management
- **Customers**: Customer information and management
- **InventoryItems**: Product and service catalog
- **Projects**: Project management
- **Invoices**: Invoice management with ZATCA compliance
- **InvoiceItems**: Invoice line items
- **InventoryTransactions**: Stock movement tracking
- **AuditLog**: Complete audit trail
- **ZatcaSettings**: ZATCA compliance configuration

### Key Features
- UUID primary keys for all tables
- Soft delete functionality with `IsActive` flags
- Automatic timestamp management with triggers
- Comprehensive indexing for performance
- Foreign key relationships for data integrity
- ZATCA compliance fields for e-invoicing

## Azure SQL Database Configuration

### Connection Configuration
```javascript
const config = {
  user: 'rh7',
  password: 'Whyme7121$',
  server: 'roman-zatca-server.database.windows.net',
  database: 'InvoiceMakerPro',
  port: 1433,
  options: {
    encrypt: true,
    trustServerCertificate: false,
    enableArithAbort: true
  },
  connectionTimeout: 30000,
  requestTimeout: 15000,
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};
```

### Features
- Connection pooling with automatic retry
- Health check monitoring
- Graceful connection handling
- Error logging and monitoring
- Transaction support

## Security Features

### Authentication
- JWT token-based authentication
- Refresh token rotation
- Password hashing with bcrypt
- Role-based access control (admin, manager, user)
- Account activation/deactivation

### Data Protection
- Input validation with Joi
- SQL injection prevention
- CORS protection
- Security headers with Helmet
- Environment variable protection

### Audit Trail
- Complete operation logging
- User action tracking
- Data change history
- Timestamp tracking

## ZATCA Compliance

### Database Preparation
- QR code field for invoices
- ZATCA hash storage
- Submission status tracking
- Compliance settings table
- Audit trail for tax authorities

### Ready for Implementation
- E-invoice XML generation
- Digital signature integration
- Tax authority submission
- Compliance validation

## Development

### Project Structure
```
├── config/          # Database and application configuration
├── controllers/     # Route controllers
├── services/        # Business logic services
├── routes/          # API route definitions
├── middleware/      # Authentication and validation middleware
├── scripts/         # Database migration and utility scripts
├── models/          # Data models (future implementation)
└── tests/           # Test suites (future implementation)
```

### Code Standards
- ES6+ JavaScript
- Async/await for asynchronous operations
- Error handling with try-catch
- Input validation for all endpoints
- Consistent API response format
- Comprehensive logging

## Deployment

### Environment Variables
Required environment variables for production:
- `NODE_ENV=production`
- `DB_USER`, `DB_PASSWORD`, `DB_SERVER`, `DB_NAME`
- `JWT_SECRET` (strong secret key)
- `LOG_LEVEL=info`

### Production Considerations
- Use PM2 or similar process manager
- Configure load balancing
- Set up database backups
- Monitor logs and performance
- Use HTTPS in production
- Configure firewalls and security groups

## License

MIT License - see LICENSE file for details.

## Support

For support and questions, please refer to the project documentation or contact the development team.