export interface User {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  ACCOUNTANT = 'ACCOUNTANT',
  SALES = 'SALES',
  USER = 'USER'
}

export interface Customer {
  id: string;
  name: string;
  nameArabic?: string;
  email?: string;
  phone?: string;
  vatNumber?: string;
  crNumber?: string;
  address?: string;
  city?: string;
  country: string;
  isActive: boolean;
  creditLimit?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface InventoryItem {
  id: string;
  name: string;
  nameArabic?: string;
  description?: string;
  category: string;
  unit: string;
  currentStock: number;
  minStock?: number;
  avgCostPrice?: number;
  currentPrice?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customer?: Customer;
  type: InvoiceType;
  status: InvoiceStatus;
  issueDate: Date;
  dueDate?: Date;
  subtotal: number;
  vatAmount: number;
  totalAmount: number;
  paidAmount: number;
  notes?: string;
  zatcaUUID?: string;
  zatcaQR?: string;
  isZatcaSubmitted: boolean;
  createdById: string;
  createdBy?: User;
  items: InvoiceItem[];
  payments: Payment[];
  createdAt: Date;
  updatedAt: Date;
}

export enum InvoiceType {
  SALE = 'SALE',
  PURCHASE = 'PURCHASE'
}

export enum InvoiceStatus {
  DRAFT = 'DRAFT',
  SENT = 'SENT',
  PAID = 'PAID',
  OVERDUE = 'OVERDUE',
  CANCELLED = 'CANCELLED'
}

export interface InvoiceItem {
  id: string;
  invoiceId: string;
  itemId: string;
  item?: InventoryItem;
  description: string;
  quantity: number;
  unitPrice: number;
  vatRate: number;
  vatAmount: number;
  totalAmount: number;
}

export interface Payment {
  id: string;
  customerId: string;
  customer?: Customer;
  invoiceId?: string;
  invoice?: Invoice;
  paymentNumber: string;
  amount: number;
  paymentMethod: PaymentMethod;
  paymentDate: Date;
  reference?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum PaymentMethod {
  CASH = 'CASH',
  BANK_TRANSFER = 'BANK_TRANSFER',
  CHECK = 'CHECK',
  CREDIT_CARD = 'CREDIT_CARD'
}

export interface DashboardStats {
  totalCustomers: number;
  totalInvoices: number;
  pendingInvoices: number;
  totalInventoryItems: number;
  totalRevenue: number;
  overdueInvoices: number;
  recentInvoices: Invoice[];
  lowStockItems: InventoryItem[];
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
  success: boolean;
}