import React from 'react';
import { formatSAR, getText, businessTexts } from '../utils/currency';
import './Dashboard.css';

interface DashboardProps {
  locale: string;
}

const Dashboard: React.FC<DashboardProps> = ({ locale }) => {
  // Sample data for dashboard
  const dashboardData = {
    totalRevenue: 2450000.75,
    totalInvoices: 1847,
    pendingPayments: 125000.50,
    inventoryValue: 890000.25,
    monthlyGrowth: 12.5,
    activeProjects: 23,
    completedTasks: 156,
    customerSatisfaction: 98.2,
  };

  const recentInvoices = [
    { id: 'INV-2024-001', customer: 'شركة الرياض للتجارة', amount: 15000, status: 'paid', date: '2024-01-20' },
    { id: 'INV-2024-002', customer: 'مؤسسة جدة الحديثة', amount: 8500, status: 'pending', date: '2024-01-19' },
    { id: 'INV-2024-003', customer: 'شركة الدمام للصناعات', amount: 22000, status: 'paid', date: '2024-01-18' },
    { id: 'INV-2024-004', customer: 'متجر الخبر الكبير', amount: 3200, status: 'overdue', date: '2024-01-15' },
  ];

  const topProducts = [
    { name: 'منتج تقني متطور', sales: 45, revenue: 125000 },
    { name: 'خدمة استشارية', sales: 32, revenue: 95000 },
    { name: 'حل برمجي مخصص', sales: 28, revenue: 180000 },
    { name: 'دعم فني', sales: 67, revenue: 85000 },
  ];

  const getStatusText = (status: string) => {
    const statusTexts = {
      paid: { en: 'Paid', ar: 'مدفوع' },
      pending: { en: 'Pending', ar: 'معلق' },
      overdue: { en: 'Overdue', ar: 'متأخر' },
    };
    return getText(statusTexts[status as keyof typeof statusTexts], locale);
  };

  const getStatusClass = (status: string) => {
    const statusClasses = {
      paid: 'status-paid',
      pending: 'status-pending', 
      overdue: 'status-overdue',
    };
    return statusClasses[status as keyof typeof statusClasses] || 'status-pending';
  };

  return (
    <div className="dashboard fade-in">
      <div className="dashboard-header">
        <h1>{getText(businessTexts.dashboard, locale)}</h1>
        <p className="dashboard-subtitle">
          {locale === 'ar' 
            ? 'نظرة عامة على أداء شركة أمانة الكلمة' 
            : 'Overview of Amanat Al-Kalima Company Performance'
          }
        </p>
      </div>

      {/* Key Performance Indicators */}
      <div className="kpi-grid">
        <div className="kpi-card revenue">
          <div className="kpi-icon">
            <i className="fas fa-chart-line"></i>
          </div>
          <div className="kpi-content">
            <h3>{locale === 'ar' ? 'إجمالي الإيرادات' : 'Total Revenue'}</h3>
            <div className="kpi-value">{formatSAR(dashboardData.totalRevenue, { locale })}</div>
            <div className="kpi-change positive">
              <i className="fas fa-arrow-up"></i>
              +{dashboardData.monthlyGrowth}% {locale === 'ar' ? 'هذا الشهر' : 'this month'}
            </div>
          </div>
        </div>

        <div className="kpi-card invoices">
          <div className="kpi-icon">
            <i className="fas fa-file-invoice-dollar"></i>
          </div>
          <div className="kpi-content">
            <h3>{getText(businessTexts.invoices, locale)}</h3>
            <div className="kpi-value">{dashboardData.totalInvoices.toLocaleString()}</div>
            <div className="kpi-change positive">
              <i className="fas fa-arrow-up"></i>
              +8.2% {locale === 'ar' ? 'هذا الشهر' : 'this month'}
            </div>
          </div>
        </div>

        <div className="kpi-card pending">
          <div className="kpi-icon">
            <i className="fas fa-clock"></i>
          </div>
          <div className="kpi-content">
            <h3>{locale === 'ar' ? 'مدفوعات معلقة' : 'Pending Payments'}</h3>
            <div className="kpi-value">{formatSAR(dashboardData.pendingPayments, { locale })}</div>
            <div className="kpi-change negative">
              <i className="fas fa-arrow-down"></i>
              -3.1% {locale === 'ar' ? 'هذا الشهر' : 'this month'}
            </div>
          </div>
        </div>

        <div className="kpi-card inventory">
          <div className="kpi-icon">
            <i className="fas fa-boxes"></i>
          </div>
          <div className="kpi-content">
            <h3>{locale === 'ar' ? 'قيمة المخزون' : 'Inventory Value'}</h3>
            <div className="kpi-value">{formatSAR(dashboardData.inventoryValue, { locale })}</div>
            <div className="kpi-change positive">
              <i className="fas fa-arrow-up"></i>
              +5.7% {locale === 'ar' ? 'هذا الشهر' : 'this month'}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="dashboard-grid">
        <div className="dashboard-section">
          <div className="section-header">
            <h2>{locale === 'ar' ? 'الفواتير الأخيرة' : 'Recent Invoices'}</h2>
            <button className="section-action">
              {locale === 'ar' ? 'عرض الكل' : 'View All'}
              <i className="fas fa-arrow-right"></i>
            </button>
          </div>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>{locale === 'ar' ? 'رقم الفاتورة' : 'Invoice #'}</th>
                  <th>{locale === 'ar' ? 'العميل' : 'Customer'}</th>
                  <th>{getText(businessTexts.amount, locale)}</th>
                  <th>{getText(businessTexts.status, locale)}</th>
                  <th>{getText(businessTexts.date, locale)}</th>
                </tr>
              </thead>
              <tbody>
                {recentInvoices.map((invoice) => (
                  <tr key={invoice.id}>
                    <td className="invoice-id">{invoice.id}</td>
                    <td>{invoice.customer}</td>
                    <td className="amount">{formatSAR(invoice.amount, { locale })}</td>
                    <td>
                      <span className={`status-badge ${getStatusClass(invoice.status)}`}>
                        {getStatusText(invoice.status)}
                      </span>
                    </td>
                    <td>{new Date(invoice.date).toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="dashboard-section">
          <div className="section-header">
            <h2>{locale === 'ar' ? 'أفضل المنتجات' : 'Top Products'}</h2>
            <button className="section-action">
              {locale === 'ar' ? 'عرض التقرير' : 'View Report'}
              <i className="fas fa-chart-bar"></i>
            </button>
          </div>
          <div className="products-list">
            {topProducts.map((product, index) => (
              <div key={index} className="product-item">
                <div className="product-rank">#{index + 1}</div>
                <div className="product-info">
                  <h4>{product.name}</h4>
                  <div className="product-stats">
                    <span>{product.sales} {locale === 'ar' ? 'مبيعة' : 'sales'}</span>
                    <span className="revenue">{formatSAR(product.revenue, { locale })}</span>
                  </div>
                </div>
                <div className="product-trend">
                  <i className="fas fa-trending-up"></i>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="quick-stats">
        <div className="stat-item">
          <i className="fas fa-project-diagram"></i>
          <div>
            <span className="stat-value">{dashboardData.activeProjects}</span>
            <span className="stat-label">{locale === 'ar' ? 'مشاريع نشطة' : 'Active Projects'}</span>
          </div>
        </div>
        <div className="stat-item">
          <i className="fas fa-tasks"></i>
          <div>
            <span className="stat-value">{dashboardData.completedTasks}</span>
            <span className="stat-label">{locale === 'ar' ? 'مهام مكتملة' : 'Completed Tasks'}</span>
          </div>
        </div>
        <div className="stat-item">
          <i className="fas fa-star"></i>
          <div>
            <span className="stat-value">{dashboardData.customerSatisfaction}%</span>
            <span className="stat-label">{locale === 'ar' ? 'رضا العملاء' : 'Customer Satisfaction'}</span>
          </div>
        </div>
        <div className="stat-item zatca-status">
          <i className="fas fa-shield-check"></i>
          <div>
            <span className="stat-value">{locale === 'ar' ? 'متوافق' : 'Compliant'}</span>
            <span className="stat-label">{locale === 'ar' ? 'زاتكا' : 'ZATCA'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;