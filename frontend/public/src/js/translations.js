// Translation System for Amanat Al-Kalima ERP
const translations = {
    en: {
        app: {
            title: "Amanat Al-Kalima ERP"
        },
        company: {
            name: "Amanat Al-Kalima"
        },
        nav: {
            dashboard: "Dashboard",
            sales: "Sales",
            inventory: "Inventory",
            customers: "Customers",
            reports: "Reports",
            settings: "Settings"
        },
        dashboard: {
            title: "Dashboard"
        },
        user: {
            welcome: "Welcome, Admin"
        },
        stats: {
            revenue: "Total Revenue",
            orders: "Orders",
            customers: "Customers",
            products: "Products"
        },
        charts: {
            sales: "Sales Overview",
            revenue: "Revenue Trends"
        },
        activity: {
            title: "Recent Activity",
            new_order: "New order #1234 created",
            new_customer: "New customer registered",
            order_completed: "Order #1230 completed"
        }
    },
    ar: {
        app: {
            title: "نظام أمانة الكلمة للموارد"
        },
        company: {
            name: "أمانة الكلمة"
        },
        nav: {
            dashboard: "لوحة التحكم",
            sales: "المبيعات",
            inventory: "المخزون",
            customers: "العملاء",
            reports: "التقارير",
            settings: "الإعدادات"
        },
        dashboard: {
            title: "لوحة التحكم"
        },
        user: {
            welcome: "مرحباً، المدير"
        },
        stats: {
            revenue: "إجمالي الإيرادات",
            orders: "الطلبات",
            customers: "العملاء",
            products: "المنتجات"
        },
        charts: {
            sales: "نظرة عامة على المبيعات",
            revenue: "اتجاهات الإيرادات"
        },
        activity: {
            title: "النشاط الأخير",
            new_order: "تم إنشاء طلب جديد #1234",
            new_customer: "تم تسجيل عميل جديد",
            order_completed: "تم إكمال الطلب #1230"
        }
    }
};

// Translation Manager
class TranslationManager {
    constructor() {
        this.currentLanguage = 'en'; // Default to English
        this.init();
    }

    init() {
        // Load saved language preference or default to English
        const savedLang = localStorage.getItem('erp-language') || 'en';
        this.setLanguage(savedLang);
        
        // Set up language switcher event listeners
        this.setupLanguageSwitcher();
    }

    setupLanguageSwitcher() {
        const langButtons = document.querySelectorAll('.lang-btn');
        langButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const lang = e.target.getAttribute('data-lang');
                this.setLanguage(lang);
            });
        });
    }

    setLanguage(lang) {
        if (!translations[lang]) {
            console.warn(`Translation for language ${lang} not found`);
            return;
        }

        this.currentLanguage = lang;
        
        // Update HTML lang and dir attributes
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        
        // Update language switcher buttons
        this.updateLanguageSwitcher();
        
        // Update all translated elements
        this.updateTranslations();
        
        // Save language preference
        localStorage.setItem('erp-language', lang);
    }

    updateLanguageSwitcher() {
        const langButtons = document.querySelectorAll('.lang-btn');
        langButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-lang') === this.currentLanguage) {
                btn.classList.add('active');
            }
        });
    }

    updateTranslations() {
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.getTranslation(key);
            if (translation) {
                element.textContent = translation;
            }
        });

        // Update document title
        const titleKey = document.querySelector('title').getAttribute('data-i18n');
        if (titleKey) {
            document.title = this.getTranslation(titleKey);
        }
    }

    getTranslation(key) {
        const keys = key.split('.');
        let translation = translations[this.currentLanguage];
        
        for (const k of keys) {
            if (translation && translation[k]) {
                translation = translation[k];
            } else {
                // Fallback to English if translation not found
                translation = translations['en'];
                for (const fallbackKey of keys) {
                    if (translation && translation[fallbackKey]) {
                        translation = translation[fallbackKey];
                    } else {
                        return key; // Return key if no translation found
                    }
                }
                break;
            }
        }
        
        return translation;
    }

    // Method to add new translations dynamically
    addTranslations(lang, newTranslations) {
        if (!translations[lang]) {
            translations[lang] = {};
        }
        
        // Deep merge function
        const deepMerge = (target, source) => {
            for (const key in source) {
                if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
                    if (!target[key]) target[key] = {};
                    deepMerge(target[key], source[key]);
                } else {
                    target[key] = source[key];
                }
            }
        };
        
        deepMerge(translations[lang], newTranslations);
    }

    // Method to get current language
    getCurrentLanguage() {
        return this.currentLanguage;
    }

    // Method to check if language is RTL
    isRTL() {
        return this.currentLanguage === 'ar';
    }
}

// Initialize translation manager when DOM is loaded
let translationManager;

document.addEventListener('DOMContentLoaded', () => {
    translationManager = new TranslationManager();
});

// Export for use in other scripts
window.TranslationManager = TranslationManager;
window.translations = translations;