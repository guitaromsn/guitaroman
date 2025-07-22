import { v4 as uuidv4 } from 'uuid';
import { format, parseISO } from 'date-fns';

/**
 * ZATCA XML Generator for E-Invoicing compliance
 * Generates XML in UBL 2.1 format according to ZATCA specifications
 */
class ZATCAXMLGenerator {
  constructor() {
    this.xmlns = {
      cbc: 'urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2',
      cac: 'urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2',
      qdt: 'urn:oasis:names:specification:ubl:schema:xsd:QualifiedDatatypes-2',
      udt: 'urn:un:unece:uncefact:data:specification:UnqualifiedDataTypesSchemaModule:2',
      ext: 'urn:oasis:names:specification:ubl:schema:xsd:CommonExtensionComponents-2',
      default: 'urn:oasis:names:specification:ubl:schema:xsd:Invoice-2'
    };
  }

  /**
   * Generate ZATCA-compliant XML for an invoice
   * @param {Object} invoiceData - Invoice data object
   * @returns {string} - XML string
   */
  generateInvoiceXML(invoiceData) {
    try {
      const xmlHeader = this.generateXMLHeader();
      const invoice = this.generateInvoiceElement(invoiceData);
      
      return `${xmlHeader}\n${invoice}`;
    } catch (error) {
      console.error('Error generating ZATCA XML:', error);
      throw new Error('Failed to generate ZATCA-compliant XML');
    }
  }

  generateXMLHeader() {
    return `<?xml version="1.0" encoding="UTF-8"?>`;
  }

  generateInvoiceElement(invoiceData) {
    const {
      id,
      invoiceNumber,
      invoiceDate,
      dueDate,
      issueTime = format(new Date(), 'HH:mm:ss'),
      invoiceTypeCode = '388', // Commercial invoice
      documentCurrencyCode = 'SAR',
      taxCurrencyCode = 'SAR',
      supplier = {},
      customer = {},
      items = [],
      subtotal = 0,
      vatAmount = 0,
      totalAmount = 0,
      notes = '',
      paymentMeansCode = '10' // In cash
    } = invoiceData;

    const uuid = id || uuidv4();
    const formattedDate = this.formatDate(invoiceDate);
    const formattedDueDate = dueDate ? this.formatDate(dueDate) : null;

    return `<Invoice xmlns="${this.xmlns.default}" 
             xmlns:cac="${this.xmlns.cac}" 
             xmlns:cbc="${this.xmlns.cbc}" 
             xmlns:ext="${this.xmlns.ext}">
  <ext:UBLExtensions>
    <ext:UBLExtension>
      <ext:ExtensionURI>urn:oasis:names:specification:ubl:dsig:enveloped:xades</ext:ExtensionURI>
      <ext:ExtensionContent>
        <!-- QR Code and Digital Signature will be inserted here -->
      </ext:ExtensionContent>
    </ext:UBLExtension>
  </ext:UBLExtensions>

  <cbc:ProfileID>reporting:1.0</cbc:ProfileID>
  <cbc:ID>${invoiceNumber}</cbc:ID>
  <cbc:UUID>${uuid}</cbc:UUID>
  <cbc:IssueDate>${formattedDate}</cbc:IssueDate>
  <cbc:IssueTime>${issueTime}</cbc:IssueTime>
  ${formattedDueDate ? `<cbc:DueDate>${formattedDueDate}</cbc:DueDate>` : ''}
  <cbc:InvoiceTypeCode name="0100000">${invoiceTypeCode}</cbc:InvoiceTypeCode>
  <cbc:Note>${this.escapeXML(notes)}</cbc:Note>
  <cbc:DocumentCurrencyCode>${documentCurrencyCode}</cbc:DocumentCurrencyCode>
  <cbc:TaxCurrencyCode>${taxCurrencyCode}</cbc:TaxCurrencyCode>

  <!-- Billing Reference (for credit notes, etc.) -->
  ${this.generateBillingReference(invoiceData)}

  <!-- Additional Document Reference -->
  ${this.generateAdditionalDocumentReference()}

  <!-- Supplier (AccountingSupplierParty) -->
  ${this.generateSupplierParty(supplier)}

  <!-- Customer (AccountingCustomerParty) -->
  ${this.generateCustomerParty(customer)}

  <!-- Delivery -->
  ${this.generateDelivery(invoiceData)}

  <!-- Payment Means -->
  ${this.generatePaymentMeans(paymentMeansCode, invoiceData)}

  <!-- Payment Terms -->
  ${this.generatePaymentTerms(invoiceData)}

  <!-- Allowances and Charges -->
  ${this.generateAllowanceCharges(invoiceData)}

  <!-- Tax Total -->
  ${this.generateTaxTotal(vatAmount, subtotal, invoiceData)}

  <!-- Legal Monetary Total -->
  ${this.generateLegalMonetaryTotal(subtotal, vatAmount, totalAmount, invoiceData)}

  <!-- Invoice Lines -->
  ${this.generateInvoiceLines(items)}

</Invoice>`;
  }

