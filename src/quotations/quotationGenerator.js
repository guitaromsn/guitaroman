import { v4 as uuidv4 } from 'uuid';
import { format, addDays } from 'date-fns';
import ZATCAFormatUtils from '../zatca/formatUtils';

/**
 * Quotation Generator for Saudi Arabia scrap metal business
 */
class QuotationGenerator {
  constructor() {
    this.formatUtils = new ZATCAFormatUtils();
  }

  /**
   * Generate quotation data
   * @param {Object} data - Quotation input data
   * @returns {Object} - Formatted quotation
   */
  generateQuotation(data) {
    const {
      quotationNumber,
      quotationDate = new Date(),
      validUntil = addDays(new Date(), 30), // Default 30 days validity
      customer = {},
      items = [],
      terms = '',
      notes = '',
      validityPeriod = 30,
      currency = 'SAR',
      vatRate = 15
    } = data;

    // Calculate totals
    const calculations = this.calculateTotals(items, vatRate);

    const quotation = {
      id: uuidv4(),
      quotationNumber: quotationNumber || this.generateQuotationNumber(),
      quotationDate: format(new Date(quotationDate), 'yyyy-MM-dd'),
      validUntil: format(new Date(validUntil), 'yyyy-MM-dd'),
      validityPeriod: validityPeriod,
      issueTime: format(new Date(), 'HH:mm:ss'),
      
      // Customer details
      customer: {
        id: customer.id || '',
        name: customer.name || '',
        arabicName: customer.arabicName || '',
        address: customer.address || '',
        phone: customer.phone || '',
        email: customer.email || '',
        vatNumber: customer.vatNumber || '',
        contactPerson: customer.contactPerson || ''
      },

      // Items
      items: items.map((item, index) => ({
        lineNumber: index + 1,
        id: item.id || uuidv4(),
        description: item.description || '',
        arabicDescription: item.arabicDescription || '',
        category: item.category || '',
        quantity: parseFloat(item.quantity || 0),
        unit: item.unit || 'kg',
        unitPrice: parseFloat(item.unitPrice || 0),
        vatRate: parseFloat(item.vatRate || vatRate),
        discount: parseFloat(item.discount || 0),
        discountType: item.discountType || 'percentage', // percentage or amount
        lineTotal: this.calculateLineTotal(item, vatRate),
        notes: item.notes || ''
      })),

      // Calculations
      calculations: {
        subtotal: calculations.subtotal,
        totalDiscount: calculations.totalDiscount,
        taxableAmount: calculations.taxableAmount,
        vatAmount: calculations.vatAmount,
        totalAmount: calculations.totalAmount,
        currency: currency
      },

      // Terms and conditions
      terms: {
        paymentTerms: terms.paymentTerms || 'Payment due within 30 days of acceptance',
        deliveryTerms: terms.deliveryTerms || 'FOB Riyadh',
        validityPeriod: validityPeriod,
        priceValidity: terms.priceValidity || 'Prices subject to change without notice',
        customTerms: terms.custom || ''
      },

      // Additional information
      notes: notes,
      specialInstructions: data.specialInstructions || '',

      // Status tracking
      status: 'draft', // draft, sent, accepted, rejected, expired, converted
      
      // Audit fields
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: data.createdBy || '',

      // Conversion tracking
      conversion: {
        convertedToInvoice: false,
        invoiceId: null,
        conversionDate: null
      }
    };

    return quotation;
  }

  /**
   * Generate quotation number
   * @param {string} prefix - Quotation number prefix
   * @returns {string} - Generated quotation number
   */
  generateQuotationNumber(prefix = 'QUO') {
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    const timestamp = Date.now().toString().slice(-6);
    
    return `${prefix}-${year}${month}-${timestamp}`;
  }

  /**
   * Calculate line total for an item
   * @param {Object} item - Quotation item
   * @param {number} defaultVatRate - Default VAT rate
   * @returns {number} - Line total
   */
  calculateLineTotal(item, defaultVatRate = 15) {
    const quantity = parseFloat(item.quantity || 0);
    const unitPrice = parseFloat(item.unitPrice || 0);
    const discount = parseFloat(item.discount || 0);
    const discountType = item.discountType || 'percentage';
    const vatRate = parseFloat(item.vatRate || defaultVatRate);

    let lineSubtotal = quantity * unitPrice;

    // Apply discount
    if (discount > 0) {
      if (discountType === 'percentage') {
        lineSubtotal = lineSubtotal * (1 - discount / 100);
      } else {
        lineSubtotal = lineSubtotal - discount;
      }
    }

    // Add VAT
    const vatAmount = lineSubtotal * (vatRate / 100);
    return lineSubtotal + vatAmount;
  }

