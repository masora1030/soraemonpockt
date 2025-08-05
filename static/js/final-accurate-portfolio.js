// Final Accurate Portfolio JavaScript
class AccuratePortfolio {
    constructor() {
        this.currentLanguage = 'en';
        this.currentTheme = 'light';
        this.isNavOpen = false;
        this.scrollPosition = 0;
        
        this.init();
    }

    init() {
        this.loadUserPreferences();
        this.setupEventListeners();
        this.setupCursor();
        this.setupScrollAnimations();
        this.setupNavigation();
        this.updateLanguageDisplay();
        this.setupBackToTop();
        this.setupScrollProgress();
        this.setupKeyboardShortcuts();
        this.setupAccessibility();
        this.hideLoadingScreen();
    }

    hideLoadingScreen() {
        console.log('hideLoadingScreen called');
        
        // Simple and reliable loading screen removal
        const removeLoadingScreen = () => {
            console.log('Removing loading screen');
            const loadingScreen = document.getElementById('loading-screen');
            if (loadingScreen) {
                loadingScreen.classList.add('hidden');
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 500);
            }
        };

        // Set a maximum loading time as fallback (reduced to 1.5s)
        const maxLoadTime = setTimeout(() => {
            console.log('Loading timeout reached');
            removeLoadingScreen();
        }, 1500);

