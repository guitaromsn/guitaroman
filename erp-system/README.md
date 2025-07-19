# Amanat Al-Kalima Company ERP System

A comprehensive ERP system for شركة أمانة الكلمة (Amanat Al-Kalima Company), a metal scrap business in Dammam, Saudi Arabia.

## Company Details
- **Company Name**: شركة أمانة الكلمة (Amanat Al-Kalima Company)
- **C.R**: 7050308233
- **VAT Registration Number**: 313054315200003
- **Address**: 6618, 4120 22 Street Al Khaleej District Dammam, EASTERN PROVINCE Saudi Arabia 32425
- **Phone**: +966565790073
- **Email**: shahid@aalkc.com

## Technology Stack
- **Backend**: Node.js, Express.js, TypeScript, Prisma ORM
- **Frontend**: React.js, TypeScript, Material-UI
- **Database**: PostgreSQL
- **Authentication**: JWT
- **ZATCA Integration**: Custom API module

## Project Structure
```
erp-system/
├── backend/           # Node.js/Express API server
├── frontend/          # React.js application
├── database/          # Database schema and migrations
├── docs/              # Documentation
├── docker/            # Docker configuration
└── shared/            # Shared types and utilities
```

## Core Features
1. Dashboard with financial metrics
2. ZATCA-compliant invoicing system
3. Inventory management for metal scrap
4. Customer management
5. Quote system
6. Payment tracking
7. Loan management
8. Employee management
9. Recurring invoices
10. Credit notes
11. Expense tracking
12. Project management
13. Reports and analytics
14. VAT/tax management
15. Settings and configuration

## Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL 14+
- Docker (optional)

### Installation
1. Clone the repository
2. Install backend dependencies: `cd backend && npm install`
3. Install frontend dependencies: `cd frontend && npm install`
4. Set up database: `cd backend && npm run db:migrate`
5. Start development servers: `npm run dev`

## License
This project is proprietary software for Amanat Al-Kalima Company.