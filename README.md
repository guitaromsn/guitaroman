# ZATCA Scrap Business App

A comprehensive desktop business application built with React + Electron, specifically designed for the scrap metal industry in Saudi Arabia with full ZATCA compliance.

## 🚀 Features

### Business Management
- **ZATCA-Compliant E-Invoicing**: Generate XML invoices with QR codes per ZATCA specifications
- **Receipt & Payment Vouchers**: Complete voucher management system
- **Professional Quotations**: Create and manage price quotations
- **Customer Management**: Track customer information and transaction history
- **Scrap Item Catalog**: Comprehensive categorization of ferrous, non-ferrous, e-waste, and demolition materials

### ZATCA Compliance
- ✅ UBL 2.1 XML format compliance
- ✅ QR code generation with ZATCA specifications
- ✅ VAT calculations (15% standard rate)
- ✅ Digital signature support
- ✅ Arabic language support
- ✅ Saudi business document formatting

### Technology Stack
- **Frontend**: React 18 with modern hooks
- **Desktop**: Electron for cross-platform support
- **Database**: Azure SQL Database connectivity
- **Styling**: Tailwind CSS with dark mode support
- **Internationalization**: Multi-language (English, Arabic, Bengali)
- **AI Integration**: Google Gemini for intelligent suggestions

### Data Management
- **Cloud Database**: Connected to Azure SQL Server
- **Offline Capability**: Works in offline mode when database unavailable
- **Export Options**: PDF, Excel, CSV, JSON export functionality
- **Backup & Restore**: Settings and data backup capabilities

## 🏗️ Architecture

```
zatca-scrap-business-app/
├── main.js                 # Electron main process
├── package.json           # Dependencies and scripts
├── electron-store.js      # Application settings management
├── public/
│   └── index.html         # HTML entry point
├── src/
│   ├── App.jsx            # Main React application
│   ├── index.js           # React entry point
│   ├── db.js              # Database connection and management
│   ├── styles/main.css    # Global styles and Tailwind
│   ├── components/        # React components
│   │   ├── Dashboard.jsx  # Main dashboard
│   │   ├── Sidebar.jsx    # Navigation sidebar
│   │   ├── Topbar.jsx     # Top navigation bar
│   │   ├── Settings.jsx   # Application settings
│   │   ├── Analytics.jsx  # Business analytics
│   │   ├── InvoiceForm.jsx    # Invoice creation
│   │   ├── VoucherForm.jsx    # Voucher creation
│   │   └── QuotationForm.jsx  # Quotation creation
│   ├── zatca/             # ZATCA compliance modules
│   │   ├── xmlGenerator.js    # XML invoice generation
│   │   ├── qrGenerator.js     # QR code generation
│   │   └── formatUtils.js     # Formatting utilities
│   ├── vouchers/          # Voucher management
│   │   ├── receiptVoucher.js  # Receipt voucher logic
│   │   └── paymentVoucher.js  # Payment voucher logic
│   ├── quotations/
│   │   └── quotationGenerator.js # Quotation management
│   ├── agents/
│   │   └── geminiAgent.js     # AI integration
│   ├── data/
│   │   └── scrap_items.js     # Scrap metal item catalog
│   └── i18n/              # Internationalization
│       ├── en.json        # English translations
│       ├── ar.json        # Arabic translations
│       ├── bn.json        # Bengali translations
│       └── i18n.js        # i18n configuration
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd zatca-scrap-business-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Database** (Optional)
   - The app is pre-configured with Azure SQL Database
   - Works in offline mode if database is unavailable
   - Configure connection in `src/db.js` if needed

4. **Set up AI Integration** (Optional)
   ```bash
   # Add your Gemini API key to environment variables
   export REACT_APP_GEMINI_API_KEY=your_api_key_here
   ```

5. **Start Development**
   ```bash
   # Start React development server
   npm start

   # In another terminal, start Electron
   npm run electron
   ```

### Build for Production

```bash
# Build React app
npm run build