  /**
   * Calculate totals for all items
   * @param {Array} items - Quotation items
   * @param {number} defaultVatRate - Default VAT rate
   * @returns {Object} - Calculated totals
   */
  calculateTotals(items, defaultVatRate = 15) {
    let subtotal = 0;
    let totalDiscount = 0;
    let vatAmount = 0;

    items.forEach(item => {
      const quantity = parseFloat(item.quantity || 0);
      const unitPrice = parseFloat(item.unitPrice || 0);
      const discount = parseFloat(item.discount || 0);
      const discountType = item.discountType || 'percentage';
      const vatRate = parseFloat(item.vatRate || defaultVatRate);

      const lineSubtotal = quantity * unitPrice;
      subtotal += lineSubtotal;

      // Calculate discount
      let lineDiscount = 0;
      if (discount > 0) {
        if (discountType === 'percentage') {
          lineDiscount = lineSubtotal * (discount / 100);
        } else {
          lineDiscount = discount;
        }
      }
      totalDiscount += lineDiscount;

      // Calculate VAT on discounted amount
      const taxableAmount = lineSubtotal - lineDiscount;
      vatAmount += taxableAmount * (vatRate / 100);
    });

    const taxableAmount = subtotal - totalDiscount;
    const totalAmount = taxableAmount + vatAmount;

    return {
      subtotal: Number(subtotal.toFixed(2)),
      totalDiscount: Number(totalDiscount.toFixed(2)),
      taxableAmount: Number(taxableAmount.toFixed(2)),
      vatAmount: Number(vatAmount.toFixed(2)),
      totalAmount: Number(totalAmount.toFixed(2))
    };
  }

  /**
   * Format quotation for printing/PDF
   * @param {Object} quotation - Quotation data
   * @param {Object} company - Company information
   * @returns {Object} - Formatted print data
   */
  formatForPrint(quotation, company = {}) {
    return {
      header: {
        companyName: company.name || '',
        companyNameArabic: company.arabicName || '',
        address: company.address || '',
        phone: company.phone || '',
        email: company.email || '',
        vatNumber: company.vatNumber || '',
        logo: company.logo || ''
      },
      quotation: {
        title: 'Quotation',
        titleArabic: 'عرض سعر',
        number: quotation.quotationNumber,
        date: this.formatUtils.formatDate(quotation.quotationDate),
        validUntil: this.formatUtils.formatDate(quotation.validUntil),
        status: quotation.status
      },
      customer: quotation.customer,
      items: quotation.items.map(item => ({
        ...item,
        unitPriceFormatted: this.formatUtils.formatCurrency(item.unitPrice),
        lineTotalFormatted: this.formatUtils.formatCurrency(item.lineTotal),
        quantityFormatted: this.formatUtils.formatNumber(item.quantity)
      })),
      calculations: {
        ...quotation.calculations,
        subtotalFormatted: this.formatUtils.formatCurrency(quotation.calculations.subtotal),
        totalDiscountFormatted: this.formatUtils.formatCurrency(quotation.calculations.totalDiscount),
        taxableAmountFormatted: this.formatUtils.formatCurrency(quotation.calculations.taxableAmount),
        vatAmountFormatted: this.formatUtils.formatCurrency(quotation.calculations.vatAmount),
        totalAmountFormatted: this.formatUtils.formatCurrency(quotation.calculations.totalAmount)
      },
      terms: quotation.terms,
      footer: {
        notes: quotation.notes,
        specialInstructions: quotation.specialInstructions,
        validity: `This quotation is valid until ${this.formatUtils.formatDate(quotation.validUntil)}`,
        signature: {
          title: 'Authorized Signature',
          name: company.authorizedSignatory || '',
          designation: company.designation || 'Sales Manager'
        }
      }
    };
  }

  /**
   * Update quotation status
   * @param {Object} quotation - Quotation to update
   * @param {string} newStatus - New status
   * @param {Object} updateData - Additional update data
   * @returns {Object} - Updated quotation
   */
  updateStatus(quotation, newStatus, updateData = {}) {
    const allowedTransitions = {
      draft: ['sent', 'cancelled'],
      sent: ['accepted', 'rejected', 'expired'],
      accepted: ['converted'],
      rejected: [],
      expired: ['sent'],
      converted: [],
      cancelled: ['draft']
    };

    const currentStatus = quotation.status;
    
    if (!allowedTransitions[currentStatus] || !allowedTransitions[currentStatus].includes(newStatus)) {
      throw new Error(`Invalid status transition from ${currentStatus} to ${newStatus}`);
    }

    return {
      ...quotation,
      status: newStatus,
      updatedAt: new Date().toISOString(),
      statusHistory: [
        ...(quotation.statusHistory || []),
        {
          status: newStatus,
          changedAt: new Date().toISOString(),
          changedBy: updateData.changedBy || '',
          notes: updateData.notes || ''
        }
      ],
      ...updateData
    };
  }

