import React, { useState } from 'react';
import { formatSAR, getText, businessTexts } from '../utils/currency';
import './ModulePage.css';

interface ReportsProps {
  locale: string;
}

const Reports: React.FC<ReportsProps> = ({ locale }) => {
  const [selectedReport, setSelectedReport] = useState('financial');
  const [dateRange, setDateRange] = useState('current_month');

  const reportTypes = [
    { id: 'financial', name: { en: 'Financial Report', ar: 'التقرير المالي' }, icon: 'fas fa-chart-line' },
    { id: 'sales', name: { en: 'Sales Report', ar: 'تقرير المبيعات' }, icon: 'fas fa-shopping-cart' },
    { id: 'inventory', name: { en: 'Inventory Report', ar: 'تقرير المخزون' }, icon: 'fas fa-boxes' },
    { id: 'tax', name: { en: 'VAT Report', ar: 'تقرير الضريبة' }, icon: 'fas fa-receipt' },
    { id: 'projects', name: { en: 'Projects Report', ar: 'تقرير المشاريع' }, icon: 'fas fa-project-diagram' },
  ];

  const dateRanges = [
    { id: 'today', name: { en: 'Today', ar: 'اليوم' } },
    { id: 'current_week', name: { en: 'This Week', ar: 'هذا الأسبوع' } },
    { id: 'current_month', name: { en: 'This Month', ar: 'هذا الشهر' } },
    { id: 'current_quarter', name: { en: 'This Quarter', ar: 'هذا الربع' } },
    { id: 'current_year', name: { en: 'This Year', ar: 'هذا العام' } },
    { id: 'custom', name: { en: 'Custom Range', ar: 'فترة مخصصة' } },
  ];

  // Sample data for financial report
  const financialData = {
    revenue: 2450000.75,
    expenses: 1850000.50,
    profit: 600000.25,
    vatCollected: 367500.11,
    vatPaid: 277500.08,
    netVat: 90000.03,
  };

  const chartData = [
    { month: locale === 'ar' ? 'يناير' : 'Jan', revenue: 185000, expenses: 145000 },
    { month: locale === 'ar' ? 'فبراير' : 'Feb', revenue: 220000, expenses: 165000 },
    { month: locale === 'ar' ? 'مارس' : 'Mar', revenue: 198000, expenses: 152000 },
    { month: locale === 'ar' ? 'أبريل' : 'Apr', revenue: 267000, expenses: 189000 },
    { month: locale === 'ar' ? 'مايو' : 'May', revenue: 245000, expenses: 175000 },
    { month: locale === 'ar' ? 'يونيو' : 'Jun', revenue: 289000, expenses: 201000 },
  ];

  const topCustomers = [
    { name: 'شركة الرياض للتجارة', amount: 125000, invoices: 15 },
    { name: 'مؤسسة جدة الحديثة', amount: 98000, invoices: 12 },
    { name: 'شركة الدمام للصناعات', amount: 87000, invoices: 8 },
    { name: 'متجر الخبر الكبير', amount: 72000, invoices: 22 },
  ];

  const renderFinancialReport = () => (
    <div className="report-content">
      <div className="report-summary">
        <div className="summary-card revenue">
          <div className="summary-icon">
            <i className="fas fa-arrow-up"></i>
          </div>
          <div className="summary-content">
            <h3>{formatSAR(financialData.revenue, { locale })}</h3>
            <p>{locale === 'ar' ? 'إجمالي الإيرادات' : 'Total Revenue'}</p>
            <span className="summary-change positive">+12.5%</span>
          </div>
        </div>

        <div className="summary-card expenses">
          <div className="summary-icon">
            <i className="fas fa-arrow-down"></i>
          </div>
          <div className="summary-content">
            <h3>{formatSAR(financialData.expenses, { locale })}</h3>
            <p>{locale === 'ar' ? 'إجمالي المصروفات' : 'Total Expenses'}</p>
            <span className="summary-change positive">-3.2%</span>
          </div>
        </div>

        <div className="summary-card profit">
          <div className="summary-icon">
            <i className="fas fa-chart-line"></i>
          </div>
          <div className="summary-content">
            <h3>{formatSAR(financialData.profit, { locale })}</h3>
            <p>{locale === 'ar' ? 'صافي الربح' : 'Net Profit'}</p>
            <span className="summary-change positive">+18.7%</span>
          </div>
        </div>

        <div className="summary-card vat">
          <div className="summary-icon">
            <i className="fas fa-receipt"></i>
          </div>
          <div className="summary-content">
            <h3>{formatSAR(financialData.netVat, { locale })}</h3>
            <p>{locale === 'ar' ? 'صافي الضريبة' : 'Net VAT'}</p>
            <span className="summary-change neutral">±0%</span>
          </div>
        </div>
      </div>

      <div className="report-charts">
        <div className="chart-container">
          <h3>{locale === 'ar' ? 'الإيرادات والمصروفات الشهرية' : 'Monthly Revenue & Expenses'}</h3>
          <div className="simple-chart">
            {chartData.map((data, index) => (
              <div key={index} className="chart-bar">
                <div className="bar-container">
                  <div 
                    className="bar revenue-bar" 
                    style={{ height: `${(data.revenue / 300000) * 100}%` }}
                    title={`${data.month}: ${formatSAR(data.revenue, { locale })}`}
                  ></div>
                  <div 
                    className="bar expense-bar" 
                    style={{ height: `${(data.expenses / 300000) * 100}%` }}
                    title={`${data.month}: ${formatSAR(data.expenses, { locale })}`}
                  ></div>
                </div>
                <span className="bar-label">{data.month}</span>
              </div>
            ))}
          </div>
          <div className="chart-legend">
            <div className="legend-item">
              <div className="legend-color revenue"></div>
              <span>{locale === 'ar' ? 'الإيرادات' : 'Revenue'}</span>
            </div>
            <div className="legend-item">
              <div className="legend-color expenses"></div>
              <span>{locale === 'ar' ? 'المصروفات' : 'Expenses'}</span>
            </div>
          </div>
        </div>

        <div className="top-customers">
          <h3>{locale === 'ar' ? 'أفضل العملاء' : 'Top Customers'}</h3>
          <div className="customers-list">
            {topCustomers.map((customer, index) => (
              <div key={index} className="customer-item">
                <div className="customer-rank">#{index + 1}</div>
                <div className="customer-info">
                  <h4>{customer.name}</h4>
                  <div className="customer-stats">
                    <span>{formatSAR(customer.amount, { locale })}</span>
                    <span>{customer.invoices} {locale === 'ar' ? 'فاتورة' : 'invoices'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ZATCA Compliance Section */}
      <div className="zatca-section">
        <div className="zatca-header">
          <i className="fas fa-shield-check"></i>
          <h3>{locale === 'ar' ? 'تقرير الامتثال لزاتكا' : 'ZATCA Compliance Report'}</h3>
        </div>
        <div className="zatca-details">
          <div className="zatca-item">
            <span className="zatca-label">{locale === 'ar' ? 'ضريبة القيمة المضافة المحصلة:' : 'VAT Collected:'}</span>
            <span className="zatca-value">{formatSAR(financialData.vatCollected, { locale })}</span>
          </div>
          <div className="zatca-item">
            <span className="zatca-label">{locale === 'ar' ? 'ضريبة القيمة المضافة المدفوعة:' : 'VAT Paid:'}</span>
            <span className="zatca-value">{formatSAR(financialData.vatPaid, { locale })}</span>
          </div>
          <div className="zatca-item highlight">
            <span className="zatca-label">{locale === 'ar' ? 'صافي الضريبة المستحقة:' : 'Net VAT Due:'}</span>
            <span className="zatca-value">{formatSAR(financialData.netVat, { locale })}</span>
          </div>
        </div>
        <div className="zatca-status">
          <i className="fas fa-check-circle"></i>
          <span>{locale === 'ar' ? 'جميع التقارير متوافقة مع متطلبات زاتكا' : 'All reports comply with ZATCA requirements'}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="module-page fade-in">
      <div className="page-header">
        <div className="header-content">
          <h1>{getText(businessTexts.reports, locale)}</h1>
          <p className="page-subtitle">
            {locale === 'ar' 
              ? 'تقارير مفصلة وإحصائيات الأعمال' 
              : 'Detailed reports and business analytics'
            }
          </p>
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary">
            <i className="fas fa-download"></i>
            {locale === 'ar' ? 'تصدير PDF' : 'Export PDF'}
          </button>
          <button className="btn btn-primary">
            <i className="fas fa-print"></i>
            {locale === 'ar' ? 'طباعة' : 'Print'}
          </button>
        </div>
      </div>

      <div className="reports-container">
        <div className="reports-sidebar">
          <div className="report-types">
            <h3>{locale === 'ar' ? 'نوع التقرير' : 'Report Type'}</h3>
            {reportTypes.map((type) => (
              <button
                key={type.id}
                className={`report-type-btn ${selectedReport === type.id ? 'active' : ''}`}
                onClick={() => setSelectedReport(type.id)}
              >
                <i className={type.icon}></i>
                <span>{getText(type.name, locale)}</span>
              </button>
            ))}
          </div>

          <div className="date-range-selector">
            <h3>{locale === 'ar' ? 'الفترة الزمنية' : 'Date Range'}</h3>
            <select 
              value={dateRange} 
              onChange={(e) => setDateRange(e.target.value)}
              className="date-range-select"
            >
              {dateRanges.map((range) => (
                <option key={range.id} value={range.id}>
                  {getText(range.name, locale)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="reports-main">
          <div className="report-header">
            <h2>{getText(reportTypes.find(t => t.id === selectedReport)?.name || { en: 'Report', ar: 'تقرير' }, locale)}</h2>
            <div className="report-period">
              {locale === 'ar' ? 'للفترة: ' : 'Period: '}
              {getText(dateRanges.find(r => r.id === dateRange)?.name || { en: 'This Month', ar: 'هذا الشهر' }, locale)}
            </div>
          </div>

          {selectedReport === 'financial' && renderFinancialReport()}
          
          {selectedReport !== 'financial' && (
            <div className="report-placeholder">
              <i className="fas fa-chart-bar"></i>
              <h3>{locale === 'ar' ? 'قريباً' : 'Coming Soon'}</h3>
              <p>
                {locale === 'ar' 
                  ? 'هذا التقرير قيد التطوير وسيكون متاحاً قريباً' 
                  : 'This report is under development and will be available soon'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;