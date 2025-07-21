import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';

/**
 * Payment Voucher Generator for Saudi Arabia business operations
 */
class PaymentVoucherGenerator {
  constructor() {
    this.voucherType = 'payment';
  }

  /**
   * Generate payment voucher data
   * @param {Object} data - Voucher input data
   * @returns {Object} - Formatted payment voucher
   */
  generatePaymentVoucher(data) {
    const {
      voucherNumber,
      date = new Date(),
      supplier = {},
      amount = 0,
      paymentMethod = 'bank_transfer',
      invoiceReference = null,
      description = '',
      authorizedBy = '',
      notes = '',
      bankDetails = {}
    } = data;

    const voucher = {
      id: uuidv4(),
      voucherNumber: voucherNumber || this.generateVoucherNumber(),
      voucherType: 'payment',
      date: format(new Date(date), 'yyyy-MM-dd'),
      issueTime: format(new Date(), 'HH:mm:ss'),
      
      // Supplier/Payee details
      payee: {
        id: supplier.id || '',
        name: supplier.name || '',
        arabicName: supplier.arabicName || '',
        address: supplier.address || '',
        phone: supplier.phone || '',
        vatNumber: supplier.vatNumber || '',
        bankAccount: supplier.bankAccount || ''
      },

      // Payment details
      payment: {
        amount: parseFloat(amount),
        currency: 'SAR',
        method: paymentMethod,
        description: description,
        bankDetails: paymentMethod === 'bank_transfer' ? {
          bankName: bankDetails.bankName || '',
          accountNumber: bankDetails.accountNumber || '',
          iban: bankDetails.iban || '',
          swiftCode: bankDetails.swiftCode || '',
          referenceNumber: bankDetails.referenceNumber || ''
        } : null,
        chequeDetails: paymentMethod === 'cheque' ? {
          chequeNumber: bankDetails.chequeNumber || '',
          bankName: bankDetails.bankName || '',
          chequeDate: bankDetails.chequeDate || format(new Date(), 'yyyy-MM-dd')
        } : null
      },

      // References
      references: {
        invoice: invoiceReference ? {
          invoiceNumber: invoiceReference.invoiceNumber,
          invoiceDate: invoiceReference.invoiceDate,
          invoiceAmount: invoiceReference.amount
        } : null,
        purchaseOrder: data.purchaseOrderReference || null
      },

      // Authorization
      authorization: {
        authorizedBy: authorizedBy,
        authorizationDate: new Date().toISOString(),
        approvalRequired: amount > 10000 // Amounts over 10,000 SAR need approval
      },

      // Additional information
      notes: notes,

      // Audit fields
      createdAt: new Date().toISOString(),
      status: 'pending' // pending, approved, paid, cancelled
    };

    return voucher;
  }

  /**
   * Generate payment voucher number
   * @param {string} prefix - Voucher number prefix
   * @returns {string} - Generated voucher number
   */
  generateVoucherNumber(prefix = 'PV') {
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    const timestamp = Date.now().toString().slice(-6);
    
    return `${prefix}-${year}${month}-${timestamp}`;
  }

  /**
   * Format payment voucher for printing
   * @param {Object} voucher - Payment voucher data
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
        title: 'Payment Voucher',
        titleArabic: 'سند صرف',
        number: voucher.voucherNumber,
        date: voucher.date,
        time: voucher.issueTime,
        status: voucher.status
      },
      payee: voucher.payee,
      payment: voucher.payment,
      references: voucher.references,
      authorization: voucher.authorization,
      footer: {
        notes: voucher.notes,
        signatures: {
          preparedBy: 'Prepared By',
          authorizedBy: 'Authorized By',
          payee: 'Received By (Payee)'
        }
      }
    };
  }

  /**
   * Validate payment voucher data
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

    if (!data.supplier || !data.supplier.name) {
      errors.push('Payee/Supplier information is required');
    }

    if (!data.paymentMethod) {
      errors.push('Payment method is required');
    }

    if (!data.description) {
      warnings.push('Payment description not provided');
    }

    if (!data.authorizedBy && data.amount > 1000) {
      errors.push('Authorization required for payments over 1,000 SAR');
    }

    // Payment method specific validation
    if (data.paymentMethod === 'bank_transfer') {
      if (!data.bankDetails || !data.bankDetails.accountNumber) {
        errors.push('Bank account details required for bank transfer');
      }
    }

    if (data.paymentMethod === 'cheque') {
      if (!data.bankDetails || !data.bankDetails.chequeNumber) {
        errors.push('Cheque number required for cheque payments');
      }
    }

    // Business logic validation
    if (data.amount && data.amount > 100000) {
      warnings.push('Large payment amount - ensure proper authorization and documentation');
    }

    if (data.paymentMethod === 'cash' && data.amount > 3000) {
      warnings.push('Cash payments over 3,000 SAR should be avoided for audit compliance');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Calculate total payments for a supplier
   * @param {Array} payments - Array of payment vouchers
   * @param {string} supplierId - Supplier ID
   * @returns {number} - Total amount paid
   */
  calculateTotalPayments(payments, supplierId) {
    return payments
      .filter(payment => 
        payment.payee.id === supplierId && 
        (payment.status === 'paid' || payment.status === 'approved')
      )
      .reduce((total, payment) => total + payment.payment.amount, 0);
  }

