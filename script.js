// Modern JavaScript for NK Website
'use strict';

// Application State
const app = {
    state: {
        isLoading: true,
        scrollY: 0,
        accessibility: {
            highContrast: false,
            largeFont: false,
            optionsVisible: false,
            toolbarHidden: false
        },
        navigation: {
            isOpen: false
        }
    },

    elements: {},

    init() {
        this.cacheElements();
        this.bindEvents();
        this.initializeComponents();
        this.handlePageLoad();
    },

    cacheElements() {
        this.elements = {
            loadingScreen: document.getElementById('loading-screen'),
            header: document.querySelector('.header'),
            navToggle: document.getElementById('nav-toggle'),
            navMenu: document.getElementById('nav-menu'),
            navLinks: document.querySelectorAll('.nav-link'),
            accessibilityToolbar: document.getElementById('accessibility-toolbar'),
            accessibilityToggle: document.getElementById('accessibility-toggle'),
            accessibilityOptions: document.getElementById('accessibility-options'),
            accessibilityHideBtn: document.getElementById('accessibility-hide-btn'),
            fontSizeBtn: document.getElementById('font-size-btn'),
            contrastBtn: document.getElementById('contrast-btn'),
            backToTop: document.getElementById('back-to-top'),
            scrollIndicator: document.querySelector('.scroll-indicator'),
            body: document.body,
            html: document.documentElement
        };
    },

    bindEvents() {
        window.addEventListener('load', () => this.handlePageLoad());
        window.addEventListener('scroll', () => this.handleScroll());
        window.addEventListener('resize', () => this.handleResize());

        if (this.elements.navToggle) {
            this.elements.navToggle.addEventListener('click', () => this.toggleMobileNav());
        }

        this.elements.navLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMobileNav());
        });

        if (this.elements.accessibilityToggle) {
            this.elements.accessibilityToggle.addEventListener('click', () => this.toggleAccessibilityOptions());
        }

        if (this.elements.fontSizeBtn) {
            this.elements.fontSizeBtn.addEventListener('click', () => this.toggleFontSize());
        }

        if (this.elements.contrastBtn) {
            this.elements.contrastBtn.addEventListener('click', () => this.toggleContrast());
        }

        if (this.elements.accessibilityHideBtn) {
            this.elements.accessibilityHideBtn.addEventListener('click', () => this.hideAccessibilityToolbar());
        }

        if (this.elements.backToTop) {
            this.elements.backToTop.addEventListener('click', () => this.scrollToTop());
        }

        if (this.elements.scrollIndicator) {
            this.elements.scrollIndicator.addEventListener('click', () => this.scrollToContent());
        }

        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
        document.addEventListener('click', (e) => this.handleOutsideClick(e));
    },

    initializeComponents() {
        this.loadAccessibilitySettings();
        this.updateActiveNavLink();
        this.initializeJobCards();
        this.checkAccessibilityToolbarVisibility();
    },

    handlePageLoad() {
        setTimeout(() => {
            if (this.elements.loadingScreen) {
                this.elements.loadingScreen.classList.add('hide');
                setTimeout(() => {
                    this.elements.loadingScreen.style.display = 'none';
                    this.state.isLoading = false;
                }, 300);
            }
        }, 1000);
        this.handleScroll();
    },

    handleScroll() {
        const scrollY = window.pageYOffset;
        this.state.scrollY = scrollY;

        if (this.elements.header) {
            if (scrollY > 100) {
                this.elements.header.classList.add('scrolled');
            } else {
                this.elements.header.classList.remove('scrolled');
            }
        }

        if (this.elements.backToTop) {
            if (scrollY > 300) {
                this.elements.backToTop.classList.add('show');
            } else {
                this.elements.backToTop.classList.remove('show');
            }
        }
    },

    handleResize() {
        if (window.innerWidth > 768 && this.state.navigation.isOpen) {
            this.closeMobileNav();
        }
    },

    handleKeyboard(e) {
        if (e.key === 'Escape') {
            this.closeMobileNav();
            this.closeAccessibilityOptions();
        }
    },

    handleOutsideClick(e) {
        if (this.state.accessibility.optionsVisible && 
            !e.target.closest('.accessibility-toolbar')) {
            this.closeAccessibilityOptions();
        }

        if (this.state.navigation.isOpen && 
            !e.target.closest('.nav-menu') && 
            !e.target.closest('.nav-toggle')) {
            this.closeMobileNav();
        }
    },

    toggleMobileNav() {
        this.state.navigation.isOpen = !this.state.navigation.isOpen;
        
        if (this.elements.navMenu && this.elements.navToggle) {
            this.elements.navMenu.classList.toggle('active');
            this.elements.navToggle.classList.toggle('active');
            this.elements.body.style.overflow = this.state.navigation.isOpen ? 'hidden' : '';
        }
    },

    closeMobileNav() {
        this.state.navigation.isOpen = false;
        
        if (this.elements.navMenu && this.elements.navToggle) {
            this.elements.navMenu.classList.remove('active');
            this.elements.navToggle.classList.remove('active');
            this.elements.body.style.overflow = '';
        }
    },

    updateActiveNavLink() {
        // Update active navigation state
        this.elements.navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href && window.location.pathname.includes(href.replace('.html', ''))) {
                link.classList.add('active');
            }
        });
    },

    toggleAccessibilityOptions() {
        this.state.accessibility.optionsVisible = !this.state.accessibility.optionsVisible;
        
        if (this.elements.accessibilityOptions) {
            if (this.state.accessibility.optionsVisible) {
                this.elements.accessibilityOptions.classList.add('show');
            } else {
                this.elements.accessibilityOptions.classList.remove('show');
            }
        }
    },

    closeAccessibilityOptions() {
        this.state.accessibility.optionsVisible = false;
        if (this.elements.accessibilityOptions) {
            this.elements.accessibilityOptions.classList.remove('show');
        }
    },

    toggleFontSize() {
        this.state.accessibility.largeFont = !this.state.accessibility.largeFont;
        
        if (this.state.accessibility.largeFont) {
            this.elements.body.classList.add('large-font');
            if (this.elements.fontSizeBtn) {
                this.elements.fontSizeBtn.style.background = 'var(--primary-color)';
                this.elements.fontSizeBtn.style.color = 'white';
            }
        } else {
            this.elements.body.classList.remove('large-font');
            if (this.elements.fontSizeBtn) {
                this.elements.fontSizeBtn.style.background = '';
                this.elements.fontSizeBtn.style.color = '';
            }
        }
        
        this.saveAccessibilitySettings();
    },

    toggleContrast() {
        this.state.accessibility.highContrast = !this.state.accessibility.highContrast;
        
        if (this.state.accessibility.highContrast) {
            this.elements.body.classList.add('high-contrast');
            if (this.elements.contrastBtn) {
                this.elements.contrastBtn.style.background = 'var(--primary-color)';
                this.elements.contrastBtn.style.color = 'white';
            }
        } else {
            this.elements.body.classList.remove('high-contrast');
            if (this.elements.contrastBtn) {
                this.elements.contrastBtn.style.background = '';
                this.elements.contrastBtn.style.color = '';
            }
        }
        
        this.saveAccessibilitySettings();
    },

    hideAccessibilityToolbar() {
        this.state.accessibility.toolbarHidden = true;
        if (this.elements.accessibilityToolbar) {
            this.elements.accessibilityToolbar.classList.add('hidden');
        }
        this.saveAccessibilitySettings();
    },

    checkAccessibilityToolbarVisibility() {
        if (this.state.accessibility.toolbarHidden && this.elements.accessibilityToolbar) {
            this.elements.accessibilityToolbar.classList.add('hidden');
        }
    },

    saveAccessibilitySettings() {
        // Save all accessibility settings except toolbarHidden (only for current session)
        const settingsToSave = {
            highContrast: this.state.accessibility.highContrast,
            largeFont: this.state.accessibility.largeFont,
            optionsVisible: false  // Never persist this
        };
        localStorage.setItem('nk-accessibility', JSON.stringify(settingsToSave));
    },

    loadAccessibilitySettings() {
        try {
            const saved = localStorage.getItem('nk-accessibility');
            if (saved) {
                const settings = JSON.parse(saved);
                
                if (settings.largeFont) {
                    this.state.accessibility.largeFont = true;
                    this.elements.body.classList.add('large-font');
                    if (this.elements.fontSizeBtn) {
                        this.elements.fontSizeBtn.style.background = 'var(--primary-color)';
                        this.elements.fontSizeBtn.style.color = 'white';
                    }
                }
                
                if (settings.highContrast) {
                    this.state.accessibility.highContrast = true;
                    this.elements.body.classList.add('high-contrast');
                    if (this.elements.contrastBtn) {
                        this.elements.contrastBtn.style.background = 'var(--primary-color)';
                        this.elements.contrastBtn.style.color = 'white';
                    }
                }
            }
        } catch (error) {
            console.warn('Failed to load accessibility settings:', error);
        }
    },

    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    },

    scrollToContent() {
        const servicesSection = document.getElementById('services') || document.querySelector('.services');
        if (servicesSection) {
            servicesSection.scrollIntoView({ behavior: 'smooth' });
        }
    },

    // Initialize job cards functionality
    initializeJobCards() {
        const showMoreButtons = document.querySelectorAll('.show-more-btn');
        
        showMoreButtons.forEach(button => {
            button.addEventListener('click', function() {
                const jobText = this.parentElement;
                const fullText = jobText.querySelector('.job-text-full');
                
                if (fullText.style.display === 'none' || fullText.style.display === '') {
                    fullText.style.display = 'block';
                    this.textContent = 'הצג פחות';
                } else {
                    fullText.style.display = 'none';
                    this.textContent = 'הצג עוד';
                }
            });
        });
    }
};

// Initialize the application
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        app.init();
    });
} else {
    app.init();
}
