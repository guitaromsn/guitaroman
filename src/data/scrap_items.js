// Scrap metal items categorized for the Saudi Arabian market
// Prices in SAR (Saudi Riyal)

export const scrapCategories = {
  ferrous: {
    name: 'Ferrous Metals',
    nameAr: 'المعادن الحديدية',
    description: 'Iron and steel-based materials',
    descriptionAr: 'المواد المعتمدة على الحديد والصلب'
  },
  'non-ferrous': {
    name: 'Non-Ferrous Metals',
    nameAr: 'المعادن غير الحديدية',
    description: 'Metals that do not contain iron',
    descriptionAr: 'المعادن التي لا تحتوي على الحديد'
  },
  'e-waste': {
    name: 'Electronic Waste',
    nameAr: 'النفايات الإلكترونية',
    description: 'Electronic devices and components',
    descriptionAr: 'الأجهزة والمكونات الإلكترونية'
  },
  demolition: {
    name: 'Demolition Materials',
    nameAr: 'مواد الهدم',
    description: 'Construction and demolition waste',
    descriptionAr: 'نفايات البناء والهدم'
  },
  precious: {
    name: 'Precious Metals',
    nameAr: 'المعادن الثمينة',
    description: 'Gold, silver, and platinum group metals',
    descriptionAr: 'الذهب والفضة ومجموعة البلاتين'
  },
  automotive: {
    name: 'Automotive Scrap',
    nameAr: 'خردة السيارات',
    description: 'Vehicle parts and automotive components',
    descriptionAr: 'قطع غيار المركبات والمكونات السيارات'
  }
};

