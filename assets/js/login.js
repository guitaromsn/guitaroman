// ===== LOGIN MODULE =====
class LoginModule {
    constructor() {
        this.currentLanguage = 'en';
        this.translations = {
            en: {
                'Amanat Al-Kalima ERP': 'Amanat Al-Kalima ERP',
                'Premium Enterprise Resource Planning': 'Premium Enterprise Resource Planning',
                'Email or Username': 'Email or Username',
                'Password': 'Password',
                'Remember me': 'Remember me',
                'Forgot password?': 'Forgot password?',
                'Sign In': 'Sign In',
                'Default Currency:': 'Default Currency:',
                'Version 1.0.0': 'Version 1.0.0',
                'Enter your email or username': 'Enter your email or username',
                'Enter your password': 'Enter your password',
                'العربية': 'العربية',
                'Please enter your email or username': 'Please enter your email or username',
                'Please enter your password': 'Please enter your password',
                'Please enter a valid email address': 'Please enter a valid email address',
                'Signing in...': 'Signing in...',
                'Invalid credentials. Please try again.': 'Invalid credentials. Please try again.',
                'An error occurred. Please try again later.': 'An error occurred. Please try again later.',
                'Login successful! Redirecting...': 'Login successful! Redirecting...'
            },
            ar: {
                'Amanat Al-Kalima ERP': 'أمانة الكلمة للموارد المؤسسية',
                'Premium Enterprise Resource Planning': 'نظام تخطيط الموارد المؤسسية المتميز',
                'Email or Username': 'البريد الإلكتروني أو اسم المستخدم',
                'Password': 'كلمة المرور',
                'Remember me': 'تذكرني',
                'Forgot password?': 'نسيت كلمة المرور؟',
                'Sign In': 'تسجيل الدخول',
                'Default Currency:': 'العملة الافتراضية:',
                'Version 1.0.0': 'الإصدار 1.0.0',
                'Enter your email or username': 'أدخل بريدك الإلكتروني أو اسم المستخدم',
                'Enter your password': 'أدخل كلمة المرور',
                'العربية': 'English',
                'Please enter your email or username': 'يرجى إدخال بريدك الإلكتروني أو اسم المستخدم',
                'Please enter your password': 'يرجى إدخال كلمة المرور',
                'Please enter a valid email address': 'يرجى إدخال عنوان بريد إلكتروني صحيح',
                'Signing in...': 'جاري تسجيل الدخول...',
                'Invalid credentials. Please try again.': 'بيانات الاعتماد غير صحيحة. يرجى المحاولة مرة أخرى.',
                'An error occurred. Please try again later.': 'حدث خطأ. يرجى المحاولة مرة أخرى لاحقاً.',
                'Login successful! Redirecting...': 'تم تسجيل الدخول بنجاح! جاري التوجيه...'
            }
        };
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadSavedPreferences();
        this.createPlaceholderLogo();
    }

    bindEvents() {
        // Language toggle
        const langToggle = document.getElementById('lang-toggle');
        if (langToggle) {
            langToggle.addEventListener('click', () => this.toggleLanguage());
        }

        // Form submission
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
        }

        // Password toggle
        const passwordToggle = document.getElementById('password-toggle');
        if (passwordToggle) {
            passwordToggle.addEventListener('click', () => this.togglePasswordVisibility());
        }

        // Real-time validation
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        
        if (emailInput) {
            emailInput.addEventListener('blur', () => this.validateEmail());
            emailInput.addEventListener('input', () => this.clearFieldError('email'));
        }

        if (passwordInput) {
            passwordInput.addEventListener('blur', () => this.validatePassword());
            passwordInput.addEventListener('input', () => this.clearFieldError('password'));
        }

