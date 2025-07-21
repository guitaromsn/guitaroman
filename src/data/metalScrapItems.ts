import { MetalScrapItem } from '@/types';

export const metalScrapItems: MetalScrapItem[] = [
  // Ferrous Metals
  {
    id: 'steel-001',
    nameEn: 'Carbon Steel Scrap',
    nameAr: 'خردة الفولاذ الكربوني',
    category: 'Ferrous Metals',
    unit: 'kg',
    pricePerUnit: 2.5,
    description: 'High-grade carbon steel scrap'
  },
  {
    id: 'steel-002',
    nameEn: 'Stainless Steel 304',
    nameAr: 'الفولاذ المقاوم للصدأ 304',
    category: 'Ferrous Metals',
    unit: 'kg',
    pricePerUnit: 8.5,
    description: 'Stainless steel 304 grade scrap'
  },
  {
    id: 'steel-003',
    nameEn: 'Stainless Steel 316',
    nameAr: 'الفولاذ المقاوم للصدأ 316',
    category: 'Ferrous Metals',
    unit: 'kg',
    pricePerUnit: 12.0,
    description: 'Stainless steel 316 grade scrap'
  },
  {
    id: 'iron-001',
    nameEn: 'Cast Iron Scrap',
    nameAr: 'خردة الحديد الزهر',
    category: 'Ferrous Metals',
    unit: 'kg',
    pricePerUnit: 1.8,
    description: 'Cast iron scrap material'
  },
  {
    id: 'iron-002',
    nameEn: 'Wrought Iron',
    nameAr: 'الحديد المطاوع',
    category: 'Ferrous Metals',
    unit: 'kg',
    pricePerUnit: 2.2,
    description: 'Wrought iron scrap'
  },

  // Non-Ferrous Metals
  {
    id: 'copper-001',
    nameEn: 'Copper Wire #1',
    nameAr: 'سلك النحاس رقم 1',
    category: 'Non-Ferrous Metals',
    unit: 'kg',
    pricePerUnit: 25.0,
    description: 'Clean copper wire, bright and shiny'
  },
  {
    id: 'copper-002',
    nameEn: 'Copper Wire #2',
    nameAr: 'سلك النحاس رقم 2',
    category: 'Non-Ferrous Metals',
    unit: 'kg',
    pricePerUnit: 22.5,
    description: 'Copper wire with minimal insulation'
  },
  {
    id: 'copper-003',
    nameEn: 'Copper Pipe',
    nameAr: 'أنابيب النحاس',
    category: 'Non-Ferrous Metals',
    unit: 'kg',
    pricePerUnit: 23.8,
    description: 'Clean copper pipes and fittings'
  },
  {
    id: 'aluminum-001',
    nameEn: 'Aluminum Cans',
    nameAr: 'علب الألومنيوم',
    category: 'Non-Ferrous Metals',
    unit: 'kg',
    pricePerUnit: 4.2,
    description: 'Clean aluminum beverage cans'
  },
  {
    id: 'aluminum-002',
    nameEn: 'Aluminum Extrusion',
    nameAr: 'بثق الألومنيوم',
    category: 'Non-Ferrous Metals',
    unit: 'kg',
    pricePerUnit: 5.8,
    description: 'Aluminum window frames and profiles'
  },
  {
    id: 'aluminum-003',
    nameEn: 'Aluminum Sheet',
    nameAr: 'صفائح الألومنيوم',
    category: 'Non-Ferrous Metals',
    unit: 'kg',
    pricePerUnit: 5.5,
    description: 'Clean aluminum sheets and plates'
  },
  {
    id: 'brass-001',
    nameEn: 'Yellow Brass',
    nameAr: 'البراص الأصفر',
    category: 'Non-Ferrous Metals',
    unit: 'kg',
    pricePerUnit: 18.5,
    description: 'Clean yellow brass fittings'
  },
  {
    id: 'brass-002',
    nameEn: 'Red Brass',
    nameAr: 'البراص الأحمر',
    category: 'Non-Ferrous Metals',
    unit: 'kg',
    pricePerUnit: 19.8,
    description: 'High-grade red brass'
  },
  {
    id: 'zinc-001',
    nameEn: 'Zinc Scrap',
    nameAr: 'خردة الزنك',
    category: 'Non-Ferrous Metals',
    unit: 'kg',
    pricePerUnit: 6.2,
    description: 'Clean zinc scrap material'
  },
  {
    id: 'lead-001',
    nameEn: 'Lead Scrap',
    nameAr: 'خردة الرصاص',
    category: 'Non-Ferrous Metals',
    unit: 'kg',
    pricePerUnit: 7.5,
    description: 'Lead weights and battery plates'
  },

  // Precious Metals
  {
    id: 'silver-001',
    nameEn: 'Silver Scrap',
    nameAr: 'خردة الفضة',
    category: 'Precious Metals',
    unit: 'gram',
    pricePerUnit: 2.8,
    description: 'Sterling silver scrap'
  },
  {
    id: 'gold-001',
    nameEn: 'Gold Scrap',
    nameAr: 'خردة الذهب',
    category: 'Precious Metals',
    unit: 'gram',
    pricePerUnit: 220.0,
    description: 'Gold jewelry and components'
  },

  // Electronic Scrap
  {
    id: 'electronic-001',
    nameEn: 'Computer Motherboards',
    nameAr: 'اللوحات الأم للكمبيوتر',
    category: 'Electronic Scrap',
    unit: 'piece',
    pricePerUnit: 45.0,
    description: 'Computer motherboards with precious metals'
  },
  {
    id: 'electronic-002',
    nameEn: 'CPU Processors',
    nameAr: 'معالجات الكمبيوتر',
    category: 'Electronic Scrap',
    unit: 'piece',
    pricePerUnit: 125.0,
    description: 'Computer processors with gold pins'
  },
  {
    id: 'electronic-003',
    nameEn: 'RAM Memory',
    nameAr: 'ذاكرة الوصول العشوائي',
    category: 'Electronic Scrap',
    unit: 'piece',
    pricePerUnit: 35.0,
    description: 'Computer memory modules'
  },
  {
    id: 'electronic-004',
    nameEn: 'Hard Drives',
    nameAr: 'أقراص التخزين الصلبة',
    category: 'Electronic Scrap',
    unit: 'piece',
    pricePerUnit: 25.0,
    description: 'Computer hard disk drives'
  },
  {
    id: 'cable-001',
    nameEn: 'Insulated Copper Wire',
    nameAr: 'سلك النحاس المعزول',
    category: 'Electronic Scrap',
    unit: 'kg',
    pricePerUnit: 15.5,
    description: 'Copper wire with insulation'
  },

  // Automotive Scrap
  {
    id: 'auto-001',
    nameEn: 'Catalytic Converters',
    nameAr: 'محولات حفزية',
    category: 'Automotive Scrap',
    unit: 'piece',
    pricePerUnit: 450.0,
    description: 'Automotive catalytic converters'
  },
  {
    id: 'auto-002',
    nameEn: 'Car Batteries',
    nameAr: 'بطاريات السيارات',
    category: 'Automotive Scrap',
    unit: 'piece',
    pricePerUnit: 85.0,
    description: 'Lead-acid car batteries'
  },
  {
    id: 'auto-003',
    nameEn: 'Aluminum Wheels',
    nameAr: 'عجلات الألومنيوم',
    category: 'Automotive Scrap',
    unit: 'piece',
    pricePerUnit: 120.0,
    description: 'Aluminum alloy wheels'
  },
  {
    id: 'auto-004',
    nameEn: 'Radiators',
    nameAr: 'المشعات',
    category: 'Automotive Scrap',
    unit: 'piece',
    pricePerUnit: 95.0,
    description: 'Copper and aluminum radiators'
  }
];

