# أمانة الكلمة ERP System - Amanat Al-Kalima ERP

Professional ERP system for **شركة أمانة الكلمة لتجارة خردة المعادن** (Amanat Al-Kalima Metal Scrap Trading Company).

## Overview

This is a complete ERP system designed specifically for metal scrap trading operations in Saudi Arabia, featuring:

- **Dark theme design** with copper/orange branding (#E58A43)
- **Arabic and English language support**
- **Saudi Arabia VAT compliance** (15%)
- **SAR currency integration**
- **Professional dashboard** with Chart.js analytics

## Features

### Business Modules
- **Dashboard**: Live metrics and performance analytics
- **Financial Documents**: Invoices, Sales Receipts, Quotes, Credit Notes
- **Operations**: Inventory Management, Projects, Expense Tracker
- **Management**: Customers, Employees, Loan Management
- **Compliance**: Reports, VAT Management (15%)
- **Settings**: System configuration

### Metal Scrap Pricing (Saudi Market)
#### Ferrous Metals
- Steel bars: SAR 1.5/kg
- General steel: SAR 1.2/kg
- Cast iron: SAR 1.0/kg

#### Non-ferrous Metals
- Copper: SAR 25.0/kg
- Aluminum: SAR 6.5/kg
- Bronze: SAR 18.0/kg

#### Copper Grades
- Bare bright copper: SAR 30.0/kg
- Copper No.1: SAR 28.0/kg
- Copper No.2: SAR 25.0/kg

#### Copper Cables
- Copper cable: SAR 28.0/kg
- B Cable: SAR 26.0/kg

### Sample Customers
- أرامكو السعودية (Saudi Aramco)
- مجموعة الراشد (Al-Rushaid Group)
- شركة المعادن المتقدمة (Advanced Metals Company)
- الشركة الوطنية للمعادن (National Metals Company)

## Getting Started

### Option 1: Direct HTML (Recommended for Testing)
1. Open `frontend/public/index.html` directly in a web browser
2. All CDN resources will load automatically
3. No server setup required for basic functionality

### Option 2: Local Web Server
```bash
# Navigate to the frontend directory
cd frontend/public

# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js (if you have http-server installed)
npx http-server .

# Access at: http://localhost:8000
```

## Key Features

### Professional UI
- **Responsive design** works on desktop, tablet, and mobile
- **Font Awesome icons** for professional appearance
- **Google Fonts (Inter)** for modern typography
- **CSS Grid and Flexbox** for flexible layouts

### Business Logic
- **15% VAT calculations** as per Saudi regulations
- **Real-time price calculations** for weight × rate
- **Dynamic form generation** for invoices and documents
- **Professional invoice numbering** (INV-2024-XXX format)

### Interactive Features
- **Modal forms** for data entry
- **Dynamic item management** in invoices
- **Chart.js dashboard** with sales analytics
- **Smooth navigation** between modules
- **Form validation** and error handling

## Technical Stack

- **Frontend**: Pure HTML5, CSS3, JavaScript (ES6+)
- **Charts**: Chart.js for dashboard analytics
- **Icons**: Font Awesome 6.4.0
- **Fonts**: Google Fonts (Inter family)
- **Responsive**: CSS Grid, Flexbox, Media Queries

## Saudi Arabia Compliance

- **VAT Rate**: 15% (as per ZATCA regulations)
- **Currency**: Saudi Riyal (SAR) throughout
- **Language**: Arabic interface with English support
- **Business Data**: Local metal scrap market prices
- **E-invoicing Ready**: ZATCA compliant interface

## Browser Support

- Chrome 90+
- Firefox 90+
- Safari 14+
- Edge 90+

## License

Licensed under the Apache License, Version 2.0