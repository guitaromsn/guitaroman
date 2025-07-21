// Currency and Localization Utilities

export interface CurrencyOptions {
  locale?: string;
  showSymbol?: boolean;
  showCode?: boolean;
}

// SAR Currency formatter
export const formatSAR = (
  amount: number, 
  options: CurrencyOptions = {}
): string => {
  const { locale = 'ar-SA', showSymbol = true, showCode = false } = options;
  
  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'SAR',
    currencyDisplay: showSymbol ? 'symbol' : 'code',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  
  let formatted = formatter.format(amount);
  
  // Replace SAR symbol with Arabic ريال سعودي symbol if needed
  if (locale === 'ar-SA' && showSymbol) {
    formatted = formatted.replace('SAR', 'ر.س');
  }
  
  if (showCode) {
    formatted += ' SAR';
  }
  
  return formatted;
};

// Localization support
export interface LocaleText {
  en: string;
  ar: string;
}

export const getText = (text: LocaleText, locale: string = 'en'): string => {
  return text[locale as keyof LocaleText] || text.en;
};

// Common business texts
export const businessTexts = {
  dashboard: { en: 'Dashboard', ar: 'لوحة التحكم' },
  inventory: { en: 'Inventory', ar: 'المخزون' },
  invoices: { en: 'Invoices', ar: 'الفواتير' },
  projects: { en: 'Projects', ar: 'المشاريع' },
  reports: { en: 'Reports', ar: 'التقارير' },
  settings: { en: 'Settings', ar: 'الإعدادات' },
  customers: { en: 'Customers', ar: 'العملاء' },
  suppliers: { en: 'Suppliers', ar: 'الموردين' },
  products: { en: 'Products', ar: 'المنتجات' },
  sales: { en: 'Sales', ar: 'المبيعات' },
  purchases: { en: 'Purchases', ar: 'المشتريات' },
  total: { en: 'Total', ar: 'المجموع' },
  amount: { en: 'Amount', ar: 'المبلغ' },
  date: { en: 'Date', ar: 'التاريخ' },
  description: { en: 'Description', ar: 'الوصف' },
  status: { en: 'Status', ar: 'الحالة' },
  pending: { en: 'Pending', ar: 'معلق' },
  approved: { en: 'Approved', ar: 'موافق عليه' },
  rejected: { en: 'Rejected', ar: 'مرفوض' },
  paid: { en: 'Paid', ar: 'مدفوع' },
  unpaid: { en: 'Unpaid', ar: 'غير مدفوع' },
  search: { en: 'Search', ar: 'بحث' },
  add: { en: 'Add', ar: 'إضافة' },
  edit: { en: 'Edit', ar: 'تعديل' },
  delete: { en: 'Delete', ar: 'حذف' },
  save: { en: 'Save', ar: 'حفظ' },
  cancel: { en: 'Cancel', ar: 'إلغاء' },
  companyName: { en: 'Amanat Al-Kalima Company', ar: 'شركة أمانة الكلمة' },
  vatNumber: { en: 'VAT Number', ar: 'الرقم الضريبي' },
  taxAmount: { en: 'Tax Amount', ar: 'مبلغ الضريبة' },
  subtotal: { en: 'Subtotal', ar: 'المجموع الفرعي' },
  grandTotal: { en: 'Grand Total', ar: 'المجموع الإجمالي' },
};

// ZATCA compliance utilities
export const generateZATCAQR = (
  companyName: string,
  vatNumber: string,
  invoiceDate: string,
  totalAmount: number,
  taxAmount: number
): string => {
  // This is a simplified QR code data structure for ZATCA compliance
  // In a real implementation, you would use proper ZATCA libraries
  const qrData = {
    companyName,
    vatNumber,
    invoiceDate,
    totalAmount: formatSAR(totalAmount),
    taxAmount: formatSAR(taxAmount),
  };
  
  return btoa(JSON.stringify(qrData));
};

// Date formatting for Saudi locale
export const formatSaudiDate = (date: Date, locale: string = 'ar-SA'): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    calendar: 'gregory', // Use Gregorian calendar for business
  };
  
  return new Intl.DateTimeFormat(locale, options).format(date);
};

// Business validation utilities
export const validateVATNumber = (vatNumber: string): boolean => {
  // Saudi VAT number validation (simplified)
  // Format: 3xxxxxxxxx15 (15 digits, starts with 3, ends with 15)
  const saudiVATPattern = /^3\d{13}15$/;
  return saudiVATPattern.test(vatNumber);
};

export const calculateVAT = (amount: number, rate: number = 0.15): number => {
  // Saudi VAT rate is 15%
  return amount * rate;
};

export const calculateTotalWithVAT = (subtotal: number, vatRate: number = 0.15): { subtotal: number; vat: number; total: number } => {
  const vat = calculateVAT(subtotal, vatRate);
  const total = subtotal + vat;
  
  return {
    subtotal,
    vat,
    total,
  };
};