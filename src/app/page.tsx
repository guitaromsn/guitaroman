'use client';

import Layout from '@/components/Layout';
import { 
  DocumentTextIcon, 
  ClipboardDocumentListIcon,
  ReceiptRefundIcon,
  BanknotesIcon,
  ArrowTrendingUpIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  UsersIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

const stats = [
  {
    name: 'Total Invoices',
    nameAr: 'إجمالي الفواتير',
    value: '1,247',
    change: '+12%',
    icon: DocumentTextIcon,
    color: 'text-primary'
  },
  {
    name: 'Revenue (SAR)',
    nameAr: 'الإيرادات (ريال)',
    value: '﷼2,847,329',
    change: '+18%',
    icon: CurrencyDollarIcon,
    color: 'text-green-500'
  },
  {
    name: 'Active Customers',
    nameAr: 'العملاء النشطون',
    value: '189',
    change: '+5%',
    icon: UsersIcon,
    color: 'text-blue-500'
  },
  {
    name: 'Metal Categories',
    nameAr: 'فئات المعادن',
    value: '25',
    change: '+2',
    icon: ChartBarIcon,
    color: 'text-purple-500'
  }
];

const quickActions = [
  {
    name: 'Create E-Invoice',
    nameAr: 'إنشاء فاتورة إلكترونية',
    description: 'ZATCA compliant electronic invoice',
    descriptionAr: 'فاتورة إلكترونية متوافقة مع زاتكا',
    href: '/e-invoice',
    icon: DocumentTextIcon,
    color: 'bg-primary'
  },
  {
    name: 'Create Invoice',
    nameAr: 'إنشاء فاتورة',
    description: 'Standard business invoice',
    descriptionAr: 'فاتورة تجارية عادية',
    href: '/invoice',
    icon: ClipboardDocumentListIcon,
    color: 'bg-blue-600'
  },
  {
    name: 'Receipt Voucher',
    nameAr: 'قسيمة استلام',
    description: 'Payment receipt document',
    descriptionAr: 'وثيقة إيصال دفع',
    href: '/receipt-voucher',
    icon: ReceiptRefundIcon,
    color: 'bg-green-600'
  },
  {
    name: 'Create Quotation',
    nameAr: 'إنشاء عرض سعر',
    description: 'Price quotation for customers',
    descriptionAr: 'عرض أسعار للعملاء',
    href: '/quotation',
    icon: BanknotesIcon,
    color: 'bg-purple-600'
  }
];

const recentActivity = [
  {
    id: 1,
    type: 'invoice',
    title: 'Invoice #INV-2024-001 created',
    titleAr: 'تم إنشاء فاتورة رقم INV-2024-001',
    customer: 'Saudi Steel Company',
    amount: '﷼45,800',
    time: '2 hours ago'
  },
  {
    id: 2,
    type: 'e-invoice',
    title: 'E-Invoice #EINV-2024-156 submitted to ZATCA',
    titleAr: 'تم إرسال الفاتورة الإلكترونية EINV-2024-156 لزاتكا',
    customer: 'Al-Rashid Metals Ltd.',
    amount: '﷼128,900',
    time: '4 hours ago'
  },
  {
    id: 3,
    type: 'quotation',
    title: 'Quotation #QUO-2024-089 sent',
    titleAr: 'تم إرسال عرض السعر QUO-2024-089',
    customer: 'Metal Works Industries',
    amount: '﷼67,500',
    time: '6 hours ago'
  }
];

export default function Dashboard() {
  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="mt-2 text-foreground-secondary">
              Welcome to Amanat Al-Kalima ERP System
            </p>
          </div>
          <div className="text-sm text-foreground-muted">
            <div>Today: {new Date().toLocaleDateString('en-SA')}</div>
            <div className="text-primary">SAR Exchange Rate: 3.75</div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.name} className="card p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
                <div className="ml-4 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-foreground-secondary truncate">
                      {stat.name}
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-foreground">
                        {stat.value}
                      </div>
                      <div className="ml-2 flex items-baseline text-sm font-semibold text-green-500">
                        <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                        {stat.change}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {quickActions.map((action) => (
              <Link
                key={action.name}
                href={action.href}
                className="card p-6 hover:bg-card/80 transition-colors group"
              >
                <div className="flex items-center">
                  <div className={`flex-shrink-0 p-3 rounded-lg ${action.color}`}>
                    <action.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-base font-semibold text-foreground group-hover:text-primary">
                      {action.name}
                    </h3>
                    <p className="text-sm text-foreground-secondary">
                      {action.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity & Metal Categories */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Recent Activity */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-4 p-3 rounded-lg bg-background-secondary">
                  <div className="flex-shrink-0">
                    <div className="h-2 w-2 bg-primary rounded-full"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {activity.title}
                    </p>
                    <p className="text-sm text-foreground-secondary">
                      {activity.customer} • {activity.amount}
                    </p>
                  </div>
                  <div className="text-xs text-foreground-muted">
                    {activity.time}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Metal Categories Summary */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Metal Categories</h3>
            <div className="space-y-3">
              {[
                { name: 'Ferrous Metals', nameAr: 'المعادن الحديدية', count: 8, color: 'bg-red-500' },
                { name: 'Non-Ferrous Metals', nameAr: 'المعادن غير الحديدية', count: 12, color: 'bg-blue-500' },
                { name: 'Precious Metals', nameAr: 'المعادن الثمينة', count: 3, color: 'bg-yellow-500' },
                { name: 'Electronic Scrap', nameAr: 'الخردة الإلكترونية', count: 6, color: 'bg-green-500' },
                { name: 'Automotive Scrap', nameAr: 'خردة السيارات', count: 4, color: 'bg-purple-500' },
              ].map((category) => (
                <div key={category.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`h-3 w-3 rounded-full ${category.color}`}></div>
                    <span className="text-sm font-medium text-foreground">{category.name}</span>
                  </div>
                  <span className="text-sm text-foreground-secondary">{category.count} items</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-sm text-foreground-secondary">
                Total: 33 metal scrap categories available
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}