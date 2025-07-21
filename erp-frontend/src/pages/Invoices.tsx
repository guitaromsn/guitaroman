import React, { useState } from 'react';
import { formatSAR, getText, businessTexts } from '../utils/currency';
import './ModulePage.css';

interface InvoicesProps {
  locale: string;
}

const Invoices: React.FC<InvoicesProps> = ({ locale }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const invoices = [
    { id: 'INV-2024-001', customerName: 'شركة الرياض للتجارة', date: '2024-01-20', amount: 15000, vatAmount: 2250, total: 17250, status: 'paid' },
    { id: 'INV-2024-002', customerName: 'مؤسسة جدة الحديثة', date: '2024-01-19', amount: 8500, vatAmount: 1275, total: 9775, status: 'pending' },
    { id: 'INV-2024-003', customerName: 'شركة الدمام للصناعات', date: '2024-01-18', amount: 22000, vatAmount: 3300, total: 25300, status: 'paid' },
    { id: 'INV-2024-004', customerName: 'متجر الخبر الكبير', date: '2024-01-15', amount: 3200, vatAmount: 480, total: 3680, status: 'overdue' },
    { id: 'INV-2024-005', customerName: 'شركة المدينة التقنية', date: '2024-01-14', amount: 12000, vatAmount: 1800, total: 13800, status: 'draft' },
  ];

  const getStatusText = (status: string) => {
    const statusTexts = {
      paid: { en: 'Paid', ar: 'مدفوع' },
      pending: { en: 'Pending', ar: 'معلق' },
      overdue: { en: 'Overdue', ar: 'متأخر' },
      draft: { en: 'Draft', ar: 'مسودة' },
    };
    return getText(statusTexts[status as keyof typeof statusTexts], locale);
  };

  const getStatusClass = (status: string) => {
    const statusClasses = {
      paid: 'status-success',
      pending: 'status-warning',
      overdue: 'status-error',
      draft: 'status-info',
    };
    return statusClasses[status as keyof typeof statusClasses] || 'status-warning';
  };

  const filteredInvoices = invoices.filter(invoice =>
    invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalRevenue = invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.total, 0);
  const pendingAmount = invoices.filter(inv => inv.status === 'pending').reduce((sum, inv) => sum + inv.total, 0);
  const overdueAmount = invoices.filter(inv => inv.status === 'overdue').reduce((sum, inv) => sum + inv.total, 0);

  return (
    <div className="module-page fade-in">
      <div className="page-header">
        <div className="header-content">
          <h1>{getText(businessTexts.invoices, locale)}</h1>
          <p className="page-subtitle">
            {locale === 'ar' 
              ? 'إدارة الفواتير والمدفوعات' 
              : 'Manage invoices and payments'
            }
          </p>
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary">
            <i className="fas fa-download"></i>
            {locale === 'ar' ? 'تصدير' : 'Export'}
          </button>
          <button className="btn btn-primary">
            <i className="fas fa-plus"></i>
            {locale === 'ar' ? 'فاتورة جديدة' : 'New Invoice'}
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card success">
          <div className="stat-icon">
            <i className="fas fa-check-circle"></i>
          </div>
          <div className="stat-content">
            <h3>{formatSAR(totalRevenue, { locale })}</h3>
            <p>{locale === 'ar' ? 'إجمالي المدفوع' : 'Total Paid'}</p>
          </div>
        </div>
        <div className="stat-card warning">
          <div className="stat-icon">
            <i className="fas fa-clock"></i>
          </div>
          <div className="stat-content">
            <h3>{formatSAR(pendingAmount, { locale })}</h3>
            <p>{locale === 'ar' ? 'معلق الدفع' : 'Pending Payment'}</p>
          </div>
        </div>
        <div className="stat-card error">
          <div className="stat-icon">
            <i className="fas fa-exclamation-triangle"></i>
          </div>
          <div className="stat-content">
            <h3>{formatSAR(overdueAmount, { locale })}</h3>
            <p>{locale === 'ar' ? 'متأخر الدفع' : 'Overdue'}</p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="page-controls">
        <div className="search-box">
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder={locale === 'ar' ? 'البحث في الفواتير...' : 'Search invoices...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filters">
          <select className="filter-select">
            <option value="">{locale === 'ar' ? 'جميع الحالات' : 'All Status'}</option>
            <option value="paid">{locale === 'ar' ? 'مدفوع' : 'Paid'}</option>
            <option value="pending">{locale === 'ar' ? 'معلق' : 'Pending'}</option>
            <option value="overdue">{locale === 'ar' ? 'متأخر' : 'Overdue'}</option>
            <option value="draft">{locale === 'ar' ? 'مسودة' : 'Draft'}</option>
          </select>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="content-card">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>{locale === 'ar' ? 'رقم الفاتورة' : 'Invoice #'}</th>
                <th>{locale === 'ar' ? 'اسم العميل' : 'Customer Name'}</th>
                <th>{getText(businessTexts.date, locale)}</th>
                <th>{getText(businessTexts.subtotal, locale)}</th>
                <th>{getText(businessTexts.taxAmount, locale)} (15%)</th>
                <th>{getText(businessTexts.grandTotal, locale)}</th>
                <th>{getText(businessTexts.status, locale)}</th>
                <th>{locale === 'ar' ? 'الإجراءات' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((invoice) => (
                <tr key={invoice.id}>
                  <td className="invoice-id">{invoice.id}</td>
                  <td className="customer-name">{invoice.customerName}</td>
                  <td>{new Date(invoice.date).toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US')}</td>
                  <td className="amount">{formatSAR(invoice.amount, { locale })}</td>
                  <td className="vat-amount">{formatSAR(invoice.vatAmount, { locale })}</td>
                  <td className="total-amount">{formatSAR(invoice.total, { locale })}</td>
                  <td>
                    <span className={`status-badge ${getStatusClass(invoice.status)}`}>
                      {getStatusText(invoice.status)}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="action-btn view" title={locale === 'ar' ? 'عرض' : 'View'}>
                        <i className="fas fa-eye"></i>
                      </button>
                      <button className="action-btn edit" title={locale === 'ar' ? 'تعديل' : 'Edit'}>
                        <i className="fas fa-edit"></i>
                      </button>
                      <button className="action-btn print" title={locale === 'ar' ? 'طباعة' : 'Print'}>
                        <i className="fas fa-print"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ZATCA Compliance Notice */}
      <div className="zatca-notice">
        <div className="notice-icon">
          <i className="fas fa-shield-check"></i>
        </div>
        <div className="notice-content">
          <h4>{locale === 'ar' ? 'متوافق مع زاتكا' : 'ZATCA Compliant'}</h4>
          <p>
            {locale === 'ar' 
              ? 'جميع الفواتير متوافقة مع متطلبات هيئة الزكاة والضريبة والجمارك السعودية'
              : 'All invoices comply with Saudi ZATCA requirements including e-invoicing standards'
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default Invoices;