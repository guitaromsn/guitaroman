'use client';

import { useState } from 'react';
import { 
  HomeIcon, 
  DocumentTextIcon, 
  ReceiptRefundIcon,
  ClipboardDocumentListIcon,
  BanknotesIcon,
  Bars3Icon,
  XMarkIcon,
  LanguageIcon
} from '@heroicons/react/24/outline';
import { NavigationItem } from '@/types';
import Link from 'next/link';
import Image from 'next/image';

const navigation: NavigationItem[] = [
  { name: 'Dashboard', nameAr: 'لوحة التحكم', href: '/', icon: HomeIcon },
  { name: 'E-Invoice', nameAr: 'فاتورة إلكترونية', href: '/e-invoice', icon: DocumentTextIcon },
  { name: 'Invoice', nameAr: 'فاتورة', href: '/invoice', icon: ClipboardDocumentListIcon },
  { name: 'Receipt Voucher', nameAr: 'قسيمة استلام', href: '/receipt-voucher', icon: ReceiptRefundIcon },
  { name: 'Quotation', nameAr: 'عرض سعر', href: '/quotation', icon: BanknotesIcon },
];

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [language, setLanguage] = useState<'en' | 'ar'>('en');

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'ar' : 'en');
    // In a real app, this would update the app's language context
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border">
            <SidebarContent navigation={navigation} language={language} />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <div className="flex grow flex-col bg-card border-r border-border">
          <SidebarContent navigation={navigation} language={language} />
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top navigation */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-border bg-card px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-foreground lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Bars3Icon className="h-6 w-6" />
          </button>

          <div className="flex flex-1 items-center justify-between">
            <h1 className="text-lg font-semibold text-foreground">
              Amanat Al-Kalima ERP System
            </h1>
            
            <div className="flex items-center gap-4">
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-background transition-colors"
              >
                <LanguageIcon className="h-4 w-4" />
                {language === 'en' ? 'العربية' : 'English'}
              </button>
              
              <div className="text-sm text-foreground-secondary">
                {new Date().toLocaleDateString('en-SA')}
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="py-6">
          <div className="px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

function SidebarContent({ navigation, language }: { navigation: NavigationItem[], language: 'en' | 'ar' }) {
  return (
    <>
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center px-6 border-b border-border">
        <Image
          src="/logo.svg"
          alt="Amanat Al-Kalima Company"
          width={180}
          height={50}
          className="h-8 w-auto"
        />
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col px-6 py-6">
        <ul role="list" className="flex flex-1 flex-col gap-y-2">
          {navigation.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className="group flex gap-x-3 rounded-md p-3 text-sm font-medium leading-6 text-foreground hover:bg-primary/10 hover:text-primary transition-colors"
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {language === 'en' ? item.name : item.nameAr}
              </Link>
            </li>
          ))}
        </ul>

        {/* Footer */}
        <div className="mt-auto pt-6 border-t border-border">
          <div className="text-xs text-foreground-muted text-center">
            <div>Amanat Al-Kalima Company</div>
            <div className="mt-1">أمانة الكلمة</div>
            <div className="mt-2 text-primary">Premium ERP System</div>
          </div>
        </div>
      </nav>
    </>
  );
}