  /**
   * Convert quotation to invoice
   * @param {Object} quotation - Quotation to convert
   * @param {Object} conversionOptions - Conversion options
   * @returns {Object} - Invoice data structure
   */
  convertToInvoice(quotation, conversionOptions = {}) {
    if (quotation.status !== 'accepted') {
      throw new Error('Only accepted quotations can be converted to invoices');
    }

    if (new Date() > new Date(quotation.validUntil)) {
      throw new Error('Cannot convert expired quotation to invoice');
    }

    // Generate invoice data from quotation
    const invoiceData = {
      quotationReference: {
        quotationId: quotation.id,
        quotationNumber: quotation.quotationNumber,
        quotationDate: quotation.quotationDate
      },
      customer: quotation.customer,
      items: quotation.items.map(item => ({
        description: item.description,
        arabicDescription: item.arabicDescription,
        quantity: item.quantity,
        unit: item.unit,
        unitPrice: item.unitPrice,
        vatRate: item.vatRate,
        discount: item.discount,
        discountType: item.discountType
      })),
      subtotal: quotation.calculations.subtotal,
      vatAmount: quotation.calculations.vatAmount,
      totalAmount: quotation.calculations.totalAmount,
      notes: quotation.notes,
      invoiceDate: conversionOptions.invoiceDate || new Date().toISOString().split('T')[0],
      dueDate: conversionOptions.dueDate,
      paymentTerms: quotation.terms.paymentTerms
    };

    // Update quotation with conversion info
    const updatedQuotation = {
      ...quotation,
      status: 'converted',
      conversion: {
        convertedToInvoice: true,
        invoiceId: conversionOptions.invoiceId || uuidv4(),
        conversionDate: new Date().toISOString()
      },
      updatedAt: new Date().toISOString()
    };

    return {
      invoiceData,
      updatedQuotation
    };
  }

  /**
   * Check if quotation is expired
   * @param {Object} quotation - Quotation to check
   * @returns {boolean} - True if expired
   */
  isExpired(quotation) {
    return new Date() > new Date(quotation.validUntil);
  }

  /**
   * Get days until expiration
   * @param {Object} quotation - Quotation to check
   * @returns {number} - Days until expiration (negative if expired)
   */
  getDaysUntilExpiration(quotation) {
    const today = new Date();
    const validUntil = new Date(quotation.validUntil);
    const diffTime = validUntil - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  /**
   * Validate quotation data
   * @param {Object} data - Quotation data to validate
   * @returns {Object} - Validation result
   */
  validateQuotationData(data) {
    const errors = [];
    const warnings = [];

    // Required fields
    if (!data.customer || !data.customer.name) {
      errors.push('Customer information is required');
    }

    if (!data.items || data.items.length === 0) {
      errors.push('At least one item is required');
    }

    if (data.items && data.items.length > 0) {
      data.items.forEach((item, index) => {
        if (!item.description) {
          errors.push(`Item ${index + 1}: Description is required`);
        }
        if (!item.quantity || item.quantity <= 0) {
          errors.push(`Item ${index + 1}: Valid quantity is required`);
        }
        if (!item.unitPrice || item.unitPrice <= 0) {
          errors.push(`Item ${index + 1}: Valid unit price is required`);
        }
      });
    }

    // Business logic validation
    if (data.validUntil && new Date(data.validUntil) <= new Date()) {
      warnings.push('Quotation validity date should be in the future');
    }

    if (data.validityPeriod && data.validityPeriod < 7) {
      warnings.push('Very short validity period - consider extending');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Generate quotation summary report
   * @param {Array} quotations - Array of quotations
   * @param {Object} filters - Filtering options
   * @returns {Object} - Summary data
   */
  generateQuotationSummary(quotations, filters = {}) {
    const {
      startDate,
      endDate,
      customerId,
      status
    } = filters;

    let filteredQuotations = [...quotations];

    // Apply filters
    if (startDate) {
      filteredQuotations = filteredQuotations.filter(quotation => 
        new Date(quotation.quotationDate) >= new Date(startDate)
      );
    }

    if (endDate) {
      filteredQuotations = filteredQuotations.filter(quotation => 
        new Date(quotation.quotationDate) <= new Date(endDate)
      );
    }

    if (customerId) {
      filteredQuotations = filteredQuotations.filter(quotation => 
        quotation.customer.id === customerId
      );
    }

    if (status) {
      filteredQuotations = filteredQuotations.filter(quotation => 
        quotation.status === status
      );
    }

    // Calculate summary
    const totalValue = filteredQuotations.reduce(
      (sum, quotation) => sum + quotation.calculations.totalAmount, 
      0
    );

    const statusBreakdown = {};
    filteredQuotations.forEach(quotation => {
      const status = quotation.status;
      statusBreakdown[status] = (statusBreakdown[status] || 0) + quotation.calculations.totalAmount;
    });

    const conversionRate = filteredQuotations.length > 0 
      ? (filteredQuotations.filter(q => q.status === 'converted').length / filteredQuotations.length) * 100 
      : 0;

    return {
      totalQuotations: filteredQuotations.length,
      totalValue,
      averageValue: filteredQuotations.length > 0 ? totalValue / filteredQuotations.length : 0,
      statusBreakdown,
      conversionRate,
      expiringSoon: filteredQuotations.filter(q => this.getDaysUntilExpiration(q) <= 7 && q.status === 'sent').length,
      period: {
        startDate: startDate || (filteredQuotations.length > 0 ? filteredQuotations[filteredQuotations.length - 1].quotationDate : null),
        endDate: endDate || (filteredQuotations.length > 0 ? filteredQuotations[0].quotationDate : null)
      }
    };
  }
}

export default QuotationGenerator;
