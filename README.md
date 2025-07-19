# Amanat Al-Kalima ERP System

**نظام تخطيط موارد المؤسسة لشركة أمانة الكلمة**

A comprehensive ERP system designed for metal scrap trading and recycling business in Saudi Arabia, with full ZATCA e-invoicing compliance.

## Features

### Core Modules
- 👥 **Customer Management** - إدارة العملاء
- 📄 **Invoice Management** - إدارة الفواتير مع تكامل ZATCA
- 📦 **Inventory Tracking** - تتبع مخزون المعادن والخردة
- 📊 **Project Management** - إدارة مشاريع التجارة
- 📈 **Reports & Analytics** - التقارير والتحليلات
- ⚙️ **Settings & Configuration** - الإعدادات والتكوين

### Technical Features
- ✅ Arabic/English bilingual support
- ✅ RTL (Right-to-Left) interface
- ✅ ZATCA e-invoicing integration
- ✅ Responsive Material-UI design
- ✅ RESTful API architecture
- ✅ JWT authentication
- ✅ MySQL database with proper indexing

## Technology Stack

### Backend
- **Node.js** with Express.js
- **MySQL** database with Sequelize ORM
- **JWT** for authentication
- **Joi** for validation
- **Axios** for ZATCA API integration

### Frontend
- **React** 18 with hooks
- **Material-UI** (MUI) for components
- **React Router** for navigation
- **i18next** for internationalization
- **Axios** for API communication

## Project Structure

```
guitaroman/
├── backend/                 # Node.js API server
│   ├── config/             # Database and app configuration
│   ├── models/             # Sequelize models
│   ├── routes/             # API route handlers
│   ├── middleware/         # Authentication & validation
│   ├── utils/              # Helper functions
│   └── server.js           # Entry point
├── frontend/               # React application
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React context providers
│   │   ├── locales/        # Translation files
│   │   └── utils/          # Helper functions
│   └── package.json
├── database/               # Database schemas and migrations
├── docs/                   # Documentation
└── scripts/                # Utility scripts
```

## Getting Started

### Prerequisites
- Node.js 16+ and npm
- MySQL 8.0+
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/guitaromsn/guitaroman.git
   cd guitaroman
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   cp ../.env.example .env
   # Edit .env with your database credentials
   npm run dev
   ```

3. **Setup Database**
   ```bash
   mysql -u root -p < ../database/schema.sql
   ```

4. **Setup Frontend**
   ```bash
   cd ../frontend
   npm install
   npm start
   ```

### Default Login
- **Username:** admin
- **Password:** admin123

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `POST /api/auth/refresh` - Refresh token
- `POST /api/auth/logout` - Logout

### Customers
- `GET /api/customers` - List customers with pagination/search
- `POST /api/customers` - Create new customer
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Deactivate customer

### Invoices (Coming Soon)
- `GET /api/invoices` - List invoices
- `POST /api/invoices` - Create invoice
- `POST /api/invoices/:id/zatca-submit` - Submit to ZATCA
- `GET /api/invoices/:id/pdf` - Download PDF

### Additional Modules
- Inventory Management
- Project Management
- Reports & Analytics
- ZATCA E-invoicing

## Development Status

### ✅ Completed
- [x] Project structure and configuration
- [x] Database schema design
- [x] Authentication system
- [x] Customer management (backend & frontend)
- [x] Basic UI layout with Arabic support
- [x] RTL Material-UI theming

### 🚧 In Progress
- [ ] Invoice management with ZATCA integration
- [ ] Inventory tracking system
- [ ] Project management features
- [ ] Dashboard analytics
- [ ] Reports generation

### 📋 Planned
- [ ] Advanced ZATCA e-invoicing
- [ ] Real-time notifications
- [ ] File upload functionality
- [ ] Data import/export
- [ ] Mobile responsiveness
- [ ] Performance optimization
- [ ] Comprehensive testing
- [ ] Docker deployment
- [ ] User documentation

## Contributing

This is a private project for Amanat Al-Kalima Company. For internal development only.

## License

Private - All rights reserved by Amanat Al-Kalima Company.

---

**شركة أمانة الكلمة** - نظام تخطيط موارد المؤسسة
*تجارة وتدوير المعادن والخردة*