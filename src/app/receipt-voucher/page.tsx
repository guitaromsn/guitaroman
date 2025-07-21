'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Input, Select, Textarea, Button } from '@/components/forms/FormFields';
import { metalScrapItems, currencies, paymentMethods } from '@/data/metalScrapItems';
import { Customer, FormItem } from '@/types';
import { 
  ReceiptRefundIcon, 
  PrinterIcon, 
  PaperAirplaneIcon,
  ArrowDownTrayIcon,
  PlusIcon,
  TrashIcon,
  BanknotesIcon
} from '@heroicons/react/24/outline';
import Image from 'next/image';

export default function ReceiptVoucherPage() {
  const [formData, setFormData] = useState({
    documentNumber: '',
    date: new Date().toISOString().split('T')[0],
    customer: {
      name: '',
      email: '',
      phone: '',
      address: '',
      taxNumber: '',
      commercialRegister: ''
    } as Customer,
    items: [] as FormItem[],
    notes: '',
    currency: 'SAR',
    paymentMethod: 'cash',
    referenceNumber: '',
    receivedFrom: ''
  });

  const [totals, setTotals] = useState({
    subtotal: 0,
    totalDiscount: 0,
    taxAmount: 0,
    total: 0
  });

  const [isLoading, setIsLoading] = useState(false);

  // Generate document number on mount
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      documentNumber: `RV-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`
    }));
  }, []);

  // Calculate totals when items change
  useEffect(() => {
    const subtotal = formData.items.reduce((sum, item) => {
      const itemTotal = (item.quantity * item.unitPrice) - item.discount;
      return sum + itemTotal;
    }, 0);

    const totalDiscount = formData.items.reduce((sum, item) => sum + item.discount, 0);
    const taxAmount = formData.items.reduce((sum, item) => {
      const itemTotal = (item.quantity * item.unitPrice) - item.discount;
      return sum + (itemTotal * item.taxRate / 100);
    }, 0);

    const total = subtotal + taxAmount;

    setTotals({ subtotal, totalDiscount, taxAmount, total });
  }, [formData.items]);

  const addItem = () => {
    const newItem: FormItem = {
      id: Date.now().toString(),
      itemId: '',
      quantity: 1,
      unitPrice: 0,
      discount: 0,
      taxRate: 15, // Saudi VAT rate
      total: 0
    };

    setFormData(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));
  };

  const removeItem = (itemId: string) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== itemId)
    }));
  };

  const updateItem = (itemId: string, field: keyof FormItem, value: any) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map(item => {
        if (item.id === itemId) {
          const updatedItem = { ...item, [field]: value };
          
          // If item selection changed, update price
          if (field === 'itemId') {
            const metalItem = metalScrapItems.find(m => m.id === value);
            if (metalItem) {
              updatedItem.unitPrice = metalItem.pricePerUnit;
            }
          }
          
          // Calculate item total
          updatedItem.total = (updatedItem.quantity * updatedItem.unitPrice) - updatedItem.discount + 
                            ((updatedItem.quantity * updatedItem.unitPrice - updatedItem.discount) * updatedItem.taxRate / 100);
          
          return updatedItem;
        }
        return item;
      })
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    alert('Receipt Voucher created and processed successfully!');
    setIsLoading(false);
  };

  const handleSave = () => {
    alert('Receipt Voucher saved as draft');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportPDF = () => {
    alert('PDF export functionality would be implemented here');
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <ReceiptRefundIcon className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">Receipt Voucher</h1>
              <p className="text-foreground-secondary">Payment Receipt Document</p>
            </div>
          </div>
          <div className="text-right">
            <Image src="/logo.svg" alt="Amanat Al-Kalima" width={180} height={50} className="h-12 w-auto" />
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Document Info */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Receipt Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Receipt Number"
                value={formData.documentNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, documentNumber: e.target.value }))}
                readOnly
                className="bg-background-secondary"
              />
              <Input
                label="Receipt Date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                required
              />
              <Select
                label="Currency"
                value={formData.currency}
                onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value }))}
                options={currencies.map(curr => ({ value: curr.code, label: `${curr.code} (${curr.symbol})` }))}
              />
              <Input
                label="Received From *"
                value={formData.receivedFrom}
                onChange={(e) => setFormData(prev => ({ ...prev, receivedFrom: e.target.value }))}
                placeholder="Customer or payer name"
                required
              />
              <Select
                label="Payment Method"
                value={formData.paymentMethod}
                onChange={(e) => setFormData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                options={paymentMethods.map(method => ({ value: method.value, label: method.labelEn }))}
              />
              <Input
                label="Reference Number"
                value={formData.referenceNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, referenceNumber: e.target.value }))}
                placeholder="Check #, Transfer ID, etc."
              />
            </div>
          </div>

          {/* Customer Information */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Customer Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Customer Name"
                value={formData.customer.name}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  customer: { ...prev.customer, name: e.target.value }
                }))}
              />
              <Input
                label="Tax Number (VAT)"
                value={formData.customer.taxNumber}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  customer: { ...prev.customer, taxNumber: e.target.value }
                }))}
                placeholder="3xxxxxxxxx"
              />
              <Input
                label="Email"
                type="email"
                value={formData.customer.email}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  customer: { ...prev.customer, email: e.target.value }
                }))}
              />
              <Input
                label="Phone"
                value={formData.customer.phone}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  customer: { ...prev.customer, phone: e.target.value }
                }))}
                placeholder="+966 XX XXX XXXX"
              />
            </div>
            <div className="mt-4">
              <Textarea
                label="Address"
                value={formData.customer.address}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  customer: { ...prev.customer, address: e.target.value }
                }))}
                rows={2}
              />
            </div>
          </div>

          {/* Items */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-foreground">Received For</h2>
              <Button type="button" onClick={addItem} size="sm">
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>

            {formData.items.length === 0 ? (
              <div className="text-center py-8 text-foreground-muted">
                No items added. Click &quot;Add Item&quot; to specify what payment was received for.
              </div>
            ) : (
              <div className="space-y-4">
                {formData.items.map((item, index) => (
                  <div key={item.id} className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-medium text-foreground">Item #{index + 1}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                      <div className="lg:col-span-2">
                        <Select
                          label="Metal Item"
                          value={item.itemId}
                          onChange={(e) => updateItem(item.id, 'itemId', e.target.value)}
                          options={[
                            { value: '', label: 'Select item...' },
                            ...metalScrapItems.map(metal => ({
                              value: metal.id,
                              label: `${metal.nameEn} (${metal.pricePerUnit} SAR/${metal.unit})`
                            }))
                          ]}
                          required
                        />
                      </div>
                      <Input
                        label="Quantity"
                        type="number"
                        min="0"
                        step="0.1"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, 'quantity', Number(e.target.value))}
                        required
                      />
                      <Input
                        label="Unit Price (SAR)"
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.unitPrice}
                        onChange={(e) => updateItem(item.id, 'unitPrice', Number(e.target.value))}
                        required
                      />
                      <Input
                        label="Discount (SAR)"
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.discount}
                        onChange={(e) => updateItem(item.id, 'discount', Number(e.target.value))}
                      />
                      <Input
                        label="Tax Rate (%)"
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        value={item.taxRate}
                        onChange={(e) => updateItem(item.id, 'taxRate', Number(e.target.value))}
                        required
                      />
                    </div>
                    
                    <div className="mt-4 text-right">
                      <span className="text-sm text-foreground-secondary">
                        Item Total: <span className="font-semibold text-primary">﷼{item.total.toFixed(2)}</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Totals */}
          {formData.items.length > 0 && (
            <div className="card p-6 bg-green-900/20 border-green-500/20">
              <div className="flex items-center gap-2 mb-4">
                <BanknotesIcon className="h-6 w-6 text-green-500" />
                <h2 className="text-xl font-semibold text-foreground">Payment Summary</h2>
              </div>
              <div className="space-y-2 max-w-md ml-auto">
                <div className="flex justify-between">
                  <span className="text-foreground-secondary">Subtotal:</span>
                  <span className="font-medium">﷼{totals.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground-secondary">Total Discount:</span>
                  <span className="font-medium">-﷼{totals.totalDiscount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground-secondary">VAT (15%):</span>
                  <span className="font-medium">﷼{totals.taxAmount.toFixed(2)}</span>
                </div>
                <div className="border-t border-border pt-2">
                  <div className="flex justify-between text-lg font-bold">
                    <span className="text-foreground">Amount Received:</span>
                    <span className="text-green-500">﷼{totals.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notes */}
          <div className="card p-6">
            <Textarea
              label="Notes / Remarks"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
              placeholder="Additional notes about the payment..."
            />
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-end">
            <Button type="button" variant="outline" onClick={handleSave}>
              Save Draft
            </Button>
            <Button type="button" variant="secondary" onClick={handlePrint}>
              <PrinterIcon className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button type="button" variant="secondary" onClick={handleExportPDF}>
              <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
            <Button type="submit" loading={isLoading}>
              <PaperAirplaneIcon className="h-4 w-4 mr-2" />
              Process Receipt
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
}