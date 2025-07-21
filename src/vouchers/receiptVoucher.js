import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';

/**
 * Receipt Voucher Generator for Saudi Arabia business operations
 */
class ReceiptVoucherGenerator {
  constructor() {
    this.voucherType = 'receipt';
  }

  /**
   * Generate receipt voucher data
   * @param {Object} data - Voucher input data
   * @returns {Object} - Formatted receipt voucher
   */
  generateReceiptVoucher(data) {
    const {
      voucherNumber,
      date = new Date(),
      customer = {},
      amount = 0,
      paymentMethod = 'cash',
      invoiceReference = null,
      description = '',
      receivedBy = '',
      notes = ''
    } = data;

    const voucher = {
      id: uuidv4(),
      voucherNumber: voucherNumber || this.generateVoucherNumber(),
      voucherType: 'receipt',
      date: format(new Date(date), 'yyyy-MM-dd'),
      issueTime: format(new Date(), 'HH:mm:ss'),
      
      // Customer details
      customer: {
        id: customer.id || '',
        name: customer.name || '',
        arabicName: customer.arabicName || '',
        address: customer.address || '',
        phone: customer.phone || '',
        vatNumber: customer.vatNumber || ''
      },

      // Payment details
      payment: {
        amount: parseFloat(amount),
        currency: 'SAR',
        method: paymentMethod,
        description: description
      },

      // References
      references: {
        invoice: invoiceReference ? {
          invoiceNumber: invoiceReference.invoiceNumber,
          invoiceDate: invoiceReference.invoiceDate,
          invoiceAmount: invoiceReference.amount
        } : null
      },

      // Additional information
      receivedBy: receivedBy,
      notes: notes,

      // Audit fields
      createdAt: new Date().toISOString(),
      status: 'active'
    };

    return voucher;
  }

  /**
   * Generate receipt voucher number
   * @param {string} prefix - Voucher number prefix
   * @returns {string} - Generated voucher number
   */
  generateVoucherNumber(prefix = 'RV') {
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    const timestamp = Date.now().toString().slice(-6);
    
    return `${prefix}-${year}${month}-${timestamp}`;
  }

  /**
   * Format receipt voucher for printing
   * @param {Object} voucher - Receipt voucher data
   * @param {Object} company - Company information
   * @returns {Object} - Formatted print data
   */
  formatForPrint(voucher, company = {}) {
    return {
      header: {
        companyName: company.name || '',
        companyNameArabic: company.arabicName || '',
        address: company.address || '',
        phone: company.phone || '',
        vatNumber: company.vatNumber || '',
        logo: company.logo || ''
      },
      voucher: {
        title: 'Receipt Voucher',
        titleArabic: 'سند قبض',
        number: voucher.voucherNumber,
        date: voucher.date,
        time: voucher.issueTime
      },
      customer: voucher.customer,
      payment: voucher.payment,
      references: voucher.references,
      footer: {
        receivedBy: voucher.receivedBy,
        notes: voucher.notes,
        signature: {
          customer: 'Customer Signature',
          company: 'Authorized Signature'
        }
      }
    };
  }

