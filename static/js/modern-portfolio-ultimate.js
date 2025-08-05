// Modern Portfolio JavaScript - Ultimate Version
class ModernPortfolio {
    constructor() {
        this.currentLanguage = 'en';
        this.currentTheme = 'light';
        this.isNavOpen = false;
        this.scrollPosition = 0;
        this.typewriterTexts = {
            en: [
                'Machine Learning Engineer',
                'AI Researcher', 
                'Computer Vision Expert',
                'Problem Solver',
                'Code Enthusiast'
            ],
            ja: [
                '機械学習エンジニア',
                'AI研究者',
                'コンピュータビジョン専門家',
                '問題解決者',
                'コード愛好家'
            ]
        };
        
        this.init();
    }

    init() {
        this.loadUserPreferences();
        this.setupEventListeners();
        this.setupCursor();
        this.setupScrollAnimations();
        this.setupFloatingElements();
        this.setupNavigation();
        this.updateLanguageDisplay();
        this.initTypewriter();
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

        // Profile image interaction
        const profileImg = document.querySelector('.profile-img');
        if (profileImg) {
            profileImg.addEventListener('click', () => this.profileImageClick());
        }

        // Close navigation when clicking outside
        document.addEventListener('click', (e) => {
            const navMenu = document.getElementById('nav-menu');
            const navToggle = document.getElementById('nav-toggle');
            
            if (this.isNavOpen && !navMenu.contains(e.target) && !navToggle.contains(e.target)) {
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
        document.querySelectorAll('a, button, .nav-link, .cta-primary, .cta-secondary, .experience-card').forEach(el => {
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
        document.querySelectorAll('.about-card, .experience-card, .research-item, .contact-item, .social-link').forEach(el => {
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
                element.style.transform = `translateY(${yPos}px) rotate(${scrolled * 0.1}deg)`;
            });
        });
    }

    initTypewriter() {
        const typewriterElement = document.querySelector('.typewriter-text');
        if (!typewriterElement) return;

        let currentTextIndex = 0;
        let currentCharIndex = 0;
        let isDeleting = false;
        let typeSpeed = 100;

        const type = () => {
            const currentTexts = this.typewriterTexts[this.currentLanguage];
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
        themeToggle?.classList.toggle('dark', this.currentTheme === 'dark');
        
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
            el.style.display = 'none';
        });

        // Show content for current language
        const currentLangClass = `.lang-${this.currentLanguage}`;
        document.querySelectorAll(currentLangClass).forEach(el => {
            el.style.display = el.tagName.toLowerCase() === 'span' ? 'inline' : 'block';
        });
    }

    updateLanguageToggleButton() {
        const langToggle = document.getElementById('lang-toggle');
        const langText = langToggle?.querySelector('.lang-text');
        
        if (langText) {
            langText.textContent = this.currentLanguage === 'en' ? 'JP' : 'EN';
        }
        
        langToggle?.classList.toggle('jp', this.currentLanguage === 'ja');
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
            en: [
                '🎉 You found the easter egg!', 
                '🚀 Keep exploring!', 
                '⭐ Thanks for clicking!',
                '💻 Code is poetry!',
                '🎮 Ready to play the game?'
            ],
            ja: [
                '🎉 イースターエッグを見つけました！', 
                '🚀 探索を続けてください！', 
                '⭐ クリックしてくれてありがとう！',
                '💻 コードは詩だ！',
                '🎮 ゲームをする準備はできた？'
            ]
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
            animation: slideInDown 0.5s ease-out, fadeOut 0.5s ease-out 2s forwards;
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
            themeToggle?.classList.toggle('dark', this.currentTheme === 'dark');
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

// Game mode functions
function setGameMode(mode) {
    // Update game mode buttons
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    const selectedBtn = document.querySelector(`[data-mode="${mode}"]`);
    if (selectedBtn) {
        selectedBtn.classList.add('active');
    }
    
    // Set global variables for game
    if (typeof window !== 'undefined') {
        window.currentGameMode = mode;
    }
}

// Enhanced game start function
function startEpicGame() {
    // Get current language for messages
    const isJapanese = window.portfolioApp && window.portfolioApp.currentLanguage === 'ja';
    
    // Update game message
    const gameMessage = document.getElementById('game-message');
    if (gameMessage) {
        gameMessage.innerHTML = isJapanese 
            ? 'ゲーム開始！頑張って！🎮' 
            : 'Game Started! Good luck! 🎮';
    }
    
    // Initialize the epic game
    if (window.epicGame) {
        window.epicGame.start();
    } else {
        // Show loading message if game not ready
        if (gameMessage) {
            gameMessage.innerHTML = isJapanese 
                ? 'ゲームを読み込み中...' 
                : 'Loading game...';
        }
        
        setTimeout(() => {
            if (window.epicGame) {
                window.epicGame.start();
            } else {
                if (gameMessage) {
                    gameMessage.innerHTML = isJapanese 
                        ? 'ゲームの準備ができていません' 
                        : 'Game not ready yet';
                }
            }
        }, 1000);
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
    
    // Set default game mode
    setGameMode('intern');
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