export const categories = [
  'Ferrous Metals',
  'Non-Ferrous Metals', 
  'Precious Metals',
  'Electronic Scrap',
  'Automotive Scrap'
];

export const units = ['kg', 'gram', 'piece', 'ton'];

export const currencies = [
  { code: 'SAR', symbol: '﷼', nameEn: 'Saudi Riyal', nameAr: 'ريال سعودي' },
  { code: 'USD', symbol: '$', nameEn: 'US Dollar', nameAr: 'دولار أمريكي' },
  { code: 'EUR', symbol: '€', nameEn: 'Euro', nameAr: 'يورو' },
];

export const paymentMethods = [
  { value: 'cash', labelEn: 'Cash', labelAr: 'نقداً' },
  { value: 'bank-transfer', labelEn: 'Bank Transfer', labelAr: 'تحويل بنكي' },
  { value: 'check', labelEn: 'Check', labelAr: 'شيك' },
  { value: 'card', labelEn: 'Credit/Debit Card', labelAr: 'بطاقة ائتمان' },
];

export const paymentTerms = [
  { value: 'immediate', labelEn: 'Immediate', labelAr: 'فوري' },
  { value: '7-days', labelEn: '7 Days', labelAr: '7 أيام' },
  { value: '15-days', labelEn: '15 Days', labelAr: '15 يوم' },
  { value: '30-days', labelEn: '30 Days', labelAr: '30 يوم' },
  { value: '60-days', labelEn: '60 Days', labelAr: '60 يوم' },
  { value: '90-days', labelEn: '90 Days', labelAr: '90 يوم' },
];