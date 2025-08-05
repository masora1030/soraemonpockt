// Crazy Portfolio Game - A Fun & Mobile-Friendly Experience
class CrazyPortfolioGame {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.gameState = 'menu'; // menu, playing, paused, gameOver, victory
        this.score = 0;
        this.level = 1;
        this.lives = 3;
        this.isGameRunning = false;
        this.isMobile = window.innerWidth <= 768;
        
        // Game objects
        this.player = null;
        this.enemies = [];
        this.powerUps = [];
        this.particles = [];
        this.achievements = [];
        
        // Input handling
        this.keys = {};
        this.mousePos = { x: 0, y: 0 };
        this.touchPos = { x: 0, y: 0 };
        
        // Game settings
        this.gameWidth = 800;
        this.gameHeight = 500;
        this.spawnTimer = 0;
        this.levelUpTimer = 0;
        
        // Crazy elements
        this.crazyMode = false;
        this.crazyTimer = 0;
        this.screenShake = 0;
        this.colorShift = 0;
        
        // Mobile-specific
        this.joystick = null;
        this.actionButton = null;
        
        // Funny messages for different languages
        this.messages = {
            en: {
                welcome: ['Welcome to the Code Chaos!', 'Debug your way to glory!', 'May the source be with you!'],
                enemy: ['Bug Alert!', 'Compiler Error!', 'Stack Overflow!', 'Memory Leak!', 'Null Pointer!'],
                powerUp: ['Coffee Power!', 'Sudo Mode!', 'Infinite Loop Breaker!', 'Debug Master!'],
                levelUp: ['Level Up! More Chaos!', 'Promotion! More Problems!', 'Achievement Unlocked!'],
                gameOver: ['404: Skills Not Found', 'Segmentation Fault', 'Game.exe has stopped working'],
                victory: ['You are now a 10x Developer!', 'Congratulations! You broke the system!', 'Maximum Craziness Achieved!'],
                crazy: ['CRAZY MODE ACTIVATED!', 'CHAOS UNLEASHED!', 'MADNESS BEGINS!']
            },
            ja: {
                welcome: ['コードカオスへようこそ！', 'デバッグで栄光を掴め！', 'ソースと共にあらんことを！'],
                enemy: ['バグアラート！', 'コンパイルエラー！', 'スタックオーバーフロー！', 'メモリリーク！', 'ヌルポインタ！'],
                powerUp: ['コーヒーパワー！', 'sudo モード！', '無限ループブレイカー！', 'デバッグマスター！'],
                levelUp: ['レベルアップ！更なるカオス！', '昇進！更なる問題！', '実績解除！'],
                gameOver: ['404: スキルが見つかりません', 'セグメンテーション違反', 'Game.exe は動作を停止しました'],
                victory: ['あなたは今や10倍速開発者！', 'おめでとう！システムを破壊した！', '最大狂気度達成！'],
                crazy: ['クレイジーモード発動！', 'カオス解放！', '狂気開始！']
            }
        };
        
        this.init();
    }
    
    init() {
        this.setupCanvas();
        this.setupControls();
        this.createPlayer();
        this.showMenu();
    }
    
    setupCanvas() {
        this.canvas = document.getElementById('game-canvas');
        if (!this.canvas) {
            console.error('Game canvas not found');
            return;
        }
        
        this.ctx = this.canvas.getContext('2d');
        
        // Responsive canvas sizing
        if (this.isMobile) {
            this.gameWidth = Math.min(window.innerWidth - 40, 400);
            this.gameHeight = Math.min(window.innerHeight * 0.6, 300);
        }
        
        this.canvas.width = this.gameWidth;
        this.canvas.height = this.gameHeight;
        
        this.canvas.style.maxWidth = '100%';
        this.canvas.style.height = 'auto';
        this.canvas.style.border = '3px solid #1e40af';
        this.canvas.style.borderRadius = '15px';
        this.canvas.style.background = 'linear-gradient(45deg, #667eea 0%, #764ba2 50%, #f093fb 100%)';
        this.canvas.style.boxShadow = '0 10px 25px rgba(0,0,0,0.3)';
    }
    
    setupControls() {
        // Keyboard events
        document.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
            this.handleKeyPress(e.code);
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });
        
        // Mouse events
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mousePos.x = (e.clientX - rect.left) * (this.gameWidth / rect.width);
            this.mousePos.y = (e.clientY - rect.top) * (this.gameHeight / rect.height);
        });
        
        this.canvas.addEventListener('click', (e) => {
            this.handleClick();
        });
        
        // Touch events for mobile
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.handleTouch(e);
        });
        
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            this.handleTouch(e);
        });
        
        this.canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
        });
        
        // Setup mobile controls if needed
        if (this.isMobile) {
            this.setupMobileControls();
        }
    }
    
    setupMobileControls() {
        // Create virtual joystick and action button
        const gameContainer = document.getElementById('game-container');
        if (!gameContainer) return;
        
        // Virtual joystick
        this.joystick = document.createElement('div');
        this.joystick.className = 'virtual-joystick';
        this.joystick.innerHTML = '<div class="joystick-knob"></div>';
        this.joystick.style.cssText = `
            position: absolute;
            bottom: 20px;
            left: 20px;
            width: 80px;
            height: 80px;
            background: rgba(255,255,255,0.2);
            border: 2px solid rgba(255,255,255,0.5);
            border-radius: 50%;
            touch-action: none;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        
        const knob = this.joystick.querySelector('.joystick-knob');
        knob.style.cssText = `
            width: 30px;
            height: 30px;
            background: rgba(255,255,255,0.8);
            border-radius: 50%;
            transition: none;
        `;
        
        // Action button
        this.actionButton = document.createElement('button');
        this.actionButton.className = 'action-button';
        this.actionButton.textContent = '🚀';
        this.actionButton.style.cssText = `
            position: absolute;
            bottom: 20px;
            right: 20px;
            width: 60px;
            height: 60px;
            background: rgba(255,255,255,0.2);
            border: 2px solid rgba(255,255,255,0.5);
            border-radius: 50%;
            color: white;
            font-size: 24px;
            cursor: pointer;
            touch-action: manipulation;
        `;
        
        gameContainer.appendChild(this.joystick);
        gameContainer.appendChild(this.actionButton);
        
        this.setupJoystickEvents();
        this.setupActionButtonEvents();
    }
    
    setupJoystickEvents() {
        let isDragging = false;
        let startPos = { x: 0, y: 0 };
        
        this.joystick.addEventListener('touchstart', (e) => {
            isDragging = true;
            const rect = this.joystick.getBoundingClientRect();
            startPos.x = rect.left + rect.width / 2;
            startPos.y = rect.top + rect.height / 2;
        });
        
        document.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            
            const touch = e.touches[0];
            const deltaX = touch.clientX - startPos.x;
            const deltaY = touch.clientY - startPos.y;
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            const maxDistance = 25;
            
            if (distance < maxDistance) {
                this.joystick.querySelector('.joystick-knob').style.transform = 
                    `translate(${deltaX}px, ${deltaY}px)`;
            } else {
                const angle = Math.atan2(deltaY, deltaX);
                const x = Math.cos(angle) * maxDistance;
                const y = Math.sin(angle) * maxDistance;
                this.joystick.querySelector('.joystick-knob').style.transform = 
                    `translate(${x}px, ${y}px)`;
            }
            
            // Update player movement
            if (this.player && this.gameState === 'playing') {
                this.player.vx = (deltaX / maxDistance) * this.player.speed;
                this.player.vy = (deltaY / maxDistance) * this.player.speed;
            }
        });
        
        document.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            isDragging = false;
            
            this.joystick.querySelector('.joystick-knob').style.transform = 'translate(0, 0)';
            
            if (this.player) {
                this.player.vx = 0;
                this.player.vy = 0;
            }
        });
    }
    
    setupActionButtonEvents() {
        this.actionButton.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.useSpecialAbility();
            this.actionButton.style.transform = 'scale(0.9)';
        });
        
        this.actionButton.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.actionButton.style.transform = 'scale(1)';
        });
    }
    
    createPlayer() {
        this.player = {
            x: this.gameWidth / 2,
            y: this.gameHeight / 2,
            width: 40,
            height: 40,
            speed: 4,
            vx: 0,
            vy: 0,
            health: 100,
            maxHealth: 100,
            color: '#4CAF50',
            invulnerable: false,
            invulnerabilityTimer: 0,
            specialAbilityTimer: 0,
            emoji: '🧑‍💻',
            trail: []
        };
    }
    
    showMenu() {
        this.gameState = 'menu';
        this.draw();
    }
    
    handleClick() {
        if (this.gameState === 'menu') {
            this.startGame();
        } else if (this.gameState === 'gameOver' || this.gameState === 'victory') {
            this.showMenu();
        }
    }
    
    handleTouch(e) {
        const rect = this.canvas.getBoundingClientRect();
        const touch = e.touches[0];
        this.touchPos.x = (touch.clientX - rect.left) * (this.gameWidth / rect.width);
        this.touchPos.y = (touch.clientY - rect.top) * (this.gameHeight / rect.height);
        
        if (this.gameState === 'menu') {
            this.startGame();
        } else if (this.gameState === 'playing') {
            // Move player towards touch position
            if (this.player && !this.isMobile) {
                const dx = this.touchPos.x - this.player.x;
                const dy = this.touchPos.y - this.player.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance > 5) {
                    this.player.vx = (dx / distance) * this.player.speed;
                    this.player.vy = (dy / distance) * this.player.speed;
                }
            }
        }
    }
    
    handleKeyPress(key) {
        if (key === 'Space' && this.gameState === 'playing') {
            this.useSpecialAbility();
        } else if (key === 'KeyC' && this.gameState === 'playing') {
            this.activateCrazyMode();
        }
    }
    
    startGame() {
        this.gameState = 'playing';
        this.isGameRunning = true;
        this.score = 0;
        this.level = 1;
        this.lives = 3;
        this.enemies = [];
        this.powerUps = [];
        this.particles = [];
        this.spawnTimer = 0;
        this.levelUpTimer = 0;
        this.crazyMode = false;
        this.crazyTimer = 0;
        
        this.createPlayer();
        this.showMessage(this.getRandomMessage('welcome'));
        this.gameLoop();
    }
    
    gameLoop() {
        if (!this.isGameRunning) return;
        
        this.update();
        this.draw();
        
        requestAnimationFrame(() => this.gameLoop());
    }
    
    update() {
        if (this.gameState !== 'playing') return;
        
        this.updatePlayer();
        this.updateEnemies();
        this.updatePowerUps();
        this.updateParticles();
        this.spawnEnemies();
        this.checkCollisions();
        this.updateCrazyMode();
        this.updateScreenEffects();
        
        // Level progression
        this.levelUpTimer++;
        if (this.levelUpTimer > 1800) { // 30 seconds at 60fps
            this.levelUp();
            this.levelUpTimer = 0;
        }
        
        // Update timers
        if (this.player.invulnerabilityTimer > 0) {
            this.player.invulnerabilityTimer--;
            this.player.invulnerable = this.player.invulnerabilityTimer > 0;
        }
        
        if (this.player.specialAbilityTimer > 0) {
            this.player.specialAbilityTimer--;
        }
    }
    
    updatePlayer() {
        // Keyboard movement (if not mobile)
        if (!this.isMobile) {
            if (this.keys['ArrowLeft'] || this.keys['KeyA']) this.player.vx = -this.player.speed;
            if (this.keys['ArrowRight'] || this.keys['KeyD']) this.player.vx = this.player.speed;
            if (this.keys['ArrowUp'] || this.keys['KeyW']) this.player.vy = -this.player.speed;
            if (this.keys['ArrowDown'] || this.keys['KeyS']) this.player.vy = this.player.speed;
            
            // Mouse movement
            const dx = this.mousePos.x - this.player.x;
            const dy = this.mousePos.y - this.player.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance > 5 && distance < 100) {
                this.player.vx = (dx / distance) * this.player.speed * 0.3;
                this.player.vy = (dy / distance) * this.player.speed * 0.3;
            }
        }
        
        // Apply movement
        this.player.x += this.player.vx;
        this.player.y += this.player.vy;
        
        // Friction
        this.player.vx *= 0.8;
        this.player.vy *= 0.8;
        
        // Keep player in bounds with screen wrapping
        if (this.player.x < 0) this.player.x = this.gameWidth;
        if (this.player.x > this.gameWidth) this.player.x = 0;
        if (this.player.y < 0) this.player.y = this.gameHeight;
        if (this.player.y > this.gameHeight) this.player.y = 0;
        
        // Add trail effect
        this.player.trail.push({ x: this.player.x, y: this.player.y, alpha: 1 });
        if (this.player.trail.length > 10) {
            this.player.trail.shift();
        }
        
        // Update trail alpha
        this.player.trail.forEach((point, index) => {
            point.alpha = index / this.player.trail.length;
        });
    }
    
    spawnEnemies() {
        this.spawnTimer++;
        
        const spawnRate = Math.max(30 - this.level * 2, 10);
        if (this.spawnTimer % spawnRate === 0) {
            this.spawnEnemy();
        }
        
        if (this.spawnTimer % 300 === 0) {
            this.spawnPowerUp();
        }
    }
    
    spawnEnemy() {
        const enemyTypes = ['bug', 'error', 'warning', 'crash', 'leak'];
        const type = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
        
        const enemy = {
            x: Math.random() < 0.5 ? -30 : this.gameWidth + 30,
            y: Math.random() * this.gameHeight,
            width: 25 + Math.random() * 15,
            height: 25 + Math.random() * 15,
            speed: 1 + Math.random() * 2 + this.level * 0.2,
            type: type,
            color: this.getEnemyColor(type),
            emoji: this.getEnemyEmoji(type),
            rotation: 0,
            rotationSpeed: (Math.random() - 0.5) * 0.2,
            bounty: 10 + this.level * 2,
            crazy: Math.random() < 0.1
        };
        
        this.enemies.push(enemy);
    }
    
    spawnPowerUp() {
        const powerUpTypes = ['coffee', 'sudo', 'debug', 'speed', 'shield'];
        const type = powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)];
        
        const powerUp = {
            x: Math.random() * this.gameWidth,
            y: -30,
            width: 20,
            height: 20,
            speed: 1,
            type: type,
            color: '#FFD700',
            emoji: this.getPowerUpEmoji(type),
            rotation: 0,
            pulse: 0
        };
        
        this.powerUps.push(powerUp);
    }
    
    updateEnemies() {
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            
            // Move towards player
            const dx = this.player.x - enemy.x;
            const dy = this.player.y - enemy.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance > 0) {
                enemy.x += (dx / distance) * enemy.speed;
                enemy.y += (dy / distance) * enemy.speed;
            }
            
            // Add rotation
            enemy.rotation += enemy.rotationSpeed;
            
            // Crazy enemy behavior
            if (enemy.crazy) {
                enemy.x += Math.sin(Date.now() * 0.01) * 3;
                enemy.y += Math.cos(Date.now() * 0.01) * 3;
                enemy.speed *= 1.2;
            }
            
            // Remove enemies that are too far
            if (distance > this.gameWidth * 2) {
                this.enemies.splice(i, 1);
            }
        }
    }
    
    updatePowerUps() {
        for (let i = this.powerUps.length - 1; i >= 0; i--) {
            const powerUp = this.powerUps[i];
            powerUp.y += powerUp.speed;
            powerUp.rotation += 0.1;
            powerUp.pulse += 0.2;
            
            if (powerUp.y > this.gameHeight + 50) {
                this.powerUps.splice(i, 1);
            }
        }
    }
    
    updateParticles() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life--;
            particle.alpha = particle.life / particle.maxLife;
            particle.rotation += particle.rotationSpeed;
            
            if (particle.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }
    
    checkCollisions() {
        // Enemy collisions
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            if (this.isColliding(this.player, enemy) && !this.player.invulnerable) {
                this.takeDamage(15);
                this.createExplosion(enemy.x, enemy.y, enemy.color);
                this.enemies.splice(i, 1);
                this.addScreenShake(5);
                continue;
            }
        }
        
        // PowerUp collisions
        for (let i = this.powerUps.length - 1; i >= 0; i--) {
            const powerUp = this.powerUps[i];
            if (this.isColliding(this.player, powerUp)) {
                this.collectPowerUp(powerUp);
                this.createExplosion(powerUp.x, powerUp.y, '#FFD700');
                this.powerUps.splice(i, 1);
                continue;
            }
        }
    }
    
    isColliding(obj1, obj2) {
        return obj1.x < obj2.x + obj2.width &&
               obj1.x + obj1.width > obj2.x &&
               obj1.y < obj2.y + obj2.height &&
               obj1.y + obj1.height > obj2.y;
    }
    
    takeDamage(damage) {
        this.player.health -= damage;
        this.player.invulnerable = true;
        this.player.invulnerabilityTimer = 120; // 2 seconds at 60fps
        
        if (this.player.health <= 0) {
            this.lives--;
            if (this.lives > 0) {
                this.player.health = this.player.maxHealth;
                this.showMessage('Life lost! Keep debugging!');
                this.addScreenShake(10);
            } else {
                this.gameOver();
            }
        }
    }
    
    collectPowerUp(powerUp) {
        this.score += 50;
        this.showMessage(this.getRandomMessage('powerUp'));
        
        switch (powerUp.type) {
            case 'coffee':
                this.player.speed += 1;
                setTimeout(() => this.player.speed -= 1, 5000);
                break;
            case 'sudo':
                this.player.invulnerable = true;
                this.player.invulnerabilityTimer = 300;
                break;
            case 'debug':
                this.clearAllEnemies();
                break;
            case 'speed':
                this.player.speed *= 1.5;
                setTimeout(() => this.player.speed /= 1.5, 3000);
                break;
            case 'shield':
                this.player.health = this.player.maxHealth;
                break;
        }
    }
    
    useSpecialAbility() {
        if (this.player.specialAbilityTimer > 0) return;
        
        this.player.specialAbilityTimer = 180; // 3 second cooldown
        
        // Create shockwave effect
        this.createShockwave();
        this.score += this.enemies.length * 5;
        this.clearNearbyEnemies();
        this.addScreenShake(3);
    }
    
    activateCrazyMode() {
        if (this.crazyMode) return;
        
        this.crazyMode = true;
        this.crazyTimer = 600; // 10 seconds
        this.showMessage(this.getRandomMessage('crazy'));
        this.addScreenShake(15);
    }
    
    updateCrazyMode() {
        if (this.crazyMode) {
            this.crazyTimer--;
            this.colorShift += 0.1;
            
            if (this.crazyTimer <= 0) {
                this.crazyMode = false;
                this.colorShift = 0;
            }
        }
    }
    
    updateScreenEffects() {
        if (this.screenShake > 0) {
            this.screenShake--;
        }
    }
    
    addScreenShake(intensity) {
        this.screenShake = Math.max(this.screenShake, intensity);
    }
    
    clearAllEnemies() {
        this.enemies.forEach(enemy => {
            this.createExplosion(enemy.x, enemy.y, enemy.color);
            this.score += enemy.bounty;
        });
        this.enemies = [];
    }
    
    clearNearbyEnemies() {
        const radius = 80;
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            const dx = enemy.x - this.player.x;
            const dy = enemy.y - this.player.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance <= radius) {
                this.createExplosion(enemy.x, enemy.y, enemy.color);
                this.score += enemy.bounty;
                this.enemies.splice(i, 1);
            }
        }
    }
    
    createExplosion(x, y, color) {
        for (let i = 0; i < 8; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 8,
                vy: (Math.random() - 0.5) * 8,
                color: color,
                life: 30,
                maxLife: 30,
                alpha: 1,
                size: Math.random() * 6 + 2,
                rotation: 0,
                rotationSpeed: (Math.random() - 0.5) * 0.3
            });
        }
    }
    
    createShockwave() {
        for (let i = 0; i < 16; i++) {
            const angle = (Math.PI * 2 * i) / 16;
            this.particles.push({
                x: this.player.x,
                y: this.player.y,
                vx: Math.cos(angle) * 6,
                vy: Math.sin(angle) * 6,
                color: '#00FFFF',
                life: 20,
                maxLife: 20,
                alpha: 1,
                size: 4,
                rotation: 0,
                rotationSpeed: 0.2
            });
        }
    }
    
    levelUp() {
        this.level++;
        this.showMessage(this.getRandomMessage('levelUp'));
        this.addScreenShake(8);
        
        // Increase player stats
        this.player.maxHealth += 10;
        this.player.health = Math.min(this.player.health + 20, this.player.maxHealth);
        
        // Spawn bonus powerups
        for (let i = 0; i < 3; i++) {
            setTimeout(() => this.spawnPowerUp(), i * 500);
        }
        
        if (this.level >= 20) {
            this.victory();
        }
    }
    
    gameOver() {
        this.gameState = 'gameOver';
        this.isGameRunning = false;
        this.addScreenShake(20);
        
        // Clean up mobile controls
        if (this.joystick) this.joystick.style.display = 'none';
        if (this.actionButton) this.actionButton.style.display = 'none';
    }
    
    victory() {
        this.gameState = 'victory';
        this.isGameRunning = false;
        this.addScreenShake(15);
        
        // Clean up mobile controls
        if (this.joystick) this.joystick.style.display = 'none';
        if (this.actionButton) this.actionButton.style.display = 'none';
    }
    
    draw() {
        // Clear canvas with crazy mode effects
        if (this.crazyMode) {
            const hue = Math.sin(this.colorShift) * 360;
            this.ctx.fillStyle = `hsl(${hue}, 50%, 10%)`;
        } else {
            this.ctx.fillStyle = 'rgba(0, 0, 20, 0.3)';
        }
        this.ctx.fillRect(0, 0, this.gameWidth, this.gameHeight);
        
        // Apply screen shake
        if (this.screenShake > 0) {
            this.ctx.save();
            this.ctx.translate(
                (Math.random() - 0.5) * this.screenShake,
                (Math.random() - 0.5) * this.screenShake
            );
        }
        
        if (this.gameState === 'playing') {
            this.drawGame();
        } else if (this.gameState === 'menu') {
            this.drawMenu();
        } else if (this.gameState === 'gameOver') {
            this.drawGameOver();
        } else if (this.gameState === 'victory') {
            this.drawVictory();
        }
        
        if (this.screenShake > 0) {
            this.ctx.restore();
        }
    }
    
    drawGame() {
        // Draw player trail
        this.player.trail.forEach((point, index) => {
            this.ctx.save();
            this.ctx.globalAlpha = point.alpha * 0.5;
            this.ctx.fillStyle = this.player.color;
            const size = (index / this.player.trail.length) * this.player.width;
            this.ctx.fillRect(point.x - size/2, point.y - size/2, size, size);
            this.ctx.restore();
        });
        
        // Draw player
        this.drawPlayer();
        
        // Draw enemies
        this.enemies.forEach(enemy => this.drawEnemy(enemy));
        
        // Draw powerups
        this.powerUps.forEach(powerUp => this.drawPowerUp(powerUp));
        
        // Draw particles
        this.particles.forEach(particle => this.drawParticle(particle));
        
        // Draw UI
        this.drawGameUI();
        
        // Show mobile controls
        if (this.isMobile && this.joystick && this.actionButton) {
            this.joystick.style.display = 'block';
            this.actionButton.style.display = 'block';
        }
    }
    
    drawPlayer() {
        this.ctx.save();
        
        if (this.player.invulnerable) {
            this.ctx.globalAlpha = 0.5 + 0.5 * Math.sin(Date.now() * 0.02);
        }
        
        this.ctx.translate(this.player.x, this.player.y);
        
        // Player glow effect
        if (this.crazyMode) {
            const gradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, 30);
            gradient.addColorStop(0, 'rgba(255,255,255,0.8)');
            gradient.addColorStop(1, 'rgba(255,255,255,0)');
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(-30, -30, 60, 60);
        }
        
        // Player body
        this.ctx.fillStyle = this.player.color;
        this.ctx.fillRect(-this.player.width/2, -this.player.height/2, this.player.width, this.player.height);
        
        // Player emoji
        this.ctx.font = '24px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(this.player.emoji, 0, 8);
        
        this.ctx.restore();
    }
    
    drawEnemy(enemy) {
        this.ctx.save();
        this.ctx.translate(enemy.x, enemy.y);
        this.ctx.rotate(enemy.rotation);
        
        // Enemy glow for crazy enemies
        if (enemy.crazy) {
            const gradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, 20);
            gradient.addColorStop(0, 'rgba(255,0,0,0.6)');
            gradient.addColorStop(1, 'rgba(255,0,0,0)');
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(-20, -20, 40, 40);
        }
        
        this.ctx.fillStyle = enemy.color;
        this.ctx.fillRect(-enemy.width/2, -enemy.height/2, enemy.width, enemy.height);
        
        this.ctx.font = '16px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(enemy.emoji, 0, 4);
        
        this.ctx.restore();
    }
    
    drawPowerUp(powerUp) {
        this.ctx.save();
        this.ctx.translate(powerUp.x, powerUp.y);
        this.ctx.rotate(powerUp.rotation);
        
        // Pulsing effect
        const scale = 1 + Math.sin(powerUp.pulse) * 0.2;
        this.ctx.scale(scale, scale);
        
        // Power-up glow
        const gradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, 15);
        gradient.addColorStop(0, 'rgba(255,215,0,0.8)');
        gradient.addColorStop(1, 'rgba(255,215,0,0)');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(-15, -15, 30, 30);
        
        this.ctx.fillStyle = powerUp.color;
        this.ctx.fillRect(-powerUp.width/2, -powerUp.height/2, powerUp.width, powerUp.height);
        
        this.ctx.font = '16px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(powerUp.emoji, 0, 4);
        
        this.ctx.restore();
    }
    
    drawParticle(particle) {
        this.ctx.save();
        this.ctx.globalAlpha = particle.alpha;
        this.ctx.translate(particle.x, particle.y);
        this.ctx.rotate(particle.rotation);
        
        this.ctx.fillStyle = particle.color;
        this.ctx.fillRect(-particle.size/2, -particle.size/2, particle.size, particle.size);
        
        this.ctx.restore();
    }
    
    drawGameUI() {
        const isJapanese = window.portfolioApp && window.portfolioApp.currentLanguage === 'ja';
        
        // Health bar
        const barWidth = this.gameWidth * 0.25;
        const barHeight = 20;
        this.ctx.fillStyle = 'rgba(0,0,0,0.5)';
        this.ctx.fillRect(10, 10, barWidth, barHeight);
        
        this.ctx.fillStyle = this.player.health > 30 ? '#4CAF50' : '#FF5722';
        this.ctx.fillRect(10, 10, (this.player.health / this.player.maxHealth) * barWidth, barHeight);
        
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.strokeRect(10, 10, barWidth, barHeight);
        
        // Game info
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = 'bold 16px Arial';
        this.ctx.textAlign = 'left';
        
        const infoY = 50;
        this.ctx.fillText(`${isJapanese ? 'スコア' : 'Score'}: ${this.score}`, 10, infoY);
        this.ctx.fillText(`${isJapanese ? 'レベル' : 'Level'}: ${this.level}`, 10, infoY + 25);
        this.ctx.fillText(`${isJapanese ? 'ライフ' : 'Lives'}: ${this.lives}`, 10, infoY + 50);
        
        // Special ability cooldown
        if (this.player.specialAbilityTimer > 0) {
            this.ctx.fillStyle = 'rgba(255,255,255,0.7)';
            this.ctx.fillText(`${isJapanese ? 'クールダウン' : 'Cooldown'}: ${Math.ceil(this.player.specialAbilityTimer / 60)}s`, 10, infoY + 75);
        } else {
            this.ctx.fillStyle = '#00FF00';
            this.ctx.fillText(`${isJapanese ? 'スペシャル準備完了' : 'Special Ready'}!`, 10, infoY + 75);
        }
        
        // Crazy mode indicator
        if (this.crazyMode) {
            this.ctx.fillStyle = '#FF00FF';
            this.ctx.font = 'bold 20px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('🌟 CRAZY MODE 🌟', this.gameWidth / 2, 30);
            this.ctx.fillText(`${Math.ceil(this.crazyTimer / 60)}s`, this.gameWidth / 2, 55);
        }
        
        // Instructions
        this.ctx.fillStyle = 'rgba(255,255,255,0.7)';
        this.ctx.font = '12px Arial';
        this.ctx.textAlign = 'right';
        if (!this.isMobile) {
            this.ctx.fillText(isJapanese ? 'スペース: スペシャル / C: クレイジー' : 'Space: Special / C: Crazy', this.gameWidth - 10, this.gameHeight - 10);
        }
    }
    
    drawMenu() {
        const isJapanese = window.portfolioApp && window.portfolioApp.currentLanguage === 'ja';
        
        // Title
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = 'bold 32px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(
            isJapanese ? 'クレイジーコードゲーム' : 'Crazy Code Game',
            this.gameWidth / 2, 
            this.gameHeight / 3
        );
        
        // Instructions
        this.ctx.font = '16px Arial';
        this.ctx.fillStyle = '#cccccc';
        const instructions = [
            isJapanese ? 'タップ/クリックでスタート' : 'Tap/Click to Start',
            isJapanese ? 'バグを避けて生き残れ！' : 'Avoid bugs and survive!',
            isJapanese ? 'パワーアップを集めよう' : 'Collect power-ups'
        ];
        
        instructions.forEach((text, index) => {
            this.ctx.fillText(text, this.gameWidth / 2, this.gameHeight / 2 + index * 25);
        });
        
        // Start button effect
        const pulse = Math.sin(Date.now() * 0.005) * 0.3 + 0.7;
        this.ctx.globalAlpha = pulse;
        this.ctx.fillStyle = '#4CAF50';
        this.ctx.font = 'bold 20px Arial';
        this.ctx.fillText(
            isJapanese ? '🎮 ゲーム開始 🎮' : '🎮 START GAME 🎮',
            this.gameWidth / 2,
            this.gameHeight * 0.75
        );
        this.ctx.globalAlpha = 1;
    }
    
    drawGameOver() {
        const isJapanese = window.portfolioApp && window.portfolioApp.currentLanguage === 'ja';
        
        this.ctx.fillStyle = 'rgba(0,0,0,0.8)';
        this.ctx.fillRect(0, 0, this.gameWidth, this.gameHeight);
        
        this.ctx.fillStyle = '#FF5722';
        this.ctx.font = 'bold 36px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(
            isJapanese ? 'ゲームオーバー' : 'GAME OVER',
            this.gameWidth / 2, 
            this.gameHeight / 3
        );
        
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '20px Arial';
        this.ctx.fillText(`${isJapanese ? 'スコア' : 'Score'}: ${this.score}`, this.gameWidth / 2, this.gameHeight / 2);
        this.ctx.fillText(`${isJapanese ? 'レベル' : 'Level'}: ${this.level}`, this.gameWidth / 2, this.gameHeight / 2 + 30);
        
        this.ctx.font = '16px Arial';
        this.ctx.fillStyle = '#cccccc';
        this.ctx.fillText(this.getRandomMessage('gameOver'), this.gameWidth / 2, this.gameHeight / 2 + 70);
        
        const pulse = Math.sin(Date.now() * 0.008) * 0.3 + 0.7;
        this.ctx.globalAlpha = pulse;
        this.ctx.fillText(
            isJapanese ? 'タップで再開' : 'Tap to Restart',
            this.gameWidth / 2,
            this.gameHeight * 0.8
        );
        this.ctx.globalAlpha = 1;
    }
    
    drawVictory() {
        const isJapanese = window.portfolioApp && window.portfolioApp.currentLanguage === 'ja';
        
        this.ctx.fillStyle = 'rgba(255,215,0,0.9)';
        this.ctx.fillRect(0, 0, this.gameWidth, this.gameHeight);
        
        this.ctx.fillStyle = '#4CAF50';
        this.ctx.font = 'bold 36px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(
            isJapanese ? '勝利！' : 'VICTORY!',
            this.gameWidth / 2, 
            this.gameHeight / 3
        );
        
        this.ctx.fillStyle = '#333333';
        this.ctx.font = '20px Arial';
        this.ctx.fillText(`${isJapanese ? '最終スコア' : 'Final Score'}: ${this.score}`, this.gameWidth / 2, this.gameHeight / 2);
        
        this.ctx.font = '16px Arial';
        this.ctx.fillText(this.getRandomMessage('victory'), this.gameWidth / 2, this.gameHeight / 2 + 50);
        
        const pulse = Math.sin(Date.now() * 0.008) * 0.3 + 0.7;
        this.ctx.globalAlpha = pulse;
        this.ctx.fillText(
            isJapanese ? 'タップで再開' : 'Tap to Restart',
            this.gameWidth / 2,
            this.gameHeight * 0.8
        );
        this.ctx.globalAlpha = 1;
    }
    
    getEnemyColor(type) {
        const colors = {
            bug: '#FF5722',
            error: '#F44336',
            warning: '#FF9800',
            crash: '#9C27B0',
            leak: '#607D8B'
        };
        return colors[type] || '#FF5722';
    }
    
    getEnemyEmoji(type) {
        const emojis = {
            bug: '🐛',
            error: '❌',
            warning: '⚠️',
            crash: '💥',
            leak: '🕳️'
        };
        return emojis[type] || '🐛';
    }
    
    getPowerUpEmoji(type) {
        const emojis = {
            coffee: '☕',
            sudo: '👑',
            debug: '🔧',
            speed: '⚡',
            shield: '🛡️'
        };
        return emojis[type] || '💎';
    }
    
    getRandomMessage(type) {
        const isJapanese = window.portfolioApp && window.portfolioApp.currentLanguage === 'ja';
        const messages = this.messages[isJapanese ? 'ja' : 'en'][type];
        return messages[Math.floor(Math.random() * messages.length)];
    }
    
    showMessage(text) {
        // Store message for display
        this.currentMessage = text;
        this.messageTimer = 180; // 3 seconds at 60fps
        
        // Clear previous message timeout
        if (this.messageTimeout) {
            clearTimeout(this.messageTimeout);
        }
        
        // Auto-hide message
        this.messageTimeout = setTimeout(() => {
            this.currentMessage = '';
        }, 3000);
    }
    
    start() {
        this.showMenu();
    }
}

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('game-canvas')) {
        window.epicGame = new CrazyPortfolioGame();
    }
});

// Export for global access
window.CrazyPortfolioGame = CrazyPortfolioGame;