  /**
   * Get payment status display name
   * @param {string} status - Payment status code
   * @param {string} language - Language code (en, ar)
   * @returns {string} - Display name
   */
  getPaymentStatusName(status, language = 'en') {
    const statuses = {
      en: {
        pending: 'Pending',
        approved: 'Approved',
        paid: 'Paid',
        cancelled: 'Cancelled',
        rejected: 'Rejected'
      },
      ar: {
        pending: 'قيد الانتظار',
        approved: 'معتمد',
        paid: 'مدفوع',
        cancelled: 'ملغي',
        rejected: 'مرفوض'
      }
    };

    return statuses[language]?.[status] || status;
  }

  /**
   * Process payment approval
   * @param {Object} voucher - Payment voucher
   * @param {string} approvedBy - Approver name/ID
   * @returns {Object} - Updated voucher
   */
  approvePayment(voucher, approvedBy) {
    if (voucher.status !== 'pending') {
      throw new Error('Only pending payments can be approved');
    }

    return {
      ...voucher,
      status: 'approved',
      authorization: {
        ...voucher.authorization,
        approvedBy,
        approvalDate: new Date().toISOString()
      }
    };
  }

  /**
   * Mark payment as completed
   * @param {Object} voucher - Payment voucher
   * @param {Object} paymentDetails - Completion details
   * @returns {Object} - Updated voucher
   */
  completePayment(voucher, paymentDetails = {}) {
    if (voucher.status !== 'approved') {
      throw new Error('Only approved payments can be marked as paid');
    }

    return {
      ...voucher,
      status: 'paid',
      payment: {
        ...voucher.payment,
        paidDate: new Date().toISOString(),
        transactionReference: paymentDetails.transactionReference || '',
        actualAmount: paymentDetails.actualAmount || voucher.payment.amount
      }
    };
  }

  /**
   * Generate payment summary for reporting
   * @param {Array} payments - Array of payment vouchers
   * @param {Object} filters - Filtering options
   * @returns {Object} - Summary data
   */
  generatePaymentSummary(payments, filters = {}) {
    const {
      startDate,
      endDate,
      supplierId,
      paymentMethod,
      status
    } = filters;

    let filteredPayments = [...payments];

    // Apply filters
    if (startDate) {
      filteredPayments = filteredPayments.filter(payment => 
        new Date(payment.date) >= new Date(startDate)
      );
    }

    if (endDate) {
      filteredPayments = filteredPayments.filter(payment => 
        new Date(payment.date) <= new Date(endDate)
      );
    }

    if (supplierId) {
      filteredPayments = filteredPayments.filter(payment => 
        payment.payee.id === supplierId
      );
    }

    if (paymentMethod) {
      filteredPayments = filteredPayments.filter(payment => 
        payment.payment.method === paymentMethod
      );
    }

    if (status) {
      filteredPayments = filteredPayments.filter(payment => 
        payment.status === status
      );
    }

    // Calculate summary
    const totalAmount = filteredPayments.reduce(
      (sum, payment) => sum + payment.payment.amount, 
      0
    );

    const statusBreakdown = {};
    filteredPayments.forEach(payment => {
      const status = payment.status;
      statusBreakdown[status] = (statusBreakdown[status] || 0) + payment.payment.amount;
    });

    const methodBreakdown = {};
    filteredPayments.forEach(payment => {
      const method = payment.payment.method;
      methodBreakdown[method] = (methodBreakdown[method] || 0) + payment.payment.amount;
    });

    const supplierBreakdown = {};
    filteredPayments.forEach(payment => {
      const supplierId = payment.payee.id || 'unknown';
      const supplierName = payment.payee.name || 'Unknown Supplier';
      
      if (!supplierBreakdown[supplierId]) {
        supplierBreakdown[supplierId] = {
          name: supplierName,
          amount: 0,
          count: 0
        };
      }
      
      supplierBreakdown[supplierId].amount += payment.payment.amount;
      supplierBreakdown[supplierId].count += 1;
    });

    return {
      totalPayments: filteredPayments.length,
      totalAmount,
      averageAmount: filteredPayments.length > 0 ? totalAmount / filteredPayments.length : 0,
      statusBreakdown,
      methodBreakdown,
      supplierBreakdown,
      pendingApprovals: filteredPayments.filter(p => p.status === 'pending').length,
      period: {
        startDate: startDate || (filteredPayments.length > 0 ? filteredPayments[filteredPayments.length - 1].date : null),
        endDate: endDate || (filteredPayments.length > 0 ? filteredPayments[0].date : null)
      }
    };
  }

  /**
   * Export payment vouchers to CSV format
   * @param {Array} payments - Payment vouchers
   * @returns {string} - CSV string
   */
  exportToCSV(payments) {
    const headers = [
      'Voucher Number',
      'Date',
      'Payee Name',
      'Amount',
      'Payment Method',
      'Description',
      'Status',
      'Authorized By'
    ];

    const rows = payments.map(payment => [
      payment.voucherNumber,
      payment.date,
      payment.payee.name,
      payment.payment.amount,
      payment.payment.method,
      payment.payment.description,
      payment.status,
      payment.authorization.authorizedBy || ''
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    return csvContent;
  }
}

export default PaymentVoucherGenerator;
