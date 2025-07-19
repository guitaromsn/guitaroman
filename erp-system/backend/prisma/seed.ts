import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 12);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@aalkc.com' },
    update: {},
    create: {
      email: 'admin@aalkc.com',
      username: 'admin',
      password: hashedPassword,
      firstName: 'System',
      lastName: 'Administrator',
      role: 'ADMIN'
    }
  });

  console.log('✅ Admin user created:', admin.email);

  // Create sample customer
  const customer = await prisma.customer.upsert({
    where: { email: 'customer@example.com' },
    update: {},
    create: {
      name: 'Sample Metal Trading Co.',
      nameArabic: 'شركة تجارة المعادن النموذجية',
      email: 'customer@example.com',
      phone: '+966501234567',
      vatNumber: '123456789000003',
      address: 'Industrial District, Dammam',
      city: 'Dammam',
      creditLimit: 50000.00
    }
  });

  console.log('✅ Sample customer created:', customer.name);

  // Create sample inventory items
  const inventoryItems = [
    {
      name: 'Steel Scrap',
      nameArabic: 'خردة الحديد',
      description: 'Mixed steel scrap',
      category: 'Ferrous Metals',
      unit: 'KG',
      currentStock: 1500.500,
      minStock: 100.000,
      currentPrice: 1.25
    },
    {
      name: 'Aluminum Scrap',
      nameArabic: 'خردة الألمنيوم',
      description: 'Aluminum sheets and parts',
      category: 'Non-Ferrous Metals',
      unit: 'KG',
      currentStock: 850.750,
      minStock: 50.000,
      currentPrice: 6.50
    },
    {
      name: 'Copper Wire',
      nameArabic: 'أسلاك النحاس',
      description: 'Copper electrical wires',
      category: 'Non-Ferrous Metals',
      unit: 'KG',
      currentStock: 125.250,
      minStock: 25.000,
      currentPrice: 28.75
    }
  ];

  for (const item of inventoryItems) {
    const inventoryItem = await prisma.inventoryItem.upsert({
      where: { name: item.name },
      update: {},
      create: item
    });
    console.log('✅ Inventory item created:', inventoryItem.name);
  }

  // Create system settings
  const settings = [
    { key: 'company_name', value: 'شركة أمانة الكلمة', description: 'Company name in Arabic' },
    { key: 'company_name_en', value: 'Amanat Al-Kalima Company', description: 'Company name in English' },
    { key: 'company_cr', value: '7050308233', description: 'Commercial Registration number' },
    { key: 'company_vat', value: '313054315200003', description: 'VAT registration number' },
    { key: 'company_address', value: '6618, 4120 22 Street Al Khaleej District Dammam, EASTERN PROVINCE Saudi Arabia 32425', description: 'Company address' },
    { key: 'company_phone', value: '+966565790073', description: 'Company phone number' },
    { key: 'company_email', value: 'shahid@aalkc.com', description: 'Company email' },
    { key: 'default_vat_rate', value: '15', description: 'Default VAT rate percentage' },
    { key: 'default_currency', value: 'SAR', description: 'Default currency' }
  ];

  for (const setting of settings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting
    });
  }

  console.log('✅ System settings created');
  console.log('🎉 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });