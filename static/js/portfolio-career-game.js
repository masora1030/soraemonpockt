/**
 * Epic Skill Battle - Advanced Action Game
 * Features: Revolutionary actions, boss battles, advanced visuals
 */

class PortfolioCareerGame {
    constructor(canvasId, options = {}) {
        // Canvas setup
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            throw new Error(`Canvas with id "${canvasId}" not found`);
        }
        this.ctx = this.canvas.getContext('2d');
        
        // Enhanced canvas configuration
        this.width = this.canvas.width = options.width || 800;
        this.height = this.canvas.height = options.height || 600;
        
        // Load profile image for boss
        this.profileImage = new Image();
        this.profileImage.src = 'static/img/about/profile.jpg';
        this.profileImageLoaded = false;
        this.profileImage.onload = () => {
            this.profileImageLoaded = true;
        };
        
        // Audio context for sound effects
        this.audioContext = null;
        this.soundEnabled = true;
        this.initAudio();
        
        // Game loop control
        this.isRunning = false;
        this.animationFrameId = null;
        
        // Game state management
        this.gameState = 'tutorial'; // tutorial, menu, playing, paused, gameOver, victory, bossIntro, bossFight
        this.language = options.language || localStorage.getItem('epicGameLanguage') || 'en';
        this.score = 0;
        this.highScore = parseInt(localStorage.getItem('epicGameHighScore') || '0');
        this.lives = 3;
        this.maxLives = 5;
        this.currentLevel = 1;
        this.gameTime = 0;
        this.totalGameTime = parseInt(localStorage.getItem('epicGameTotalTime') || '0');
        this.tutorialStep = 0;
        this.maxTutorialSteps = 5;
        
        // Enhanced player with special abilities
        this.player = {
            x: this.width / 2 - 25,
            y: this.height - 80,
            width: 50,
            height: 50,
            speed: 5,
            health: 100,
            maxHealth: 100,
            energy: 150,
            maxEnergy: 150,
            invulnerable: false,
            invulnerabilityTime: 0,
            maxInvulnerabilityTime: 120,
            // Special abilities
            canShoot: true,
            shootCooldown: 0,
            maxShootCooldown: 15,
            canDash: true,
            dashCooldown: 0,
            maxDashCooldown: 60,
            isDashing: false,
            dashDuration: 0,
            maxDashDuration: 15,
            // Shield ability
            shieldActive: false,
            shieldCooldown: 0,
            maxShieldCooldown: 300,
            shieldDuration: 0,
            maxShieldDuration: 180,
            // Player progression system
            level: 1,
            xp: 0,
            xpToNextLevel: 50, // Reduced from 100 to 50
            attackDamage: 25,
            attackLevel: 1,
            // Charge shot system
            isCharging: false,
            chargeLevel: 0,
            maxChargeLevel: 100,
            chargeRate: 2, // Charge points per frame
            // Shot count based on level
            baseShotCount: 1,
            // New buff system
            berserkMode: false,
            berserkTimer: 0,
            rapidFireTimer: 0,
            emergencyShieldTimer: 0,
            killStreak: 0,
            lastKillTime: 0,
            // Homing missile system
            hasHomingMissiles: false,
            homingMissileTimer: 0,
            homingMissileInterval: 300 // 5 seconds at 60fps (increased for performance)
        };
        
        // Input handling with immediate response
        this.keys = {};
        this.keysPressed = {}; // For single press actions
        this.mouse = { x: 0, y: 0, isPressed: false };
        this.touch = { x: 0, y: 0, isActive: false };
        this.inputMode = 'keyboard';
        
        // Mobile virtual controls
        this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        this.virtualJoystick = {
            centerX: 100,
            centerY: this.height - 100,
            radius: 50,
            knobRadius: 20,
            knobX: 100,
            knobY: this.height - 100,
            isActive: false,
            touchId: null
        };
        this.virtualButtons = {
            shoot: { x: this.width - 80, y: this.height - 120, radius: 35, isPressed: false, touchId: null },
            dash: { x: this.width - 80, y: this.height - 200, radius: 30, isPressed: false, touchId: null },
            shield: { x: this.width - 160, y: this.height - 160, radius: 30, isPressed: false, touchId: null },
            pause: { x: 50, y: 50, radius: 25, isPressed: false, touchId: null }
        };
        
        // Game objects with enhanced visuals
        this.skills = [];
        this.enemies = [];
        this.projectiles = [];
        this.particles = [];
        this.powerups = [];
        this.floatingTexts = [];
        this.backgroundElements = [];
        this.explosions = [];
        
        // Boss system
        this.boss = null;
        this.bossActive = false;
        this.bossIntroTimer = 0;
        this.maxBossIntroTime = 30; // 0.5 seconds
        this.waveCount = 0;
        this.wavesUntilBoss = 5; // Boss every 5 waves instead of 3
        this.lastBossTime = 0; // Track when last boss was defeated
        
        // Visual effects
        this.screenShake = { x: 0, y: 0, intensity: 0, duration: 0 };
        this.combo = 0;
        this.maxCombo = 0;
        this.comboTimer = 0;
        this.maxComboTimer = 180;
        
        // Enhanced timing and difficulty
        this.lastTime = 0;
        this.deltaTime = 0;
        this.skillSpawnTimer = 0;
        this.enemySpawnTimer = 0;
        this.powerupSpawnTimer = 0;
        this.difficultyMultiplier = 1.0;
        
        // Achievement System
        this.achievements = {
            firstShot: { unlocked: false, name: { en: 'First Strike', ja: 'ファーストストライク' }, description: { en: 'Fire your first shot', ja: '初回射撃' }, icon: '🎯' },
            combo10: { unlocked: false, name: { en: 'Combo Master', ja: 'コンボマスター' }, description: { en: 'Achieve 10x combo', ja: '10連続コンボ達成' }, icon: '🔥' },
            bossDefeated: { unlocked: false, name: { en: 'Boss Slayer', ja: 'ボス討伐' }, description: { en: 'Defeat your first boss', ja: '初ボス撃破' }, icon: '👑' },
            perfectDash: { unlocked: false, name: { en: 'Dash Master', ja: 'ダッシュマスター' }, description: { en: 'Use dash 50 times', ja: 'ダッシュ50回使用' }, icon: '💨' },
            shieldMaster: { unlocked: false, name: { en: 'Shield Expert', ja: 'シールドエキスパート' }, description: { en: 'Block 25 attacks', ja: '25回攻撃をブロック' }, icon: '🛡️' },
            survivor: { unlocked: false, name: { en: 'Survivor', ja: 'サバイバー' }, description: { en: 'Survive 3 minutes', ja: '3分間生存' }, icon: '⏰' },
            scoreHunter: { unlocked: false, name: { en: 'Score Hunter', ja: 'スコアハンター' }, description: { en: 'Score 25,000 points', ja: '25,000点獲得' }, icon: '🏆' },
            legend: { unlocked: false, name: { en: 'Legend', ja: 'レジェンド' }, description: { en: 'Defeat 3 bosses', ja: 'ボス3体撃破' }, icon: '⭐' }
        };
        
        this.loadAchievements();
        
        // Enhanced statistics
        this.stats = {
            skillsCollected: parseInt(localStorage.getItem('epicGameSkillsCollected') || '0'),
            enemiesDefeated: parseInt(localStorage.getItem('epicGameEnemiesDefeated') || '0'),
            shotsFired: parseInt(localStorage.getItem('epicGameShotsFired') || '0'),
            dashesUsed: parseInt(localStorage.getItem('epicGameDashesUsed') || '0'),
            shieldsUsed: parseInt(localStorage.getItem('epicGameShieldsUsed') || '0'),
            bossesDefeated: parseInt(localStorage.getItem('epicGameBossesDefeated') || '0'),
            gamesPlayed: parseInt(localStorage.getItem('epicGameGamesPlayed') || '0'),
            totalScore: parseInt(localStorage.getItem('epicGameTotalScore') || '0')
        };
        
        // Enhanced visual themes
        this.skillTypes = {
            code: { 
                color: '#3b82f6', 
                secondaryColor: '#1d4ed8',
                name: { en: 'Code Orb', ja: 'コードオーブ' }, 
                points: 100,
                size: 25,
                effect: 'sparkle'
            },
            web: { 
                color: '#10b981', 
                secondaryColor: '#047857',
                name: { en: 'Web Crystal', ja: 'ウェブクリスタル' }, 
                points: 120,
                size: 25,
                effect: 'pulse'
            },
            ai: { 
                color: '#ef4444', 
                secondaryColor: '#dc2626',
                name: { en: 'AI Core', ja: 'AIコア' }, 
                points: 200,
                size: 30,
                effect: 'rotate'
            },
            rare: { 
                color: '#8b5cf6', 
                secondaryColor: '#7c3aed',
                name: { en: 'Rare Gem', ja: 'レアジェム' }, 
                points: 300,
                size: 35,
                effect: 'glow'
            },
            legendary: { 
                color: '#f59e0b', 
                secondaryColor: '#d97706',
                name: { en: 'Legendary Star', ja: 'レジェンドスター' }, 
                points: 500,
                size: 40,
                effect: 'rainbow'
            }
        };
        
        // Enhanced power-up system
        this.powerupTypes = {
            health: { 
                color: '#ef4444', 
                secondaryColor: '#dc2626',
                name: { en: 'Health Pack', ja: 'ヘルスパック' }, 
                duration: 0, 
                effect: 'heal',
                description: { en: 'Restore 30 health', ja: 'HP30回復' }
            },
            energy: { 
                color: '#3b82f6', 
                secondaryColor: '#1d4ed8',
                name: { en: 'Energy Cell', ja: 'エナジーセル' }, 
                duration: 0, 
                effect: 'energize',
                description: { en: 'Restore full energy', ja: 'エナジー全回復' }
            },
            rapidFire: { 
                color: '#f59e0b', 
                secondaryColor: '#d97706',
                name: { en: 'Rapid Fire', ja: 'ラピッドファイア' }, 
                duration: 300, 
                effect: 'rapidFire',
                description: { en: 'Faster shooting for 5s', ja: '5秒間高速射撃' }
            },
            shield: { 
                color: '#10b981', 
                secondaryColor: '#047857',
                name: { en: 'Shield Boost', ja: 'シールドブースト' }, 
                duration: 0, 
                effect: 'shieldBoost',
                description: { en: 'Reset shield cooldown', ja: 'シールド即使用可能' }
            },
            multiShot: { 
                color: '#8b5cf6', 
                secondaryColor: '#7c3aed',
                name: { en: 'Multi Shot', ja: 'マルチショット' }, 
                duration: 240, 
                effect: 'multiShot',
                description: { en: 'Triple shot for 4s', ja: '4秒間3連射' }
            }
        };
        
        this.activePowerups = new Map();
        
