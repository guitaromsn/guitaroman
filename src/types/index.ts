export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  taxNumber?: string;
  commercialRegister?: string;
}

export interface MetalScrapItem {
  id: string;
  nameEn: string;
  nameAr: string;
  category: string;
  unit: string;
  pricePerUnit: number;
  description?: string;
}

export interface FormItem {
  id: string;
  itemId: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  taxRate: number;
  total: number;
}

export interface BaseForm {
  id: string;
  documentNumber: string;
  date: string;
  customer: Customer;
  items: FormItem[];
  subtotal: number;
  totalDiscount: number;
  taxAmount: number;
  total: number;
  currency: string;
  notes?: string;
  attachments?: string[];
  status: 'draft' | 'pending' | 'approved' | 'sent' | 'paid' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface Invoice extends BaseForm {
  type: 'invoice';
  dueDate: string;
  paymentTerms: string;
  reference?: string;
}

export interface EInvoice extends BaseForm {
  type: 'e-invoice';
  zatcaStatus: 'pending' | 'submitted' | 'approved' | 'rejected';
  zatcaReference?: string;
  zatcaHash?: string;
  dueDate: string;
  paymentTerms: string;
}

export interface ReceiptVoucher extends BaseForm {
  type: 'receipt-voucher';
  paymentMethod: 'cash' | 'bank-transfer' | 'check' | 'card';
  referenceNumber?: string;
  receivedFrom: string;
}

export interface Quotation extends BaseForm {
  type: 'quotation';
  validUntil: string;
  terms: string;
  convertedToInvoice?: boolean;
  invoiceId?: string;
}

export type FormType = Invoice | EInvoice | ReceiptVoucher | Quotation;

export interface Language {
  code: 'en' | 'ar';
  name: string;
  direction: 'ltr' | 'rtl';
}

export interface NavigationItem {
  name: string;
  nameAr: string;
  href: string;
  icon: React.ComponentType<any>;
  current?: boolean;
}