  /**
   * Validate receipt voucher data
   * @param {Object} data - Voucher data to validate
   * @returns {Object} - Validation result
   */
  validateVoucherData(data) {
    const errors = [];
    const warnings = [];

    // Required fields validation
    if (!data.amount || data.amount <= 0) {
      errors.push('Amount is required and must be greater than zero');
    }

    if (!data.customer || !data.customer.name) {
      errors.push('Customer information is required');
    }

    if (!data.paymentMethod) {
      errors.push('Payment method is required');
    }

    if (!data.date) {
      warnings.push('Date not specified, using current date');
    }

    // Business logic validation
    if (data.amount && data.amount > 100000) {
      warnings.push('Large amount - ensure proper authorization');
    }

    if (data.paymentMethod === 'cash' && data.amount > 50000) {
      warnings.push('Large cash payment - consider bank transfer for audit trail');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Calculate total received amount for a customer
   * @param {Array} receipts - Array of receipt vouchers
   * @param {string} customerId - Customer ID
   * @returns {number} - Total amount received
   */
  calculateTotalReceived(receipts, customerId) {
    return receipts
      .filter(receipt => 
        receipt.customer.id === customerId && 
        receipt.status === 'active'
      )
      .reduce((total, receipt) => total + receipt.payment.amount, 0);
  }

  /**
   * Get payment method display name
   * @param {string} method - Payment method code
   * @param {string} language - Language code (en, ar)
   * @returns {string} - Display name
   */
  getPaymentMethodName(method, language = 'en') {
    const methods = {
      en: {
        cash: 'Cash',
        bank_transfer: 'Bank Transfer',
        cheque: 'Cheque',
        card: 'Credit/Debit Card',
        other: 'Other'
      },
      ar: {
        cash: 'نقد',
        bank_transfer: 'حوالة بنكية',
        cheque: 'شيك',
        card: 'بطاقة ائتمانية',
        other: 'أخرى'
      }
    };

    return methods[language]?.[method] || method;
  }

  /**
   * Generate receipt summary for reporting
   * @param {Array} receipts - Array of receipt vouchers
   * @param {Object} filters - Filtering options
   * @returns {Object} - Summary data
   */
  generateReceiptSummary(receipts, filters = {}) {
    const {
      startDate,
      endDate,
      customerId,
      paymentMethod
    } = filters;

    let filteredReceipts = receipts.filter(receipt => receipt.status === 'active');

    // Apply filters
    if (startDate) {
      filteredReceipts = filteredReceipts.filter(receipt => 
        new Date(receipt.date) >= new Date(startDate)
      );
    }

    if (endDate) {
      filteredReceipts = filteredReceipts.filter(receipt => 
        new Date(receipt.date) <= new Date(endDate)
      );
    }

    if (customerId) {
      filteredReceipts = filteredReceipts.filter(receipt => 
        receipt.customer.id === customerId
      );
    }

    if (paymentMethod) {
      filteredReceipts = filteredReceipts.filter(receipt => 
        receipt.payment.method === paymentMethod
      );
    }

    // Calculate summary
    const totalAmount = filteredReceipts.reduce(
      (sum, receipt) => sum + receipt.payment.amount, 
      0
    );

    const paymentMethodBreakdown = {};
    filteredReceipts.forEach(receipt => {
      const method = receipt.payment.method;
      paymentMethodBreakdown[method] = (paymentMethodBreakdown[method] || 0) + receipt.payment.amount;
    });

    const customerBreakdown = {};
    filteredReceipts.forEach(receipt => {
      const customerId = receipt.customer.id || 'unknown';
      const customerName = receipt.customer.name || 'Unknown Customer';
      
      if (!customerBreakdown[customerId]) {
        customerBreakdown[customerId] = {
          name: customerName,
          amount: 0,
          count: 0
        };
      }
      
      customerBreakdown[customerId].amount += receipt.payment.amount;
      customerBreakdown[customerId].count += 1;
    });

    return {
      totalReceipts: filteredReceipts.length,
      totalAmount,
      averageAmount: filteredReceipts.length > 0 ? totalAmount / filteredReceipts.length : 0,
      paymentMethodBreakdown,
      customerBreakdown,
      period: {
        startDate: startDate || (filteredReceipts.length > 0 ? filteredReceipts[filteredReceipts.length - 1].date : null),
        endDate: endDate || (filteredReceipts.length > 0 ? filteredReceipts[0].date : null)
      }
    };
  }

  /**
   * Export receipt vouchers to various formats
   * @param {Array} receipts - Receipt vouchers to export
   * @param {string} format - Export format (json, csv, xlsx)
   * @returns {string|Object} - Exported data
   */
  exportReceipts(receipts, format = 'json') {
    switch (format.toLowerCase()) {
      case 'csv':
        return this.exportToCSV(receipts);
      case 'json':
        return JSON.stringify(receipts, null, 2);
      default:
        return receipts;
    }
  }

  /**
   * Export receipts to CSV format
   * @param {Array} receipts - Receipt vouchers
   * @returns {string} - CSV string
   */
  exportToCSV(receipts) {
    const headers = [
      'Voucher Number',
      'Date',
      'Customer Name',
      'Amount',
      'Payment Method',
      'Description',
      'Status'
    ];

    const rows = receipts.map(receipt => [
      receipt.voucherNumber,
      receipt.date,
      receipt.customer.name,
      receipt.payment.amount,
      receipt.payment.method,
      receipt.payment.description,
      receipt.status
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    return csvContent;
  }
}

export default ReceiptVoucherGenerator;