        // Enhanced localization with detailed explanations
        this.texts = {
            en: {
                title: "Epic Skill Battle",
                subtitle: "Master combat skills in this action-packed adventure!",
                tutorial: "Tutorial",
                tutorialTexts: [
                    "Welcome to Epic Skill Battle! Use WASD or Arrow keys to move around.",
                    "Left Click or Space to shoot projectiles at enemies. Right Click or Shift for shield.",
                    "Middle Click or Q to dash through enemies. Collect blue orbs for points!",
                    "Avoid red enemies! Your health bar is at the top. Powerups restore health/energy.",
                    "Every 3 waves, face a boss! Use all your abilities to win. Good luck!"
                ],
                nextTip: "Press SPACE for next tip",
                startGame: "Press SPACE to Start Epic Battle!",
                objective: "Defeat enemies, collect orbs, survive boss battles!",
                controls: "Move: WASD/Arrows • Shoot: Space/Click • Shield: Shift/Right Click • Dash: Q/Middle Click",
                score: "Score",
                health: "Health",
                energy: "Energy",
                lives: "Lives",
                level: "Level",
                wave: "Wave",
                combo: "Combo",
                gameOver: "Game Over",
                victory: "Victory!",
                restart: "Press R to Restart",
                pause: "Paused - Press P to Resume",
                bossWarning: "BOSS APPROACHING!",
                bossIntro: "Prepare for battle!",
                skillCollected: "+",
                enemyDefeated: "Enemy Down!",
                bossDefeated: "BOSS DEFEATED!",
                powerupCollected: "Power Up!",
                newHighScore: "NEW RECORD!",
                achievementUnlocked: "Achievement!",
                finalScore: "Final Score",
                playTime: "Time",
                abilities: "Abilities: Shoot, Shield, Dash"
            },
            ja: {
                title: "エピックスキルバトル",
                subtitle: "アクション満載の戦闘でスキルをマスターせよ！",
                tutorial: "チュートリアル",
                tutorialTexts: [
                    "エピックスキルバトルへようこそ！WASD又は矢印キーで移動できます。",
                    "左クリック又はスペースで弾を撃ち、敵を倒そう。右クリック又はShiftでシールド。",
                    "中クリック又はQでダッシュ。敵を突き抜けられます！青いオーブでポイント獲得！",
                    "赤い敵を避けよう！上部にHP表示。パワーアップでHP/エナジー回復可能。",
                    "3ウェーブごとにボス戦！全能力を使って勝利せよ。健闘を祈る！"
                ],
                nextTip: "SPACEキーで次のヒント",
                startGame: "SPACEキーでエピックバトル開始！",
                objective: "敵を倒し、オーブを集め、ボス戦を生き抜け！",
                controls: "移動: WASD/矢印 • 射撃: スペース/クリック • シールド: Shift/右クリック • ダッシュ: Q/中クリック",
                score: "スコア",
                health: "HP",
                energy: "エナジー",
                lives: "ライフ",
                level: "レベル",
                wave: "ウェーブ",
                combo: "コンボ",
                gameOver: "ゲームオーバー",
                victory: "勝利！",
                restart: "Rキーでリスタート",
                pause: "ポーズ中 - Pキーで再開",
                bossWarning: "ボス接近中！",
                bossIntro: "戦闘準備！",
                skillCollected: "+",
                enemyDefeated: "敵撃破！",
                bossDefeated: "ボス撃破！",
                powerupCollected: "パワーアップ！",
                newHighScore: "新記録達成！",
                achievementUnlocked: "実績解除！",
                finalScore: "最終スコア",
                playTime: "タイム",
                abilities: "アビリティ: 射撃、シールド、ダッシュ"
            }
        };
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.createBackgroundElements();
        this.start();
    }
    
    setupEventListeners() {
        // Enhanced keyboard events with immediate response
        document.addEventListener('keydown', (e) => {
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
                e.preventDefault();
            }
            
            // Handle single press actions
            if (!this.keys[e.code]) {
                this.keysPressed[e.code] = true;
                this.handleKeyPress(e.code);
            }
            
            this.keys[e.code] = true;
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
            this.keysPressed[e.code] = false;
        });
        
        // Enhanced mouse events with multiple buttons
        this.canvas.addEventListener('mousemove', (e) => {
            e.preventDefault();
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = (e.clientX - rect.left) * (this.width / rect.width);
            this.mouse.y = (e.clientY - rect.top) * (this.height / rect.height);
            this.inputMode = 'mouse';
        });
        
        this.canvas.addEventListener('mousedown', (e) => {
            e.preventDefault();
            
            if (e.button === 0) { // Left click - shoot
                if (this.gameState === 'menu' && this.achievementsButton) {
                    // Check if clicking on achievements button
                    const rect = this.canvas.getBoundingClientRect();
                    const clickX = (e.clientX - rect.left) * (this.width / rect.width);
                    const clickY = (e.clientY - rect.top) * (this.height / rect.height);
                    
                    if (clickX >= this.achievementsButton.x && clickX <= this.achievementsButton.x + this.achievementsButton.width &&
                        clickY >= this.achievementsButton.y && clickY <= this.achievementsButton.y + this.achievementsButton.height) {
                        this.showAchievements();
                        return;
                    }
                }
                
                if (this.gameState === 'tutorial' || this.gameState === 'menu' || this.gameState === 'gameOver') {
                    this.handleSpacePress();
                } else if (this.gameState === 'playing' || this.gameState === 'bossFight') {
                    this.shoot();
                }
            } else if (e.button === 1) { // Middle click - dash
                if (this.gameState === 'playing' || this.gameState === 'bossFight') {
                    this.dash();
                }
            } else if (e.button === 2) { // Right click - shield
                if (this.gameState === 'playing' || this.gameState === 'bossFight') {
                    this.activateShield();
                }
            }
        });
        
        this.canvas.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
        
        // Enhanced touch events
        // Enhanced touch events for virtual controls
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.handleTouchStart(e);
        });
        
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            this.handleTouchMove(e);
        });
        
        this.canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.handleTouchEnd(e);
        });

        this.canvas.addEventListener('touchcancel', (e) => {
            e.preventDefault();
            this.handleTouchEnd(e);
        });
    }
    
    handleTouchStart(e) {
        this.inputMode = 'touch';
        
        for (let i = 0; i < e.touches.length; i++) {
            const touch = e.touches[i];
            const rect = this.canvas.getBoundingClientRect();
            const touchX = (touch.clientX - rect.left) * (this.width / rect.width);
            const touchY = (touch.clientY - rect.top) * (this.height / rect.height);
            
            // Handle non-game states with simple tap
            if (this.gameState === 'tutorial' || this.gameState === 'menu' || this.gameState === 'gameOver') {
                this.handleSpacePress();
                return;
            }
            
            // Check virtual joystick
            const joystickDist = Math.sqrt(
                Math.pow(touchX - this.virtualJoystick.centerX, 2) + 
                Math.pow(touchY - this.virtualJoystick.centerY, 2)
            );
            if (joystickDist <= this.virtualJoystick.radius) {
                this.virtualJoystick.isActive = true;
                this.virtualJoystick.touchId = touch.identifier;
                this.virtualJoystick.knobX = touchX;
                this.virtualJoystick.knobY = touchY;
                continue;
            }
            
            // Check virtual buttons
            for (const [buttonName, button] of Object.entries(this.virtualButtons)) {
                const buttonDist = Math.sqrt(
                    Math.pow(touchX - button.x, 2) + 
                    Math.pow(touchY - button.y, 2)
                );
                if (buttonDist <= button.radius) {
                    button.isPressed = true;
                    button.touchId = touch.identifier;
                    this.handleVirtualButtonPress(buttonName);
                    break;
                }
            }
        }
    }
    
    handleTouchMove(e) {
        for (let i = 0; i < e.touches.length; i++) {
            const touch = e.touches[i];
            const rect = this.canvas.getBoundingClientRect();
            const touchX = (touch.clientX - rect.left) * (this.width / rect.width);
            const touchY = (touch.clientY - rect.top) * (this.height / rect.height);
            
            // Update joystick knob position
            if (this.virtualJoystick.isActive && this.virtualJoystick.touchId === touch.identifier) {
                const dx = touchX - this.virtualJoystick.centerX;
                const dy = touchY - this.virtualJoystick.centerY;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance <= this.virtualJoystick.radius) {
                    this.virtualJoystick.knobX = touchX;
                    this.virtualJoystick.knobY = touchY;
                } else {
                    // Constrain to circle boundary
                    const angle = Math.atan2(dy, dx);
                    this.virtualJoystick.knobX = this.virtualJoystick.centerX + Math.cos(angle) * this.virtualJoystick.radius;
                    this.virtualJoystick.knobY = this.virtualJoystick.centerY + Math.sin(angle) * this.virtualJoystick.radius;
                }
            }
        }
    }
    
    handleTouchEnd(e) {
        // Reset joystick and buttons based on ended touches
        const remainingTouchIds = Array.from(e.touches).map(touch => touch.identifier);
        
        if (this.virtualJoystick.isActive && !remainingTouchIds.includes(this.virtualJoystick.touchId)) {
            this.virtualJoystick.isActive = false;
            this.virtualJoystick.knobX = this.virtualJoystick.centerX;
            this.virtualJoystick.knobY = this.virtualJoystick.centerY;
            this.virtualJoystick.touchId = null;
        }
        
        for (const button of Object.values(this.virtualButtons)) {
            if (button.isPressed && !remainingTouchIds.includes(button.touchId)) {
                button.isPressed = false;
                button.touchId = null;
            }
        }
    }
    
    handleVirtualButtonPress(buttonName) {
        if (this.gameState !== 'playing' && this.gameState !== 'bossFight') return;
        
        switch (buttonName) {
            case 'shoot':
                this.shoot();
                break;
            case 'dash':
                this.dash();
                break;
            case 'shield':
                this.activateShield();
                break;
            case 'pause':
                if (this.gameState === 'playing' || this.gameState === 'bossFight') {
                    this.gameState = 'paused';
                }
                break;
        }
    }
    
    handleKeyPress(code) {
        switch (code) {
            case 'Space':
                this.handleSpacePress();
                break;
            case 'KeyQ':
                if (this.gameState === 'playing' || this.gameState === 'bossFight') {
                    this.dash();
                }
                break;
            case 'ShiftLeft':
            case 'ShiftRight':
                if (this.gameState === 'playing' || this.gameState === 'bossFight') {
                    this.activateShield();
                }
                break;
            case 'KeyP':
                // P key only pauses the game
                if (this.gameState === 'playing' || this.gameState === 'bossFight') {
                    this.gameState = 'paused';
                }
                break;
            case 'KeyT':
                // T key: Tweet score in game over, return to title from pause
                if (this.gameState === 'gameOver') {
                    this.tweetScore();
                } else if (this.gameState === 'paused') {
                    this.gameState = 'menu';
                    this.resetGame();
                }
                break;
            case 'KeyL':
                this.toggleLanguage();
                break;
            case 'Escape':
                if (this.gameState === 'tutorial') {
                    this.gameState = 'menu';
                } else if (this.gameState === 'playing' || this.gameState === 'bossFight' || this.gameState === 'paused') {
                    this.gameState = 'menu';
                    this.resetGame();
                }
                break;
        }
    }
    
    handleSpacePress() {
        if (this.gameState === 'tutorial') {
            this.tutorialStep++;
            if (this.tutorialStep >= this.maxTutorialSteps) {
                this.gameState = 'menu';
            }
        } else if (this.gameState === 'menu') {
            this.startGame();
        } else if (this.gameState === 'gameOver') {
            this.resetGame();
        } else if (this.gameState === 'paused') {
            // Space key resumes the game from pause
            this.gameState = 'playing';
        } else if (this.gameState === 'achievements') {
            this.gameState = 'menu';
        } else if (this.gameState === 'playing' || this.gameState === 'bossFight') {
            // For space key, handle charge shot release
            if (this.player.isCharging) {
                this.releaseChargeShot();
            } else {
                this.shoot();
            }
        }
    }
    
    tweetScore() {
        const gameTitle = 'Epic Skill Battle';
        const scoreText = this.score.toLocaleString();
        const comboText = this.maxCombo;
        const bossesText = this.stats.bossesDefeated;
        const timeText = this.formatTime(this.gameTime);
        
        const portfolioUrl = 'https://masora1030.github.io/soraemonpockt/';
        
        let tweetText;
        if (this.language === 'ja') {
            tweetText = `${gameTitle}で${scoreText}点獲得！\n最大コンボ: ${comboText}x\nボス撃破: ${bossesText}体\nプレイ時間: ${timeText}\n\n${portfolioUrl}`;
        } else {
            tweetText = `I scored ${scoreText} points in ${gameTitle}!\nMax Combo: ${comboText}x\nBosses Defeated: ${bossesText}\nPlay Time: ${timeText}\n\n${portfolioUrl}`;
        }
        
        // Create Twitter URL
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
        
        // Open in new window/tab
        window.open(twitterUrl, '_blank', 'noopener,noreferrer');
        
        // Show confirmation
        this.addFloatingText(
            this.width / 2, 
            this.height / 2 + 200, 
            this.language === 'ja' ? 'ツイートを開きました！' : 'Tweet opened!', 
            '#1DA1F2', 
            120
        );
    }
    
    shoot() {
        if (!this.player.canShoot || this.player.shootCooldown > 0 || this.player.energy < 10) return;
        
        this.playSoundEffect('shoot');
        
        const rapidFireActive = this.activePowerups.has('rapidFire');
        const multiShotActive = this.activePowerups.has('multiShot');
        
        this.player.shootCooldown = rapidFireActive ? 
            this.player.maxShootCooldown * 0.3 : this.player.maxShootCooldown;
        this.player.energy = Math.max(0, this.player.energy - 10);
        
        // Calculate shot count based on player level and powerups
        let baseShotCount = this.player.baseShotCount;
        let shotCount = multiShotActive ? baseShotCount + 2 : baseShotCount;
        let damage = this.player.attackDamage;
        let shotColor = '#00ffff';
        
        // Berserk mode: double shot count and damage
        if (this.player.berserkMode) {
            shotCount = Math.floor(shotCount * 1.5);
            damage = Math.floor(damage * 1.5);
            shotColor = '#ff4400';
        }
        
        // Rapid fire mode: more shots
        if (this.player.rapidFireTimer > 0) {
            shotCount = Math.floor(shotCount * 1.3);
            shotColor = '#44ff00';
        }
        
        for (let i = 0; i < shotCount; i++) {
            const angle = shotCount > 1 ? (i - (shotCount-1)/2) * 0.2 : 0;
            
            this.projectiles.push({
                x: this.player.x + this.player.width / 2,
                y: this.player.y,
                width: 6 + this.player.attackLevel,
                height: 12 + this.player.attackLevel,
                speed: 8,
                angle: angle,
                vx: Math.sin(angle) * 8,
                vy: -8,
                damage: damage,
                type: 'player',
                attackLevel: this.player.attackLevel,
                color: shotColor,
                trail: []
            });
        }
        
        this.stats.shotsFired++;
        this.checkAchievement('firstShot');
        this.createMuzzleFlash();
    }
    
    fireHomingMissile() {
        // Find the closest enemy
        let closestEnemy = null;
        let closestDistance = Infinity;
        
        this.enemies.forEach(enemy => {
            const dx = enemy.x - this.player.x;
            const dy = enemy.y - this.player.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < closestDistance) {
                closestDistance = distance;
                closestEnemy = enemy;
            }
        });
        
        // If no enemies, don't fire
        if (!closestEnemy) return;
        
        // Create homing missile
        this.projectiles.push({
            x: this.player.x + this.player.width / 2 - 5,
            y: this.player.y,
            width: 10,
            height: 20,
            speed: 6,
            vx: 0,
            vy: -6,
            damage: this.player.attackDamage * 1.5,
            type: 'player',
            isHomingMissile: true,
            targetEnemy: closestEnemy,
            color: '#ff4400',
            trail: [],
            turnSpeed: 0.1
        });
        
        this.addFloatingText(this.player.x, this.player.y - 20, 
            this.language === 'ja' ? '追尾！' : 'HOMING!', '#ff4400', 40);
        this.playSoundEffect('shoot');
    }
    
    dash() {
        if (!this.player.canDash || this.player.dashCooldown > 0 || this.player.energy < 25) return;
        
        this.playSoundEffect('dash');
        
        this.player.isDashing = true;
        this.player.dashDuration = this.player.maxDashDuration;
        this.player.dashCooldown = this.player.maxDashCooldown;
        this.player.invulnerable = true;
        this.player.invulnerabilityTime = this.player.maxDashDuration;
        this.player.energy = Math.max(0, this.player.energy - 25);
        
        this.stats.dashesUsed++;
        this.checkAchievement('perfectDash');
        this.createDashEffect();
        this.addScreenShake(3, 100);
    }
    
    activateShield() {
        if (this.player.shieldCooldown > 0 || this.player.energy < 20) return;
        
        console.log('Activating shield! Energy:', this.player.energy, 'Cooldown:', this.player.shieldCooldown);
        this.playSoundEffect('shield');
        
        this.player.shieldActive = true;
        this.player.shieldDuration = this.player.maxShieldDuration;
        this.player.shieldCooldown = this.player.maxShieldCooldown;
        this.player.energy = Math.max(0, this.player.energy - 20);
        
        console.log('Shield activated! Duration:', this.player.shieldDuration, 'New cooldown:', this.player.shieldCooldown);
        
        this.stats.shieldsUsed++;
        this.checkAchievement('shieldMaster');
        this.createShieldEffect();
    }
    
    createMuzzleFlash() {
        for (let i = 0; i < 8; i++) {
            this.particles.push({
                x: this.player.x + this.player.width / 2,
                y: this.player.y,
                vx: (Math.random() - 0.5) * 6,
                vy: -Math.random() * 8,
                life: 200 + Math.random() * 100,
                maxLife: 300,
                color: '#ffff00',
                alpha: 1,
                size: 3 + Math.random() * 2
            });
        }
    }
    
    createDashEffect() {
        for (let i = 0; i < 15; i++) {
            this.particles.push({
                x: this.player.x + this.player.width / 2,
                y: this.player.y + this.player.height / 2,
                vx: (Math.random() - 0.5) * 8,
                vy: (Math.random() - 0.5) * 8,
                life: 400 + Math.random() * 200,
                maxLife: 600,
                color: '#00ffff',
                alpha: 1,
                size: 2 + Math.random() * 3
            });
        }
    }
    
    createShieldEffect() {
        for (let i = 0; i < 20; i++) {
            const angle = (i / 20) * Math.PI * 2;
            this.particles.push({
                x: this.player.x + this.player.width / 2 + Math.cos(angle) * 30,
                y: this.player.y + this.player.height / 2 + Math.sin(angle) * 30,
                vx: Math.cos(angle) * 2,
                vy: Math.sin(angle) * 2,
                life: 300,
                maxLife: 300,
                color: '#00ff00',
                alpha: 1,
                size: 3
            });
        }
    }
    
    toggleLanguage() {
        this.language = this.language === 'en' ? 'ja' : 'en';
        localStorage.setItem('epicGameLanguage', this.language);
    }
    
    startGame() {
        this.gameState = 'playing';
        this.resetGameStats(); // Call a separate function that doesn't change gameState
        this.stats.gamesPlayed++;
        this.saveStats();
    }
    
    resetGameStats() {
        // Reset game variables without changing gameState
        this.score = 0;
        this.lives = 3;
        this.currentLevel = 1;
        this.gameTime = 0;
        this.combo = 0;
        this.comboTimer = 0;
        this.difficultyMultiplier = 1.0;
        this.waveCount = 0;
        this.bossActive = false;
        this.boss = null;
        this.lastBossTime = 0; // Reset boss timer
        
        // Reset player
        this.player.x = this.width / 2 - 25;
        this.player.y = this.height - 80;
        this.player.health = 100;  // Reset to base health
        this.player.maxHealth = 100;
        this.player.energy = 150;  // Reset to base energy
        this.player.maxEnergy = 150;
        this.player.invulnerable = false;
        this.player.invulnerabilityTime = 0;
        this.player.shootCooldown = 0;
        // Reset progression
        this.player.level = 1;
        this.player.xp = 0;
        this.player.xpToNextLevel = 50; // Match the initial value
        this.player.attackDamage = 25;
        this.player.attackLevel = 1;
        this.player.dashCooldown = 0;
        // Reset charge shot
        this.player.isCharging = false;
        this.player.chargeLevel = 0;
        this.player.isDashing = false;
        this.player.dashDuration = 0;
        this.player.shieldActive = false;
        this.player.shieldCooldown = 0;
        this.player.shieldDuration = 0;
        this.player.baseShotCount = 1;
        this.player.berserkMode = false;
        this.player.berserkTimer = 0;
        this.player.rapidFireTimer = 0;
        this.player.emergencyShieldTimer = 0;
        this.player.killStreak = 0;
        this.player.lastKillTime = 0;
        this.player.hasHomingMissiles = false;
        this.player.homingMissileTimer = 0;

        // Clear arrays
        this.projectiles = [];
        this.enemies = [];
        this.skills = [];
        this.powerups = [];
        this.particles = [];
        this.floatingTexts = [];
        this.explosions = [];
        this.activePowerups.clear();
        
        // Reset timers
        this.skillSpawnTimer = 0;
        this.enemySpawnTimer = 0;
        this.powerupSpawnTimer = 0;
        this.screenShake = { x: 0, y: 0, intensity: 0, duration: 0 };
    }
    
    resetGame() {
        this.gameState = 'menu'; // Return to menu instead of immediately starting
        this.score = 0;
        this.lives = 3;
        this.currentLevel = 1;
        this.gameTime = 0;
        this.combo = 0;
        this.comboTimer = 0;
        this.difficultyMultiplier = 1.0;
        this.waveCount = 0;
        this.bossActive = false;
        this.boss = null;
        this.lastBossTime = 0; // Reset boss timer
        
        // Reset player
        this.player.x = this.width / 2 - 25;
        this.player.y = this.height - 80;
        this.player.health = 100;  // Reset to base health
        this.player.maxHealth = 100;
        this.player.energy = 150;  // Reset to base energy
        this.player.maxEnergy = 150;
        this.player.invulnerable = false;
        this.player.invulnerabilityTime = 0;
        this.player.shootCooldown = 0;
        // Reset progression
        this.player.level = 1;
        this.player.xp = 0;
        this.player.xpToNextLevel = 50; // Match the initial value
        this.player.attackDamage = 25;
        this.player.attackLevel = 1;
        this.player.dashCooldown = 0;
        // Reset charge shot
        this.player.isCharging = false;
        this.player.chargeLevel = 0;
        this.player.isDashing = false;
        this.player.dashDuration = 0;
        this.player.shieldActive = false;
        this.player.shieldCooldown = 0;
        this.player.shieldDuration = 0;
        this.player.baseShotCount = 1; // Reset shot count to initial value
        this.player.berserkMode = false;
        this.player.berserkTimer = 0;
        this.player.rapidFireTimer = 0;
        this.player.emergencyShieldTimer = 0;
        this.player.killStreak = 0;
        this.player.lastKillTime = 0;
        this.player.hasHomingMissiles = false;
        this.player.homingMissileTimer = 0;
        
        // Clear game objects
        this.skills = [];
        this.enemies = [];
        this.projectiles = [];
        this.particles = [];
        this.powerups = [];
        this.floatingTexts = [];
        this.explosions = [];
        this.activePowerups.clear();
        
        // Reset timers
        this.skillSpawnTimer = 0;
        this.enemySpawnTimer = 0;
        this.powerupSpawnTimer = 0;
        this.screenShake = { x: 0, y: 0, intensity: 0, duration: 0 };
    }
    
    update(deltaTime) {
        if (this.gameState !== 'playing' && this.gameState !== 'bossIntro' && this.gameState !== 'bossFight') return;
        
        this.gameTime += deltaTime;
        this.updateDifficulty();
        this.updatePlayer(deltaTime);
        this.updateProjectiles(deltaTime);
        this.updateSkills(deltaTime);
        this.updateEnemies(deltaTime);
        this.updatePowerups(deltaTime);
        this.updateParticles(deltaTime);
        this.updateFloatingTexts(deltaTime);
        this.updateExplosions(deltaTime);
        this.updateScreenShake(deltaTime);
        this.updateActivePowerups(deltaTime);
        this.updateCombo(deltaTime);
        this.updateBoss(deltaTime);
        this.spawnObjects(deltaTime);
        this.checkCollisions();
        this.checkTimeBasedAchievements();
        
        // Auto-regenerate energy (slower for more strategic gameplay)
        if (this.player.energy < this.player.maxEnergy) {
            this.player.energy = Math.min(this.player.maxEnergy, this.player.energy + 0.4); // Increased from 0.15 to 0.4
        }
        
        // Update buff timers
        if (this.player.berserkTimer > 0) {
            this.player.berserkTimer -= deltaTime;
            if (this.player.berserkTimer <= 0) {
                this.player.berserkMode = false;
            }
        }
        
        if (this.player.rapidFireTimer > 0) {
            this.player.rapidFireTimer -= deltaTime;
        }
        
        // Emergency shield system - activate when health is critical
        if (this.player.health <= 20 && !this.player.shieldActive && this.player.emergencyShieldTimer <= 0) {
            this.player.shieldActive = true;
            this.player.shieldDuration = 180; // 3 seconds
            this.player.emergencyShieldTimer = 1800; // 30 second cooldown
            this.addFloatingText(this.player.x, this.player.y - 30, 
                this.language === 'ja' ? '緊急シールド！' : 'EMERGENCY SHIELD!', '#00ff00', 80);
        }
        
        if (this.player.emergencyShieldTimer > 0) {
            this.player.emergencyShieldTimer -= deltaTime;
        }
        
        // Auto-fire homing missiles
        if (this.player.hasHomingMissiles) {
            this.player.homingMissileTimer -= deltaTime;
            if (this.player.homingMissileTimer <= 0) {
                this.fireHomingMissile();
                this.player.homingMissileTimer = this.player.homingMissileInterval;
            }
        }
    }
    
    updateDifficulty() {
        // More moderate difficulty scaling
        this.difficultyMultiplier = 1.0 + (this.gameTime / 12000) * 0.8;
        this.currentLevel = Math.floor(this.gameTime / 8000) + 1;
        
        // Check for boss battle - with 30 second cooldown
        const currentTime = Date.now();
        const timeSinceLastBoss = currentTime - this.lastBossTime;
        const minimumBossInterval = 30000; // 30 seconds in milliseconds
        
        if (!this.bossActive && this.waveCount > 0 && this.waveCount % this.wavesUntilBoss === 0 && 
            timeSinceLastBoss >= minimumBossInterval) {
            this.startBossIntro();
        }
    }
    
    updatePlayer(deltaTime) {
        const speed = this.player.speed * (this.player.isDashing ? 1.8 : 1.0);
        
        // Handle charge shot
        if (this.keys['Space'] && !this.player.isCharging && (this.gameState === 'playing' || this.gameState === 'bossFight')) {
            this.player.isCharging = true;
            this.player.chargeLevel = 0;
        }
        
        if (this.player.isCharging) {
            if (this.keys['Space']) {
                // Continue charging
                this.player.chargeLevel = Math.min(this.player.maxChargeLevel, this.player.chargeLevel + this.player.chargeRate);
            } else {
                // Release charge shot
                this.releaseChargeShot();
            }
        }
        
        // Virtual joystick movement (mobile)
        if (this.virtualJoystick.isActive) {
            const dx = this.virtualJoystick.knobX - this.virtualJoystick.centerX;
            const dy = this.virtualJoystick.knobY - this.virtualJoystick.centerY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance > 5) { // Dead zone
                const normalizedX = dx / this.virtualJoystick.radius;
                const normalizedY = dy / this.virtualJoystick.radius;
                
                this.player.x += normalizedX * speed * 0.8;
                this.player.y += normalizedY * speed * 0.8;
            }
        }
        
        // WASD and Arrow key movement (desktop)
        if (this.keys['KeyW'] || this.keys['ArrowUp']) {
            this.player.y = Math.max(0, this.player.y - speed);
        }
        if (this.keys['KeyS'] || this.keys['ArrowDown']) {
            this.player.y = Math.min(this.height - this.player.height, this.player.y + speed);
        }
        if (this.keys['KeyA'] || this.keys['ArrowLeft']) {
            this.player.x = Math.max(0, this.player.x - speed);
        }
        if (this.keys['KeyD'] || this.keys['ArrowRight']) {
            this.player.x = Math.min(this.width - this.player.width, this.player.x + speed);
        }
        
        // Mouse/touch movement
        if ((this.inputMode === 'mouse' || this.inputMode === 'touch') && 
            (this.mouse.isPressed || this.touch.isActive)) {
            const targetX = (this.inputMode === 'mouse' ? this.mouse.x : this.touch.x) - this.player.width / 2;
            const targetY = (this.inputMode === 'mouse' ? this.mouse.y : this.touch.y) - this.player.height / 2;
            
            const dx = targetX - this.player.x;
            const dy = targetY - this.player.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance > 5) {
                this.player.x += (dx / distance) * speed * 0.8;
                this.player.y += (dy / distance) * speed * 0.8;
            }
        }
        
        // Update abilities
        if (this.player.shootCooldown > 0) this.player.shootCooldown--;
        if (this.player.dashCooldown > 0) this.player.dashCooldown--;
        if (this.player.shieldCooldown > 0) this.player.shieldCooldown--;
        
        if (this.player.isDashing) {
            this.player.dashDuration--;
            if (this.player.dashDuration <= 0) {
                this.player.isDashing = false;
            }
        }
        
        if (this.player.shieldActive) {
            this.player.shieldDuration--;
            if (this.player.shieldDuration <= 0) {
                this.player.shieldActive = false;
            }
        }
        
        if (this.player.invulnerable && !this.player.isDashing) {
            this.player.invulnerabilityTime--;
            if (this.player.invulnerabilityTime <= 0) {
                this.player.invulnerable = false;
            }
        }
        
        // Update active powerups
        this.activePowerups.forEach((powerup, type) => {
            powerup.duration--;
            if (powerup.duration <= 0) {
                console.log('Powerup expired:', type);
                this.activePowerups.delete(type);
                this.addFloatingText(this.player.x, this.player.y, `${type} ended`, '#888888', 60);
            }
        });
        
        // Mobile button continuous actions
        if (this.virtualButtons.shoot.isPressed) {
            this.shoot();
        }
        
        // Keep player in bounds
        this.player.x = Math.max(0, Math.min(this.width - this.player.width, this.player.x));
        this.player.y = Math.max(0, Math.min(this.height - this.player.height, this.player.y));
    }
    
    startBossIntro() {
        this.gameState = 'bossIntro';
        this.bossIntroTimer = this.maxBossIntroTime;
        this.addFloatingText(this.width / 2, this.height / 2, this.texts[this.language].bossWarning, '#ff0000', 120);
        this.addScreenShake(10, 300);
        
        // Clear screen of enemies
        this.enemies = [];
        this.projectiles = this.projectiles.filter(p => p.type === 'player');
    }
    
    createBoss() {
        // Calculate boss level based on wave count
        const bossLevel = Math.floor(this.waveCount / 5) + 1;
        
        // Boss evolution forms with different characteristics
        const bossForm = this.getBossForm(bossLevel);
        
        this.boss = {
            x: this.width / 2 - 60,
            y: 50,
            width: 120 + (bossLevel * 10), // Boss gets bigger
            height: 120 + (bossLevel * 10),
            health: 400 + (this.waveCount * 80) + (bossLevel * 150),
            maxHealth: 400 + (this.waveCount * 80) + (bossLevel * 150),
            speed: 1 + (bossLevel * 0.5), // Boss gets faster
            shootTimer: 0,
            shootInterval: Math.max(30, 60 - (bossLevel * 5)), // Boss shoots more frequently
            moveDirection: 1,
            attackPattern: 0,
            patternTimer: 0,
            invulnerable: false,
            invulnerabilityTime: 0,
            level: bossLevel,
            maxAttackPatterns: Math.min(3 + bossLevel, 6), // More attack patterns as level increases
            // New boss form properties
            form: bossForm,
            color: bossForm.color,
            secondaryColor: bossForm.secondaryColor,
            shape: bossForm.shape,
            specialAttacks: bossForm.specialAttacks,
            name: bossForm.name
        };
        
        this.bossActive = true;
        this.gameState = 'bossFight';
        
        // Show boss evolution text
        this.addFloatingText(
            this.width / 2, 
            150, 
            `${bossForm.name[this.language]} ${this.language === 'ja' ? '登場！' : 'Appears!'}`, 
            bossForm.color, 
            180
        );
    }
    
    getBossForm(level) {
        const forms = [
            // Level 1: Basic Form
            {
                name: { en: 'Guardian Core', ja: 'ガーディアンコア' },
                color: '#ff4444',
                secondaryColor: '#cc2222',
                shape: 'circle',
                specialAttacks: ['basic']
            },
            // Level 2: Evolved Form
            {
                name: { en: 'Plasma Devastator', ja: 'プラズマデストロイヤー' },
                color: '#4444ff',
                secondaryColor: '#2222cc',
                shape: 'diamond',
                specialAttacks: ['basic', 'spiral']
            },
            // Level 3: Advanced Form
            {
                name: { en: 'Cyber Overlord', ja: 'サイバーオーバーロード' },
                color: '#44ff44',
                secondaryColor: '#22cc22',
                shape: 'star',
                specialAttacks: ['basic', 'spiral', 'burst']
            },
            // Level 4: Elite Form
            {
                name: { en: 'Quantum Emperor', ja: 'クアンタムエンペラー' },
                color: '#ff44ff',
                secondaryColor: '#cc22cc',
                shape: 'hexagon',
                specialAttacks: ['basic', 'spiral', 'burst', 'laser']
            },
            // Level 5: Ultimate Form
            {
                name: { en: 'Void Destroyer', ja: 'ヴォイドデストロイヤー' },
                color: '#ffaa00',
                secondaryColor: '#cc8800',
                shape: 'complex',
                specialAttacks: ['basic', 'spiral', 'burst', 'laser', 'chaos']
            },
            // Level 6+: Legendary Form
            {
                name: { en: 'Infinity Sovereign', ja: 'インフィニティソブリン' },
                color: '#ffffff',
                secondaryColor: '#cccccc',
                shape: 'morphing',
                specialAttacks: ['basic', 'spiral', 'burst', 'laser', 'chaos', 'ultimate']
            }
        ];
        
        // Cap at maximum form, but return increasingly powerful versions
        const formIndex = Math.min(level - 1, forms.length - 1);
        const selectedForm = { ...forms[formIndex] };
        
        // For levels beyond our defined forms, enhance the legendary form
        if (level > forms.length) {
            const enhancement = level - forms.length;
            selectedForm.name.en += ` Mk.${enhancement + 1}`;
            selectedForm.name.ja += ` Mk.${enhancement + 1}`;
            
            // Shift colors for higher levels
            const hue = (enhancement * 60) % 360;
            selectedForm.color = `hsl(${hue}, 70%, 50%)`;
            selectedForm.secondaryColor = `hsl(${hue}, 70%, 30%)`;
        }
        
        return selectedForm;
    }
    
    updateBoss(deltaTime) {
        if (this.gameState === 'bossIntro') {
            this.bossIntroTimer--;
            if (this.bossIntroTimer <= 0) {
                this.createBoss();
            }
            return;
        }
        
        if (!this.boss || !this.bossActive) return;
        
        // Enhanced boss movement patterns based on evolution level
        const time = Date.now() * 0.001;
        const baseSpeed = this.boss.speed;
        
        switch (this.boss.level) {
            case 1:
                // Basic horizontal movement
                this.boss.x += baseSpeed * this.boss.moveDirection;
                if (this.boss.x <= 0 || this.boss.x >= this.width - this.boss.width) {
                    this.boss.moveDirection *= -1;
                }
                break;
                
            case 2:
                // Figure-8 movement pattern
                const figure8Speed = 0.02;
                this.boss.x = (this.width / 2) + Math.sin(time * figure8Speed) * (this.width * 0.3);
                this.boss.y = 80 + Math.sin(time * figure8Speed * 2) * 30;
                break;
                
            case 3:
                // Circular orbital movement
                const orbitRadius = this.width * 0.25;
                const orbitCenterX = this.width / 2;
                const orbitCenterY = 120;
                this.boss.x = orbitCenterX + Math.cos(time * 0.03) * orbitRadius - this.boss.width / 2;
                this.boss.y = orbitCenterY + Math.sin(time * 0.03) * (orbitRadius * 0.5) - this.boss.height / 2;
                break;
                
            case 4:
                // Aggressive weaving pattern
                this.boss.x += baseSpeed * 1.5 * this.boss.moveDirection;
                this.boss.y = 80 + Math.sin(time * 0.05) * 40;
                if (this.boss.x <= 0 || this.boss.x >= this.width - this.boss.width) {
                    this.boss.moveDirection *= -1;
                }
                break;
                
            default:
                // Ultimate chaotic movement
                const chaosX = Math.sin(time * 0.04) * 0.3 + Math.cos(time * 0.07) * 0.2;
                const chaosY = Math.sin(time * 0.06) * 0.4 + Math.cos(time * 0.03) * 0.3;
                this.boss.x = (this.width / 2) + chaosX * (this.width * 0.35) - this.boss.width / 2;
                this.boss.y = 100 + chaosY * 60;
                break;
        }
        
        // Boss attack patterns
        this.boss.shootTimer++;
        this.boss.patternTimer++;
        
        if (this.boss.shootTimer >= this.boss.shootInterval) {
            this.bossAttack();
            this.boss.shootTimer = 0;
        }
        
        // Change attack patterns (more frequently at higher levels)
        const patternChangeTime = Math.max(150, 300 - (this.boss.level * 30));
        if (this.boss.patternTimer >= patternChangeTime) {
            this.boss.attackPattern = (this.boss.attackPattern + 1) % this.boss.maxAttackPatterns;
            this.boss.patternTimer = 0;
        }
        
        if (this.boss.invulnerable) {
            this.boss.invulnerabilityTime--;
            if (this.boss.invulnerabilityTime <= 0) {
                this.boss.invulnerable = false;
            }
        }
    }
    
    bossAttack() {
        const centerX = this.boss.x + this.boss.width / 2;
        const centerY = this.boss.y + this.boss.height;
        const baseDamage = 25 + (this.boss.level * 5);
        
        switch (this.boss.attackPattern) {
            case 0: // Single shot at player
                const dx = (this.player.x + this.player.width / 2) - centerX;
                const dy = (this.player.y + this.player.height / 2) - centerY;
                const length = Math.sqrt(dx * dx + dy * dy);
                
                this.projectiles.push({
                    x: centerX,
                    y: centerY,
                    width: 12 + this.boss.level,
                    height: 12 + this.boss.level,
                    vx: (dx / length) * (6 + this.boss.level * 0.5),
                    vy: (dy / length) * (6 + this.boss.level * 0.5),
                    damage: baseDamage + 10,
                    type: 'boss',
                    color: '#ff0000',
                    trail: []
                });
                break;
                
            case 1: // Spread shot
                const spreadCount = Math.min(3 + this.boss.level, 8);
                for (let i = 0; i < spreadCount; i++) {
                    const angle = (i - Math.floor(spreadCount/2)) * 0.4;
                    this.projectiles.push({
                        x: centerX,
                        y: centerY,
                        width: 8 + this.boss.level,
                        height: 8 + this.boss.level,
                        vx: Math.sin(angle) * (5 + this.boss.level * 0.3),
                        vy: Math.cos(angle) * (5 + this.boss.level * 0.3),
                        damage: baseDamage,
                        type: 'boss',
                        color: '#ff4444',
                        trail: []
                    });
                }
                break;
                
            case 2: // Circle shot
                const circleCount = Math.min(6 + this.boss.level * 2, 16);
                for (let i = 0; i < circleCount; i++) {
                    const angle = (i / circleCount) * Math.PI * 2;
                    this.projectiles.push({
                        x: centerX,
                        y: centerY,
                        width: 10 + this.boss.level,
                        height: 10 + this.boss.level,
                        vx: Math.cos(angle) * (4 + this.boss.level * 0.3),
                        vy: Math.sin(angle) * (4 + this.boss.level * 0.3),
                        damage: baseDamage,
                        type: 'boss',
                        color: '#ff6666',
                        trail: []
                    });
                }
                break;
                
            case 3: // Spiral shot (level 4+)
                if (this.boss.level >= 4) {
                    const spiralCount = 4;
                    for (let i = 0; i < spiralCount; i++) {
                        const angle = (Date.now() * 0.01 + i * Math.PI / 2) % (Math.PI * 2);
                        this.projectiles.push({
                            x: centerX,
                            y: centerY,
                            width: 8,
                            height: 8,
                            vx: Math.cos(angle) * 3,
                            vy: Math.sin(angle) * 3,
                            damage: baseDamage - 5,
                            type: 'boss',
                            color: '#ff8888',
                            trail: []
                        });
                    }
                }
                break;
                
            case 4: // Laser burst (level 6+)
                if (this.boss.level >= 6) {
                    for (let i = 0; i < 3; i++) {
                        const targetAngle = Math.atan2(
                            (this.player.y + this.player.height / 2) - centerY,
                            (this.player.x + this.player.width / 2) - centerX
                        ) + (i - 1) * 0.2;
                        
                        this.projectiles.push({
                            x: centerX,
                            y: centerY,
                            width: 6,
                            height: 20,
                            vx: Math.cos(targetAngle) * 8,
                            vy: Math.sin(targetAngle) * 8,
                            damage: baseDamage + 15,
                            type: 'boss',
                            color: '#ffaa00',
                            trail: []
                        });
                    }
                }
                break;
                
            case 5: // Ultimate pattern (level 8+)
                if (this.boss.level >= 8) {
                    // Combination attack
                    this.bossUltimateAttack(centerX, centerY, baseDamage);
                }
                break;
        }
    }
    
    bossUltimateAttack(centerX, centerY, baseDamage) {
        // Player-seeking missiles
        for (let i = 0; i < 2; i++) {
            const dx = (this.player.x + this.player.width / 2) - centerX;
            const dy = (this.player.y + this.player.height / 2) - centerY;
            const length = Math.sqrt(dx * dx + dy * dy);
            
            this.projectiles.push({
                x: centerX + (i - 0.5) * 30,
                y: centerY,
                width: 15,
                height: 15,
                vx: (dx / length) * 5,
                vy: (dy / length) * 5,
                damage: baseDamage + 20,
                type: 'boss',
                color: '#ffffff',
                trail: []
            });
        }
        
        // Circle burst
        for (let i = 0; i < 12; i++) {
            const angle = (i / 12) * Math.PI * 2;
            this.projectiles.push({
                x: centerX,
                y: centerY,
                width: 8,
                height: 8,
                vx: Math.cos(angle) * 6,
                vy: Math.sin(angle) * 6,
                damage: baseDamage,
                type: 'boss',
                color: '#ff0088',
                trail: []
            });
        }
    }
    
    // Continue with remaining methods...
    updateProjectiles(deltaTime) {
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const projectile = this.projectiles[i];
            
            // Optimized homing missile handling (only every 3rd frame for performance)
            if (projectile.isHomingMissile && projectile.targetEnemy && (i % 3 === 0)) {
                // Check if target still exists
                const targetExists = this.enemies.includes(projectile.targetEnemy);
                if (targetExists) {
                    // Simplified direction calculation
                    const dx = projectile.targetEnemy.x - projectile.x;
                    const dy = projectile.targetEnemy.y - projectile.y;
                    const distance = dx * dx + dy * dy; // Skip sqrt for performance
                    
                    if (distance > 400) { // Only home if far enough (20px squared)
                        // Simple direction update
                        const targetAngle = Math.atan2(dy, dx);
                        projectile.vx = Math.cos(targetAngle) * projectile.speed;
                        projectile.vy = Math.sin(targetAngle) * projectile.speed;
                    }
                } else {
                    // Target is gone, fly straight up
                    projectile.vy = -projectile.speed;
                    projectile.vx = 0;
                }
            }
            
            projectile.x += projectile.vx;
            projectile.y += projectile.vy;
            
            // Add trail effect
            projectile.trail.push({ x: projectile.x, y: projectile.y });
            if (projectile.trail.length > 5) {
                projectile.trail.shift();
            }
            
            // Remove if off screen
            if (projectile.x < -20 || projectile.x > this.width + 20 ||
                projectile.y < -20 || projectile.y > this.height + 20) {
                this.projectiles.splice(i, 1);
            }
        }
    }
    
    updateSkills(deltaTime) {
        this.skills.forEach((skill, index) => {
            // Slower, more reasonable skill movement
            skill.y += skill.speed * Math.min(this.difficultyMultiplier, 1.5);
            skill.rotation = (skill.rotation || 0) + 0.05;
            
            // Enhanced visual effects
            skill.pulsePhase = (skill.pulsePhase || 0) + 0.1;
            skill.pulse = 1 + Math.sin(skill.pulsePhase) * 0.2;
            
            if (skill.y > this.height + 50) {
                this.skills.splice(index, 1);
            }
        });
    }
    
    updateEnemies(deltaTime) {
        this.enemies.forEach((enemy, index) => {
            // Slower, more controlled enemy movement
            enemy.y += enemy.speed * Math.min(this.difficultyMultiplier, 1.3);
            
            // More interesting movement patterns
            if (enemy.type === 'seeker' && Math.random() < 0.02) {
                const dx = (this.player.x + this.player.width / 2) - (enemy.x + enemy.width / 2);
                enemy.x += Math.sign(dx) * 1.2;
            }
            
            // Add wave movement for variety
            if (enemy.type === 'fast') {
                enemy.x += Math.sin(Date.now() * 0.003 + enemy.y * 0.01) * 1.5;
                enemy.x = Math.max(0, Math.min(this.width - enemy.width, enemy.x));
            }
            
            // Tank enemies move in zigzag pattern
            if (enemy.type === 'tank') {
                if (!enemy.zigzagTimer) enemy.zigzagTimer = 0;
                enemy.zigzagTimer += deltaTime;
                if (enemy.zigzagTimer > 100) {
                    enemy.x += (Math.random() - 0.5) * 3;
                    enemy.x = Math.max(0, Math.min(this.width - enemy.width, enemy.x));
                    enemy.zigzagTimer = 0;
                }
            }
            
            if (enemy.y > this.height + 50) {
                this.enemies.splice(index, 1);
            }
        });
    }
    
    updatePowerups(deltaTime) {
        this.powerups.forEach((powerup, index) => {
            powerup.y += powerup.speed;
            powerup.rotation = (powerup.rotation || 0) + 0.1;
            powerup.pulse = 1 + Math.sin(Date.now() * 0.005) * 0.3;
            
            if (powerup.y > this.height + 50) {
                this.powerups.splice(index, 1);
            }
        });
    }
    
    updateParticles(deltaTime) {
        // Update particles in reverse order to avoid index issues
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life -= deltaTime;
            particle.alpha = Math.max(0, particle.life / particle.maxLife);
            particle.vx *= 0.98;
            particle.vy *= 0.98;
            
            if (particle.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }
    
    updateFloatingTexts(deltaTime) {
        // Update floating texts in reverse order to avoid index issues
        for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
            const text = this.floatingTexts[i];
            text.y -= 1.5;
            text.life -= deltaTime;
            text.alpha = Math.max(0, text.life / text.maxLife);
            
            if (text.life <= 0) {
                this.floatingTexts.splice(i, 1);
            }
        }
    }
    
    updateExplosions(deltaTime) {
        // Update explosions in reverse order to avoid index issues
        for (let i = this.explosions.length - 1; i >= 0; i--) {
            const explosion = this.explosions[i];
            explosion.radius += explosion.speed;
            explosion.life -= deltaTime;
            explosion.alpha = Math.max(0, explosion.life / explosion.maxLife);
            
            if (explosion.life <= 0) {
                this.explosions.splice(i, 1);
            }
        }
    }
    
    updateActivePowerups(deltaTime) {
        for (let [type, powerup] of this.activePowerups) {
            powerup.duration -= deltaTime;
            if (powerup.duration <= 0) {
                this.activePowerups.delete(type);
            }
        }
    }
    
    updateCombo(deltaTime) {
        if (this.comboTimer > 0) {
            this.comboTimer -= deltaTime;
            if (this.comboTimer <= 0) {
                this.combo = 0;
            }
        }
    }
    
    updateScreenShake(deltaTime) {
        if (this.screenShake.duration > 0) {
            this.screenShake.duration -= deltaTime;
            this.screenShake.x = (Math.random() - 0.5) * this.screenShake.intensity;
            this.screenShake.y = (Math.random() - 0.5) * this.screenShake.intensity;
        } else {
            this.screenShake.x = 0;
            this.screenShake.y = 0;
        }
    }
    
    spawnObjects(deltaTime) {
        // Allow skill spawning during boss fights, but not enemies
        const allowSkillSpawning = true;
        const allowEnemySpawning = !this.bossActive;
        
        const skillSpawnRate = Math.max(400, 1200 - (this.difficultyMultiplier * 150));
        // Base spawn rate decreases with difficulty and wave count
        const waveSpawnMultiplier = Math.max(0.6, 1 - (this.waveCount * 0.04)); // Slightly slower wave progression
        const enemySpawnRate = Math.max(400, (1800 - (this.difficultyMultiplier * 200)) * waveSpawnMultiplier); // Slower initial spawn
        const powerupSpawnRate = 4000; // Reduced from 8000 to 4000 for more frequent energy items
        
        // Spawn skills (allowed during boss fights)
        if (allowSkillSpawning) {
            this.skillSpawnTimer += deltaTime;
            if (this.skillSpawnTimer > skillSpawnRate) {
                this.spawnSkill();
                this.skillSpawnTimer = 0;
            }
        }
        
        // Spawn enemies (not during boss fights)
        if (allowEnemySpawning) {
            this.enemySpawnTimer += deltaTime;
            if (this.enemySpawnTimer > enemySpawnRate) {
                // Spawn multiple enemies at higher waves  
                const enemyCount = Math.min(1 + Math.floor(this.waveCount / 4), 3); // Max 3 enemies per spawn, slower progression
                for (let i = 0; i < enemyCount; i++) {
                    this.spawnEnemy();
                }
                this.enemySpawnTimer = 0;
            }
        }
        
        // Spawn powerups
        this.powerupSpawnTimer += deltaTime;
        if (this.powerupSpawnTimer > powerupSpawnRate) {
            this.spawnPowerup();
            this.powerupSpawnTimer = 0;
        }
        
        // Count waves (slower wave progression)
        if (this.gameTime > 0 && Math.floor(this.gameTime / 12000) > this.waveCount - 1) { // Changed from 10000 to 12000
            this.waveCount++;
        }
    }
    
    spawnSkill() {
        const rand = Math.random();
        let skillType;
        
        if (rand < 0.05) skillType = 'legendary';
        else if (rand < 0.15) skillType = 'rare';
        else if (rand < 0.35) skillType = 'ai';
        else if (rand < 0.65) skillType = 'web';
        else skillType = 'code';
        
        const skill = this.skillTypes[skillType];
        
        this.skills.push({
            x: Math.random() * (this.width - skill.size),
            y: -skill.size,
            width: skill.size,
            height: skill.size,
            speed: 1.0 + Math.random() * 0.8, // Much slower skill items
            type: skillType,
            color: skill.color,
            secondaryColor: skill.secondaryColor,
            points: skill.points,
            effect: skill.effect,
            rotation: 0,
            pulse: 1,
            pulsePhase: 0
        });
    }
    
    spawnEnemy() {
        const enemyTypes = ['basic', 'fast', 'seeker', 'tank'];
        const type = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
        
        // Scale enemy stats based on wave count
        const waveScaling = 1 + (this.waveCount * 0.15); // 15% increase per wave
        
        let size = 30;
        let speed = (1.2 + Math.random() * 0.8) * Math.min(waveScaling * 0.6, 1.8); // Slower enemies, cap speed scaling
        let health = Math.floor(25 * waveScaling);
        let color = '#ff4444';
        
        switch (type) {
            case 'fast':
                speed *= 1.3;
                size = 25;
                health = Math.floor(15 * waveScaling);
                color = '#ff6666';
                break;
            case 'seeker':
                size = 35;
                speed *= 0.8;
                health = Math.floor(35 * waveScaling);
                color = '#ff2222';
                break;
            case 'tank':
                size = 40;
                speed *= 0.5;
                health = Math.floor(50 * waveScaling);
                color = '#cc2222';
                break;
        }
        
        this.enemies.push({
            x: Math.random() * (this.width - size),
            y: -size,
            width: size,
            height: size,
            speed: speed,
            health: health,
            maxHealth: health,
            type: type,
            color: color
        });
    }
    
    spawnPowerup() {
        const powerupKeys = Object.keys(this.powerupTypes);
        // Increase chance of energy powerups by 50%
        const rand = Math.random();
        let randomType;
        if (rand < 0.4) { // 40% chance for energy
            randomType = 'energy';
        } else {
            const filteredKeys = powerupKeys.filter(key => key !== 'energy');
            randomType = filteredKeys[Math.floor(Math.random() * filteredKeys.length)];
        }
        const powerupType = this.powerupTypes[randomType];
        
        this.powerups.push({
            x: Math.random() * (this.width - 35),
            y: -35,
            width: 35,
            height: 35,
            speed: 1.2,
            type: randomType,
            color: powerupType.color,
            secondaryColor: powerupType.secondaryColor,
            pulse: 1,
            rotation: 0
        });
    }
    
    checkCollisions() {
        // Player projectiles vs enemies
        this.projectiles.forEach((projectile, pIndex) => {
            if (projectile.type !== 'player') return;
            
            this.enemies.forEach((enemy, eIndex) => {
                if (this.isColliding(projectile, enemy)) {
                    enemy.health -= projectile.damage;
                    this.projectiles.splice(pIndex, 1);
                    
                    // Show damage dealt to enemy
                    this.addFloatingText(
                        enemy.x + enemy.width / 2, 
                        enemy.y - 10, 
                        `-${projectile.damage}`, 
                        '#ffff00', 
                        60
                    );
                    
                    this.createHitEffect(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, enemy.color);
                    this.playSoundEffect('hit');
                    
                    if (enemy.health <= 0) {
                        this.playSoundEffect('explosion');
                        this.destroyEnemy(enemy, eIndex);
                    }
                }
            });
            
            // Player projectiles vs boss
            if (this.boss && this.bossActive && !this.boss.invulnerable && this.isColliding(projectile, this.boss)) {
                this.boss.health -= projectile.damage;
                this.projectiles.splice(pIndex, 1);
                
                // Show damage dealt to boss
                this.addFloatingText(
                    this.boss.x + this.boss.width / 2, 
                    this.boss.y - 20, 
                    `-${projectile.damage}`, 
                    '#ff8800', 
                    80
                );
                
                this.createHitEffect(this.boss.x + this.boss.width / 2, this.boss.y + this.boss.height / 2, '#ff0000');
                this.playSoundEffect('bossHit');
                this.boss.invulnerable = true;
                this.boss.invulnerabilityTime = 10;
                
                if (this.boss.health <= 0) {
                    this.defeatBoss();
                }
            }
        });
        
        // Boss/enemy projectiles vs player
        this.projectiles.forEach((projectile, index) => {
            if (projectile.type === 'player') return;
            
            if (this.isColliding(projectile, this.player)) {
                this.projectiles.splice(index, 1);
                this.damagePlayer(projectile.damage);
            }
        });
        
        // Player vs skills
        this.skills.forEach((skill, index) => {
            if (this.isColliding(this.player, skill)) {
                this.collectSkill(skill, index);
            }
        });
        
        // Player vs enemies (collision damage)
        if (!this.player.invulnerable && !this.player.shieldActive) {
            this.enemies.forEach((enemy, index) => {
                if (this.isColliding(this.player, enemy)) {
                    this.damagePlayer(20);
                    this.destroyEnemy(enemy, index);
                }
            });
        }
        
        // Player vs powerups
        this.powerups.forEach((powerup, index) => {
            if (this.isColliding(this.player, powerup)) {
                this.collectPowerup(powerup, index);
            }
        });
    }
    
    isColliding(obj1, obj2) {
        return obj1.x < obj2.x + obj2.width &&
               obj1.x + obj1.width > obj2.x &&
               obj1.y < obj2.y + obj2.height &&
               obj1.y + obj1.height > obj2.y;
    }
    
    collectSkill(skill, index) {
        const comboMultiplier = Math.floor(this.combo / 5) + 1;
        const points = Math.floor(skill.points * comboMultiplier);
        
        this.playSoundEffect('powerup');
        
        this.score += points;
        this.skills.splice(index, 1);
        this.combo++;
        this.maxCombo = Math.max(this.maxCombo, this.combo);
        this.comboTimer = this.maxComboTimer;
        
        this.createCollectEffect(skill.x + skill.width / 2, skill.y + skill.height / 2, skill.color);
        this.addFloatingText(skill.x, skill.y, `${this.texts[this.language].skillCollected}${points}`, skill.color);
        
        this.stats.skillsCollected++;
        this.stats.totalScore += points;
        
        // Grant XP for skill collection
        this.grantXP(5);
        
        this.checkAchievement('combo10');
        this.saveStats();
    }
    
    collectPowerup(powerup, index) {
        console.log('Collecting powerup:', powerup.type, 'Player health before:', this.player.health);
        const powerupType = this.powerupTypes[powerup.type];
        this.powerups.splice(index, 1);
        
        switch (powerup.type) {
            case 'health':
                const healAmount = 30;
                const oldHealth = this.player.health;
                this.player.health = Math.min(this.player.maxHealth, this.player.health + healAmount);
                const actualHeal = this.player.health - oldHealth;
                console.log('Health powerup: old health =', oldHealth, 'new health =', this.player.health, 'heal amount =', actualHeal);
                this.addFloatingText(this.player.x, this.player.y, `+${actualHeal} HP`, '#00ff00', 90);
                this.playSoundEffect('powerup');
                break;
            case 'energy':
                console.log('Energy powerup: old energy =', this.player.energy, 'max energy =', this.player.maxEnergy);
                this.player.energy = this.player.maxEnergy;
                this.addFloatingText(this.player.x, this.player.y, 'Energy Full!', '#00aaff', 90);
                this.playSoundEffect('powerup');
                break;
            case 'shieldBoost':
                console.log('Shield boost: old cooldown =', this.player.shieldCooldown);
                this.player.shieldCooldown = 0;
                this.addFloatingText(this.player.x, this.player.y, 'Shield Ready!', '#00ff88', 90);
                this.playSoundEffect('powerup');
                break;
            default:
                console.log('Default powerup case:', powerup.type, 'Duration:', powerupType.duration);
                this.activePowerups.set(powerup.type, { duration: powerupType.duration });
                
                // Show specific powerup activation text
                let powerupText = '';
                switch (powerup.type) {
                    case 'rapidFire':
                        powerupText = this.language === 'ja' ? 'ラピッドファイア！' : 'Rapid Fire!';
                        break;
                    case 'multiShot':
                        powerupText = this.language === 'ja' ? 'マルチショット！' : 'Multi Shot!';
                        break;
                    default:
                        powerupText = powerupType.name[this.language] || powerup.type;
                        break;
                }
                this.addFloatingText(this.player.x, this.player.y, powerupText, powerup.color, 120);
                
                this.playSoundEffect('powerup');
                break;
        }
        
        this.createCollectEffect(powerup.x + powerup.width / 2, powerup.y + powerup.height / 2, powerup.color);
        this.addFloatingText(powerup.x, powerup.y, this.texts[this.language].powerupCollected, powerup.color);
        this.addScreenShake(3, 100);
    }
    
    damagePlayer(damage) {
        if (this.player.invulnerable) return;
        
        console.log('Player taking damage:', damage, 'Shield active:', this.player.shieldActive, 'Player health before damage:', this.player.health);
        
        if (this.player.shieldActive) {
            console.log('Shield blocked damage! Duration remaining:', this.player.shieldDuration);
            this.addFloatingText(this.player.x, this.player.y, 'SHIELD!', '#00ff88', 120);
            this.player.shieldActive = false;
            this.player.shieldDuration = 0;
            damage *= 0.2; // Even more reduced damage with shield (from 0.3 to 0.2)
            console.log('Reduced damage to:', damage);
        }
        
        this.player.health -= damage;
        this.player.invulnerable = true;
        this.player.invulnerabilityTime = 60;
        this.combo = 0;
        
        console.log('Player health after damage:', this.player.health);
        
        this.addScreenShake(12, 300);
        this.createHitEffect(this.player.x + this.player.width / 2, this.player.y + this.player.height / 2, '#ff0000');
        
        if (this.player.health <= 0) {
            this.lives--;
            if (this.lives <= 0) {
                this.gameOver();
            } else {
                this.player.health = this.player.maxHealth;
                this.player.energy = this.player.maxEnergy;
            }
        }
    }
    
    destroyEnemy(enemy, index) {
        this.enemies.splice(index, 1);
        
        // Enhanced explosion and particle effects
        this.createExplosion(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, enemy.color);
        
        // Create multiple particles for destruction effect
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const speed = 3 + Math.random() * 4;
            this.particles.push({
                x: enemy.x + enemy.width / 2,
                y: enemy.y + enemy.height / 2,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 60,
                maxLife: 60,
                alpha: 1,
                color: enemy.color,
                size: 3 + Math.random() * 2
            });
        }
        
        // Combo system
        this.combo++;
        this.comboTimer = 300; // 5 seconds to continue combo
        
        // Kill streak system
        const currentTime = Date.now();
        if (currentTime - this.player.lastKillTime < 2000) { // Within 2 seconds
            this.player.killStreak++;
        } else {
            this.player.killStreak = 1;
        }
        this.player.lastKillTime = currentTime;
        
        // Activate rapid fire mode for kill streaks
        if (this.player.killStreak >= 3) {
            this.player.rapidFireTimer = 300; // 5 seconds
            if (this.player.killStreak === 3) {
                this.addFloatingText(this.player.x, this.player.y - 40, 
                    this.language === 'ja' ? 'ラピッドファイア！' : 'RAPID FIRE!', '#00ff00', 80);
            }
        }
        
        let scoreBonus = 50;
        if (this.combo > 5) {
            scoreBonus += Math.floor(this.combo * 10); // Bonus score for combo
            this.addFloatingText(enemy.x, enemy.y - 20, `${this.combo}x COMBO! +${scoreBonus}`, '#ff8800', 60);
        } else {
            this.addFloatingText(enemy.x, enemy.y, this.texts[this.language].enemyDefeated, '#ffff00');
        }
        
        this.stats.enemiesDefeated++;
        this.score += scoreBonus;
        
        // Grant XP for enemy defeat (increased from 10 to 25)
        this.grantXP(25);
    }
    
    defeatBoss() {
        this.playSoundEffect('victory');
        
        this.bossActive = false;
        this.boss = null;
        this.gameState = 'playing';
        this.lastBossTime = Date.now(); // Record when boss was defeated
        
        this.createExplosion(this.boss?.x + 60 || this.width / 2, this.boss?.y + 60 || 100, '#ff0000');
        this.addFloatingText(this.width / 2, this.height / 2, this.texts[this.language].bossDefeated, '#ffd700', 180);
        this.addScreenShake(15, 500);
        
        this.stats.bossesDefeated++;
        this.score += 2000;
        
        // Grant large XP for boss defeat
        this.grantXP(100 + (this.boss?.level || 1) * 50);
        
        // Activate BERSERK MODE for 15 seconds after boss defeat
        this.player.berserkMode = true;
        this.player.berserkTimer = 900; // 15 seconds at 60fps
        this.addFloatingText(this.width / 2, this.height / 2 + 50, 
            this.language === 'ja' ? 'バーサークモード！' : 'BERSERK MODE!', '#ff0000', 120);
        
        this.checkAchievement('bossDefeated');
        this.checkAchievement('legend');
    }
    
    grantXP(amount) {
        this.player.xp += amount;
        this.addFloatingText(this.player.x, this.player.y - 20, `+${amount} XP`, '#00ccff', 60);
        
        // Check for level up
        while (this.player.xp >= this.player.xpToNextLevel) {
            this.levelUp();
        }
    }
    
    levelUp() {
        this.player.xp -= this.player.xpToNextLevel;
        this.player.level++;
        this.player.xpToNextLevel = Math.floor(this.player.xpToNextLevel * 1.3); // Reduced multiplier from 1.5 to 1.3
        
        // Increase player stats
        this.player.maxHealth += 10;
        this.player.health = this.player.maxHealth; // Full heal on level up
        this.player.maxEnergy += 5;
        this.player.energy = this.player.maxEnergy;
        
        // Increase shot count every 5 levels
        if (this.player.level % 5 === 0) {
            this.player.baseShotCount++;
            this.addFloatingText(this.player.x, this.player.y - 60, 
                `${this.language === 'ja' ? '弾数増加！' : 'Shot Count Up!'} ${this.player.baseShotCount}`, 
                '#ff6600', 120);
        }
        
        // Unlock homing missiles at level 10
        if (this.player.level === 10) {
            this.player.hasHomingMissiles = true;
            this.addFloatingText(this.player.x, this.player.y - 80, 
                this.language === 'ja' ? '追尾ミサイル解除！' : 'HOMING MISSILES UNLOCKED!', 
                '#ff4400', 120);
        }
        
        // Evolve attack every few levels
        const newAttackLevel = Math.floor((this.player.level - 1) / 3) + 1;
        if (newAttackLevel > this.player.attackLevel) {
            this.evolveAttack(newAttackLevel);
        }
        
        // Show level up effect
        this.addFloatingText(this.player.x, this.player.y - 40, 
            `${this.language === 'ja' ? 'レベルアップ！' : 'LEVEL UP!'} Lv.${this.player.level}`, 
            '#ffd700', 150);
        this.createLevelUpEffect();
        this.playSoundEffect('powerup');
        this.addScreenShake(8, 200);
    }
    
    releaseChargeShot() {
        if (this.player.chargeLevel < 40) { // Increased minimum charge time from 20 to 40
            // Not enough charge, fire normal shot
            this.shoot();
        } else {
            // Fire charge shot
            const chargeMultiplier = 1 + (this.player.chargeLevel / this.player.maxChargeLevel) * 2; // Up to 3x damage
            const damage = Math.floor(this.player.attackDamage * chargeMultiplier);
            
            // Create massive charge beam
            const beamWidth = 30 + (this.player.chargeLevel / 3);
            const beamHeight = 40 + (this.player.chargeLevel / 2);
            
            const projectile = {
                x: this.player.x + this.player.width / 2 - beamWidth / 2,
                y: this.player.y,
                width: beamWidth,
                height: beamHeight,
                speed: 10,
                vx: 0,
                vy: -10,
                damage: damage,
                type: 'player',
                isChargedShot: true,
                chargeLevel: this.player.chargeLevel,
                color: '#ffaa00',
                trail: [],
                glowIntensity: Math.min(this.player.chargeLevel / 20, 5),
                beamEffect: true
            };
            
            this.projectiles.push(projectile);
            
            // Add screen shake effect
            this.screenShake.intensity = 8;
            this.screenShake.duration = 200;
            
            // Add visual explosion effect at launch
            this.explosions.push({
                x: this.player.x + this.player.width / 2,
                y: this.player.y,
                radius: 5,
                maxRadius: 60,
                life: 300,
                maxLife: 300,
                alpha: 1,
                speed: 2,
                color: '#ffaa00'
            });
            
            this.addFloatingText(this.player.x, this.player.y - 30, `CHARGE BEAM! ${damage}`, '#ffaa00', 80);
            this.playSoundEffect('chargeShot');
            
            // Consume more energy based on charge level
            const energyCost = 20 + (this.player.chargeLevel / 3); // Increased base cost from 10 to 20
            this.player.energy = Math.max(0, this.player.energy - energyCost);
        }
        
        // Reset charge
        this.player.isCharging = false;
        this.player.chargeLevel = 0;
    }
    
    evolveAttack(newAttackLevel) {
        const oldAttackLevel = this.player.attackLevel;
        this.player.attackLevel = newAttackLevel;
        this.player.attackDamage = 25 + (newAttackLevel - 1) * 15;
        
        const attackNames = [
            { en: 'Basic Shot', ja: 'ベーシックショット' },        // Level 1
            { en: 'Power Blast', ja: 'パワーブラスト' },          // Level 2
            { en: 'Plasma Cannon', ja: 'プラズマキャノン' },       // Level 3
            { en: 'Energy Beam', ja: 'エナジービーム' },          // Level 4
            { en: 'Quantum Strike', ja: 'クアンタムストライク' },   // Level 5
            { en: 'Void Destroyer', ja: 'ヴォイドデストロイヤー' }  // Level 6+
        ];
        
        const attackIndex = Math.min(newAttackLevel - 1, attackNames.length - 1);
        const attackName = attackNames[attackIndex][this.language];
        
        this.addFloatingText(this.player.x, this.player.y - 60, 
            `${this.language === 'ja' ? '攻撃進化！' : 'ATTACK EVOLVED!'}\n${attackName}`, 
            '#ff6600', 180);
        
        // Create special evolution effect
        this.createAttackEvolutionEffect();
    }
    
    createLevelUpEffect() {
        // Create particles around player
        for (let i = 0; i < 20; i++) {
            const angle = (i / 20) * Math.PI * 2;
            const speed = 5 + Math.random() * 3;
            this.particles.push({
                x: this.player.x + this.player.width / 2,
                y: this.player.y + this.player.height / 2,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 60 + Math.random() * 30,
                maxLife: 60 + Math.random() * 30,
                color: '#ffd700',
                size: 3 + Math.random() * 2
            });
        }
    }
    
    createAttackEvolutionEffect() {
        // Create special evolution particles
        for (let i = 0; i < 30; i++) {
            const angle = (i / 30) * Math.PI * 2;
            const speed = 3 + Math.random() * 4;
            this.particles.push({
                x: this.player.x + this.player.width / 2,
                y: this.player.y + this.player.height / 2,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 90 + Math.random() * 60,
                maxLife: 90 + Math.random() * 60,
                color: '#ff6600',
                size: 4 + Math.random() * 3
            });
        }
    }
    
    gameOver() {
        this.playSoundEffect('gameOver');
        
        this.gameState = 'gameOver';
        this.totalGameTime += this.gameTime;
        
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('epicGameHighScore', this.highScore.toString());
            this.addFloatingText(this.width / 2, this.height / 2 - 100, this.texts[this.language].newHighScore, '#ffd700', 120);
        }
        
        this.saveStats();
        localStorage.setItem('epicGameTotalTime', this.totalGameTime.toString());
    }
    
    createCollectEffect(x, y, color) {
        for (let i = 0; i < 15; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 8,
                vy: (Math.random() - 0.5) * 8,
                life: 400 + Math.random() * 200,
                maxLife: 600,
                color: color,
                alpha: 1,
                size: 2 + Math.random() * 3
            });
        }
    }
    
    createHitEffect(x, y, color) {
        for (let i = 0; i < 10; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 6,
                vy: (Math.random() - 0.5) * 6,
                life: 300 + Math.random() * 200,
                maxLife: 500,
                color: color,
                alpha: 1,
                size: 2 + Math.random() * 2
            });
        }
    }
    
    createExplosion(x, y, color) {
        this.explosions.push({
            x: x,
            y: y,
            radius: 0,
            maxRadius: 50,
            speed: 3,
            life: 400,
            maxLife: 400,
            color: color,
            alpha: 1
        });
        
        for (let i = 0; i < 25; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 12,
                vy: (Math.random() - 0.5) * 12,
                life: 600 + Math.random() * 400,
                maxLife: 1000,
                color: color,
                alpha: 1,
                size: 3 + Math.random() * 4
            });
        }
    }
    
    addFloatingText(x, y, text, color, duration = 60) {
        this.floatingTexts.push({
            x: x,
            y: y,
            text: text,
            color: color,
            life: duration,
            maxLife: duration,
            alpha: 1
        });
    }
    
    addScreenShake(intensity, duration) {
        this.screenShake.intensity = Math.max(this.screenShake.intensity, intensity);
        this.screenShake.duration = Math.max(this.screenShake.duration, duration);
    }
    
    checkTimeBasedAchievements() {
        this.checkAchievement('survivor');
        this.checkAchievement('scoreHunter');
    }
    
    checkAchievement(achievementId) {
        if (this.achievements[achievementId].unlocked) return;
        
        let unlocked = false;
        
        switch (achievementId) {
            case 'firstShot':
                unlocked = this.stats.shotsFired >= 1;
                break;
            case 'combo10':
                unlocked = this.maxCombo >= 10;
                break;
            case 'bossDefeated':
                unlocked = this.stats.bossesDefeated >= 1;
                break;
            case 'perfectDash':
                unlocked = this.stats.dashesUsed >= 50;
                break;
            case 'shieldMaster':
                unlocked = this.stats.shieldsUsed >= 25;
                break;
            case 'survivor':
                unlocked = this.gameTime >= 180000;
                break;
            case 'scoreHunter':
                unlocked = this.score >= 25000;
                break;
            case 'legend':
                unlocked = this.stats.bossesDefeated >= 3;
                break;
        }
        
        if (unlocked) {
            this.unlockAchievement(achievementId);
        }
    }
    
    unlockAchievement(achievementId) {
        this.achievements[achievementId].unlocked = true;
        this.saveAchievements();
        
        const achievement = this.achievements[achievementId];
        this.addFloatingText(
            this.width / 2, 
            100, 
            `${this.texts[this.language].achievementUnlocked}\n${achievement.icon} ${achievement.name[this.language]}`, 
            '#ffd700', 
            180
        );
        
        this.addScreenShake(5, 200);
    }
    
    saveAchievements() {
        localStorage.setItem('epicGameAchievements', JSON.stringify(this.achievements));
    }
    
    loadAchievements() {
        const saved = localStorage.getItem('epicGameAchievements');
        if (saved) {
            const savedAchievements = JSON.parse(saved);
            for (let key in savedAchievements) {
                if (this.achievements[key]) {
                    this.achievements[key].unlocked = savedAchievements[key].unlocked;
                }
            }
        }
    }
    
    saveStats() {
        localStorage.setItem('epicGameSkillsCollected', this.stats.skillsCollected.toString());
        localStorage.setItem('epicGameEnemiesDefeated', this.stats.enemiesDefeated.toString());
        localStorage.setItem('epicGameShotsFired', this.stats.shotsFired.toString());
        localStorage.setItem('epicGameDashesUsed', this.stats.dashesUsed.toString());
        localStorage.setItem('epicGameShieldsUsed', this.stats.shieldsUsed.toString());
        localStorage.setItem('epicGameBossesDefeated', this.stats.bossesDefeated.toString());
        localStorage.setItem('epicGameGamesPlayed', this.stats.gamesPlayed.toString());
        localStorage.setItem('epicGameTotalScore', this.stats.totalScore.toString());
    }
    
    createBackgroundElements() {
        this.backgroundElements = [];
        for (let i = 0; i < 30; i++) {
            this.backgroundElements.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                size: Math.random() * 2 + 1,
                speed: Math.random() * 0.5 + 0.1,
                alpha: Math.random() * 0.3 + 0.1,
                twinkle: Math.random() * Math.PI * 2
            });
        }
    }
    
    render() {
        // Clear canvas with screen shake
        this.ctx.save();
        this.ctx.translate(this.screenShake.x, this.screenShake.y);
        this.ctx.clearRect(-this.screenShake.x, -this.screenShake.y, this.width, this.height);
        
        // Enhanced background
        this.renderBackground();
        
        if (this.gameState === 'tutorial') {
            this.renderTutorial();
        } else if (this.gameState === 'menu') {
            this.renderMenu();
        } else if (this.gameState === 'playing' || this.gameState === 'paused' || 
                   this.gameState === 'bossIntro' || this.gameState === 'bossFight') {
            this.renderGame();
            if (this.gameState === 'paused') {
                this.renderPauseOverlay();
            } else if (this.gameState === 'bossIntro') {
                this.renderBossIntro();
            }
        } else if (this.gameState === 'gameOver') {
            this.renderGameOver();
        } else if (this.gameState === 'achievements') {
            this.renderAchievements();
        }
        
        // Render mobile controls on top of everything (if mobile)
        if (this.isMobile && (this.gameState === 'playing' || this.gameState === 'bossFight')) {
            this.renderMobileControls();
        }
        
        this.ctx.restore();
    }
    
    renderBackground() {
        // Animated starfield
        const gradient = this.ctx.createRadialGradient(this.width/2, this.height/2, 0, this.width/2, this.height/2, this.width);
        gradient.addColorStop(0, '#0a0a1a');
        gradient.addColorStop(1, '#000010');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(-this.screenShake.x, -this.screenShake.y, this.width, this.height);
        
        // Animated stars
        this.backgroundElements.forEach(star => {
            star.y += star.speed;
            star.twinkle += 0.1;
            if (star.y > this.height) {
                star.y = -star.size;
                star.x = Math.random() * this.width;
            }
            
            this.ctx.save();
            this.ctx.globalAlpha = star.alpha * (0.5 + 0.5 * Math.sin(star.twinkle));
            this.ctx.fillStyle = '#ffffff';
            this.ctx.fillRect(star.x, star.y, star.size, star.size);
            this.ctx.restore();
        });
    }
    
    renderTutorial() {
        // Tutorial overlay
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        // Title
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = 'bold 36px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(this.texts[this.language].tutorial, this.width / 2, 80);
        
        // Tutorial content
        const tutorialText = this.texts[this.language].tutorialTexts[this.tutorialStep];
        this.ctx.font = '18px Arial';
        this.wrapText(tutorialText, this.width / 2, this.height / 2 - 50, this.width - 100, 25);
        
        // Progress indicator
        this.ctx.fillStyle = '#888888';
        this.ctx.font = '14px Arial';
        this.ctx.fillText(`${this.tutorialStep + 1} / ${this.maxTutorialSteps}`, this.width / 2, this.height - 80);
        
        // Next instruction
        this.ctx.fillStyle = '#00ffff';
        this.ctx.font = '16px Arial';
        this.ctx.fillText(this.texts[this.language].nextTip, this.width / 2, this.height - 50);
    }
    
    renderMenu() {
        // Title with glow
        this.ctx.save();
        this.ctx.shadowColor = '#00ffff';
        this.ctx.shadowBlur = 20;
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = 'bold 48px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(this.texts[this.language].title, this.width / 2, this.height / 3);
        this.ctx.restore();
        
        // Subtitle
        this.ctx.fillStyle = '#cccccc';
        this.ctx.font = '18px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(this.texts[this.language].subtitle, this.width / 2, this.height / 2 - 40);
        
        // Objective
        this.ctx.fillStyle = '#ffaa00';
        this.ctx.font = '16px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(this.texts[this.language].objective, this.width / 2, this.height / 2);
        
        // Start instruction
        this.ctx.fillStyle = '#00ff00';
        this.ctx.font = 'bold 20px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(this.texts[this.language].startGame, this.width / 2, this.height / 2 + 60);
        
        // Controls
        this.ctx.fillStyle = '#888888';
        this.ctx.font = '14px Arial';
        this.wrapText(this.texts[this.language].controls, this.width / 2, this.height / 2 + 100, this.width - 100, 18);
        
        // High score (moved to top-left)
        if (this.highScore > 0) {
            this.ctx.fillStyle = '#ffd700';
            this.ctx.font = '16px Arial';
            this.ctx.textAlign = 'left';
            this.ctx.fillText(`${this.language === 'ja' ? 'ベストスコア' : 'Best Score'}: ${this.highScore.toLocaleString()}`, 20, 30);
        }
        
        // Abilities info
        this.ctx.fillStyle = '#00ccff';
        this.ctx.font = '14px Arial';
        this.ctx.fillText(this.texts[this.language].abilities, this.width / 2, this.height - 120);
        
        // Achievements button (moved higher to avoid text overlap)
        const buttonWidth = 200;
        const buttonHeight = 40;
        const buttonX = this.width / 2 - buttonWidth / 2;
        const buttonY = this.height - 80;
        
        this.ctx.fillStyle = '#444444';
        this.ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);
        this.ctx.strokeStyle = '#ffd700';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(buttonX, buttonY, buttonWidth, buttonHeight);
        
        this.ctx.fillStyle = '#ffd700';
        this.ctx.font = '16px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(this.language === 'ja' ? '実績を見る' : 'View Achievements', this.width / 2, buttonY + 25);
        
        // Store button position for mouse clicks
        this.achievementsButton = { x: buttonX, y: buttonY, width: buttonWidth, height: buttonHeight };
        
    }
    
    renderGame() {
        // Render all game elements in proper order
        this.renderParticles();
        this.renderProjectiles();
        this.renderSkills();
        this.renderEnemies();
        this.renderPowerups();
        this.renderPlayer();
        if (this.boss && this.bossActive) {
            this.renderBoss();
        }
        this.renderExplosions();
        this.renderUI();
        this.renderFloatingTexts();
    }
    
    renderPlayer() {
        this.ctx.save();
        
        const centerX = this.player.x + this.player.width / 2;
        const centerY = this.player.y + this.player.height / 2;
        
        // Player invulnerability effect
        if (this.player.invulnerable) {
            this.ctx.globalAlpha = 0.3 + 0.7 * Math.sin(Date.now() * 0.03);
        }
        
        // Shield effect
        if (this.player.shieldActive) {
            this.ctx.save();
            this.ctx.strokeStyle = '#00ff00';
            this.ctx.lineWidth = 3;
            this.ctx.beginPath();
            this.ctx.arc(centerX, centerY, 35, 0, Math.PI * 2);
            this.ctx.stroke();
            
            // Shield particles
            for (let i = 0; i < 6; i++) {
                const angle = (Date.now() * 0.01 + i) % (Math.PI * 2);
                const shieldX = centerX + Math.cos(angle) * 30;
                const shieldY = centerY + Math.sin(angle) * 30;
                this.ctx.fillStyle = '#00ff00';
                this.ctx.fillRect(shieldX - 2, shieldY - 2, 4, 4);
            }
            this.ctx.restore();
        }
        
        // Player body with enhanced design
        const gradient = this.ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 25);
        gradient.addColorStop(0, '#00ffff');
        gradient.addColorStop(1, '#0088ff');
        this.ctx.fillStyle = gradient;
        
        // Draw hexagonal player
        this.ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2;
            const x = centerX + Math.cos(angle) * 20;
            const y = centerY + Math.sin(angle) * 20;
            if (i === 0) this.ctx.moveTo(x, y);
            else this.ctx.lineTo(x, y);
        }
        this.ctx.closePath();
        this.ctx.fill();
        
        // Player center core
        this.ctx.fillStyle = '#ffffff';
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, 8, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Enhanced charge shot indicator
        if (this.player.isCharging) {
            const chargePercent = this.player.chargeLevel / this.player.maxChargeLevel;
            const ringRadius = 25 + (chargePercent * 10);
            
            this.ctx.save();
            
            // Outer charge ring
            this.ctx.strokeStyle = `hsl(${30 + chargePercent * 30}, 100%, 60%)`; // Yellow to orange
            this.ctx.lineWidth = 4;
            this.ctx.globalAlpha = 0.9;
            this.ctx.beginPath();
            this.ctx.arc(centerX, centerY, ringRadius, -Math.PI / 2, (-Math.PI / 2) + (Math.PI * 2 * chargePercent));
            this.ctx.stroke();
            
            // Inner glow effect
            if (chargePercent > 0.4) { // Show ready indicator when charge is sufficient
                this.ctx.fillStyle = '#ffaa00';
                this.ctx.globalAlpha = 0.3 + (chargePercent * 0.3);
                this.ctx.beginPath();
                this.ctx.arc(centerX, centerY, ringRadius + 5, 0, Math.PI * 2);
                this.ctx.fill();
                
                // Charge ready text
                if (chargePercent > 0.4) {
                    this.ctx.fillStyle = '#ffffff';
                    this.ctx.globalAlpha = 1;
                    this.ctx.font = '12px Arial';
                    this.ctx.textAlign = 'center';
                    this.ctx.fillText('READY', centerX, centerY - 50);
                }
            }
            
            this.ctx.restore();
        }
        
        // Dash effect
        if (this.player.isDashing) {
            this.ctx.shadowColor = '#00ffff';
            this.ctx.shadowBlur = 15;
        }
        
        this.ctx.restore();
    }
    
    renderSkills() {
        this.skills.forEach(skill => {
            this.ctx.save();
            
            const centerX = skill.x + skill.width / 2;
            const centerY = skill.y + skill.height / 2;
            
            this.ctx.translate(centerX, centerY);
            this.ctx.rotate(skill.rotation);
            this.ctx.scale(skill.pulse, skill.pulse);
            
            // Enhanced visual effects based on type
            switch (skill.effect) {
                case 'glow':
                    this.ctx.shadowColor = skill.color;
                    this.ctx.shadowBlur = 15;
                    break;
                case 'rainbow':
                    const hue = (Date.now() * 0.1) % 360;
                    skill.color = `hsl(${hue}, 70%, 60%)`;
                    this.ctx.shadowColor = skill.color;
                    this.ctx.shadowBlur = 20;
                    break;
            }
            
            // Skill orb with gradient and special border
            const gradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, skill.width / 2);
            gradient.addColorStop(0, skill.color);
            gradient.addColorStop(1, skill.secondaryColor);
            this.ctx.fillStyle = gradient;
            
            // Double border to distinguish from enemies
            this.ctx.strokeStyle = '#ffffff';
            this.ctx.lineWidth = 3;
            this.ctx.beginPath();
            this.ctx.arc(0, 0, skill.width / 2 + 2, 0, Math.PI * 2);
            this.ctx.stroke();
            
            this.ctx.strokeStyle = skill.color;
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();
            this.ctx.arc(0, 0, skill.width / 2 + 4, 0, Math.PI * 2);
            this.ctx.stroke();
            
            // Fill main orb
            this.ctx.beginPath();
            this.ctx.arc(0, 0, skill.width / 2, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Inner glow
            this.ctx.fillStyle = '#ffffff';
            this.ctx.globalAlpha = 0.8;
            this.ctx.beginPath();
            this.ctx.arc(0, 0, skill.width / 4, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.restore();
        });
    }
    
    renderEnemies() {
        this.enemies.forEach(enemy => {
            this.ctx.save();
            
            const centerX = enemy.x + enemy.width / 2;
            const centerY = enemy.y + enemy.height / 2;
            
            // Health bar
            if (enemy.health < enemy.maxHealth) {
                this.ctx.fillStyle = '#ff0000';
                this.ctx.fillRect(enemy.x, enemy.y - 8, enemy.width, 4);
                this.ctx.fillStyle = '#00ff00';
                this.ctx.fillRect(enemy.x, enemy.y - 8, enemy.width * (enemy.health / enemy.maxHealth), 4);
            }
            
            // Enemy body with type-specific design
            const gradient = this.ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, enemy.width / 2);
            gradient.addColorStop(0, enemy.color);
            gradient.addColorStop(1, '#660000');
            this.ctx.fillStyle = gradient;
            
            if (enemy.type === 'tank') {
                // Square tank
                this.ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
            } else {
                // Diamond shape for others
                this.ctx.beginPath();
                this.ctx.moveTo(centerX, enemy.y);
                this.ctx.lineTo(enemy.x + enemy.width, centerY);
                this.ctx.lineTo(centerX, enemy.y + enemy.height);
                this.ctx.lineTo(enemy.x, centerY);
                this.ctx.closePath();
                this.ctx.fill();
            }
            
            // Enemy core
            this.ctx.fillStyle = '#ffffff';
            this.ctx.beginPath();
            this.ctx.arc(centerX, centerY, 4, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.restore();
        });
    }
    
    renderPowerups() {
        this.powerups.forEach(powerup => {
            this.ctx.save();
            
            const centerX = powerup.x + powerup.width / 2;
            const centerY = powerup.y + powerup.height / 2;
            
            this.ctx.translate(centerX, centerY);
            this.ctx.rotate(powerup.rotation);
            this.ctx.scale(powerup.pulse, powerup.pulse);
            
            // Powerup glow
            this.ctx.shadowColor = powerup.color;
            this.ctx.shadowBlur = 15;
            
            // Different shapes for different powerup types
            const gradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, 15);
            gradient.addColorStop(0, powerup.color);
            gradient.addColorStop(1, powerup.secondaryColor);
            this.ctx.fillStyle = gradient;
            
            switch (powerup.type) {
                case 'health':
                    // Cross shape for health (💙)
                    this.ctx.fillRect(-12, -4, 24, 8);
                    this.ctx.fillRect(-4, -12, 8, 24);
                    break;
                    
                case 'energy':
                    // Lightning bolt shape for energy (⚡)
                    this.ctx.beginPath();
                    this.ctx.moveTo(-8, -12);
                    this.ctx.lineTo(4, -2);
                    this.ctx.lineTo(-2, 0);
                    this.ctx.lineTo(8, 12);
                    this.ctx.lineTo(-4, 2);
                    this.ctx.lineTo(2, 0);
                    this.ctx.closePath();
                    this.ctx.fill();
                    break;
                    
                case 'rapidFire':
                    // Triple circle for rapid fire (🔥)
                    for (let i = 0; i < 3; i++) {
                        const offsetX = (i - 1) * 8;
                        this.ctx.beginPath();
                        this.ctx.arc(offsetX, 0, 6, 0, Math.PI * 2);
                        this.ctx.fill();
                    }
                    break;
                    
                case 'multiShot':
                    // Star shape for multi shot (💥)
                    this.ctx.beginPath();
                    for (let i = 0; i < 10; i++) {
                        const angle = (i / 10) * Math.PI * 2;
                        const radius = (i % 2 === 0) ? 12 : 6;
                        const x = Math.cos(angle) * radius;
                        const y = Math.sin(angle) * radius;
                        if (i === 0) this.ctx.moveTo(x, y);
                        else this.ctx.lineTo(x, y);
                    }
                    this.ctx.closePath();
                    this.ctx.fill();
                    break;
                    
                case 'invincible':
                    // Hexagon for shield (🛡️)
                    this.ctx.beginPath();
                    for (let i = 0; i < 6; i++) {
                        const angle = (i / 6) * Math.PI * 2;
                        const x = Math.cos(angle) * 12;
                        const y = Math.sin(angle) * 12;
                        if (i === 0) this.ctx.moveTo(x, y);
                        else this.ctx.lineTo(x, y);
                    }
                    this.ctx.closePath();
                    this.ctx.fill();
                    break;
                    
                default:
                    // Default crystal shape
                    this.ctx.beginPath();
                    for (let i = 0; i < 8; i++) {
                        const angle = (i / 8) * Math.PI * 2;
                        const radius = (i % 2 === 0) ? 12 : 8;
                        const x = Math.cos(angle) * radius;
                        const y = Math.sin(angle) * radius;
                        if (i === 0) this.ctx.moveTo(x, y);
                        else this.ctx.lineTo(x, y);
                    }
                    this.ctx.closePath();
                    this.ctx.fill();
                    break;
            }
            
            // Add white highlight
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
            this.ctx.beginPath();
            this.ctx.arc(0, 0, 4, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.restore();
        });
    }
    
    renderProjectiles() {
        this.projectiles.forEach(projectile => {
            this.ctx.save();
            
            // Trail effect
            if (projectile.trail.length > 1) {
                this.ctx.strokeStyle = projectile.color;
                this.ctx.lineWidth = 3;
                this.ctx.globalAlpha = 0.6;
                this.ctx.beginPath();
                for (let i = 0; i < projectile.trail.length; i++) {
                    const trail = projectile.trail[i];
                    if (i === 0) this.ctx.moveTo(trail.x, trail.y);
                    else this.ctx.lineTo(trail.x, trail.y);
                }
                this.ctx.stroke();
            }
            
            // Projectile body
            this.ctx.globalAlpha = 1;
            this.ctx.fillStyle = projectile.color;
            this.ctx.shadowColor = projectile.color;
            this.ctx.shadowBlur = 8;
            
            if (projectile.type === 'player') {
                // Check if this is a charge shot
                if (projectile.isChargedShot && projectile.beamEffect) {
                    // Massive charge beam effect
                    this.ctx.save(); // Save context state
                    
                    const centerX = projectile.x + projectile.width / 2;
                    const centerY = projectile.y + projectile.height / 2;
                    const glowIntensity = projectile.glowIntensity || 2;
                    
                    // Multiple glow layers for massive beam effect
                    this.ctx.shadowBlur = 30 + glowIntensity * 5;
                    this.ctx.shadowColor = '#ffaa00';
                    
                    // Outer energy field
                    this.ctx.fillStyle = '#ff6600';
                    this.ctx.globalAlpha = 0.3;
                    this.ctx.fillRect(projectile.x - 10, projectile.y, projectile.width + 20, projectile.height);
                    
                    // Main beam body
                    this.ctx.fillStyle = '#ffaa00';
                    this.ctx.globalAlpha = 0.8;
                    this.ctx.fillRect(projectile.x, projectile.y, projectile.width, projectile.height);
                    
                    // Inner core
                    this.ctx.fillStyle = '#ffff44';
                    this.ctx.globalAlpha = 1;
                    this.ctx.fillRect(projectile.x + 5, projectile.y + 5, projectile.width - 10, projectile.height - 10);
                    
                    // Center bright line
                    this.ctx.fillStyle = '#ffffff';
                    this.ctx.fillRect(centerX - 2, projectile.y, 4, projectile.height);
                    
                    // Simple glow effect instead of particles
                    this.ctx.fillStyle = '#ffff88';
                    this.ctx.globalAlpha = 0.4;
                    this.ctx.fillRect(projectile.x - 5, projectile.y, projectile.width + 10, projectile.height);
                    
                    this.ctx.restore(); // Restore context state
                } else if (projectile.isHomingMissile) {
                    // Homing missile - distinct missile shape
                    this.ctx.save();
                    this.ctx.translate(projectile.x + projectile.width / 2, projectile.y + projectile.height / 2);
                    
                    // Rotate missile to face movement direction
                    const angle = Math.atan2(projectile.vy, projectile.vx) + Math.PI / 2;
                    this.ctx.rotate(angle);
                    
                    // Missile body
                    this.ctx.fillStyle = projectile.color;
                    this.ctx.shadowColor = projectile.color;
                    this.ctx.shadowBlur = 8;
                    this.ctx.fillRect(-5, -10, 10, 20);
                    
                    // Missile tip
                    this.ctx.fillStyle = '#ffffff';
                    this.ctx.beginPath();
                    this.ctx.moveTo(0, -10);
                    this.ctx.lineTo(-3, -6);
                    this.ctx.lineTo(3, -6);
                    this.ctx.closePath();
                    this.ctx.fill();
                    
                    // Fins
                    this.ctx.fillStyle = '#aa2200';
                    this.ctx.fillRect(-4, 8, 3, 6);
                    this.ctx.fillRect(1, 8, 3, 6);
                    
                    this.ctx.restore();
                } else {
                    // Regular player projectiles - energy bolt
                    this.ctx.beginPath();
                    this.ctx.arc(projectile.x + projectile.width / 2, projectile.y + projectile.height / 2, 
                               projectile.width / 2, 0, Math.PI * 2);
                    this.ctx.fill();
                }
            } else {
                // Enemy projectiles - angular
                this.ctx.fillRect(projectile.x, projectile.y, projectile.width, projectile.height);
            }
            
            this.ctx.restore();
        });
    }
    
    renderBoss() {
        this.ctx.save();
        
        const centerX = this.boss.x + this.boss.width / 2;
        const centerY = this.boss.y + this.boss.height / 2;
        
        // Boss invulnerability effect
        if (this.boss.invulnerable) {
            this.ctx.globalAlpha = 0.5 + 0.5 * Math.sin(Date.now() * 0.05);
        }
        
        // Boss health bar
        this.ctx.fillStyle = '#666666';
        this.ctx.fillRect(50, 20, this.width - 100, 20);
        this.ctx.fillStyle = '#ff0000';
        this.ctx.fillRect(50, 20, (this.width - 100) * (this.boss.health / this.boss.maxHealth), 20);
        
        // Boss name and level
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = 'bold 14px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(`${this.boss.name[this.language]} - Lv.${this.boss.level}`, this.width / 2, 35);
        
        // Draw evolved boss form
        this.renderBossShape(centerX, centerY);
        
        // Boss glow effect
        this.ctx.save();
        this.ctx.shadowColor = this.boss.color;
        this.ctx.shadowBlur = 20;
        this.ctx.globalAlpha = 0.3;
        this.renderBossShape(centerX, centerY);
        this.ctx.restore();
        
        this.ctx.restore();
    }
    
    renderBossShape(centerX, centerY) {
        const bossRadius = Math.min(this.boss.width, this.boss.height) / 2 - 5;
        const time = Date.now() * 0.005;
        const pulseTime = Date.now() * 0.01;
        const pulse = 1 + Math.sin(pulseTime) * 0.1;
        
        // Enhanced orbital elements based on evolution level
        const orbitCount = 3 + this.boss.level;
        const orbitRadius = bossRadius * 1.5;
        
        // Draw orbital elements
        for (let i = 0; i < orbitCount; i++) {
            const orbitAngle = (time * 2) + (i * Math.PI * 2 / orbitCount);
            const orbitX = centerX + Math.cos(orbitAngle) * orbitRadius;
            const orbitY = centerY + Math.sin(orbitAngle) * orbitRadius;
            
            this.ctx.save();
            this.ctx.fillStyle = this.boss.secondaryColor;
            this.ctx.shadowColor = this.boss.secondaryColor;
            this.ctx.shadowBlur = 10;
            this.ctx.beginPath();
            this.ctx.arc(orbitX, orbitY, 8 + this.boss.level * 2, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        }
        
        // Draw profile picture in the center (enhanced with rotation)
        const profileRadius = bossRadius * 0.35;
        this.ctx.save();
        this.ctx.translate(centerX, centerY);
        this.ctx.rotate(time * 0.5);
        this.ctx.scale(pulse, pulse);
        
        this.ctx.beginPath();
        this.ctx.arc(0, 0, profileRadius, 0, Math.PI * 2);
        this.ctx.clip();
        
        // Load and draw profile image if available
        if (!this.profileImg) {
            this.profileImg = new Image();
            this.profileImg.src = 'static/img/about/profile.jpg';
        }
        
        if (this.profileImg.complete) {
            this.ctx.drawImage(this.profileImg, 
                -profileRadius, -profileRadius, 
                profileRadius * 2, profileRadius * 2);
        } else {
            // Fallback circle if image not loaded
            this.ctx.fillStyle = '#0088ff';
            this.ctx.fill();
        }
        this.ctx.restore();
        
        // Draw enhanced boss shape based on evolution level
        this.renderEnhancedBossShape(centerX, centerY, bossRadius, profileRadius, time, pulse);
    }
    
    renderEnhancedBossShape(centerX, centerY, bossRadius, profileRadius, time, pulse) {
        this.ctx.fillStyle = this.boss.color;
        this.ctx.strokeStyle = this.boss.secondaryColor;
        this.ctx.lineWidth = 4;
        
        // Add energy field based on boss level
        if (this.boss.level >= 2) {
            this.ctx.save();
            this.ctx.fillStyle = this.boss.color;
            this.ctx.globalAlpha = 0.2;
            this.ctx.beginPath();
            this.ctx.arc(centerX, centerY, bossRadius * 1.3, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        }
        
        switch (this.boss.shape) {
            case 'circle':
                // Enhanced circular boss with rotating energy rings
                for (let ring = 0; ring < 2 + this.boss.level; ring++) {
                    const ringRadius = bossRadius * (0.6 + ring * 0.2);
                    const ringRotation = time * (ring + 1) * 0.5;
                    
                    this.ctx.save();
                    this.ctx.strokeStyle = this.boss.secondaryColor;
                    this.ctx.lineWidth = 3 - ring;
                    this.ctx.globalAlpha = 0.7 - ring * 0.2;
                    
                    this.ctx.beginPath();
                    for (let i = 0; i < 8; i++) {
                        const segmentAngle = (i * Math.PI * 2) / 8 + ringRotation;
                        const startAngle = segmentAngle - 0.2;
                        const endAngle = segmentAngle + 0.2;
                        this.ctx.arc(centerX, centerY, ringRadius, startAngle, endAngle);
                    }
                    this.ctx.stroke();
                    this.ctx.restore();
                }
                
                // Main body
                this.ctx.beginPath();
                this.ctx.arc(centerX, centerY, bossRadius, 0, Math.PI * 2);
                this.ctx.arc(centerX, centerY, profileRadius + 5, 0, Math.PI * 2, true);
                this.ctx.fill();
                this.ctx.stroke();
                break;
                
            case 'diamond':
                // Enhanced diamond with rotating crystal shards
                this.ctx.save();
                this.ctx.translate(centerX, centerY);
                this.ctx.rotate(time * 0.3);
                
                // Outer crystal shards
                for (let i = 0; i < 4 + this.boss.level; i++) {
                    const shardAngle = (i * Math.PI * 2) / (4 + this.boss.level);
                    const shardDistance = bossRadius * 1.2;
                    this.ctx.save();
                    this.ctx.translate(Math.cos(shardAngle) * shardDistance, Math.sin(shardAngle) * shardDistance);
                    this.ctx.rotate(shardAngle);
                    this.ctx.fillStyle = this.boss.secondaryColor;
                    this.ctx.globalAlpha = 0.6;
                    this.ctx.fillRect(-5, -15, 10, 30);
                    this.ctx.restore();
                }
                
                // Main diamond body
                this.ctx.fillStyle = this.boss.color;
                this.ctx.globalAlpha = 1;
                this.ctx.beginPath();
                this.ctx.moveTo(0, -bossRadius);
                this.ctx.lineTo(bossRadius * 0.7, 0);
                this.ctx.lineTo(0, bossRadius);
                this.ctx.lineTo(-bossRadius * 0.7, 0);
                this.ctx.closePath();
                this.ctx.arc(0, 0, profileRadius + 5, 0, Math.PI * 2, true);
                this.ctx.fill();
                this.ctx.stroke();
                this.ctx.restore();
                break;
                
            case 'star':
                // Pulsating multi-layered star
                this.ctx.save();
                this.ctx.translate(centerX, centerY);
                
                // Multiple star layers
                for (let layer = 0; layer < 2 + Math.floor(this.boss.level / 2); layer++) {
                    const layerScale = 1.0 - layer * 0.3;
                    const layerRotation = time * (1 + layer * 0.5);
                    const layerPulse = 1 + Math.sin(time * 3 + layer) * 0.2;
                    
                    this.ctx.save();
                    this.ctx.rotate(layerRotation);
                    this.ctx.scale(layerScale * layerPulse, layerScale * layerPulse);
                    this.ctx.globalAlpha = 0.8 - layer * 0.2;
                    
                    const points = 5 + this.boss.level;
                    this.ctx.beginPath();
                    for (let i = 0; i < points * 2; i++) {
                        const angle = (i * Math.PI) / points;
                        const radius = i % 2 === 0 ? bossRadius * layerScale : bossRadius * layerScale * 0.4;
                        const x = Math.cos(angle) * radius;
                        const y = Math.sin(angle) * radius;
                        if (i === 0) this.ctx.moveTo(x, y);
                        else this.ctx.lineTo(x, y);
                    }
                    this.ctx.closePath();
                    
                    if (layer === 0) {
                        this.ctx.arc(0, 0, profileRadius + 5, 0, Math.PI * 2, true);
                    }
                    
                    this.ctx.fillStyle = layer === 0 ? this.boss.color : this.boss.secondaryColor;
                    this.ctx.fill();
                    this.ctx.stroke();
                    this.ctx.restore();
                }
                
                this.ctx.restore();
                break;
                
            case 'hexagon':
                // Advanced hexagonal fortress
                this.ctx.save();
                this.ctx.translate(centerX, centerY);
                this.ctx.rotate(time * 0.2);
                
                // Hexagonal shield barriers
                for (let i = 0; i < 6; i++) {
                    const barrierAngle = (i * Math.PI * 2) / 6;
                    const barrierDistance = bossRadius * 1.1;
                    const barrierX = Math.cos(barrierAngle) * barrierDistance;
                    const barrierY = Math.sin(barrierAngle) * barrierDistance;
                    
                    this.ctx.save();
                    this.ctx.translate(barrierX, barrierY);
                    this.ctx.rotate(barrierAngle);
                    this.ctx.fillStyle = this.boss.secondaryColor;
                    this.ctx.globalAlpha = 0.7;
                    this.ctx.fillRect(-3, -12, 6, 24);
                    this.ctx.restore();
                }
                
                // Main hexagon with rotating inner pattern
                this.ctx.globalAlpha = 1;
                this.ctx.beginPath();
                for (let i = 0; i < 6; i++) {
                    const angle = (i * Math.PI * 2) / 6;
                    const x = Math.cos(angle) * bossRadius;
                    const y = Math.sin(angle) * bossRadius;
                    if (i === 0) this.ctx.moveTo(x, y);
                    else this.ctx.lineTo(x, y);
                }
                this.ctx.closePath();
                this.ctx.arc(0, 0, profileRadius + 5, 0, Math.PI * 2, true);
                this.ctx.fill();
                this.ctx.stroke();
                
                this.ctx.restore();
                break;
                
            case 'complex':
                // Ultimate boss form - multiple rotating geometric patterns
                this.ctx.save();
                this.ctx.translate(centerX, centerY);
                
                // Outer rotating spikes
                for (let spike = 0; spike < 8 + this.boss.level; spike++) {
                    const spikeAngle = (spike * Math.PI * 2) / (8 + this.boss.level) + time;
                    const spikeLength = bossRadius * 1.4;
                    this.ctx.save();
                    this.ctx.rotate(spikeAngle);
                    this.ctx.fillStyle = this.boss.secondaryColor;
                    this.ctx.globalAlpha = 0.8;
                    this.ctx.fillRect(bossRadius * 0.8, -3, spikeLength - bossRadius * 0.8, 6);
                    this.ctx.restore();
                }
                
                // Multiple rotating geometric layers
                for (let layer = 0; layer < 3; layer++) {
                    const layerRadius = bossRadius * (0.4 + layer * 0.2);
                    const layerRotation = time * (2 - layer * 0.5);
                    const sides = 3 + layer * 2;
                    
                    this.ctx.save();
                    this.ctx.rotate(layerRotation);
                    this.ctx.globalAlpha = 0.9 - layer * 0.2;
                    
                    this.ctx.beginPath();
                    for (let i = 0; i < sides; i++) {
                        const angle = (i * Math.PI * 2) / sides;
                        const x = Math.cos(angle) * layerRadius;
                        const y = Math.sin(angle) * layerRadius;
                        if (i === 0) this.ctx.moveTo(x, y);
                        else this.ctx.lineTo(x, y);
                    }
                    this.ctx.closePath();
                    
                    if (layer === 2) {
                        this.ctx.arc(0, 0, profileRadius + 5, 0, Math.PI * 2, true);
                    }
                    
                    this.ctx.fillStyle = layer % 2 === 0 ? this.boss.color : this.boss.secondaryColor;
                    this.ctx.fill();
                    this.ctx.stroke();
                    this.ctx.restore();
                }
                
                this.ctx.restore();
                break;
                
            case 'morphing':
                // Final evolution - constantly morphing cosmic entity
                this.ctx.save();
                this.ctx.translate(centerX, centerY);
                
                // Morphing energy tendrils
                for (let tendril = 0; tendril < 6 + this.boss.level; tendril++) {
                    const tendrilAngle = (tendril * Math.PI * 2) / (6 + this.boss.level) + time * 0.5;
                    const wavePhase = time * 2 + tendril;
                    
                    this.ctx.save();
                    this.ctx.rotate(tendrilAngle);
                    this.ctx.strokeStyle = this.boss.secondaryColor;
                    this.ctx.lineWidth = 4;
                    this.ctx.globalAlpha = 0.7;
                    
                    this.ctx.beginPath();
                    for (let point = 0; point < 20; point++) {
                        const distance = (point / 20) * bossRadius * 1.5;
                        const waveOffset = Math.sin(wavePhase + point * 0.3) * 15;
                        const x = distance;
                        const y = waveOffset;
                        if (point === 0) this.ctx.moveTo(x, y);
                        else this.ctx.lineTo(x, y);
                    }
                    this.ctx.stroke();
                    this.ctx.restore();
                }
                
                // Morphing main body
                const morphPhase = Math.sin(time * 0.5) * 0.5 + 0.5;
                const vertices = 8 + Math.floor(morphPhase * 4);
                
                this.ctx.globalAlpha = 1;
                this.ctx.beginPath();
                for (let i = 0; i < vertices; i++) {
                    const angle = (i * Math.PI * 2) / vertices + time * 0.3;
                    const radiusVariation = Math.sin(angle * 3 + time * 2) * 0.4 + 1;
                    const radius = bossRadius * radiusVariation * (0.6 + morphPhase * 0.4);
                    const x = Math.cos(angle) * radius;
                    const y = Math.sin(angle) * radius;
                    if (i === 0) this.ctx.moveTo(x, y);
                    else this.ctx.lineTo(x, y);
                }
                this.ctx.closePath();
                this.ctx.arc(0, 0, profileRadius + 5, 0, Math.PI * 2, true);
                this.ctx.fill();
                this.ctx.stroke();
                this.ctx.restore();
                break;
                
            default:
                // Fallback to enhanced circle
                this.ctx.beginPath();
                this.ctx.arc(centerX, centerY, bossRadius, 0, Math.PI * 2);
                this.ctx.arc(centerX, centerY, profileRadius + 5, 0, Math.PI * 2, true);
                this.ctx.fill();
                this.ctx.stroke();
                break;
        }
    }
    
    renderExplosions() {
        this.explosions.forEach(explosion => {
            this.ctx.save();
            this.ctx.globalAlpha = explosion.alpha;
            
            const gradient = this.ctx.createRadialGradient(explosion.x, explosion.y, 0, 
                                                         explosion.x, explosion.y, explosion.radius);
            gradient.addColorStop(0, '#ffffff');
            gradient.addColorStop(0.3, explosion.color);
            gradient.addColorStop(1, 'transparent');
            
            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(explosion.x, explosion.y, explosion.radius, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.restore();
        });
    }
    
    renderParticles() {
        this.particles.forEach(particle => {
            this.ctx.save();
            this.ctx.globalAlpha = particle.alpha;
            this.ctx.fillStyle = particle.color;
            const size = particle.size || 2;
            this.ctx.fillRect(particle.x - size/2, particle.y - size/2, size, size);
            this.ctx.restore();
        });
    }
    
    renderFloatingTexts() {
        this.floatingTexts.forEach(text => {
            this.ctx.save();
            this.ctx.globalAlpha = text.alpha;
            this.ctx.fillStyle = text.color;
            this.ctx.font = 'bold 14px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.strokeStyle = '#000000';
            this.ctx.lineWidth = 2;
            this.ctx.strokeText(text.text, text.x, text.y);
            this.ctx.fillText(text.text, text.x, text.y);
            this.ctx.restore();
        });
    }
    
    renderUI() {
        // Enhanced HUD with glassmorphism effect
        const gradient = this.ctx.createLinearGradient(0, 0, 0, 120);
        gradient.addColorStop(0, 'rgba(0, 20, 40, 0.9)');
        gradient.addColorStop(1, 'rgba(0, 10, 20, 0.7)');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.width, 120);
        
        // Score with glow
        this.ctx.save();
        this.ctx.shadowColor = '#00ffff';
        this.ctx.shadowBlur = 5;
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = 'bold 18px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`${this.texts[this.language].score}: ${this.score.toLocaleString()}`, 20, 25);
        this.ctx.restore();
        
        // Health bar
        this.ctx.fillStyle = '#333333';
        this.ctx.fillRect(20, 40, 200, 15);
        this.ctx.fillStyle = this.player.health > 30 ? '#00ff00' : '#ff0000';
        this.ctx.fillRect(20, 40, 200 * (this.player.health / this.player.maxHealth), 15);
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '12px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`${this.texts[this.language].health}: ${this.player.health}/${this.player.maxHealth}`, 20, 72);
        
        // Energy bar
        this.ctx.fillStyle = '#333333';
        this.ctx.fillRect(20, 80, 200, 10);
        this.ctx.fillStyle = '#0088ff';
        this.ctx.fillRect(20, 80, 200 * (this.player.energy / this.player.maxEnergy), 10);
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '10px Arial';
        this.ctx.fillText(`${this.texts[this.language].energy}: ${Math.floor(this.player.energy)}`, 20, 105);
        
        // Player level and XP bar (right side)
        this.ctx.textAlign = 'right';
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = 'bold 16px Arial';
        this.ctx.fillText(`${this.language === 'ja' ? 'レベル' : 'Level'}: ${this.player.level}`, this.width - 20, 25);
        this.ctx.fillText(`${this.texts[this.language].wave}: ${this.waveCount}`, this.width - 20, 45);
        
        // XP Bar
        const xpBarWidth = 200;
        const xpBarX = this.width - 220;
        this.ctx.fillStyle = '#333333';
        this.ctx.fillRect(xpBarX, 55, xpBarWidth, 10);
        this.ctx.fillStyle = '#ffaa00';
        this.ctx.fillRect(xpBarX, 55, xpBarWidth * (this.player.xp / this.player.xpToNextLevel), 10);
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '10px Arial';
        this.ctx.textAlign = 'right';
        this.ctx.fillText(`XP: ${this.player.xp}/${this.player.xpToNextLevel}`, this.width - 20, 77);
        
        // Attack level indicator
        this.ctx.font = '12px Arial';
        this.ctx.fillStyle = '#ff6600';
        this.ctx.fillText(`${this.language === 'ja' ? '攻撃Lv' : 'ATK Lv'}: ${this.player.attackLevel}`, this.width - 20, 95);
        
        // Combo
        if (this.combo > 1) {
            this.ctx.save();
            this.ctx.shadowColor = '#ff6600';
            this.ctx.shadowBlur = 5;
            this.ctx.fillStyle = '#ffaa00';
            this.ctx.fillText(`${this.texts[this.language].combo}: ${this.combo}x`, this.width - 20, 65);
            this.ctx.restore();
        }
        
        // Lives
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '14px Arial';
        this.ctx.fillText(`${this.texts[this.language].lives}: ${'❤️'.repeat(this.lives)}`, this.width - 20, 85);
        
        // Buff status indicators
        let buffY = 105;
        if (this.player.berserkMode) {
            this.ctx.fillStyle = '#ff0000';
            this.ctx.font = 'bold 12px Arial';
            this.ctx.fillText(`BERSERK ${Math.ceil(this.player.berserkTimer / 60)}s`, this.width - 20, buffY);
            buffY += 18;
        }
        
        if (this.player.rapidFireTimer > 0) {
            this.ctx.fillStyle = '#00ff00';
            this.ctx.font = 'bold 12px Arial';
            this.ctx.fillText(`RAPID FIRE ${Math.ceil(this.player.rapidFireTimer / 60)}s`, this.width - 20, buffY);
            buffY += 18;
        }
        
        if (this.player.killStreak >= 3) {
            this.ctx.fillStyle = '#ffaa00';
            this.ctx.font = 'bold 12px Arial';
            this.ctx.fillText(`${this.player.killStreak}x STREAK`, this.width - 20, buffY);
        }
        
        // Ability cooldowns
        this.renderAbilityCooldowns();
        
        // Controls and items legend (always visible)
        this.renderControlsLegend();
    }
    
    renderAbilityCooldowns() {
        const abilityY = this.height - 60;
        const abilitySize = 40;
        const spacing = 50;
        const startX = this.width / 2 - 75;
        
        // Shoot ability
        this.ctx.fillStyle = this.player.shootCooldown > 0 ? '#666666' : '#00ffff';
        this.ctx.fillRect(startX, abilityY, abilitySize, abilitySize);
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '24px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('🔫', startX + abilitySize / 2, abilityY + abilitySize / 2 + 8);
        
        // Dash ability
        this.ctx.fillStyle = this.player.dashCooldown > 0 ? '#666666' : '#ffaa00';
        this.ctx.fillRect(startX + spacing, abilityY, abilitySize, abilitySize);
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillText('💨', startX + spacing + abilitySize / 2, abilityY + abilitySize / 2 + 8);
        
        // Shield ability
        this.ctx.fillStyle = this.player.shieldCooldown > 0 ? '#666666' : '#00ff00';
        this.ctx.fillRect(startX + spacing * 2, abilityY, abilitySize, abilitySize);
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillText('🛡️', startX + spacing * 2 + abilitySize / 2, abilityY + abilitySize / 2 + 8);
        
        // Cooldown indicators
        this.ctx.font = '10px Arial';
        if (this.player.shootCooldown > 0) {
            this.ctx.fillText(Math.ceil(this.player.shootCooldown / 60), startX + abilitySize / 2, abilityY + abilitySize + 15);
        }
        if (this.player.dashCooldown > 0) {
            this.ctx.fillText(Math.ceil(this.player.dashCooldown / 60), startX + spacing + abilitySize / 2, abilityY + abilitySize + 15);
        }
        if (this.player.shieldCooldown > 0) {
            this.ctx.fillText(Math.ceil(this.player.shieldCooldown / 60), startX + spacing * 2 + abilitySize / 2, abilityY + abilitySize + 15);
        }
    }
    
    renderControlsLegend() {
        // Show legend only when not in action (avoid covering gameplay)
        if (this.gameState === 'playing' || this.gameState === 'bossFight') {
            // Compact legend at top-left corner during gameplay
            this.ctx.save();
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            this.ctx.fillRect(10, 130, 180, 40);
            
            this.ctx.fillStyle = '#ffffff';
            this.ctx.font = '10px Arial';
            this.ctx.textAlign = 'left';
            this.ctx.fillText(this.language === 'ja' ? 'WASD:移動 Space:射撃 Q:ダッシュ Shift:シールド P:ポーズ' : 'WASD:Move Space:Shoot Q:Dash Shift:Shield P:Pause', 15, 145);
            this.ctx.fillText(this.language === 'ja' ? '💙体力 ⚡エネルギー 🔥連射 💥マルチ 🛡️シールド' : '💙Health ⚡Energy 🔥Rapid 💥Multi 🛡️Shield', 15, 160);
            
            this.ctx.restore();
            return;
        }
        
        // Full legend for menu/tutorial states
        this.ctx.save();
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillRect(this.width - 250, 140, 230, 220);
        
        // Legend title
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = 'bold 14px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(this.language === 'ja' ? 'コントロール & アイテム' : 'Controls & Items', this.width - 240, 160);
        
        // Controls section
        this.ctx.font = '11px Arial';
        this.ctx.fillStyle = '#ffff00';
        this.ctx.fillText(this.language === 'ja' ? '操作方法:' : 'Controls:', this.width - 240, 180);
        
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '10px Arial';
        const controls = this.language === 'ja' ? [
            'WASD/矢印キー: 移動',
            'スペース/クリック: 射撃',
            'Q/中クリック: ダッシュ',
            'シフト/右クリック: シールド'
        ] : [
            'WASD/Arrows: Move',
            'Space/Click: Shoot',
            'Q/Middle-click: Dash',
            'Shift/Right-click: Shield'
        ];
        
        controls.forEach((control, i) => {
            this.ctx.fillText(control, this.width - 240, 195 + i * 14);
        });
        
        // Items section
        this.ctx.fillStyle = '#00ff00';
        this.ctx.font = '11px Arial';
        this.ctx.fillText(this.language === 'ja' ? 'アイテム:' : 'Items:', this.width - 240, 265);
        
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '10px Arial';
        const items = this.language === 'ja' ? [
            '💙 体力回復',
            '⚡ エネルギー回復',
            '🔥 連射モード',
            '💥 マルチショット',
            '🛡️ 無敵シールド'
        ] : [
            '💙 Health Restore',
            '⚡ Energy Boost',
            '🔥 Rapid Fire',
            '💥 Multi Shot',
            '🛡️ Invincible Shield'
        ];
        
        items.forEach((item, i) => {
            this.ctx.fillText(item, this.width - 240, 280 + i * 14);
        });
        
        this.ctx.restore();
    }
    
    initAudio() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.warn('Web Audio API not supported');
            this.soundEnabled = false;
        }
    }
    
    playSound(frequency, duration, type = 'sine', volume = 0.1) {
        if (!this.soundEnabled || !this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
        oscillator.type = type;
        
        gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }
    
    playSoundEffect(effectName) {
        if (!this.soundEnabled) return;
        
        switch (effectName) {
            case 'shoot':
                this.playSound(800, 0.1, 'square', 0.05);
                break;
            case 'dash':
                this.playSound(600, 0.2, 'sawtooth', 0.08);
                break;
            case 'shield':
                this.playSound(400, 0.3, 'sine', 0.06);
                break;
            case 'hit':
                this.playSound(200, 0.1, 'square', 0.1);
                break;
            case 'powerup':
                this.playSound(1000, 0.3, 'sine', 0.07);
                setTimeout(() => this.playSound(1200, 0.2, 'sine', 0.07), 100);
                break;
            case 'explosion':
                this.playSound(150, 0.4, 'sawtooth', 0.12);
                break;
            case 'bossHit':
                this.playSound(100, 0.2, 'square', 0.15);
                break;
            case 'gameOver':
                this.playSound(300, 0.5, 'sine', 0.1);
                setTimeout(() => this.playSound(250, 0.5, 'sine', 0.1), 200);
                setTimeout(() => this.playSound(200, 1.0, 'sine', 0.1), 400);
                break;
            case 'victory':
                this.playSound(500, 0.2, 'sine', 0.08);
                setTimeout(() => this.playSound(600, 0.2, 'sine', 0.08), 200);
                setTimeout(() => this.playSound(800, 0.4, 'sine', 0.08), 400);
                break;
            case 'chargeShot':
                this.playSound(400, 0.3, 'sawtooth', 0.15);
                setTimeout(() => this.playSound(800, 0.2, 'square', 0.1), 100);
                break;
        }
    }
    
    renderBossIntro() {
        this.ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        this.ctx.save();
        this.ctx.shadowColor = '#ff0000';
        this.ctx.shadowBlur = 20;
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = 'bold 36px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(this.texts[this.language].bossWarning, this.width / 2, this.height / 2 - 20);
        
        this.ctx.font = '24px Arial';
        this.ctx.fillText(this.texts[this.language].bossIntro, this.width / 2, this.height / 2 + 20);
        this.ctx.restore();
    }
    
    renderPauseOverlay() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = 'bold 32px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(this.language === 'ja' ? '⏸️ 一時停止' : '⏸️ PAUSED', this.width / 2, this.height / 2 - 40);
        
        // Updated instructions for new controls
        this.ctx.font = '18px Arial';
        this.ctx.fillStyle = '#00ff00';
        this.ctx.fillText(this.language === 'ja' ? 'スペース: 続行' : 'Space: Resume', this.width / 2, this.height / 2 + 20);
        
        this.ctx.fillStyle = '#ffff00';
        this.ctx.fillText(this.language === 'ja' ? 'T: タイトルに戻る' : 'T: Return to Title', this.width / 2, this.height / 2 + 50);
        
        this.ctx.fillStyle = '#cccccc';
        this.ctx.font = '14px Arial';
        this.ctx.fillText(this.language === 'ja' ? 'P: 一時停止' : 'P: Pause', this.width / 2, this.height / 2 + 80);
    }
    
    showAchievements() {
        this.gameState = 'achievements';
    }
    
    renderAchievements() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = 'bold 36px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(this.language === 'ja' ? '実績一覧' : 'Achievements', this.width / 2, 80);
        
        let y = 140;
        const achievements = Object.keys(this.achievements);
        const itemsPerPage = 6;
        const startIndex = 0;
        const endIndex = Math.min(startIndex + itemsPerPage, achievements.length);
        
        for (let i = startIndex; i < endIndex; i++) {
            const key = achievements[i];
            const achievement = this.achievements[key];
            
            // Background box
            this.ctx.fillStyle = achievement.unlocked ? 'rgba(255, 215, 0, 0.3)' : 'rgba(128, 128, 128, 0.3)';
            this.ctx.fillRect(50, y - 25, this.width - 100, 60);
            
            // Icon
            this.ctx.font = '24px Arial';
            this.ctx.fillText(achievement.icon, 90, y + 5);
            
            // Name
            this.ctx.fillStyle = achievement.unlocked ? '#ffd700' : '#888888';
            this.ctx.font = 'bold 18px Arial';
            this.ctx.textAlign = 'left';
            this.ctx.fillText(achievement.name[this.language], 130, y - 5);
            
            // Description
            this.ctx.fillStyle = achievement.unlocked ? '#ffffff' : '#666666';
            this.ctx.font = '14px Arial';
            this.ctx.fillText(achievement.description[this.language], 130, y + 15);
            
            // Status
            this.ctx.fillStyle = achievement.unlocked ? '#00ff00' : '#ff0000';
            this.ctx.font = '12px Arial';
            this.ctx.textAlign = 'right';
            this.ctx.fillText(achievement.unlocked ? (this.language === 'ja' ? '解除済み' : 'Unlocked') : (this.language === 'ja' ? '未解除' : 'Locked'), this.width - 70, y + 5);
            
            y += 80;
        }
        
        // Return instruction
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '16px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(this.language === 'ja' ? 'スペース: 戻る' : 'Space: Return', this.width / 2, this.height - 30);
    }
    
    renderGameOver() {
        this.ctx.fillStyle = 'rgba(255, 0, 0, 0.2)';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = 'bold 36px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(this.texts[this.language].gameOver, this.width / 2, this.height / 2 - 80);
        
        this.ctx.font = '20px Arial';
        this.ctx.fillText(`${this.texts[this.language].finalScore}: ${this.score.toLocaleString()}`, this.width / 2, this.height / 2 - 20);
        
        if (this.score === this.highScore) {
            this.ctx.fillStyle = '#ffd700';
            this.ctx.fillText(this.texts[this.language].newHighScore, this.width / 2, this.height / 2 + 10);
        }
        
        this.ctx.fillStyle = '#cccccc';
        this.ctx.font = '16px Arial';
        this.ctx.fillText(`${this.texts[this.language].playTime}: ${this.formatTime(this.gameTime)}`, this.width / 2, this.height / 2 + 40);
        this.ctx.fillText(`${this.language === 'ja' ? '最大コンボ' : 'Max Combo'}: ${this.maxCombo}x`, this.width / 2, this.height / 2 + 60);
        this.ctx.fillText(`${this.language === 'ja' ? 'ボス撃破数' : 'Bosses Defeated'}: ${this.stats.bossesDefeated}`, this.width / 2, this.height / 2 + 80);
        
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '18px Arial';
        this.ctx.fillText(this.language === 'ja' ? 'スペース: リスタート' : 'Space: Restart', this.width / 2, this.height / 2 + 120);
        
        // Tweet button
        this.ctx.fillStyle = '#1DA1F2';
        this.ctx.font = '16px Arial';
        this.ctx.fillText(this.language === 'ja' ? 'T: スコアをツイート 🐦' : 'T: Tweet Score 🐦', this.width / 2, this.height / 2 + 150);
    }
    
    renderMobileControls() {
        this.ctx.save();
        
        // Virtual Joystick
        // Outer circle (background)
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.arc(this.virtualJoystick.centerX, this.virtualJoystick.centerY, this.virtualJoystick.radius, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.stroke();
        
        // Inner knob
        const knobAlpha = this.virtualJoystick.isActive ? 0.8 : 0.5;
        this.ctx.fillStyle = `rgba(255, 255, 255, ${knobAlpha})`;
        this.ctx.strokeStyle = `rgba(255, 255, 255, ${knobAlpha + 0.2})`;
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.arc(this.virtualJoystick.knobX, this.virtualJoystick.knobY, this.virtualJoystick.knobRadius, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.stroke();
        
        // Virtual Buttons
        this.renderVirtualButton(this.virtualButtons.shoot, '🔫', '#ff4444');
        this.renderVirtualButton(this.virtualButtons.dash, '💨', '#44ff44');
        this.renderVirtualButton(this.virtualButtons.shield, '🛡️', '#4444ff');
        this.renderVirtualButton(this.virtualButtons.pause, '⏸️', '#ffaa00');
        
        this.ctx.restore();
    }
    
    renderVirtualButton(button, emoji, color) {
        const alpha = button.isPressed ? 0.8 : 0.4;
        
        // Button background
        this.ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.3})`;
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.arc(button.x, button.y, button.radius, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.stroke();
        
        // Button icon/emoji
        this.ctx.fillStyle = color;
        this.ctx.font = `${button.radius}px Arial`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(emoji, button.x, button.y);
    }
    
    // Ranking functions removed
    
    wrapText(text, x, y, maxWidth, lineHeight) {
        const words = text.split(' ');
        let line = '';
        let currentY = y;
        
        for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' ';
            const metrics = this.ctx.measureText(testLine);
            const testWidth = metrics.width;
            
            if (testWidth > maxWidth && n > 0) {
                this.ctx.fillText(line, x, currentY);
                line = words[n] + ' ';
                currentY += lineHeight;
            } else {
                line = testLine;
            }
        }
        this.ctx.fillText(line, x, currentY);
    }
    
    formatTime(milliseconds) {
        const minutes = Math.floor(milliseconds / 60000);
        const seconds = Math.floor((milliseconds % 60000) / 1000);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
    
    gameLoop() {
        if (!this.isRunning) return;
        
        const currentTime = performance.now();
        this.deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;
        
        this.update(this.deltaTime);
        this.render();
        
        this.animationFrameId = requestAnimationFrame(() => this.gameLoop());
    }
    
    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.lastTime = performance.now();
            this.gameLoop();
        }
    }
    
    stop() {
        this.isRunning = false;
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }
}

// Export the game class globally
window.PortfolioCareerGame = PortfolioCareerGame;