  generateSupplierParty(supplier) {
    return `<cac:AccountingSupplierParty>
    <cac:Party>
      <cac:PartyIdentification>
        <cbc:ID schemeID="CRN">${supplier.crNumber || ''}</cbc:ID>
      </cac:PartyIdentification>
      <cac:PartyIdentification>
        <cbc:ID schemeID="VAT">${supplier.vatNumber || ''}</cbc:ID>
      </cac:PartyIdentification>
      <cac:PostalAddress>
        <cbc:StreetName>${this.escapeXML(supplier.address || '')}</cbc:StreetName>
        <cbc:CityName>${this.escapeXML(supplier.city || 'Riyadh')}</cbc:CityName>
        <cbc:PostalZone>${supplier.postalCode || '11564'}</cbc:PostalZone>
        <cbc:CountrySubentity>${this.escapeXML(supplier.region || 'Riyadh Region')}</cbc:CountrySubentity>
        <cac:Country>
          <cbc:IdentificationCode>SA</cbc:IdentificationCode>
        </cac:Country>
      </cac:PostalAddress>
      <cac:PartyTaxScheme>
        <cbc:RegistrationName>${this.escapeXML(supplier.name || '')}</cbc:RegistrationName>
        <cbc:CompanyID>${supplier.vatNumber || ''}</cbc:CompanyID>
        <cac:TaxScheme>
          <cbc:ID>VAT</cbc:ID>
        </cac:TaxScheme>
      </cac:PartyTaxScheme>
      <cac:PartyLegalEntity>
        <cbc:RegistrationName>${this.escapeXML(supplier.name || '')}</cbc:RegistrationName>
        <cbc:CompanyID>${supplier.crNumber || ''}</cbc:CompanyID>
      </cac:PartyLegalEntity>
    </cac:Party>
  </cac:AccountingSupplierParty>`;
  }

  generateCustomerParty(customer) {
    return `<cac:AccountingCustomerParty>
    <cac:Party>
      <cac:PartyIdentification>
        <cbc:ID schemeID="NAT">${customer.nationalId || customer.vatNumber || ''}</cbc:ID>
      </cac:PartyIdentification>
      ${customer.vatNumber ? `<cac:PartyIdentification>
        <cbc:ID schemeID="VAT">${customer.vatNumber}</cbc:ID>
      </cac:PartyIdentification>` : ''}
      <cac:PostalAddress>
        <cbc:StreetName>${this.escapeXML(customer.address || '')}</cbc:StreetName>
        <cbc:CityName>${this.escapeXML(customer.city || '')}</cbc:CityName>
        <cbc:PostalZone>${customer.postalCode || ''}</cbc:PostalZone>
        <cbc:CountrySubentity>${this.escapeXML(customer.region || '')}</cbc:CountrySubentity>
        <cac:Country>
          <cbc:IdentificationCode>SA</cbc:IdentificationCode>
        </cac:Country>
      </cac:PostalAddress>
      <cac:PartyTaxScheme>
        <cbc:RegistrationName>${this.escapeXML(customer.name || '')}</cbc:RegistrationName>
        <cbc:CompanyID>${customer.vatNumber || ''}</cbc:CompanyID>
        <cac:TaxScheme>
          <cbc:ID>VAT</cbc:ID>
        </cac:TaxScheme>
      </cac:PartyTaxScheme>
      <cac:PartyLegalEntity>
        <cbc:RegistrationName>${this.escapeXML(customer.name || '')}</cbc:RegistrationName>
      </cac:PartyLegalEntity>
    </cac:Party>
  </cac:AccountingCustomerParty>`;
  }

