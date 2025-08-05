// Professional Portfolio JavaScript
class ProfessionalPortfolio {
    constructor() {
        this.currentLanguage = 'en';
        this.currentTheme = 'light';
        this.isNavOpen = false;
        this.scrollPosition = 0;
        this.easterEggCounter = 0;
        this.easterEggSequence = ['profile-img', 'logo-text', 'theme-toggle'];
        this.easterEggProgress = 0;
        
        this.init();
    }

    init() {
        this.loadUserPreferences();
        this.setupEventListeners();
        this.setupCursor();
        this.setupScrollAnimations();
        this.setupNavigation();
        this.updateLanguageDisplay();
        this.setupSkillBars();
        this.setupBackToTop();
        this.setupEasterEgg();
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

        // Profile image interaction (Easter egg trigger)
        const profileImg = document.querySelector('.profile-img');
        if (profileImg) {
            profileImg.addEventListener('click', () => this.handleEasterEggClick('profile-img'));
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

        // Form submission
        const form = document.querySelector('.form');
        if (form) {
            form.addEventListener('submit', (e) => this.handleFormSubmit(e));
        }

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
        document.querySelectorAll('a, button, .nav-link, .cta-primary, .cta-secondary, .timeline-item, .research-card').forEach(el => {
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
        document.querySelectorAll('.highlight-item, .timeline-item, .research-card, .contact-item, .skills-container').forEach(el => {
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
                element.style.transform = `translateY(${yPos}px) rotate(${scrolled * 0.05}deg)`;
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

    setupSkillBars() {
        const skillObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const skillBars = entry.target.querySelectorAll('.skill-progress');
                    skillBars.forEach(bar => {
                        const progress = bar.dataset.progress;
                        setTimeout(() => {
                            bar.style.width = progress + '%';
                        }, 200);
                    });
                    skillObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        const skillsContainer = document.querySelector('.skills-container');
        if (skillsContainer) {
            skillObserver.observe(skillsContainer);
        }
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

    setupEasterEgg() {
        // Setup easter egg triggers
        const logoText = document.querySelector('.logo-text');
        const themeToggle = document.getElementById('theme-toggle');

        if (logoText) {
            logoText.addEventListener('click', () => this.handleEasterEggClick('logo-text'));
        }

        if (themeToggle) {
            // Add a special click handler that doesn't interfere with theme toggle
            themeToggle.addEventListener('dblclick', () => this.handleEasterEggClick('theme-toggle'));
        }
    }

    handleEasterEggClick(elementType) {
        if (this.easterEggSequence[this.easterEggProgress] === elementType) {
            this.easterEggProgress++;
            
            if (this.easterEggProgress >= this.easterEggSequence.length) {
                this.activateEasterEgg();
                this.easterEggProgress = 0;
            }
        } else {
            this.easterEggProgress = 0;
        }
    }

    activateEasterEgg() {
        // Show the hidden game
        const gameContainer = document.getElementById('game-container');
        if (gameContainer) {
            gameContainer.style.display = 'flex';
            
            // Initialize game if available
            if (window.epicGame) {
                window.epicGame.start();
            }
        }

        // Show notification
        this.showNotification(
            this.currentLanguage === 'ja' ? 
            '🎮 隠されたゲームを発見しました！' : 
            '🎮 Hidden game unlocked!'
        );
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

    handleFormSubmit(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);
        
        // Show success message
        this.showNotification(
            this.currentLanguage === 'ja' ? 
            '✅ メッセージが送信されました！' : 
            '✅ Message sent successfully!'
        );
        
        // Reset form
        e.target.reset();
        
        // In a real implementation, you would send this data to a server
        console.log('Form submission:', data);
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

// Show all experiences toggle
function toggleAllExperiences() {
    const additionalExperiences = document.querySelector('.additional-experiences');
    const showMoreBtn = document.querySelector('.show-more-btn');
    
    if (additionalExperiences && showMoreBtn) {
        const isVisible = additionalExperiences.style.display !== 'none';
        
        additionalExperiences.style.display = isVisible ? 'none' : 'block';
        
        const isJapanese = window.portfolioApp && window.portfolioApp.currentLanguage === 'ja';
        showMoreBtn.innerHTML = isVisible ? 
            (isJapanese ? 'すべての経歴を表示' : 'Show All Experience') :
            (isJapanese ? '経歴を折りたたむ' : 'Hide Experience');
    }
}

// Research toggle
function toggleResearch() {
    // Implementation for showing more research papers
    const isJapanese = window.portfolioApp && window.portfolioApp.currentLanguage === 'ja';
    window.portfolioApp.showNotification(
        isJapanese ? '追加の研究論文は準備中です' : 'Additional research papers coming soon'
    );
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
    window.portfolioApp = new ProfessionalPortfolio();
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

// Preload images for better performance
const preloadImages = [
    'static/img/about/profile.jpg',
    'static/img/experience/icon_ly.png',
    'static/img/experience/icon_aist.jpeg',
    'static/img/experience/icon_nttdata.png',
    'static/img/experience/icon_yahoo.png',
    'static/img/experience/sony_icon.jpeg'
];

preloadImages.forEach(src => {
    const img = new Image();
    img.src = src;
});

// Handle keyboard navigation
document.addEventListener('keydown', (e) => {
    // Escape key to close game
    if (e.key === 'Escape') {
        closeGame();
    }
    
    // Arrow keys for section navigation
    if (e.key === 'ArrowDown' && e.ctrlKey) {
        e.preventDefault();
        const sections = ['hero', 'about', 'experience', 'research', 'contact'];
        const currentSection = getCurrentSection();
        const currentIndex = sections.indexOf(currentSection);
        if (currentIndex < sections.length - 1) {
            scrollToSection(sections[currentIndex + 1]);
        }
    }
    
    if (e.key === 'ArrowUp' && e.ctrlKey) {
        e.preventDefault();
        const sections = ['hero', 'about', 'experience', 'research', 'contact'];
        const currentSection = getCurrentSection();
        const currentIndex = sections.indexOf(currentSection);
        if (currentIndex > 0) {
            scrollToSection(sections[currentIndex - 1]);
        }
    }
});

function getCurrentSection() {
    const sections = document.querySelectorAll('section[id]');
    let current = 'hero';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (window.pageYOffset >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });
    
    return current;
}