export const scrapItems = [
  // Ferrous Metals
  {
    id: 'FER001',
    name: 'Heavy Steel Scrap',
    nameAr: 'خردة الصلب الثقيل',
    nameAr: 'خردة الصلب الثقيل',
    category: 'ferrous',
    unit: 'kg',
    currentPrice: 0.85,
    minPrice: 0.70,
    maxPrice: 1.20,
    description: 'Heavy gauge steel plates and structural steel',
    descriptionAr: 'ألواح الصلب الثقيل والصلب الهيكلي',
    vatRate: 15
  },
  {
    id: 'FER002',
    name: 'Light Steel Scrap',
    nameAr: 'خردة الصلب الخفيف',
    category: 'ferrous',
    unit: 'kg',
    currentPrice: 0.75,
    minPrice: 0.60,
    maxPrice: 1.00,
    description: 'Thin gauge steel sheets and light structural steel',
    descriptionAr: 'صفائح الصلب الرفيع والصلب الهيكلي الخفيف',
    vatRate: 15
  },
  {
    id: 'FER003',
    name: 'Cast Iron',
    nameAr: 'حديد زهر',
    category: 'ferrous',
    unit: 'kg',
    currentPrice: 0.65,
    minPrice: 0.50,
    maxPrice: 0.90,
    description: 'Cast iron components and parts',
    descriptionAr: 'مكونات وأجزاء الحديد الزهر',
    vatRate: 15
  },
  {
    id: 'FER004',
    name: 'Rebar (Reinforcement Bar)',
    nameAr: 'حديد التسليح',
    category: 'ferrous',
    unit: 'ton',
    currentPrice: 750.00,
    minPrice: 650.00,
    maxPrice: 900.00,
    description: 'Reinforcement steel bars used in construction',
    descriptionAr: 'قضبان الصلب المستخدمة في التسليح في البناء',
    vatRate: 15
  },

  // Non-Ferrous Metals
  {
    id: 'NFE001',
    name: 'Aluminum Cans',
    nameAr: 'علب الألمنيوم',
    category: 'non-ferrous',
    unit: 'kg',
    currentPrice: 5.20,
    minPrice: 4.50,
    maxPrice: 6.00,
    description: 'Aluminum beverage cans and food containers',
    descriptionAr: 'علب المشروبات الألمنيوم وحاويات الطعام',
    vatRate: 15
  },
  {
    id: 'NFE002',
    name: 'Aluminum Sheets',
    nameAr: 'صفائح الألمنيوم',
    category: 'non-ferrous',
    unit: 'kg',
    currentPrice: 5.50,
    minPrice: 5.00,
    maxPrice: 6.50,
    description: 'Aluminum sheets and plates',
    descriptionAr: 'صفائح وألواح الألمنيوم',
    vatRate: 15
  },
  {
    id: 'NFE003',
    name: 'Copper Wire',
    nameAr: 'سلك النحاس',
    category: 'non-ferrous',
    unit: 'kg',
    currentPrice: 28.00,
    minPrice: 25.00,
    maxPrice: 32.00,
    description: 'Copper electrical wire and cables',
    descriptionAr: 'الأسلاك والكابلات الكهربائية النحاسية',
    vatRate: 15
  },
  {
    id: 'NFE004',
    name: 'Copper Pipes',
    nameAr: 'أنابيب النحاس',
    category: 'non-ferrous',
    unit: 'kg',
    currentPrice: 26.50,
    minPrice: 24.00,
    maxPrice: 30.00,
    description: 'Copper plumbing pipes and fittings',
    descriptionAr: 'أنابيب السباكة النحاسية والتركيبات',
    vatRate: 15
  },
  {
    id: 'NFE005',
    name: 'Brass Fittings',
    nameAr: 'تركيبات النحاس الأصفر',
    category: 'non-ferrous',
    unit: 'kg',
    currentPrice: 18.50,
    minPrice: 16.00,
    maxPrice: 22.00,
    description: 'Brass plumbing fittings and hardware',
    descriptionAr: 'تركيبات السباكة النحاسية الصفراء والأجهزة',
    vatRate: 15
  },
  {
    id: 'NFE006',
    name: 'Lead Batteries',
    nameAr: 'بطاريات الرصاص',
    category: 'non-ferrous',
    unit: 'kg',
    currentPrice: 7.25,
    minPrice: 6.50,
    maxPrice: 8.50,
    description: 'Lead-acid automotive and UPS batteries',
    descriptionAr: 'بطاريات الرصاص الحمضية للسيارات وأجهزة UPS',
    vatRate: 15
  },

  // Electronic Waste
  {
    id: 'EWA001',
    name: 'Desktop Computers',
    nameAr: 'أجهزة الكمبيوتر المكتبية',
    category: 'e-waste',
    unit: 'piece',
    currentPrice: 25.00,
    minPrice: 20.00,
    maxPrice: 35.00,
    description: 'Complete desktop computer units',
    descriptionAr: 'وحدات الكمبيوتر المكتبية الكاملة',
    vatRate: 15
  },
  {
    id: 'EWA002',
    name: 'Laptop Computers',
    nameAr: 'أجهزة الكمبيوتر المحمولة',
    category: 'e-waste',
    unit: 'piece',
    currentPrice: 30.00,
    minPrice: 25.00,
    maxPrice: 40.00,
    description: 'Laptop computers and notebooks',
    descriptionAr: 'أجهزة الكمبيوتر المحمولة والدفاتر',
    vatRate: 15
  },
  {
    id: 'EWA003',
    name: 'Mobile Phones',
    nameAr: 'الهواتف المحمولة',
    category: 'e-waste',
    unit: 'piece',
    currentPrice: 15.00,
    minPrice: 10.00,
    maxPrice: 25.00,
    description: 'Cell phones and smartphones',
    descriptionAr: 'الهواتف الخلوية والهواتف الذكية',
    vatRate: 15
  },
  {
    id: 'EWA004',
    name: 'Circuit Boards',
    nameAr: 'لوحات الدوائر',
    category: 'e-waste',
    unit: 'kg',
    currentPrice: 45.00,
    minPrice: 40.00,
    maxPrice: 55.00,
    description: 'Electronic circuit boards and PCBs',
    descriptionAr: 'لوحات الدوائر الإلكترونية وثنائي الفينيل متعدد الكلور',
    vatRate: 15
  },
  {
    id: 'EWA005',
    name: 'CRT Monitors',
    nameAr: 'شاشات CRT',
    category: 'e-waste',
    unit: 'piece',
    currentPrice: 12.00,
    minPrice: 8.00,
    maxPrice: 18.00,
    description: 'Cathode ray tube monitors and TVs',
    descriptionAr: 'شاشات وتلفزيونات أنبوب الأشعة المهبطية',
    vatRate: 15
  },

  // Demolition Materials
  {
    id: 'DEM001',
    name: 'Structural Steel Beams',
    nameAr: 'عوارض الصلب الهيكلية',
    category: 'demolition',
    unit: 'ton',
    currentPrice: 850.00,
    minPrice: 750.00,
    maxPrice: 1000.00,
    description: 'I-beams and structural steel from buildings',
    descriptionAr: 'العوارض على شكل I والصلب الهيكلي من المباني',
    vatRate: 15
  },
  {
    id: 'DEM002',
    name: 'Steel Pipes',
    nameAr: 'الأنابيب الفولاذية',
    category: 'demolition',
    unit: 'kg',
    currentPrice: 0.80,
    minPrice: 0.70,
    maxPrice: 1.00,
    description: 'Steel pipes from plumbing and construction',
    descriptionAr: 'الأنابيب الفولاذية من السباكة والبناء',
    vatRate: 15
  },
  {
    id: 'DEM003',
    name: 'Aluminum Window Frames',
    nameAr: 'إطارات النوافذ الألمنيوم',
    category: 'demolition',
    unit: 'kg',
    currentPrice: 4.80,
    minPrice: 4.20,
    maxPrice: 5.50,
    description: 'Aluminum window and door frames',
    descriptionAr: 'إطارات النوافذ والأبواب الألمنيوم',
    vatRate: 15
  },

  // Precious Metals
  {
    id: 'PRE001',
    name: 'Gold Jewelry Scrap',
    nameAr: 'خردة المجوهرات الذهبية',
    category: 'precious',
    unit: 'gram',
    currentPrice: 220.00,
    minPrice: 200.00,
    maxPrice: 250.00,
    description: 'Gold jewelry and gold-plated items',
    descriptionAr: 'المجوهرات الذهبية والأشياء المطلية بالذهب',
    vatRate: 15
  },
  {
    id: 'PRE002',
    name: 'Silver Items',
    nameAr: 'العناصر الفضية',
    category: 'precious',
    unit: 'gram',
    currentPrice: 3.20,
    minPrice: 2.80,
    maxPrice: 3.80,
    description: 'Silver jewelry and silverware',
    descriptionAr: 'المجوهرات الفضية وأدوات المائدة الفضية',
    vatRate: 15
  },

  // Automotive Scrap
  {
    id: 'AUT001',
    name: 'Car Engines',
    nameAr: 'محركات السيارات',
    category: 'automotive',
    unit: 'piece',
    currentPrice: 450.00,
    minPrice: 350.00,
    maxPrice: 600.00,
    description: 'Complete automotive engines',
    descriptionAr: 'محركات السيارات الكاملة',
    vatRate: 15
  },
  {
    id: 'AUT002',
    name: 'Radiators',
    nameAr: 'المشعات',
    category: 'automotive',
    unit: 'piece',
    currentPrice: 85.00,
    minPrice: 70.00,
    maxPrice: 110.00,
    description: 'Automotive radiators and cooling systems',
    descriptionAr: 'مشعات السيارات وأنظمة التبريد',
    vatRate: 15
  },
  {
    id: 'AUT003',
    name: 'Catalytic Converters',
    nameAr: 'المحولات الحفازة',
    category: 'automotive',
    unit: 'piece',
    currentPrice: 850.00,
    minPrice: 600.00,
    maxPrice: 1200.00,
    description: 'Automotive catalytic converters',
    descriptionAr: 'محولات حفازة للسيارات',
    vatRate: 15
  },
  {
    id: 'AUT004',
    name: 'Transmission Units',
    nameAr: 'وحدات النقل',
    category: 'automotive',
    unit: 'piece',
    currentPrice: 320.00,
    minPrice: 250.00,
    maxPrice: 450.00,
    description: 'Automotive transmission units',
    descriptionAr: 'وحدات نقل السيارات',
    vatRate: 15
  }
];

export const units = [
  { value: 'kg', label: 'Kilogram', labelAr: 'كيلوغرام' },
  { value: 'ton', label: 'Ton', labelAr: 'طن' },
  { value: 'piece', label: 'Piece', labelAr: 'قطعة' },
  { value: 'gram', label: 'Gram', labelAr: 'جرام' },
  { value: 'meter', label: 'Meter', labelAr: 'متر' },
  { value: 'liter', label: 'Liter', labelAr: 'لتر' }
];

// Helper functions
export const getItemsByCategory = (category) => {
  return scrapItems.filter(item => item.category === category);
};

export const getItemById = (id) => {
  return scrapItems.find(item => item.id === id);
};

export const getCategoryInfo = (category) => {
  return scrapCategories[category];
};

export const searchItems = (query) => {
  const lowercaseQuery = query.toLowerCase();
  return scrapItems.filter(item => 
    item.name.toLowerCase().includes(lowercaseQuery) ||
    item.nameAr.includes(query) ||
    item.description.toLowerCase().includes(lowercaseQuery) ||
    item.descriptionAr.includes(query)
  );
};

export default {
  scrapCategories,
  scrapItems,
  units,
  getItemsByCategory,
  getItemById,
  getCategoryInfo,
  searchItems
};
