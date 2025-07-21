import React, { useState } from 'react';
import { formatSAR, getText, businessTexts } from '../utils/currency';
import './ModulePage.css';

interface InventoryProps {
  locale: string;
}

const Inventory: React.FC<InventoryProps> = ({ locale }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const inventoryItems = [
    { id: 'PRD-001', name: 'حاسوب محمول ديل', category: 'إلكترونيات', quantity: 25, unitPrice: 3500, totalValue: 87500, status: 'in-stock' },
    { id: 'PRD-002', name: 'طابعة ليزر HP', category: 'مكتبية', quantity: 12, unitPrice: 850, totalValue: 10200, status: 'low-stock' },
    { id: 'PRD-003', name: 'شاشة سامسونج 27 بوصة', category: 'إلكترونيات', quantity: 8, unitPrice: 1200, totalValue: 9600, status: 'in-stock' },
    { id: 'PRD-004', name: 'كرسي مكتب مريح', category: 'أثاث', quantity: 3, unitPrice: 450, totalValue: 1350, status: 'low-stock' },
    { id: 'PRD-005', name: 'برنامج أوفيس', category: 'برمجيات', quantity: 50, unitPrice: 120, totalValue: 6000, status: 'in-stock' },
  ];

  const getStatusText = (status: string) => {
    const statusTexts = {
      'in-stock': { en: 'In Stock', ar: 'متوفر' },
      'low-stock': { en: 'Low Stock', ar: 'مخزون منخفض' },
      'out-of-stock': { en: 'Out of Stock', ar: 'نفد المخزون' },
    };
    return getText(statusTexts[status as keyof typeof statusTexts], locale);
  };

  const getStatusClass = (status: string) => {
    const statusClasses = {
      'in-stock': 'status-success',
      'low-stock': 'status-warning',
      'out-of-stock': 'status-error',
    };
    return statusClasses[status as keyof typeof statusClasses] || 'status-warning';
  };

  const filteredItems = inventoryItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalValue = inventoryItems.reduce((sum, item) => sum + item.totalValue, 0);
  const totalItems = inventoryItems.reduce((sum, item) => sum + item.quantity, 0);
  const lowStockItems = inventoryItems.filter(item => item.status === 'low-stock').length;

  return (
    <div className="module-page fade-in">
      <div className="page-header">
        <div className="header-content">
          <h1>{getText(businessTexts.inventory, locale)}</h1>
          <p className="page-subtitle">
            {locale === 'ar' 
              ? 'إدارة المخزون والمنتجات' 
              : 'Manage inventory and products'
            }
          </p>
        </div>
        <div className="header-actions">
          <button className="btn btn-primary">
            <i className="fas fa-plus"></i>
            {locale === 'ar' ? 'إضافة منتج' : 'Add Product'}
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-boxes"></i>
          </div>
          <div className="stat-content">
            <h3>{totalItems}</h3>
            <p>{locale === 'ar' ? 'إجمالي المنتجات' : 'Total Items'}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-coins"></i>
          </div>
          <div className="stat-content">
            <h3>{formatSAR(totalValue, { locale })}</h3>
            <p>{locale === 'ar' ? 'قيمة المخزون' : 'Inventory Value'}</p>
          </div>
        </div>
        <div className="stat-card warning">
          <div className="stat-icon">
            <i className="fas fa-exclamation-triangle"></i>
          </div>
          <div className="stat-content">
            <h3>{lowStockItems}</h3>
            <p>{locale === 'ar' ? 'مخزون منخفض' : 'Low Stock Items'}</p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="page-controls">
        <div className="search-box">
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder={locale === 'ar' ? 'البحث في المنتجات...' : 'Search products...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filters">
          <select className="filter-select">
            <option value="">{locale === 'ar' ? 'جميع الفئات' : 'All Categories'}</option>
            <option value="electronics">{locale === 'ar' ? 'إلكترونيات' : 'Electronics'}</option>
            <option value="office">{locale === 'ar' ? 'مكتبية' : 'Office'}</option>
            <option value="furniture">{locale === 'ar' ? 'أثاث' : 'Furniture'}</option>
            <option value="software">{locale === 'ar' ? 'برمجيات' : 'Software'}</option>
          </select>
          <select className="filter-select">
            <option value="">{locale === 'ar' ? 'جميع الحالات' : 'All Status'}</option>
            <option value="in-stock">{locale === 'ar' ? 'متوفر' : 'In Stock'}</option>
            <option value="low-stock">{locale === 'ar' ? 'مخزون منخفض' : 'Low Stock'}</option>
            <option value="out-of-stock">{locale === 'ar' ? 'نفد المخزون' : 'Out of Stock'}</option>
          </select>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="content-card">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>{locale === 'ar' ? 'رمز المنتج' : 'Product ID'}</th>
                <th>{locale === 'ar' ? 'اسم المنتج' : 'Product Name'}</th>
                <th>{locale === 'ar' ? 'الفئة' : 'Category'}</th>
                <th>{locale === 'ar' ? 'الكمية' : 'Quantity'}</th>
                <th>{locale === 'ar' ? 'سعر الوحدة' : 'Unit Price'}</th>
                <th>{locale === 'ar' ? 'القيمة الإجمالية' : 'Total Value'}</th>
                <th>{getText(businessTexts.status, locale)}</th>
                <th>{locale === 'ar' ? 'الإجراءات' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (
                <tr key={item.id}>
                  <td className="product-id">{item.id}</td>
                  <td className="product-name">{item.name}</td>
                  <td>{item.category}</td>
                  <td className="quantity">{item.quantity}</td>
                  <td className="price">{formatSAR(item.unitPrice, { locale })}</td>
                  <td className="total-value">{formatSAR(item.totalValue, { locale })}</td>
                  <td>
                    <span className={`status-badge ${getStatusClass(item.status)}`}>
                      {getStatusText(item.status)}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="action-btn edit" title={locale === 'ar' ? 'تعديل' : 'Edit'}>
                        <i className="fas fa-edit"></i>
                      </button>
                      <button className="action-btn delete" title={locale === 'ar' ? 'حذف' : 'Delete'}>
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Inventory;