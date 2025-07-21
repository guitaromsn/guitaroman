import { format, parseISO, isValid } from 'date-fns';
import { ar } from 'date-fns/locale';

/**
 * ZATCA Format Utilities for Saudi Arabia compliance
 * Handles formatting for dates, numbers, currencies, and text
 */
class ZATCAFormatUtils {
  constructor() {
    this.saudiLocale = ar;
    this.defaultCurrency = 'SAR';
    this.vatRate = 15; // Standard VAT rate in Saudi Arabia
  }

  /**
   * Format currency amount according to Saudi standards
   * @param {number} amount - Amount to format
   * @param {string} currency - Currency code (default: SAR)
   * @param {string} locale - Locale code (default: en)
   * @returns {string} - Formatted currency string
   */
  formatCurrency(amount, currency = this.defaultCurrency, locale = 'en') {
    if (typeof amount !== 'number' || isNaN(amount)) {
      return '0.00 ' + currency;
    }

    const options = {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    };

    try {
      if (locale === 'ar') {
        // For Arabic, format manually to ensure proper display
        const formattedNumber = new Intl.NumberFormat('ar-SA', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }).format(amount);
        return `${formattedNumber} ر.س`;
      } else if (locale === 'bn') {
        // For Bengali
        const formattedNumber = new Intl.NumberFormat('bn-BD', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }).format(amount);
        return `${formattedNumber} SAR`;
      } else {
        // English and default
        return new Intl.NumberFormat('en-SA', options).format(amount);
      }
    } catch (error) {
      console.error('Error formatting currency:', error);
      return `${amount.toFixed(2)} ${currency}`;
    }
  }

  /**
   * Format number without currency symbol
   * @param {number} number - Number to format
   * @param {number} decimals - Number of decimal places (default: 2)
   * @param {string} locale - Locale code (default: en)
   * @returns {string} - Formatted number string
   */
  formatNumber(number, decimals = 2, locale = 'en') {
    if (typeof number !== 'number' || isNaN(number)) {
      return '0.' + '0'.repeat(decimals);
    }

    const options = {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    };

    try {
      switch (locale) {
        case 'ar':
          return new Intl.NumberFormat('ar-SA', options).format(number);
        case 'bn':
          return new Intl.NumberFormat('bn-BD', options).format(number);
        default:
          return new Intl.NumberFormat('en-US', options).format(number);
      }
    } catch (error) {
      console.error('Error formatting number:', error);
      return number.toFixed(decimals);
    }
  }

  /**
   * Format date according to Saudi standards
   * @param {string|Date} date - Date to format
   * @param {string} formatString - Date format (default: dd/MM/yyyy)
   * @param {string} locale - Locale code (default: en)
   * @returns {string} - Formatted date string
   */
  formatDate(date, formatString = 'dd/MM/yyyy', locale = 'en') {
    if (!date) return '';

    try {
      let dateObj;
      if (typeof date === 'string') {
        dateObj = parseISO(date);
      } else {
        dateObj = new Date(date);
      }

      if (!isValid(dateObj)) {
        return '';
      }

      const localeOptions = {
        ar: this.saudiLocale,
        en: undefined,
        bn: undefined // Will use default
      };

      return format(dateObj, formatString, { 
        locale: localeOptions[locale] 
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  }

  /**
   * Format date for ZATCA XML (ISO 8601 format)
   * @param {string|Date} date - Date to format
   * @returns {string} - ISO formatted date string (YYYY-MM-DD)
   */
  formatDateISO(date) {
    if (!date) return format(new Date(), 'yyyy-MM-dd');

    try {
      let dateObj;
      if (typeof date === 'string') {
        dateObj = parseISO(date);
      } else {
        dateObj = new Date(date);
      }

      if (!isValid(dateObj)) {
        return format(new Date(), 'yyyy-MM-dd');
      }

      return format(dateObj, 'yyyy-MM-dd');
    } catch (error) {
      console.error('Error formatting ISO date:', error);
      return format(new Date(), 'yyyy-MM-dd');
    }
  }

  /**
   * Format datetime for ZATCA XML with timezone
   * @param {string|Date} date - Date to format
   * @returns {string} - ISO formatted datetime string
   */
  formatDateTimeISO(date) {
    if (!date) return format(new Date(), "yyyy-MM-dd'T'HH:mm:ssXXX");

    try {
      let dateObj;
      if (typeof date === 'string') {
        dateObj = parseISO(date);
      } else {
        dateObj = new Date(date);
      }

      if (!isValid(dateObj)) {
        return format(new Date(), "yyyy-MM-dd'T'HH:mm:ssXXX");
      }

      return format(dateObj, "yyyy-MM-dd'T'HH:mm:ssXXX");
    } catch (error) {
      console.error('Error formatting ISO datetime:', error);
      return format(new Date(), "yyyy-MM-dd'T'HH:mm:ssXXX");
    }
  }

  /**
   * Format percentage value
   * @param {number} percentage - Percentage to format
   * @param {number} decimals - Number of decimal places (default: 2)
   * @param {string} locale - Locale code (default: en)
   * @returns {string} - Formatted percentage string
   */
  formatPercentage(percentage, decimals = 2, locale = 'en') {
    if (typeof percentage !== 'number' || isNaN(percentage)) {
      return '0%';
    }

    const options = {
      style: 'percent',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    };

    try {
      switch (locale) {
        case 'ar':
          return new Intl.NumberFormat('ar-SA', options).format(percentage / 100);
        case 'bn':
          return new Intl.NumberFormat('bn-BD', options).format(percentage / 100);
        default:
          return new Intl.NumberFormat('en-US', options).format(percentage / 100);
      }
    } catch (error) {
      console.error('Error formatting percentage:', error);
      return `${percentage.toFixed(decimals)}%`;
    }
  }

  /**
   * Format VAT number according to Saudi standards
   * @param {string} vatNumber - VAT number to format
   * @returns {string} - Formatted VAT number
   */
  formatVATNumber(vatNumber) {
    if (!vatNumber) return '';

    // Remove any non-digit characters
    const cleanNumber = vatNumber.replace(/\D/g, '');

    // Saudi VAT numbers should be 15 digits
    if (cleanNumber.length !== 15) {
      return vatNumber; // Return original if not standard format
    }

    // Format as XXX-XXX-XXX-XXX-XXX
    return cleanNumber.replace(/(\d{3})(?=\d)/g, '$1-');
  }

  /**
   * Format commercial registration number
   * @param {string} crNumber - CR number to format
   * @returns {string} - Formatted CR number
   */
  formatCRNumber(crNumber) {
    if (!crNumber) return '';

    // Remove any non-digit characters
    const cleanNumber = crNumber.replace(/\D/g, '');

    // Saudi CR numbers are typically 10 digits
    if (cleanNumber.length === 10) {
      // Format as XXXX-XXXXXX
      return cleanNumber.replace(/(\d{4})(\d{6})/, '$1-$2');
    }

    return crNumber; // Return original if not standard format
  }

  /**
   * Format phone number for Saudi Arabia
   * @param {string} phoneNumber - Phone number to format
   * @returns {string} - Formatted phone number
   */
  formatPhoneNumber(phoneNumber) {
    if (!phoneNumber) return '';

    // Remove any non-digit characters except +
    let cleanNumber = phoneNumber.replace(/[^\d+]/g, '');

    // Handle Saudi numbers
    if (cleanNumber.startsWith('+966')) {
      // +966 XX XXX XXXX format
      const number = cleanNumber.substring(4);
      if (number.length === 9) {
        return `+966 ${number.substring(0, 2)} ${number.substring(2, 5)} ${number.substring(5)}`;
      }
    } else if (cleanNumber.startsWith('966')) {
      // 966 XX XXX XXXX format
      const number = cleanNumber.substring(3);
      if (number.length === 9) {
        return `+966 ${number.substring(0, 2)} ${number.substring(2, 5)} ${number.substring(5)}`;
      }
    } else if (cleanNumber.startsWith('0') && cleanNumber.length === 10) {
      // Local format 0XX XXX XXXX
      const number = cleanNumber.substring(1);
      return `+966 ${number.substring(0, 2)} ${number.substring(2, 5)} ${number.substring(5)}`;
    }

    return phoneNumber; // Return original if not recognizable format
  }

  /**
   * Validate and format email address
   * @param {string} email - Email to format
   * @returns {string} - Formatted (lowercased) email
   */
  formatEmail(email) {
    if (!email) return '';
    return email.toLowerCase().trim();
  }

  /**
   * Format text for XML (escape special characters)
   * @param {string} text - Text to format
   * @returns {string} - XML-safe text
   */
  formatXMLText(text) {
    if (!text) return '';

    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;')
      .trim();
  }

  /**
   * Format address for display
   * @param {Object} address - Address object
   * @param {string} locale - Locale code (default: en)
   * @returns {string} - Formatted address string
   */
  formatAddress(address, locale = 'en') {
    if (!address) return '';

    const {
      street = '',
      city = '',
      region = '',
      postalCode = '',
      country = 'Saudi Arabia'
    } = address;

    const parts = [street, city, region, postalCode, country]
      .filter(part => part && part.trim())
      .map(part => part.trim());

    if (locale === 'ar') {
      // For Arabic, reverse the order for better readability
      return parts.reverse().join('، ');
    } else {
      return parts.join(', ');
    }
  }

  /**
   * Calculate and format VAT breakdown
   * @param {number} subtotal - Subtotal amount
   * @param {number} vatRate - VAT rate percentage (default: 15)
   * @returns {Object} - VAT breakdown object
   */
  calculateVATBreakdown(subtotal, vatRate = this.vatRate) {
    if (typeof subtotal !== 'number' || isNaN(subtotal) || subtotal < 0) {
      return {
        subtotal: 0,
        vatAmount: 0,
        totalAmount: 0,
        vatRate: vatRate
      };
    }

    const vatAmount = (subtotal * vatRate) / 100;
    const totalAmount = subtotal + vatAmount;

    return {
      subtotal: Number(subtotal.toFixed(2)),
      vatAmount: Number(vatAmount.toFixed(2)),
      totalAmount: Number(totalAmount.toFixed(2)),
      vatRate: vatRate
    };
  }

  /**
   * Format invoice number with proper padding
   * @param {string|number} invoiceNumber - Invoice number
   * @param {number} padding - Number of digits to pad to (default: 6)
   * @param {string} prefix - Prefix to add (default: 'INV-')
   * @returns {string} - Formatted invoice number
   */
  formatInvoiceNumber(invoiceNumber, padding = 6, prefix = 'INV-') {
    if (!invoiceNumber) return '';

    // Extract numeric part
    const numericPart = String(invoiceNumber).replace(/\D/g, '');
    
    if (!numericPart) return String(invoiceNumber);

    // Pad with zeros
    const paddedNumber = numericPart.padStart(padding, '0');

    return `${prefix}${paddedNumber}`;
  }

  /**
   * Generate next invoice number
   * @param {string} lastInvoiceNumber - Last invoice number used
   * @param {string} prefix - Prefix to use (default: 'INV-')
   * @returns {string} - Next invoice number
   */
  generateNextInvoiceNumber(lastInvoiceNumber, prefix = 'INV-') {
    if (!lastInvoiceNumber) {
      return this.formatInvoiceNumber(1, 6, prefix);
    }

    // Extract numeric part from last invoice number
    const numericPart = lastInvoiceNumber.replace(/\D/g, '');
    const nextNumber = parseInt(numericPart, 10) + 1;

    return this.formatInvoiceNumber(nextNumber, 6, prefix);
  }

  /**
   * Validate Saudi VAT number format
   * @param {string} vatNumber - VAT number to validate
   * @returns {boolean} - True if valid format
   */
  isValidVATNumber(vatNumber) {
    if (!vatNumber) return false;

    // Remove any formatting
    const cleanNumber = vatNumber.replace(/\D/g, '');

    // Saudi VAT numbers are 15 digits
    return /^\d{15}$/.test(cleanNumber);
  }

  /**
   * Validate Saudi commercial registration number
   * @param {string} crNumber - CR number to validate
   * @returns {boolean} - True if valid format
   */
  isValidCRNumber(crNumber) {
    if (!crNumber) return false;

    // Remove any formatting
    const cleanNumber = crNumber.replace(/\D/g, '');

    // Saudi CR numbers are typically 10 digits
    return /^\d{10}$/.test(cleanNumber);
  }

  /**
   * Convert Gregorian date to Hijri for display purposes
   * @param {string|Date} date - Date to convert
   * @returns {string} - Hijri date string (approximate)
   */
  formatHijriDate(date) {
    // This is a simplified conversion for display purposes
    // For precise conversion, you would use a proper Hijri calendar library
    try {
      const gregorianDate = typeof date === 'string' ? new Date(date) : date;
      
      // Approximate Hijri calculation (for display only)
      const hijriYear = Math.floor((gregorianDate.getFullYear() - 622) * 1.030684);
      const hijriMonth = gregorianDate.getMonth() + 1;
      const hijriDay = gregorianDate.getDate();

      return `${hijriDay}/${hijriMonth}/${hijriYear} هـ`;
    } catch (error) {
      console.error('Error formatting Hijri date:', error);
      return '';
    }
  }

  /**
   * Format unit of measurement
   * @param {string} unit - Unit code
   * @param {string} locale - Locale code
   * @returns {string} - Formatted unit name
   */
  formatUnit(unit, locale = 'en') {
    const units = {
      en: {
        'kg': 'Kilogram',
        'ton': 'Ton',
        'piece': 'Piece',
        'pcs': 'Pieces',
        'gram': 'Gram',
        'meter': 'Meter',
        'liter': 'Liter',
        'box': 'Box',
        'each': 'Each'
      },
      ar: {
        'kg': 'كيلوغرام',
        'ton': 'طن',
        'piece': 'قطعة',
        'pcs': 'قطع',
        'gram': 'جرام',
        'meter': 'متر',
        'liter': 'لتر',
        'box': 'صندوق',
        'each': 'كل'
      },
      bn: {
        'kg': 'কিলোগ্রাম',
        'ton': 'টন',
        'piece': 'টুকরা',
        'pcs': 'টুকরা',
        'gram': 'গ্রাম',
        'meter': 'মিটার',
        'liter': 'লিটার',
        'box': 'বাক্স',
        'each': 'প্রতিটি'
      }
    };

    return units[locale]?.[unit.toLowerCase()] || unit;
  }
}

export default ZATCAFormatUtils;
