// Main JavaScript for Amanat Al-Kalima ERP

class ERPApplication {
    constructor() {
        this.isMobile = window.innerWidth <= 768;
        this.sidebarOpen = !this.isMobile;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupResponsiveHandling();
        this.initializeComponents();
        this.handleInitialLoad();
    }

    setupEventListeners() {
        // Sidebar toggle
        const sidebarToggle = document.getElementById('sidebar-toggle');
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', () => {
                this.toggleSidebar();
            });
        }

        // Navigation links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleNavigation(e.target.closest('.nav-link'));
            });
        });

        // Close sidebar on mobile when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isMobile && this.sidebarOpen) {
                const sidebar = document.getElementById('sidebar');
                const sidebarToggle = document.getElementById('sidebar-toggle');
                
                if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
                    this.closeSidebar();
                }
            }
        });

        // Language switcher events
        this.setupLanguageEvents();
    }

    setupLanguageEvents() {
        // Listen for language changes to update UI
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('lang-btn')) {
                setTimeout(() => {
                    // Dispatch custom event for other components
                    document.dispatchEvent(new CustomEvent('languageChanged', {
                        detail: { language: e.target.getAttribute('data-lang') }
                    }));
                    
                    // Update charts and other components
                    this.updateUIForLanguageChange();
                }, 100);
            }
        });
    }

    setupResponsiveHandling() {
        window.addEventListener('resize', () => {
            const wasMobile = this.isMobile;
            this.isMobile = window.innerWidth <= 768;
            
            // Handle transition between mobile and desktop
            if (wasMobile !== this.isMobile) {
                if (this.isMobile) {
                    this.closeSidebar();
                } else {
                    this.openSidebar();
                }
            }
        });
    }

    initializeComponents() {
        // Initialize stat cards animation
        this.animateStatCards();
        
        // Initialize activity items animation
        this.animateActivityItems();
        
        // Set up tooltips (if needed)
        this.setupTooltips();
    }

    handleInitialLoad() {
        // Add fade-in animation to main content
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
            mainContent.classList.add('fade-in');
        }

        // Update initial UI state
        this.updateSidebarState();
    }

    toggleSidebar() {
        if (this.sidebarOpen) {
            this.closeSidebar();
        } else {
            this.openSidebar();
        }
    }

    openSidebar() {
        const sidebar = document.getElementById('sidebar');
        if (sidebar) {
            sidebar.classList.add('mobile-open');
            this.sidebarOpen = true;
            this.updateSidebarState();
        }
    }

    closeSidebar() {
        const sidebar = document.getElementById('sidebar');
        if (sidebar) {
            sidebar.classList.remove('mobile-open');
            this.sidebarOpen = false;
            this.updateSidebarState();
        }
    }

    updateSidebarState() {
        const mainContent = document.getElementById('main-content');
        if (mainContent && !this.isMobile) {
            mainContent.style.marginLeft = this.sidebarOpen ? 'var(--sidebar-width)' : '0';
        }
    }

    handleNavigation(linkElement) {
        // Remove active class from all nav items
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });

        // Add active class to clicked nav item
        const navItem = linkElement.closest('.nav-item');
        if (navItem) {
            navItem.classList.add('active');
        }

        // Update page title based on navigation
        const pageTitle = document.querySelector('.page-title');
        const linkText = linkElement.querySelector('span').textContent;
        if (pageTitle) {
            pageTitle.textContent = linkText;
        }

        // Close sidebar on mobile after navigation
        if (this.isMobile) {
            this.closeSidebar();
        }

        // Here you would typically load the appropriate content
        // For now, we'll just show a placeholder
        this.loadPageContent(linkElement.getAttribute('href'));
    }

    loadPageContent(page) {
        // Placeholder for content loading
        console.log(`Loading content for: ${page}`);
        
        // In a real application, you would:
        // 1. Fetch content via AJAX
        // 2. Update the main content area
        // 3. Handle routing
        // 4. Update browser history
    }

    animateStatCards() {
        const statCards = document.querySelectorAll('.stat-card');
        statCards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 100);
            }, index * 100);
        });
    }

    animateActivityItems() {
        const activityItems = document.querySelectorAll('.activity-item');
        activityItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.opacity = '0';
                item.style.transform = 'translateX(-20px)';
                item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateX(0)';
                }, 50);
            }, index * 150 + 500); // Start after stat cards
        });
    }

    setupTooltips() {
        // Simple tooltip implementation
        const elementsWithTooltips = document.querySelectorAll('[title]');
        elementsWithTooltips.forEach(element => {
            element.addEventListener('mouseenter', (e) => {
                this.showTooltip(e.target, e.target.getAttribute('title'));
            });
            
            element.addEventListener('mouseleave', () => {
                this.hideTooltip();
            });
        });
    }

    showTooltip(element, text) {
        // Create tooltip element if it doesn't exist
        let tooltip = document.getElementById('custom-tooltip');
        if (!tooltip) {
            tooltip = document.createElement('div');
            tooltip.id = 'custom-tooltip';
            tooltip.style.cssText = `
                position: absolute;
                background: var(--bg-tertiary);
                color: var(--text-primary);
                padding: 8px 12px;
                border-radius: 6px;
                font-size: 12px;
                z-index: 10000;
                pointer-events: none;
                opacity: 0;
                transition: opacity 0.2s ease;
                border: 1px solid var(--border-color);
            `;
            document.body.appendChild(tooltip);
        }

        tooltip.textContent = text;
        tooltip.style.opacity = '1';

        // Position tooltip
        const rect = element.getBoundingClientRect();
        tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
        tooltip.style.top = rect.top - tooltip.offsetHeight - 8 + 'px';
    }

    hideTooltip() {
        const tooltip = document.getElementById('custom-tooltip');
        if (tooltip) {
            tooltip.style.opacity = '0';
        }
    }

    updateUIForLanguageChange() {
        // Update any dynamic content that needs language-specific formatting
        this.updateTimeFormats();
        this.updateNumberFormats();
    }

    updateTimeFormats() {
        // Update time formatting based on current language
        const timeElements = document.querySelectorAll('.activity-time');
        timeElements.forEach(element => {
            // This would update time formatting based on locale
            // For now, keeping English format
        });
    }

    updateNumberFormats() {
        // Update number formatting based on current language
        const numberElements = document.querySelectorAll('.stat-value');
        numberElements.forEach(element => {
            // This would update number formatting based on locale
            // For now, keeping standard format
        });
    }

    // Method to refresh dashboard data
    refreshDashboard() {
        // This would fetch fresh data from the server
        console.log('Refreshing dashboard data...');
        
        // Animate refresh
        const statsGrid = document.querySelector('.stats-grid');
        if (statsGrid) {
            statsGrid.style.opacity = '0.6';
            setTimeout(() => {
                statsGrid.style.opacity = '1';
            }, 500);
        }
    }

    // Method to handle real-time updates
    handleRealTimeUpdate(data) {
        // This would handle real-time data updates
        console.log('Received real-time update:', data);
    }
}

// Utility functions
const Utils = {
    // Format currency
    formatCurrency(amount, currency = 'USD') {
        const isArabic = translationManager && translationManager.isRTL();
        const locale = isArabic ? 'ar-SA' : 'en-US';
        
        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: currency
        }).format(amount);
    },

    // Format numbers
    formatNumber(number) {
        const isArabic = translationManager && translationManager.isRTL();
        const locale = isArabic ? 'ar-SA' : 'en-US';
        
        return new Intl.NumberFormat(locale).format(number);
    },

    // Format dates
    formatDate(date) {
        const isArabic = translationManager && translationManager.isRTL();
        const locale = isArabic ? 'ar-SA' : 'en-US';
        
        return new Intl.DateTimeFormat(locale, {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        }).format(new Date(date));
    },

    // Debounce function
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
};

// Initialize application
let erpApp;

document.addEventListener('DOMContentLoaded', () => {
    erpApp = new ERPApplication();
});

// Global error handler
window.addEventListener('error', (e) => {
    console.error('ERP Application Error:', e.error);
});

// Export for use in other scripts
window.ERPApplication = ERPApplication;
window.Utils = Utils;