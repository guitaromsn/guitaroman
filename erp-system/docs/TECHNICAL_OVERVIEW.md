# Amanat Al-Kalima Company ERP System - Technical Documentation

## Architecture Overview

This ERP system is built using a modern web technology stack:

### Backend Architecture
- **Framework**: Node.js with Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT tokens
- **API Structure**: RESTful APIs

### Frontend Architecture
- **Framework**: React.js with TypeScript
- **UI Library**: Material-UI (MUI)
- **State Management**: React Query for server state
- **Routing**: React Router
- **Theme**: Material-UI theme with Arabic font support

### Database Schema

The database is designed to handle all aspects of a metal scrap business:

#### Core Entities
1. **Users** - System users with role-based access
2. **Customers** - Buyers and suppliers
3. **Inventory Items** - Metal scrap types and materials
4. **Invoices** - ZATCA-compliant invoicing
5. **Quotes** - Price quotations
6. **Payments** - Payment tracking
7. **Loans** - Loan management
8. **Employees** - Staff management
9. **Projects** - Project-based tracking
10. **Expenses** - Business expense tracking

#### Key Features
- Multi-language support (Arabic/English)
- ZATCA e-invoicing compliance
- VAT management
- Role-based permissions
- Real-time dashboard
- Comprehensive reporting

## Security Considerations

1. **Authentication**: JWT-based authentication
2. **Authorization**: Role-based access control
3. **Data Validation**: Input validation using Zod
4. **Rate Limiting**: API rate limiting implemented
5. **Security Headers**: Helmet.js for security headers
6. **CORS**: Configured for specific origins

## Compliance

### ZATCA E-Invoicing
- The system is designed to support ZATCA e-invoicing requirements
- Invoice structure complies with Saudi Arabian tax regulations
- QR code generation for invoices
- Electronic submission capability

### VAT Management
- 15% VAT rate support
- VAT collection and payment tracking
- Tax reports for authority submission

## Deployment

The system can be deployed using:
1. **Docker** - Containerized deployment
2. **Cloud Platforms** - AWS, Azure, or Google Cloud
3. **Traditional Hosting** - VPS or dedicated servers

## Future Enhancements

1. Mobile application
2. Barcode/QR code scanning for inventory
3. Integration with accounting software
4. Advanced analytics and reporting
5. Multi-location support
6. API for third-party integrations