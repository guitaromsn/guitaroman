import QRCode from 'qrcode';
import { format } from 'date-fns';

/**
 * ZATCA QR Code Generator for E-Invoicing compliance
 * Generates QR codes according to ZATCA specifications for Saudi Arabia
 */
class ZATCAQRGenerator {
  constructor() {
    // ZATCA QR Code field tags
    this.tags = {
      SELLER_NAME: 1,
      VAT_REGISTRATION_NUMBER: 2,
      TIMESTAMP: 3,
      INVOICE_TOTAL: 4,
      VAT_TOTAL: 5,
      XML_INVOICE_HASH: 6,
      ECDSA_SIGNATURE: 7,
      ECDSA_PUBLIC_KEY: 8,
      STAMP_SIGNATURE: 9
    };
  }

  /**
   * Generate ZATCA-compliant QR code for an invoice
   * @param {Object} invoiceData - Invoice data object
   * @returns {Promise<string>} - Base64 encoded QR code image
   */
  async generateQRCode(invoiceData) {
    try {
      const qrString = this.buildQRString(invoiceData);
      const qrOptions = this.getQROptions();
      
      const qrCodeDataURL = await QRCode.toDataURL(qrString, qrOptions);
      return qrCodeDataURL;
    } catch (error) {
      console.error('Error generating QR code:', error);
      throw new Error('Failed to generate ZATCA QR code');
    }
  }

  /**
   * Generate QR code as SVG
   * @param {Object} invoiceData - Invoice data object
   * @returns {Promise<string>} - SVG string
   */
  async generateQRCodeSVG(invoiceData) {
    try {
      const qrString = this.buildQRString(invoiceData);
      const qrOptions = this.getQROptions();
      
      const qrCodeSVG = await QRCode.toString(qrString, {
        ...qrOptions,
        type: 'svg'
      });
      return qrCodeSVG;
    } catch (error) {
      console.error('Error generating QR code SVG:', error);
      throw new Error('Failed to generate ZATCA QR code SVG');
    }
  }

  /**
   * Build the QR code string according to ZATCA specifications
   * @param {Object} invoiceData - Invoice data object
   * @returns {string} - QR code string
   */
  buildQRString(invoiceData) {
    const {
      supplier = {},
      invoiceDate,
      totalAmount = 0,
      vatAmount = 0,
      xmlHash = '',
      digitalSignature = '',
      publicKey = '',
      stampSignature = ''
    } = invoiceData;

    // Format timestamp (ISO 8601 format)
    const timestamp = this.formatTimestamp(invoiceDate);
    
    // Build QR string using TLV (Type-Length-Value) encoding
    let qrString = '';
    
    // Tag 1: Seller name
    qrString += this.encodeTLV(this.tags.SELLER_NAME, supplier.name || '');
    
    // Tag 2: VAT registration number
    qrString += this.encodeTLV(this.tags.VAT_REGISTRATION_NUMBER, supplier.vatNumber || '');
    
    // Tag 3: Timestamp
    qrString += this.encodeTLV(this.tags.TIMESTAMP, timestamp);
    
    // Tag 4: Invoice total with VAT
    qrString += this.encodeTLV(this.tags.INVOICE_TOTAL, totalAmount.toFixed(2));
    
    // Tag 5: VAT total
    qrString += this.encodeTLV(this.tags.VAT_TOTAL, vatAmount.toFixed(2));
    
    // Tag 6: XML invoice hash (Base64 encoded)
    if (xmlHash) {
      qrString += this.encodeTLV(this.tags.XML_INVOICE_HASH, xmlHash);
    }
    
    // Tag 7: ECDSA signature (Base64 encoded)
    if (digitalSignature) {
      qrString += this.encodeTLV(this.tags.ECDSA_SIGNATURE, digitalSignature);
    }
    
    // Tag 8: ECDSA public key (Base64 encoded)
    if (publicKey) {
      qrString += this.encodeTLV(this.tags.ECDSA_PUBLIC_KEY, publicKey);
    }
    
    // Tag 9: Stamp signature (Base64 encoded)
    if (stampSignature) {
      qrString += this.encodeTLV(this.tags.STAMP_SIGNATURE, stampSignature);
    }

    // Convert to Base64
    return Buffer.from(qrString, 'utf8').toString('base64');
  }

  /**
   * Encode value using TLV (Type-Length-Value) format
   * @param {number} tag - Field tag number
   * @param {string} value - Field value
   * @returns {string} - TLV encoded string
   */
  encodeTLV(tag, value) {
    if (!value) return '';
    
    const valueBytes = Buffer.from(value, 'utf8');
    const tagByte = Buffer.from([tag]);
    const lengthByte = Buffer.from([valueBytes.length]);
    
    return Buffer.concat([tagByte, lengthByte, valueBytes]).toString('binary');
  }