  generateDelivery(invoiceData) {
    const deliveryDate = invoiceData.deliveryDate || invoiceData.invoiceDate;
    return `<cac:Delivery>
    <cbc:ActualDeliveryDate>${this.formatDate(deliveryDate)}</cbc:ActualDeliveryDate>
    <cac:DeliveryLocation>
      <cac:Address>
        <cbc:CountrySubentity>SA</cbc:CountrySubentity>
        <cac:Country>
          <cbc:IdentificationCode>SA</cbc:IdentificationCode>
        </cac:Country>
      </cac:Address>
    </cac:DeliveryLocation>
  </cac:Delivery>`;
  }

  generatePaymentMeans(paymentMeansCode, invoiceData) {
    return `<cac:PaymentMeans>
    <cbc:PaymentMeansCode>${paymentMeansCode}</cbc:PaymentMeansCode>
    <cbc:InstructionNote>${this.escapeXML(invoiceData.paymentNote || 'Payment due within terms')}</cbc:InstructionNote>
  </cac:PaymentMeans>`;
  }

  generatePaymentTerms(invoiceData) {
    return `<cac:PaymentTerms>
    <cbc:Note>${this.escapeXML(invoiceData.paymentTerms || 'Payment due on receipt')}</cbc:Note>
  </cac:PaymentTerms>`;
  }

  generateBillingReference(invoiceData) {
    if (!invoiceData.billingReference) return '';
    
    return `<cac:BillingReference>
    <cac:InvoiceDocumentReference>
      <cbc:ID>${invoiceData.billingReference.id}</cbc:ID>
      <cbc:IssueDate>${this.formatDate(invoiceData.billingReference.date)}</cbc:IssueDate>
    </cac:InvoiceDocumentReference>
  </cac:BillingReference>`;
  }

  generateAdditionalDocumentReference() {
    return `<cac:AdditionalDocumentReference>
    <cbc:ID>ICV</cbc:ID>
    <cbc:UUID>${uuidv4()}</cbc:UUID>
  </cac:AdditionalDocumentReference>`;
  }

  generateAllowanceCharges(invoiceData) {
    if (!invoiceData.allowances && !invoiceData.charges) return '';
    
    let result = '';
    
    // Allowances (discounts)
    if (invoiceData.allowances) {
      invoiceData.allowances.forEach(allowance => {
        result += `<cac:AllowanceCharge>
        <cbc:ChargeIndicator>false</cbc:ChargeIndicator>
        <cbc:AllowanceChargeReason>${this.escapeXML(allowance.reason || 'Discount')}</cbc:AllowanceChargeReason>
        <cbc:Amount currencyID="SAR">${allowance.amount.toFixed(2)}</cbc:Amount>
        <cac:TaxCategory>
          <cbc:ID schemeAgencyID="6" schemeID="UN/ECE 5305">S</cbc:ID>
          <cbc:Percent>${allowance.vatRate || 15}</cbc:Percent>
          <cac:TaxScheme>
            <cbc:ID schemeAgencyID="6" schemeID="UN/ECE 5153">VAT</cbc:ID>
          </cac:TaxScheme>
        </cac:TaxCategory>
      </cac:AllowanceCharge>`;
      });
    }

    // Charges (additional fees)
    if (invoiceData.charges) {
      invoiceData.charges.forEach(charge => {
        result += `<cac:AllowanceCharge>
        <cbc:ChargeIndicator>true</cbc:ChargeIndicator>
        <cbc:AllowanceChargeReason>${this.escapeXML(charge.reason || 'Additional Fee')}</cbc:AllowanceChargeReason>
        <cbc:Amount currencyID="SAR">${charge.amount.toFixed(2)}</cbc:Amount>
        <cac:TaxCategory>
          <cbc:ID schemeAgencyID="6" schemeID="UN/ECE 5305">S</cbc:ID>
          <cbc:Percent>${charge.vatRate || 15}</cbc:Percent>
          <cac:TaxScheme>
            <cbc:ID schemeAgencyID="6" schemeID="UN/ECE 5153">VAT</cbc:ID>
          </cac:TaxScheme>
        </cac:TaxCategory>
      </cac:AllowanceCharge>`;
      });
    }

    return result;
  }

