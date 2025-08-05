// Modern Portfolio JavaScript
class ModernPortfolio {
    constructor() {
        this.currentLanguage = 'en';
        this.currentTheme = 'light';
        this.isNavOpen = false;
        this.scrollPosition = 0;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupCursor();
        this.setupScrollAnimations();
        this.setupTypewriter();
        this.setupFloatingElements();
        this.setupNavigation();
        this.loadUserPreferences();
        this.updateLanguage();
    }

    setupEventListeners() {
        // Theme toggle
        const themeToggle = document.getElementById('theme-toggle');
        themeToggle?.addEventListener('click', () => this.toggleTheme());

        // Language toggle
        const langToggle = document.getElementById('lang-toggle');
        langToggle?.addEventListener('click', () => this.toggleLanguage());

        // Navigation toggle (mobile)
        const navToggle = document.getElementById('nav-toggle');
        navToggle?.addEventListener('click', () => this.toggleNavigation());

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

        // Game mode buttons
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.addEventListener('click', () => this.setGameMode(btn.dataset.mode));
        });

        // Profile image interaction
        const profileImg = document.querySelector('.profile-img');
        profileImg?.addEventListener('click', () => this.profileImageClick());
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
        document.querySelectorAll('a, button, .nav-link, .cta-primary, .cta-secondary').forEach(el => {
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
                    entry.target.classList.add('fade-in-up');
                }
            });
        }, observerOptions);

        // Observe elements for animation
        document.querySelectorAll('.about-card, .timeline-item, .research-item, .contact-item, .social-link').forEach(el => {
            observer.observe(el);
        });

        // Parallax effect for floating elements
        this.setupParallax();
    }

    setupParallax() {
        const floatingElements = document.querySelectorAll('.floating-element');
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;

            floatingElements.forEach((element, index) => {
                const speed = parseFloat(element.dataset.speed) || 0.5;
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px) rotate(${scrolled * 0.1}deg)`;
            });
        });
    }

    setupTypewriter() {
        const typewriterElement = document.querySelector('.typewriter-text');
        if (!typewriterElement) return;

        const texts = {
            en: [
                'Machine Learning Engineer',
                'AI Researcher',
                'Computer Vision Expert',
                'Problem Solver'
            ],
            ja: [
                '機械学習エンジニア',
                'AI研究者',
                'コンピュータビジョン専門家',
                '問題解決者'
            ]
        };

        let currentTextIndex = 0;
        let currentCharIndex = 0;
        let isDeleting = false;
        let typeSpeed = 100;

        const type = () => {
            const currentTexts = texts[this.currentLanguage];
            const currentText = currentTexts[currentTextIndex];
            
            if (isDeleting) {
                typewriterElement.textContent = currentText.substring(0, currentCharIndex - 1);
                currentCharIndex--;
                typeSpeed = 50;
            } else {
                typewriterElement.textContent = currentText.substring(0, currentCharIndex + 1);
                currentCharIndex++;
                typeSpeed = 100;
            }

            if (!isDeleting && currentCharIndex === currentText.length) {
                typeSpeed = 2000; // Pause at end
                isDeleting = true;
            } else if (isDeleting && currentCharIndex === 0) {
                isDeleting = false;
                currentTextIndex = (currentTextIndex + 1) % currentTexts.length;
                typeSpeed = 500; // Pause before next word
            }

            setTimeout(type, typeSpeed);
        };

        // Start typewriter effect
        setTimeout(type, 1000);
    }

    setupFloatingElements() {
        const floatingElements = document.querySelectorAll('.floating-element');
        
        floatingElements.forEach((element, index) => {
            // Random initial position
            const randomX = Math.random() * 100;
            const randomY = Math.random() * 100;
            
            element.style.left = randomX + '%';
            element.style.top = randomY + '%';
            
            // Different animation delays
            element.style.animationDelay = (index * 5) + 's';
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
                
                if (scrollY >= (sectionTop - 200)) {
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

    handleScroll() {
        const scrollTop = window.pageYOffset;
        const navbar = document.querySelector('.navbar');
        
        // Navbar scroll effect
        if (scrollTop > 50) {
            navbar?.classList.add('scrolled');
        } else {
            navbar?.classList.remove('scrolled');
        }

        // Parallax effects
        this.updateParallax(scrollTop);
        
        // Update scroll position
        this.scrollPosition = scrollTop;
    }

    updateParallax(scrollTop) {
        // Hero section parallax
        const heroSection = document.querySelector('.hero-section');
        if (heroSection) {
            const rate = scrollTop * 0.5;
            heroSection.style.transform = `translateY(${rate}px)`;
        }

        // Floating elements parallax
        const floatingElements = document.querySelectorAll('.floating-element');
        floatingElements.forEach((element, index) => {
            const speed = parseFloat(element.dataset.speed) || 0.5;
            const yPos = -(scrollTop * speed);
            element.style.transform = `translateY(${yPos}px) rotate(${scrollTop * 0.05}deg)`;
        });
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
        themeToggle?.classList.toggle('dark', this.currentTheme === 'dark');
        
        // Save preference
        localStorage.setItem('theme', this.currentTheme);
        
        // Update canvas if game is running
        this.updateGameTheme();
    }

    toggleLanguage() {
        this.currentLanguage = this.currentLanguage === 'en' ? 'ja' : 'en';
        document.documentElement.setAttribute('data-lang', this.currentLanguage);
        
        const langToggle = document.getElementById('lang-toggle');
        langToggle?.classList.toggle('jp', this.currentLanguage === 'ja');
        
        // Save preference
        localStorage.setItem('language', this.currentLanguage);
        
        this.updateLanguage();
    }

    updateLanguage() {
        // Update all language-specific content
        document.querySelectorAll('.lang-content').forEach(element => {
            const enText = element.getAttribute('data-en');
            const jaText = element.getAttribute('data-ja');
            
            if (this.currentLanguage === 'ja' && jaText) {
                element.textContent = jaText;
            } else if (enText) {
                element.textContent = enText;
            }
        });

        // Update typewriter if running
        this.restartTypewriter();
    }

    restartTypewriter() {
        // This would restart the typewriter effect with new language
        // Implementation depends on the typewriter setup
    }

    toggleNavigation() {
        this.isNavOpen = !this.isNavOpen;
        const navMenu = document.getElementById('nav-menu');
        const navToggle = document.getElementById('nav-toggle');
        
        navMenu?.classList.toggle('active', this.isNavOpen);
        navToggle?.classList.toggle('active', this.isNavOpen);
        
        // Prevent scroll when nav is open
        document.body.style.overflow = this.isNavOpen ? 'hidden' : '';
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

    setGameMode(mode) {
        // Update game mode buttons
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        document.querySelector(`[data-mode="${mode}"]`)?.classList.add('active');
        
        // Set global variable for game
        if (typeof window !== 'undefined') {
            window.gameMode = mode;
            if (mode === 'hard') {
                window.hardmode = true;
            } else {
                window.hardmode = false;
            }
        }
    }

    profileImageClick() {
        const profileImg = document.querySelector('.profile-img');
        if (profileImg) {
            // Add fun animation
            profileImg.style.transform = 'scale(1.1) rotate(360deg)';
            setTimeout(() => {
                profileImg.style.transform = '';
            }, 500);
            
            // Easter egg: show a message
            this.showEasterEgg();
        }
    }

    showEasterEgg() {
        const messages = {
            en: ['🎉 You found the easter egg!', '🚀 Keep exploring!', '⭐ Thanks for clicking!'],
            ja: ['🎉 イースターエッグを見つけました！', '🚀 探索を続けてください！', '⭐ クリックしてくれてありがとう！']
        };
        
        const randomMessage = messages[this.currentLanguage][Math.floor(Math.random() * messages[this.currentLanguage].length)];
        
        // Create temporary notification
        const notification = document.createElement('div');
        notification.textContent = randomMessage;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            left: 50%;
            transform: translateX(-50%);
            background: var(--accent-gradient);
            color: white;
            padding: 1rem 2rem;
            border-radius: 2rem;
            font-weight: 600;
            z-index: 10000;
            animation: slideInDown 0.5s ease-out, fadeOut 0.5s ease-out 2s;
            box-shadow: var(--shadow-lg);
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    updateGameTheme() {
        // Update game canvas styling based on theme
        const canvas = document.getElementById('canvas');
        if (canvas) {
            if (this.currentTheme === 'dark') {
                canvas.style.filter = 'brightness(0.9) contrast(1.1)';
            } else {
                canvas.style.filter = '';
            }
        }
    }

    loadUserPreferences() {
        // Load theme preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            this.currentTheme = savedTheme;
            document.documentElement.setAttribute('data-theme', this.currentTheme);
            const themeToggle = document.getElementById('theme-toggle');
            themeToggle?.classList.toggle('dark', this.currentTheme === 'dark');
        }

        // Load language preference
        const savedLanguage = localStorage.getItem('language');
        if (savedLanguage) {
            this.currentLanguage = savedLanguage;
            document.documentElement.setAttribute('data-lang', this.currentLanguage);
            const langToggle = document.getElementById('lang-toggle');
            langToggle?.classList.toggle('jp', this.currentLanguage === 'ja');
        }
    }

    // Game integration functions
    startGame() {
        const canvasOverlay = document.querySelector('.canvas-overlay');
        canvasOverlay?.classList.add('hidden');
        
        // Call the original game start function
        if (typeof gameStart === 'function') {
            gameStart();
        }
    }

    // Utility functions
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

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// Global functions for backward compatibility and easy access
function scrollToSection(sectionId) {
    portfolioApp.scrollToSection(sectionId);
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
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
    
    .navbar.scrolled {
        background: rgba(255, 255, 255, 0.95) !important;
        backdrop-filter: blur(20px) !important;
    }
    
    [data-theme="dark"] .navbar.scrolled {
        background: rgba(26, 32, 44, 0.95) !important;
    }
`;
document.head.appendChild(style);

// Initialize the portfolio when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.portfolioApp = new ModernPortfolio();
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

// Enhanced game integration
window.gameStart = function() {
    if (window.portfolioApp) {
        window.portfolioApp.startGame();
    }
    // Call original game start if it exists
    if (typeof gameStart === 'function' && gameStart !== window.gameStart) {
        gameStart();
    }
};