# Package Electron app
npm run dist
```

## 🌍 Multi-Language Support

The application supports three languages:
- **English (en)**: Primary language
- **Arabic (ar)**: Full RTL support for Saudi Arabia
- **Bengali (bn)**: For international users

Switch languages from the top navigation bar.

## 💼 Business Features

### Invoice Management
- Create ZATCA-compliant invoices
- Automatic XML generation
- QR code integration
- VAT calculations
- Customer management

### Scrap Metal Catalog
- **Ferrous Metals**: Steel, iron, cast iron, rebar
- **Non-Ferrous**: Aluminum, copper, brass, lead
- **E-Waste**: Computers, phones, circuit boards
- **Demolition**: Structural steel, pipes, frames
- **Precious Metals**: Gold, silver items
- **Automotive**: Engines, radiators, converters

### Document Types
- **E-Invoices**: ZATCA-compliant with XML/QR
- **Receipt Vouchers**: Cash and payment receipts
- **Payment Vouchers**: Supplier payments
- **Quotations**: Professional price quotes

## 🛠️ Configuration

### Company Settings
Configure your company information in Settings:
- Company name (English & Arabic)
- VAT registration number
- Commercial registration number  
- Address and contact details
- Logo upload

### Application Settings
- Language preference
- Theme (Light/Dark)
- Currency (SAR default)
- Date format
- Print settings

### Database Configuration
- Azure SQL connection configured
- Automatic table initialization
- Offline mode fallback
- Connection status monitoring

## 🔒 ZATCA Compliance Details

### E-Invoice Requirements
- ✅ UBL 2.1 XML format
- ✅ Seller information (VAT number, CR number)
- ✅ Buyer information  
- ✅ Invoice totals with VAT breakdown
- ✅ QR code with required fields
- ✅ Digital signature support
- ✅ Arabic translations

### QR Code Fields
1. Seller name
2. VAT registration number
3. Invoice date and time
4. Invoice total (including VAT)
5. VAT amount
6. XML invoice hash

## 🤖 AI Features

When configured with Google Gemini API:
- **Smart Item Suggestions**: Auto-categorize scrap items
- **Invoice Validation**: ZATCA compliance checking
- **Customer Insights**: Payment patterns and risk analysis
- **Business Analytics**: Performance recommendations
- **Intelligent Search**: Natural language queries

## 📊 Reporting & Analytics

- Sales performance tracking
- Customer transaction history
- Inventory movement reports
- VAT reporting for ZATCA
- Export capabilities (PDF, Excel, CSV)

## 🔧 Development

### Code Structure
- **React Hooks**: Modern React with functional components
- **Context API**: Global state management
- **Electron IPC**: Main/renderer process communication
- **Tailwind CSS**: Utility-first styling
- **React Router**: Client-side routing

### Database Schema
- Companies, Customers, ScrapItems
- Invoices, InvoiceItems
- Vouchers, Quotations, QuotationItems
- Automatic relationship management

### Testing
```bash
npm test
```

## 🌟 Production Deployment

1. **Build Application**
   ```bash
   npm run build
   npm run dist
   ```

2. **Database Setup**
   - Ensure Azure SQL database is accessible
   - Verify connection credentials
   - Test database connectivity

3. **Configuration**
   - Set production environment variables
   - Configure company information
   - Set up AI integration (optional)

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For support and questions:
- Check the documentation in `/docs`
- Review sample templates in `/src/assets/sample_templates`
- Ensure ZATCA compliance requirements are met
- Test thoroughly in Saudi Arabian business environment

## 🚧 Roadmap

- [ ] Advanced reporting dashboards
- [ ] Mobile companion app
- [ ] Integration with Saudi banks
- [ ] Automated ZATCA submission
- [ ] Multi-branch support
- [ ] Advanced inventory management
- [ ] Customer portal
- [ ] API integrations

---

**Built for Saudi Arabian businesses with ZATCA compliance in mind** 🇸🇦