  generateTaxTotal(vatAmount, subtotal, invoiceData) {
    const taxableAmount = subtotal;
    const vatRate = vatAmount > 0 ? (vatAmount / subtotal * 100).toFixed(2) : '15.00';

    return `<cac:TaxTotal>
    <cbc:TaxAmount currencyID="SAR">${vatAmount.toFixed(2)}</cbc:TaxAmount>
    <cac:TaxSubtotal>
      <cbc:TaxableAmount currencyID="SAR">${taxableAmount.toFixed(2)}</cbc:TaxableAmount>
      <cbc:TaxAmount currencyID="SAR">${vatAmount.toFixed(2)}</cbc:TaxAmount>
      <cac:TaxCategory>
        <cbc:ID schemeAgencyID="6" schemeID="UN/ECE 5305">S</cbc:ID>
        <cbc:Percent>${vatRate}</cbc:Percent>
        <cac:TaxScheme>
          <cbc:ID schemeAgencyID="6" schemeID="UN/ECE 5153">VAT</cbc:ID>
        </cac:TaxScheme>
      </cac:TaxCategory>
    </cac:TaxSubtotal>
  </cac:TaxTotal>`;
  }

  generateLegalMonetaryTotal(subtotal, vatAmount, totalAmount, invoiceData) {
    const lineExtensionAmount = subtotal;
    const taxExclusiveAmount = subtotal;
    const taxInclusiveAmount = totalAmount;
    const allowanceTotalAmount = invoiceData.totalAllowances || 0;
    const chargeTotalAmount = invoiceData.totalCharges || 0;
    const payableAmount = totalAmount;

    return `<cac:LegalMonetaryTotal>
    <cbc:LineExtensionAmount currencyID="SAR">${lineExtensionAmount.toFixed(2)}</cbc:LineExtensionAmount>
    <cbc:TaxExclusiveAmount currencyID="SAR">${taxExclusiveAmount.toFixed(2)}</cbc:TaxExclusiveAmount>
    <cbc:TaxInclusiveAmount currencyID="SAR">${taxInclusiveAmount.toFixed(2)}</cbc:TaxInclusiveAmount>
    ${allowanceTotalAmount > 0 ? `<cbc:AllowanceTotalAmount currencyID="SAR">${allowanceTotalAmount.toFixed(2)}</cbc:AllowanceTotalAmount>` : ''}
    ${chargeTotalAmount > 0 ? `<cbc:ChargeTotalAmount currencyID="SAR">${chargeTotalAmount.toFixed(2)}</cbc:ChargeTotalAmount>` : ''}
    <cbc:PayableAmount currencyID="SAR">${payableAmount.toFixed(2)}</cbc:PayableAmount>
  </cac:LegalMonetaryTotal>`;
  }

