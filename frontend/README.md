# Amanat Al-Kalima ERP Frontend

## نظام إدارة الأعمال لشركة أمانة الكلمة

This directory contains the professional frontend for the Amanat Al-Kalima ERP system, specifically designed for metal scrap business operations in Dammam, Saudi Arabia.

## 🚀 Features

### 🎨 Professional UI/UX Design
- Beautiful dark theme with copper/orange accent (#E58A43)
- Responsive layout with sidebar navigation
- Material Design components and smooth animations
- Professional typography with Inter font family
- Arabic business branding with recycle icon

### 🏢 Complete Business Modules
**Financial Documents:**
- Dashboard with real-time analytics
- Invoices with ZATCA compliance
- Sales Receipts
- Quotes & Credit Notes

**Operations Management:**
- Inventory tracking
- Project management
- Expense tracking

**Management:**
- Customer management
- Employee management
- Loan management

**Compliance & Reporting:**
- Advanced reports
- VAT management (15% Saudi rate)

### 💰 Real Business Data Integration
**Ferrous Metals (حديد):**
- Reinforcing Steel: SAR 1.5/kg
- General Steel: SAR 1.2/kg
- Cast Iron: SAR 1.0/kg

**Non-Ferrous Metals:**
- Copper Scrap: SAR 25.0/kg
- Aluminum: SAR 6.5/kg
- Bronze: SAR 18.0/kg

**Premium Copper Grades:**
- Bare Bright Copper: SAR 30.0/kg
- No. 1 Copper: SAR 28.0/kg
- Copper Cable: SAR 28.0/kg

### 📊 Live Dashboard Metrics
- Total Receivables: SAR 1,250,400.50
- Overdue Balance: SAR 85,230.00
- Monthly Sales: SAR 312,800.75
- VAT Payable: SAR 45,150.20

## 🛠️ Technical Features

### Saudi Arabia Compliance
- **Arabic language support** in item descriptions
- **SAR currency** formatting throughout
- **15% VAT rate** as per Saudi regulations
- **Professional invoice formatting** for ZATCA compliance

### Advanced Functionality
- **Dynamic item forms** with auto-calculation
- **Real-time VAT calculations** (15% Saudi rate)
- **Chart.js integration** for sales analytics
- **Modal system** for data entry forms
- **Responsive navigation** with smooth animations
- **Professional color scheme** matching brand

## 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm start
   ```
   This will serve the application on http://localhost:3000

3. **Build for production:**
   ```bash
   npm run build
   ```

## 📁 File Structure

```
frontend/
├── public/
│   └── index.html          # Complete ERP frontend application
├── src/
│   └── App.js             # React component placeholder for future integration
├── package.json           # Project configuration
└── README.md             # This file
```

## 🎯 Implementation Notes

### Current Implementation
- The main ERP application is implemented as a complete, standalone HTML file in `public/index.html`
- All business logic, styling, and functionality is included in the single file
- External dependencies are loaded via CDN (Font Awesome, Google Fonts, Chart.js)
- Ready for immediate deployment and production use

### Future Migration
- The `src/App.js` file provides a placeholder for gradually migrating features to React components
- This approach allows for immediate deployment while maintaining flexibility for future enhancements

## 🌐 External Dependencies

- **Font Awesome 6.4.0** - Icons
- **Google Fonts (Inter family)** - Typography
- **Chart.js** - Dashboard analytics
- All dependencies are loaded via CDN for optimal performance

## 🏪 Business Context

**Company:** شركة أمانة الكلمة (Amanat Al-Kalima Company)  
**Industry:** Metal Scrap Recycling and Trading  
**Location:** Dammam, Saudi Arabia  
**Compliance:** ZATCA (Saudi Tax Authority) compliant  

## 📊 System Capabilities

- **Multi-currency support** with primary focus on SAR
- **Real-time pricing** for various metal types
- **Inventory management** with quantity tracking
- **Financial reporting** with VAT calculations
- **Customer relationship management**
- **Employee management system**
- **Project tracking and management**
- **Expense monitoring and control**

## 🎨 Design System

### Color Palette
- Primary: #E58A43 (Copper/Orange)
- Background: #1a1a1a (Dark)
- Surface: #2d2d2d (Dark)
- Text: #ffffff (White)
- Success: #4CAF50 (Green)
- Warning: #FF9800 (Orange)
- Error: #f44336 (Red)

### Typography
- Font Family: Inter (Google Fonts)
- Arabic support with proper RTL layout
- Professional business styling

## 📱 Responsive Design

The application is fully responsive and works seamlessly across:
- Desktop computers
- Tablets
- Mobile phones
- All modern browsers

## 🔒 Security Features

- Form validation and error handling
- Professional data entry controls
- Auto-save functionality
- Secure modal system for sensitive operations

---

Built with ❤️ for شركة أمانة الكلمة - Professional ERP Solutions