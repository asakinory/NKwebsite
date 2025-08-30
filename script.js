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
            },
            jobs: {
                data: null,
                filteredJobs: [],
                currentFilter: 'all',
                searchTerm: ''
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
        
        // Only load jobs data if we're on the jobs page
        if (window.location.pathname.includes('jobs.html') || document.getElementById('jobs-grid')) {
            this.loadJobsData();
        }
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
            // Ensure accessibility toolbar remains visible
            if (this.elements.accessibilityToolbar) {
                this.elements.accessibilityToolbar.style.opacity = '1';
                this.elements.accessibilityToolbar.style.visibility = 'visible';
                this.elements.accessibilityToolbar.style.zIndex = '9999';
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
            console.log('Loading accessibility settings:', saved); // Debug log
            if (saved) {
                const settings = JSON.parse(saved);
                
                if (settings.largeFont) {
                    this.state.accessibility.largeFont = true;
                    this.elements.body.classList.add('large-font');
                    if (this.elements.fontSizeBtn) {
                        this.elements.fontSizeBtn.style.background = 'var(--primary-color)';
                        this.elements.fontSizeBtn.style.color = 'white';
                    }
                    console.log('Large font enabled from storage');
                }
                
                if (settings.highContrast) {
                    this.state.accessibility.highContrast = true;
                    this.elements.body.classList.add('high-contrast');
                    if (this.elements.contrastBtn) {
                        this.elements.contrastBtn.style.background = 'var(--primary-color)';
                        this.elements.contrastBtn.style.color = 'white';
                    }
                    // Ensure accessibility toolbar remains visible when loading from storage
                    if (this.elements.accessibilityToolbar) {
                        this.elements.accessibilityToolbar.style.opacity = '1';
                        this.elements.accessibilityToolbar.style.visibility = 'visible';
                        this.elements.accessibilityToolbar.style.zIndex = '9999';
                    }
                    console.log('High contrast enabled from storage');
                }
            } else {
                console.log('No accessibility settings found in storage');
            }
        } catch (error) {
            console.warn('Failed to load accessibility settings:', error);
        }
    },

    // Method to reset accessibility settings (for debugging)
    resetAccessibilitySettings() {
        localStorage.removeItem('nk-accessibility');
        this.state.accessibility.highContrast = false;
        this.state.accessibility.largeFont = false;
        this.elements.body.classList.remove('high-contrast', 'large-font');
        
        if (this.elements.contrastBtn) {
            this.elements.contrastBtn.style.background = '';
            this.elements.contrastBtn.style.color = '';
        }
        if (this.elements.fontSizeBtn) {
            this.elements.fontSizeBtn.style.background = '';
            this.elements.fontSizeBtn.style.color = '';
        }
        console.log('Accessibility settings reset');
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
    },

    // Load jobs data from JSON file
    async loadJobsData() {
        try {
            console.log('Loading jobs data...');
            const response = await fetch('jobs.json');
            console.log('Fetch response:', response.status, response.statusText);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const jsonData = await response.json();
            console.log('JSON loaded successfully:', jsonData);
            
            this.state.jobs.data = jsonData;
            this.state.jobs.filteredJobs = [...this.state.jobs.data.jobs];
            
            console.log('Rendering components...');
            this.renderFilterTags();
            this.renderJobs();
            this.renderExternalLinks();
            this.setupJobsEventListeners();
            this.updateJobsCount();
            console.log('Jobs loading completed successfully');
            
        } catch (error) {
            console.error('Failed to load jobs data:', error);
            
            // If fetch fails (e.g., due to CORS when opening file directly), 
            // try to provide fallback static data or show a helpful message
            if (error.message.includes('fetch') || error.message.includes('CORS')) {
                console.log('Fetch failed, likely due to CORS. Showing instructions for proper viewing.');
                this.showCorsError();
            } else {
                this.showJobsError();
            }
        }
    },

    // Render filter tags
    renderFilterTags() {
        console.log('Rendering filter tags...');
        const filterTagsContainer = document.getElementById('filter-tags');
        if (!filterTagsContainer) {
            console.error('Filter tags container not found');
            return;
        }
        if (!this.state.jobs.data) {
            console.error('Jobs data not available');
            return;
        }

        const categories = this.state.jobs.data.categories;
        console.log('Found categories:', categories);
        filterTagsContainer.innerHTML = categories.map(category => 
            `<button class="filter-tag ${category.id === 'all' ? 'active' : ''}" data-filter="${category.id}">
                ${category.displayName}
            </button>`
        ).join('');
        console.log('Filter tags rendered successfully');
    },

    // Render jobs
    renderJobs() {
        const jobsGrid = document.getElementById('jobs-grid');
        const loadingMessage = document.getElementById('jobs-loading');
        
        if (!jobsGrid) return;

        // Hide loading message
        if (loadingMessage) {
            loadingMessage.style.display = 'none';
        }

        if (!this.state.jobs.filteredJobs.length) {
            jobsGrid.innerHTML = `
                <div class="no-jobs-message">
                    <i class="fas fa-search"></i>
                    <h3>לא נמצאו משרות</h3>
                    <p>נסה לשנות את הפילטר או החיפוש</p>
                </div>
            `;
            return;
        }

        jobsGrid.innerHTML = this.state.jobs.filteredJobs.map((job, index) => 
            this.createJobCard(job, index)
        ).join('');

        // Re-initialize job cards functionality for dynamically created cards
        this.initializeJobCards();
    },

    // Create individual job card HTML
    createJobCard(job, index) {
        const requirementsList = job.requirements.map(req => `<p>${req}</p>`).join('');
        const delay = (index + 1) * 100;

        return `
            <div class="job-card" data-category="${job.category}" data-aos="fade-up" data-aos-delay="${delay}">
                <div class="job-badge">
                    <span class="job-type">${job.type}</span>
                    <span class="job-level">${job.level}</span>
                </div>
                <h3 class="job-title">${job.title}</h3>
                <div class="job-company">
                    <i class="fas fa-building"></i>
                    <span>${job.company}</span>
                </div>
                <div class="job-location">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${job.location}</span>
                </div>
                <div class="job-content">
                    <div class="job-description">
                        <div class="job-text">
                            <p>${job.shortDescription}</p>
                            <div class="job-text-full" style="display: none;">
                                <br>
                                <p><strong>דרישות:</strong></p>
                                ${requirementsList}
                                <br>
                                <p><strong>מיקום:</strong> ${job.location}</p>
                                <br>
                                <p>${job.description}</p>
                            </div>
                            <button class="show-more-btn">הצג עוד</button>
                        </div>
                    </div>
                </div>
                <div class="job-footer">
                    <span class="job-posted">${job.postedDate}</span>
                    <a href="contact.html" class="job-apply-btn">
                        <i class="fas fa-paper-plane"></i>
                        שלח קו"ח
                    </a>
                </div>
            </div>
        `;
    },

    // Render external links
    renderExternalLinks() {
        const externalLinksContainer = document.getElementById('external-links');
        if (!externalLinksContainer || !this.state.jobs.data) return;

        const externalLinks = this.state.jobs.data.externalLinks;
        externalLinksContainer.innerHTML = externalLinks.map((link, index) => {
            const delay = (index + 1) * 100;
            return `
                <a href="${link.url}" target="_blank" class="external-link" data-aos="fade-up" data-aos-delay="${delay}">
                    <div class="external-icon">
                        <i class="${link.icon}"></i>
                    </div>
                    <div class="external-content">
                        <h3>${link.name}</h3>
                        <p>${link.description}</p>
                    </div>
                    <i class="fas fa-arrow-left"></i>
                </a>
            `;
        }).join('');
    },

    // Setup event listeners for jobs functionality
    setupJobsEventListeners() {
        // Filter tags
        const filterTags = document.querySelectorAll('.filter-tag');
        filterTags.forEach(tag => {
            tag.addEventListener('click', (e) => {
                const filter = e.target.getAttribute('data-filter');
                this.filterJobs(filter);
                
                // Update active tag
                filterTags.forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');
            });
        });

        // Search input
        const searchInput = document.getElementById('job-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.state.jobs.searchTerm = e.target.value.toLowerCase();
                this.applyFilters();
            });
        }
    },

    // Filter jobs by category
    filterJobs(category) {
        this.state.jobs.currentFilter = category;
        this.applyFilters();
    },

    // Apply both category and search filters
    applyFilters() {
        if (!this.state.jobs.data) return;

        let filteredJobs = [...this.state.jobs.data.jobs];

        // Apply category filter
        if (this.state.jobs.currentFilter !== 'all') {
            filteredJobs = filteredJobs.filter(job => job.category === this.state.jobs.currentFilter);
        }

        // Apply search filter
        if (this.state.jobs.searchTerm) {
            filteredJobs = filteredJobs.filter(job => {
                const searchFields = [
                    job.title,
                    job.company,
                    job.location,
                    job.shortDescription,
                    job.description,
                    ...job.requirements
                ].join(' ').toLowerCase();
                
                return searchFields.includes(this.state.jobs.searchTerm);
            });
        }

        this.state.jobs.filteredJobs = filteredJobs;
        this.renderJobs();
        this.updateJobsCount();
    },

    // Update jobs count display
    updateJobsCount() {
        const jobsCountElement = document.getElementById('jobs-count');
        if (jobsCountElement) {
            jobsCountElement.textContent = this.state.jobs.filteredJobs.length;
        }
    },

    // Show error message when jobs fail to load
    showJobsError() {
        const jobsGrid = document.getElementById('jobs-grid');
        const loadingMessage = document.getElementById('jobs-loading');
        
        if (loadingMessage) {
            loadingMessage.style.display = 'none';
        }
        
        if (jobsGrid) {
            jobsGrid.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h3>שגיאה בטעינת המשרות</h3>
                    <p>אנא רענן את הדף ונסה שוב</p>
                    <button onclick="window.location.reload()" class="retry-btn">רענן דף</button>
                </div>
            `;
        }
    },

    // Show CORS error with instructions
    showCorsError() {
        const jobsGrid = document.getElementById('jobs-grid');
        const loadingMessage = document.getElementById('jobs-loading');
        
        if (loadingMessage) {
            loadingMessage.style.display = 'none';
        }
        
        if (jobsGrid) {
            jobsGrid.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-server"></i>
                    <h3>נדרש שרת מקומי</h3>
                    <p>כדי לראות את המשרות, יש לפתוח את האתר דרך שרת HTTP מקומי</p>
                    <div style="margin: 20px 0; padding: 15px; background: #f8f9fa; border-radius: 8px; text-align: left; direction: ltr;">
                        <strong>להפעלה מקומית:</strong><br>
                        1. פתח terminal/command prompt<br>
                        2. נווט לתיקיית האתר<br>
                        3. הרץ: <code>python -m http.server 8080</code><br>
                        4. פתח: <code>http://localhost:8080/jobs.html</code>
                    </div>
                    <p>באתר GitHub Pages הכל יעבוד בצורה רגילה</p>
                </div>
            `;
        }
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