  /**
   * Format timestamp for QR code
   * @param {string|Date} date - Date input
   * @returns {string} - Formatted timestamp
   */
  formatTimestamp(date) {
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return format(dateObj, "yyyy-MM-dd'T'HH:mm:ss'Z'");
    } catch (error) {
      return format(new Date(), "yyyy-MM-dd'T'HH:mm:ss'Z'");
    }
  }

  /**
   * Get QR code generation options
   * @returns {Object} - QR code options
   */
  getQROptions() {
    return {
      errorCorrectionLevel: 'L', // Low error correction (required by ZATCA)
      type: 'image/png',
      quality: 0.92,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      width: 300
    };
  }

  /**
   * Decode QR code string for verification
   * @param {string} qrString - Base64 encoded QR string
   * @returns {Object} - Decoded QR data
   */
  decodeQRString(qrString) {
    try {
      const binaryString = Buffer.from(qrString, 'base64').toString('binary');
      const decoded = {};
      let offset = 0;

      while (offset < binaryString.length) {
        const tag = binaryString.charCodeAt(offset);
        const length = binaryString.charCodeAt(offset + 1);
        const value = binaryString.substring(offset + 2, offset + 2 + length);
        
        switch (tag) {
          case this.tags.SELLER_NAME:
            decoded.sellerName = value;
            break;
          case this.tags.VAT_REGISTRATION_NUMBER:
            decoded.vatNumber = value;
            break;
          case this.tags.TIMESTAMP:
            decoded.timestamp = value;
            break;
          case this.tags.INVOICE_TOTAL:
            decoded.invoiceTotal = parseFloat(value);
            break;
          case this.tags.VAT_TOTAL:
            decoded.vatTotal = parseFloat(value);
            break;
          case this.tags.XML_INVOICE_HASH:
            decoded.xmlHash = value;
            break;
          case this.tags.ECDSA_SIGNATURE:
            decoded.digitalSignature = value;
            break;
          case this.tags.ECDSA_PUBLIC_KEY:
            decoded.publicKey = value;
            break;
          case this.tags.STAMP_SIGNATURE:
            decoded.stampSignature = value;
            break;
        }
        
        offset += 2 + length;
      }

      return decoded;
    } catch (error) {
      console.error('Error decoding QR string:', error);
      throw new Error('Failed to decode QR string');
    }
  }

  /**
   * Validate QR code data against ZATCA requirements
   * @param {Object} qrData - QR code data
   * @returns {Object} - Validation result
   */
  validateQRData(qrData) {
    const errors = [];
    const warnings = [];

    // Required fields validation
    if (!qrData.sellerName) {
      errors.push('Seller name is required');
    }

    if (!qrData.vatNumber) {
      errors.push('VAT registration number is required');
    } else if (!/^\d{15}$/.test(qrData.vatNumber)) {
      warnings.push('VAT number format may be invalid (should be 15 digits)');
    }

    if (!qrData.timestamp) {
      errors.push('Timestamp is required');
    }

    if (qrData.invoiceTotal === undefined || qrData.invoiceTotal === null) {
      errors.push('Invoice total is required');
    } else if (qrData.invoiceTotal < 0) {
      errors.push('Invoice total cannot be negative');
    }

    if (qrData.vatTotal === undefined || qrData.vatTotal === null) {
      errors.push('VAT total is required');
    } else if (qrData.vatTotal < 0) {
      errors.push('VAT total cannot be negative');
    }

    // Validate VAT percentage (should typically be 15% in Saudi Arabia)
    if (qrData.invoiceTotal > 0 && qrData.vatTotal > 0) {
      const vatPercentage = (qrData.vatTotal / (qrData.invoiceTotal - qrData.vatTotal)) * 100;
      if (Math.abs(vatPercentage - 15) > 0.01 && Math.abs(vatPercentage - 0) > 0.01) {
        warnings.push(`VAT percentage (${vatPercentage.toFixed(2)}%) is not standard (0% or 15%)`);
      }
    }

    // For simplified tax invoices (B2C), digital signature fields are optional
    // For tax invoices (B2B), digital signature fields are required
    if (!qrData.xmlHash) {
      warnings.push('XML hash not present - may be required for B2B transactions');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Generate simplified QR code for basic invoices (no digital signature)
   * @param {Object} invoiceData - Invoice data object
   * @returns {Promise<string>} - Base64 encoded QR code image
   */
  async generateSimplifiedQRCode(invoiceData) {
    const simplifiedData = {
      supplier: invoiceData.supplier,
      invoiceDate: invoiceData.invoiceDate,
      totalAmount: invoiceData.totalAmount,
      vatAmount: invoiceData.vatAmount
      // Exclude digital signature fields for simplified invoices
    };

    return this.generateQRCode(simplifiedData);
  }

  /**
   * Generate QR code with custom dimensions
   * @param {Object} invoiceData - Invoice data object
   * @param {number} width - QR code width in pixels
   * @returns {Promise<string>} - Base64 encoded QR code image
   */
  async generateQRCodeWithSize(invoiceData, width = 300) {
    try {
      const qrString = this.buildQRString(invoiceData);
      const qrOptions = {
        ...this.getQROptions(),
        width
      };
      
      const qrCodeDataURL = await QRCode.toDataURL(qrString, qrOptions);
      return qrCodeDataURL;
    } catch (error) {
      console.error('Error generating custom size QR code:', error);
      throw new Error('Failed to generate custom size ZATCA QR code');
    }
  }

  /**
   * Generate QR code as buffer for server-side processing
   * @param {Object} invoiceData - Invoice data object
   * @returns {Promise<Buffer>} - QR code as buffer
   */
  async generateQRCodeBuffer(invoiceData) {
    try {
      const qrString = this.buildQRString(invoiceData);
      const qrOptions = this.getQROptions();
      
      const qrCodeBuffer = await QRCode.toBuffer(qrString, qrOptions);
      return qrCodeBuffer;
    } catch (error) {
      console.error('Error generating QR code buffer:', error);
      throw new Error('Failed to generate ZATCA QR code buffer');
    }
  }
}

export default ZATCAQRGenerator;