        // Enhanced keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyboardNavigation(e));
    }

    toggleLanguage() {
        this.currentLanguage = this.currentLanguage === 'en' ? 'ar' : 'en';
        this.updateLanguage();
        this.savePreferences();
    }

    updateLanguage() {
        const html = document.documentElement;
        const body = document.body;
        
        // Update direction
        html.setAttribute('dir', this.currentLanguage === 'ar' ? 'rtl' : 'ltr');
        html.setAttribute('lang', this.currentLanguage);
        
        // Update all translatable elements
        const translatableElements = document.querySelectorAll('[data-en], [data-ar]');
        translatableElements.forEach(element => {
            const key = element.getAttribute(`data-${this.currentLanguage}`);
            if (key) {
                element.textContent = key;
            }
        });

        // Update placeholders
        const inputElements = document.querySelectorAll('[data-placeholder-en], [data-placeholder-ar]');
        inputElements.forEach(element => {
            const placeholder = element.getAttribute(`data-placeholder-${this.currentLanguage}`);
            if (placeholder) {
                element.setAttribute('placeholder', placeholder);
            }
        });

        // Update language toggle button
        const langToggle = document.getElementById('lang-toggle');
        if (langToggle) {
            const langText = langToggle.querySelector('.lang-text');
            if (langText) {
                langText.textContent = this.translations[this.currentLanguage]['العربية'];
            }
        }

        // Apply RTL styles if needed
        this.applyRTLStyles();
    }

    applyRTLStyles() {
        const rtlStyles = document.getElementById('rtl-styles');
        if (this.currentLanguage === 'ar') {
            rtlStyles.innerHTML = `
                * { font-family: 'Cairo', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif !important; }
                .company-name { font-size: 1.5rem; }
            `;
        } else {
            rtlStyles.innerHTML = '';
        }
    }

    validateEmail() {
        const emailInput = document.getElementById('email');
        const emailError = document.getElementById('email-error');
        const value = emailInput.value.trim();

        if (!value) {
            this.showFieldError('email', this.translations[this.currentLanguage]['Please enter your email or username']);
            return false;
        }

        // Basic email validation if it looks like an email
        if (value.includes('@')) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                this.showFieldError('email', this.translations[this.currentLanguage]['Please enter a valid email address']);
                return false;
            }
        }

        this.clearFieldError('email');
        return true;
    }

    validatePassword() {
        const passwordInput = document.getElementById('password');
        const value = passwordInput.value;

        if (!value) {
            this.showFieldError('password', this.translations[this.currentLanguage]['Please enter your password']);
            return false;
        }

        this.clearFieldError('password');
        return true;
    }

    showFieldError(fieldName, message) {
        const input = document.getElementById(fieldName);
        const error = document.getElementById(`${fieldName}-error`);
        
        if (input) {
            input.classList.add('error');
        }
        
        if (error) {
            error.textContent = message;
            error.classList.add('visible');
        }
    }

    clearFieldError(fieldName) {
        const input = document.getElementById(fieldName);
        const error = document.getElementById(`${fieldName}-error`);
        
        if (input) {
            input.classList.remove('error');
        }
        
        if (error) {
            error.classList.remove('visible');
            error.textContent = '';
        }
    }

    togglePasswordVisibility() {
        const passwordInput = document.getElementById('password');
        const eyeOpen = document.querySelector('.eye-open');
        const eyeClosed = document.querySelector('.eye-closed');
        
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            eyeOpen.style.display = 'none';
            eyeClosed.style.display = 'block';
        } else {
            passwordInput.type = 'password';
            eyeOpen.style.display = 'block';
            eyeClosed.style.display = 'none';
        }
    }

    async handleFormSubmit(e) {
        e.preventDefault();
        
        // Clear any existing messages
        this.hideFormMessage();
        
        // Validate form
        const isEmailValid = this.validateEmail();
        const isPasswordValid = this.validatePassword();
        
        if (!isEmailValid || !isPasswordValid) {
            return;
        }

        // Get form data
        const formData = new FormData(e.target);
        const loginData = {
            email: formData.get('email').trim(),
            password: formData.get('password'),
            remember: formData.get('remember') === 'on'
        };

        // Show loading state
        this.setLoadingState(true);

        try {
            // Simulate API call - Replace with actual authentication
            const result = await this.authenticateUser(loginData);
            
            if (result.success) {
                this.showFormMessage('success', this.translations[this.currentLanguage]['Login successful! Redirecting...']);
                
                // Save remember me preference
                if (loginData.remember) {
                    this.saveUserPreferences(loginData.email);
                }
                
                // Redirect after delay
                setTimeout(() => {
                    this.redirectToDashboard();
                }, 1500);
            } else {
                this.showFormMessage('error', result.message || this.translations[this.currentLanguage]['Invalid credentials. Please try again.']);
            }
        } catch (error) {
            console.error('Login error:', error);
            this.showFormMessage('error', this.translations[this.currentLanguage]['An error occurred. Please try again later.']);
        } finally {
            this.setLoadingState(false);
        }
    }

    async authenticateUser(loginData) {
        // Simulate API call with delay
        return new Promise((resolve) => {
            setTimeout(() => {
                // Demo authentication - replace with real API call
                if (loginData.email === 'admin@amanat.com' && loginData.password === 'admin123') {
                    resolve({ success: true, user: { name: 'Admin User' } });
                } else {
                    resolve({ success: false, message: this.translations[this.currentLanguage]['Invalid credentials. Please try again.'] });
                }
            }, 2000);
        });
    }

    setLoadingState(isLoading) {
        const loginBtn = document.getElementById('login-btn');
        const btnText = loginBtn.querySelector('.btn-text');
        const btnLoading = loginBtn.querySelector('.btn-loading');
        
        if (isLoading) {
            loginBtn.disabled = true;
            btnText.style.display = 'none';
            btnLoading.style.display = 'block';
            btnText.textContent = this.translations[this.currentLanguage]['Signing in...'];
        } else {
            loginBtn.disabled = false;
            btnText.style.display = 'block';
            btnLoading.style.display = 'none';
            btnText.textContent = this.translations[this.currentLanguage]['Sign In'];
        }
    }

    showFormMessage(type, message) {
        const formMessage = document.getElementById('form-message');
        if (formMessage) {
            formMessage.textContent = message;
            formMessage.className = `form-message ${type}`;
            formMessage.style.display = 'block';
            
            // Smooth scroll to message if needed
            formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }

    hideFormMessage() {
        const formMessage = document.getElementById('form-message');
        if (formMessage) {
            formMessage.style.display = 'none';
            formMessage.className = 'form-message';
        }
    }

    handleKeyboardNavigation(e) {
        // Enter key handling for better UX
        if (e.key === 'Enter') {
            const activeElement = document.activeElement;
            
            if (activeElement.id === 'email') {
                document.getElementById('password').focus();
                e.preventDefault();
            }
        }
        
        // Escape key to clear messages
        if (e.key === 'Escape') {
            this.hideFormMessage();
        }
    }

    createPlaceholderLogo() {
        // Create a placeholder logo if image is not available
        const logo = document.getElementById('company-logo');
        if (logo) {
            logo.onerror = () => {
                // Create SVG placeholder
                const svgPlaceholder = `
                    <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="50" height="50" rx="8" fill="white"/>
                        <path d="M25 12L35 20V35L25 43L15 35V20L25 12Z" fill="#D2691E"/>
                        <circle cx="25" cy="25" r="8" fill="white"/>
                        <text x="25" y="29" text-anchor="middle" fill="#D2691E" font-size="8" font-weight="bold">AK</text>
                    </svg>
                `;
                
                logo.style.display = 'none';
                logo.parentElement.innerHTML = svgPlaceholder;
            };
        }
    }

    savePreferences() {
        const preferences = {
            language: this.currentLanguage
        };
        localStorage.setItem('amanat_preferences', JSON.stringify(preferences));
    }

    saveUserPreferences(email) {
        const userPrefs = {
            rememberedEmail: email,
            timestamp: Date.now()
        };
        localStorage.setItem('amanat_user_prefs', JSON.stringify(userPrefs));
    }

    loadSavedPreferences() {
        try {
            // Load language preference
            const preferences = JSON.parse(localStorage.getItem('amanat_preferences'));
            if (preferences && preferences.language) {
                this.currentLanguage = preferences.language;
                this.updateLanguage();
            }

            // Load remembered user
            const userPrefs = JSON.parse(localStorage.getItem('amanat_user_prefs'));
            if (userPrefs && userPrefs.rememberedEmail) {
                // Check if preference is not too old (30 days)
                const daysPassed = (Date.now() - userPrefs.timestamp) / (1000 * 60 * 60 * 24);
                if (daysPassed < 30) {
                    const emailInput = document.getElementById('email');
                    const rememberCheckbox = document.getElementById('remember');
                    
                    if (emailInput) {
                        emailInput.value = userPrefs.rememberedEmail;
                    }
                    if (rememberCheckbox) {
                        rememberCheckbox.checked = true;
                    }
                }
            }
        } catch (error) {
            console.warn('Could not load saved preferences:', error);
        }
    }

    redirectToDashboard() {
        // Replace with actual dashboard URL
        window.location.href = 'dashboard.html';
    }
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    // Initialize login module
    window.loginModule = new LoginModule();
    
    // Add smooth loading animation
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// ===== UTILITY FUNCTIONS =====
function debounce(func, wait) {
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

// Export for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LoginModule;
}