  generateInvoiceLines(items) {
    return items.map((item, index) => {
      const lineNumber = index + 1;
      const lineExtensionAmount = (item.quantity * item.unitPrice).toFixed(2);
      const vatAmount = (parseFloat(lineExtensionAmount) * (item.vatRate || 15) / 100).toFixed(2);

      return `<cac:InvoiceLine>
      <cbc:ID>${lineNumber}</cbc:ID>
      <cbc:InvoicedQuantity unitCode="${item.unit || 'PCE'}">${item.quantity}</cbc:InvoicedQuantity>
      <cbc:LineExtensionAmount currencyID="SAR">${lineExtensionAmount}</cbc:LineExtensionAmount>
      <cac:TaxTotal>
        <cbc:TaxAmount currencyID="SAR">${vatAmount}</cbc:TaxAmount>
        <cbc:RoundingAmount currencyID="SAR">${(parseFloat(lineExtensionAmount) + parseFloat(vatAmount)).toFixed(2)}</cbc:RoundingAmount>
      </cac:TaxTotal>
      <cac:Item>
        <cbc:Name>${this.escapeXML(item.description || item.name || '')}</cbc:Name>
        <cac:ClassifiedTaxCategory>
          <cbc:ID>S</cbc:ID>
          <cbc:Percent>${item.vatRate || 15}</cbc:Percent>
          <cac:TaxScheme>
            <cbc:ID>VAT</cbc:ID>
          </cac:TaxScheme>
        </cac:ClassifiedTaxCategory>
      </cac:Item>
      <cac:Price>
        <cbc:PriceAmount currencyID="SAR">${item.unitPrice.toFixed(2)}</cbc:PriceAmount>
        <cac:AllowanceCharge>
          <cbc:ChargeIndicator>true</cbc:ChargeIndicator>
          <cbc:AllowanceChargeReason>discount</cbc:AllowanceChargeReason>
          <cbc:Amount currencyID="SAR">0.00</cbc:Amount>
        </cac:AllowanceCharge>
      </cac:Price>
    </cac:InvoiceLine>`;
    }).join('\n');
  }

  formatDate(dateInput) {
    try {
      if (!dateInput) return format(new Date(), 'yyyy-MM-dd');
      
      if (typeof dateInput === 'string') {
        return format(parseISO(dateInput), 'yyyy-MM-dd');
      }
      
      return format(new Date(dateInput), 'yyyy-MM-dd');
    } catch (error) {
      return format(new Date(), 'yyyy-MM-dd');
    }
  }

  escapeXML(str) {
    if (!str) return '';
    
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  /**
   * Validate generated XML against ZATCA rules
   * @param {string} xmlString - Generated XML
   * @returns {Object} - Validation result
   */
  validateXML(xmlString) {
    const errors = [];
    const warnings = [];

    // Basic validation checks
    if (!xmlString.includes('<cbc:ProfileID>reporting:1.0</cbc:ProfileID>')) {
      errors.push('Missing or invalid ProfileID');
    }

    if (!xmlString.includes('xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2"')) {
      errors.push('Missing required UBL namespace');
    }

    if (!xmlString.includes('<cbc:InvoiceTypeCode')) {
      errors.push('Missing InvoiceTypeCode');
    }

    if (!xmlString.includes('<cac:AccountingSupplierParty>')) {
      errors.push('Missing AccountingSupplierParty');
    }

    if (!xmlString.includes('<cac:AccountingCustomerParty>')) {
      errors.push('Missing AccountingCustomerParty');
    }

    if (!xmlString.includes('<cac:TaxTotal>')) {
      errors.push('Missing TaxTotal');
    }

    if (!xmlString.includes('<cac:LegalMonetaryTotal>')) {
      errors.push('Missing LegalMonetaryTotal');
    }

    if (!xmlString.includes('<cac:InvoiceLine>')) {
      warnings.push('No invoice lines found');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Generate hash for the invoice (used in QR code)
   * @param {string} xmlString - XML string
   * @returns {string} - Base64 encoded hash
   */
  generateInvoiceHash(xmlString) {
    // This is a simplified hash generation for browser environment
    // In production, you would use proper cryptographic hashing with Web Crypto API
    const encoder = new TextEncoder();
    const data = encoder.encode(xmlString);
    
    // Simple hash fallback for development
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data[i];
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    // Convert to base64-like string for compatibility
    return btoa(Math.abs(hash).toString());
  }
}

export default ZATCAXMLGenerator;