        // Try to wait for fonts and critical images, but with timeout
        try {
            const loadingPromises = [];
            
            // Add fonts promise with timeout
            if (document.fonts && document.fonts.ready) {
                loadingPromises.push(
                    Promise.race([
                        document.fonts.ready,
                        new Promise(resolve => setTimeout(resolve, 1000))
                    ])
                );
            }

            // Add critical images (profile image) with timeout
            const criticalImages = document.querySelectorAll('img[src*="profile"]');
            criticalImages.forEach(img => {
                if (!img.complete) {
                    loadingPromises.push(
                        Promise.race([
                            new Promise(resolve => {
                                img.onload = resolve;
                                img.onerror = resolve;
                            }),
                            new Promise(resolve => setTimeout(resolve, 1500))
                        ])
                    );
                }
            });

            if (loadingPromises.length > 0) {
                Promise.all(loadingPromises).then(() => {
                    clearTimeout(maxLoadTime);
                    setTimeout(removeLoadingScreen, 500);
                });
            } else {
                // If no promises, remove loading screen immediately
                clearTimeout(maxLoadTime);
                setTimeout(removeLoadingScreen, 500);
            }
        } catch (error) {
            // Fallback: remove loading screen on any error
            console.warn('Loading screen error:', error);
            clearTimeout(maxLoadTime);
            removeLoadingScreen();
        }
    }

    setupScrollProgress() {
        const progressBar = document.getElementById('scroll-progress-bar');
        const progressContainer = document.getElementById('scroll-progress');
        
        if (!progressBar || !progressContainer) return;

        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            
            progressBar.style.width = scrollPercent + '%';
            
            // Show/hide progress indicator
            if (scrollTop > 100) {
                progressContainer.classList.add('visible');
            } else {
                progressContainer.classList.remove('visible');
            }
        });
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Prevent shortcuts when typing in input fields
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) {
                return;
            }

            const key = e.key.toLowerCase();
            
            switch (key) {
                case '?':
                    e.preventDefault();
                    this.toggleShortcutsHelp();
                    break;
                case 'h':
                    e.preventDefault();
                    this.scrollToSection('hero');
                    break;
                case 'a':
                    e.preventDefault();
                    this.scrollToSection('hero');
                    break;
                case 'e':
                    e.preventDefault();
                    this.scrollToSection('experience');
                    break;
                case 'r':
                    e.preventDefault();
                    this.scrollToSection('research');
                    break;
                case 'c':
                    e.preventDefault();
                    this.scrollToSection('contact');
                    break;
                case 't':
                    e.preventDefault();
                    this.toggleTheme();
                    break;
                case 'l':
                    e.preventDefault();
                    this.toggleLanguage();
                    break;
                case 'escape':
                    e.preventDefault();
                    this.closeShortcutsHelp();
                    closeGame();
                    break;
            }
        });
    }

    setupAccessibility() {
        // Improve focus management
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('using-keyboard');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('using-keyboard');
        });

        // Add skip link functionality
        const skipLinks = document.querySelectorAll('[href^="#"]');
        skipLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const target = document.querySelector(link.getAttribute('href'));
                if (target) {
                    target.setAttribute('tabindex', '-1');
                    target.focus();
                    target.addEventListener('blur', () => {
                        target.removeAttribute('tabindex');
                    }, { once: true });
                }
            });
        });
    }

    toggleShortcutsHelp() {
        const shortcutsHelp = document.getElementById('shortcuts-help');
        if (!shortcutsHelp) return;

        const isVisible = shortcutsHelp.style.display !== 'none';
        shortcutsHelp.style.display = isVisible ? 'none' : 'flex';
        
        // Focus management
        if (!isVisible) {
            const closeButton = shortcutsHelp.querySelector('.shortcuts-close');
            setTimeout(() => closeButton?.focus(), 100);
        }
    }

    closeShortcutsHelp() {
        const shortcutsHelp = document.getElementById('shortcuts-help');
        if (shortcutsHelp) {
            shortcutsHelp.style.display = 'none';
        }
    }

    setupEventListeners() {
        // Theme toggle
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }

        // Language toggle
        const langToggle = document.getElementById('lang-toggle');
        if (langToggle) {
            langToggle.addEventListener('click', () => this.toggleLanguage());
        }

        // Navigation toggle (mobile)
        const navToggle = document.getElementById('nav-toggle');
        if (navToggle) {
            navToggle.addEventListener('click', () => this.toggleNavigation());
        }

        // Smooth scrolling for navigation links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                this.scrollToSection(targetId);
                this.closeNavigation();
            });
        });

        // Scroll events
        window.addEventListener('scroll', () => this.handleScroll());
        
        // Resize events
        window.addEventListener('resize', () => this.handleResize());

        // Mystery icon interaction (Easter egg trigger)
        const mysteryIcon = document.getElementById('mystery-icon');
        if (mysteryIcon) {
            mysteryIcon.addEventListener('click', () => this.activateEasterEgg());
        }

        // Close navigation when clicking outside
        document.addEventListener('click', (e) => {
            const navMenu = document.getElementById('nav-menu');
            const navToggle = document.getElementById('nav-toggle');
            
            if (this.isNavOpen && navMenu && navToggle && 
                !navMenu.contains(e.target) && !navToggle.contains(e.target)) {
                this.closeNavigation();
            }
        });

        // Prevent scroll when mobile nav is open
        document.addEventListener('touchmove', (e) => {
            if (this.isNavOpen && window.innerWidth <= 768) {
                e.preventDefault();
            }
        }, { passive: false });
    }

    setupCursor() {
        if (window.innerWidth <= 768) return; // Skip on mobile

        const cursor = document.querySelector('.cursor');
        const cursorTrail = document.querySelector('.cursor-trail');
        
        if (!cursor || !cursorTrail) return;

        let mouseX = 0;
        let mouseY = 0;
        let trailX = 0;
        let trailY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        // Animate cursor
        const animateCursor = () => {
            cursor.style.left = mouseX + 'px';
            cursor.style.top = mouseY + 'px';

            // Smooth trail follow
            trailX += (mouseX - trailX) * 0.1;
            trailY += (mouseY - trailY) * 0.1;
            
            cursorTrail.style.left = trailX + 'px';
            cursorTrail.style.top = trailY + 'px';

            requestAnimationFrame(animateCursor);
        };
        animateCursor();

        // Cursor hover effects
        document.querySelectorAll('a, button, .nav-link, .timeline-item, .research-card, .mystery-icon').forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
                cursorTrail.style.transform = 'translate(-50%, -50%) scale(1.2)';
            });
            
            el.addEventListener('mouseleave', () => {
                cursor.style.transform = 'translate(-50%, -50%) scale(1)';
                cursorTrail.style.transform = 'translate(-50%, -50%) scale(1)';
            });
        });
    }

    setupScrollAnimations() {
        // Intersection Observer for fade-in animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });
        }, observerOptions);

        // Observe elements for animation
        document.querySelectorAll('.timeline-item, .research-card, .education-card, .work-card, .contact-card').forEach(el => {
            observer.observe(el);
        });

        // Parallax effect for floating elements
        this.setupParallax();
    }

    setupParallax() {
        const floatingElements = document.querySelectorAll('.floating-element');
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;

            floatingElements.forEach((element, index) => {
                const speed = parseFloat(element.dataset.speed) || 0.5;
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px) rotate(${scrolled * 0.02}deg)`;
            });
        });
    }

    setupNavigation() {
        // Active section highlighting
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');

        window.addEventListener('scroll', () => {
            let current = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                
                if (window.pageYOffset >= (sectionTop - 200)) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('data-section') === current) {
                    link.classList.add('active');
                }
            });
        });
    }

    setupBackToTop() {
        const backToTop = document.getElementById('back-to-top');
        if (!backToTop) return;

        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 500) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });
    }


    activateEasterEgg() {
        // Show the hidden game
        const gameContainer = document.getElementById('game-container');
        if (gameContainer) {
            gameContainer.style.display = 'flex';
            
            // Prevent background scrolling
            document.body.classList.add('game-active');
            
            // Initialize game if not already created
            if (!window.portfolioGame) {
                try {
                    window.portfolioGame = new PortfolioCareerGame('gameCanvas');
                } catch (error) {
                    console.error('Game initialization failed:', error);
                }
            } else {
                // Restart the game if it was stopped
                window.portfolioGame.start();
            }
        }
    }


    handleScroll() {
        const scrollTop = window.pageYOffset;
        const navbar = document.querySelector('.navbar');
        
        // Navbar scroll effect
        if (scrollTop > 50) {
            navbar?.classList.add('scrolled');
        } else {
            navbar?.classList.remove('scrolled');
        }

        // Update scroll position
        this.scrollPosition = scrollTop;
    }

    handleResize() {
        if (window.innerWidth > 768 && this.isNavOpen) {
            this.closeNavigation();
        }
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        
        const themeToggle = document.getElementById('theme-toggle');
        const themeIcon = themeToggle?.querySelector('.theme-icon');
        
        if (themeIcon) {
            themeIcon.textContent = this.currentTheme === 'dark' ? '☀️' : '🌙';
        }
        
        // Save preference
        localStorage.setItem('theme', this.currentTheme);
    }

    toggleLanguage() {
        this.currentLanguage = this.currentLanguage === 'en' ? 'ja' : 'en';
        
        // Save preference
        localStorage.setItem('language', this.currentLanguage);
        
        this.updateLanguageDisplay();
        this.updateLanguageToggleButton();
    }

    updateLanguageDisplay() {
        // Hide all language content first
        document.querySelectorAll('.lang-en, .lang-ja').forEach(el => {
            el.classList.remove('active');
        });

        // Show content for current language
        const currentLangClass = `.lang-${this.currentLanguage}`;
        document.querySelectorAll(currentLangClass).forEach(el => {
            el.classList.add('active');
        });

        // Update HTML lang attribute
        document.documentElement.lang = this.currentLanguage;
    }

    updateLanguageToggleButton() {
        const langToggle = document.getElementById('lang-toggle');
        const langText = langToggle?.querySelector('.lang-text');
        
        if (langText) {
            langText.textContent = this.currentLanguage === 'en' ? 'JP' : 'EN';
        }
    }

    toggleNavigation() {
        this.isNavOpen = !this.isNavOpen;
        const navMenu = document.getElementById('nav-menu');
        const navToggle = document.getElementById('nav-toggle');
        
        navMenu?.classList.toggle('active', this.isNavOpen);
        navToggle?.classList.toggle('active', this.isNavOpen);
        
        // Prevent scroll when nav is open on mobile
        if (window.innerWidth <= 768) {
            document.body.style.overflow = this.isNavOpen ? 'hidden' : '';
        }
    }

    closeNavigation() {
        this.isNavOpen = false;
        const navMenu = document.getElementById('nav-menu');
        const navToggle = document.getElementById('nav-toggle');
        
        navMenu?.classList.remove('active');
        navToggle?.classList.remove('active');
        document.body.style.overflow = '';
    }

    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            const navHeight = document.querySelector('.navbar')?.offsetHeight || 70;
            const sectionTop = section.offsetTop - navHeight;
            
            window.scrollTo({
                top: sectionTop,
                behavior: 'smooth'
            });
        }
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            left: 50%;
            transform: translateX(-50%);
            background: var(--accent-blue);
            color: white;
            padding: 1rem 2rem;
            border-radius: 12px;
            font-weight: 600;
            z-index: 10000;
            animation: slideInDown 0.5s ease-out, fadeOut 0.5s ease-out 2.5s forwards;
            box-shadow: var(--shadow-lg);
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 3000);
    }

    loadUserPreferences() {
        // Load theme preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            this.currentTheme = savedTheme;
            document.documentElement.setAttribute('data-theme', this.currentTheme);
            
            const themeToggle = document.getElementById('theme-toggle');
            const themeIcon = themeToggle?.querySelector('.theme-icon');
            if (themeIcon) {
                themeIcon.textContent = this.currentTheme === 'dark' ? '☀️' : '🌙';
            }
        }

        // Load language preference
        const savedLanguage = localStorage.getItem('language');
        if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'ja')) {
            this.currentLanguage = savedLanguage;
        }
    }
}

// Experience card toggle functionality
function toggleExperience(card) {
    card.classList.toggle('expanded');
}

// Global functions for navigation
function scrollToSection(sectionId) {
    if (window.portfolioApp) {
        window.portfolioApp.scrollToSection(sectionId);
    }
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Close game function
function closeGame() {
    const gameContainer = document.getElementById('game-container');
    if (gameContainer) {
        gameContainer.style.display = 'none';
        
        // Stop the game loop and reset game state
        if (window.portfolioGame) {
            window.portfolioGame.stop();
            window.portfolioGame.resetGame();
        }
        
        // Restore background scrolling
        document.body.classList.remove('game-active');
    }
}

// Add CSS animations dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInDown {
        from {
            opacity: 0;
            transform: translateX(-50%) translateY(-100px);
        }
        to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
    }
    
    @keyframes fadeOut {
        from {
            opacity: 1;
        }
        to {
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize the portfolio when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.portfolioApp = new AccuratePortfolio();
});

// Handle page visibility for performance
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations when page is not visible
        document.querySelectorAll('.floating-element').forEach(el => {
            el.style.animationPlayState = 'paused';
        });
    } else {
        // Resume animations when page becomes visible
        document.querySelectorAll('.floating-element').forEach(el => {
            el.style.animationPlayState = 'running';
        });
    }
});

// Add smooth scrolling behavior to all anchor links
document.addEventListener('click', (e) => {
    const target = e.target.closest('a[href^="#"]');
    if (target) {
        e.preventDefault();
        const sectionId = target.getAttribute('href').substring(1);
        scrollToSection(sectionId);
    }
});

// Global functions for shortcuts help
function toggleShortcutsHelp() {
    if (window.portfolioApp) {
        window.portfolioApp.toggleShortcutsHelp();
    }
}

function closeShortcutsHelp() {
    if (window.portfolioApp) {
        window.portfolioApp.closeShortcutsHelp();
    }
}

// Preload images for better performance
const preloadImages = [
    'static/img/about/profile.jpg',
    'static/img/experience/icon_ly.png',
    'static/img/experience/icon_aist.jpeg',
    'static/img/experience/icon_nttdata.png',
    'static/img/experience/icon_yahoo.png',
    'static/img/experience/sony_icon.jpeg',
    'static/img/experience/icon_line.png',
    'static/img/experience/icon_fixstars.png',
    'static/img/experience/icon_flywheel.png',
    'static/img/experience/icon_ibm.jpg',
    'static/img/experience/icon_teamlab.png'
];

preloadImages.forEach(src => {
    const img = new Image();
    img.src = src;
});