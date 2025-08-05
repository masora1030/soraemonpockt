// Epic Code Adventure - A Career-Themed Portfolio Game
class EpicGame {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.gameState = 'menu'; // menu, playing, paused, gameOver, victory
        this.score = 0;
        this.level = 1;
        this.lives = 3;
        this.currentStage = 'intern';
        this.isGameRunning = false;
        
        // Game objects
        this.player = null;
        this.bugs = [];
        this.powerUps = [];
        this.particles = [];
        this.bosses = [];
        this.codeBlocks = [];
        
        // Input handling
        this.keys = {};
        this.mousePos = { x: 0, y: 0 };
        
        // Game settings
        this.gameWidth = 800;
        this.gameHeight = 600;
        this.spawnTimer = 0;
        this.difficultyMultiplier = 1;
        
        // Career stages with humorous themes
        this.careerStages = {
            intern: {
                name: { en: 'Intern Level', ja: 'インターンレベル' },
                description: { en: 'Survive the coffee runs!', ja: 'コーヒー配達を乗り切れ！' },
                bugs: ['NullPointerException', 'Syntax Error', 'Missing Semicolon'],
                boss: 'Senior Developer',
                color: '#4CAF50'
            },
            junior: {
                name: { en: 'Junior Developer', ja: 'ジュニア開発者' },
                description: { en: 'Debug the legacy code!', ja: 'レガシーコードをデバッグ！' },
                bugs: ['Memory Leak', 'Infinite Loop', 'Race Condition'],
                boss: 'Tech Lead',
                color: '#2196F3'
            },
            senior: {
                name: { en: 'Senior Engineer', ja: 'シニアエンジニア' },
                description: { en: 'Handle the production fires!', ja: '本番環境の火消し対応！' },
                bugs: ['Database Deadlock', 'Security Vulnerability', 'Performance Issue'],
                boss: 'Product Manager',
                color: '#FF9800'
            },
            architect: {
                name: { en: 'System Architect', ja: 'システムアーキテクト' },
                description: { en: 'Design the ultimate system!', ja: '究極のシステム設計！' },
                bugs: ['Microservice Chaos', 'Technical Debt', 'Scalability Crisis'],
                boss: 'Executive Management',
                color: '#9C27B0'
            }
        };
        
        // Humorous messages
        this.messages = {
            en: {
                gameStart: ['Let the coding adventure begin!', 'Time to debug your career!', 'Welcome to the code matrix!'],
                bugCaught: ['Bug squashed!', 'Code fixed!', 'Error resolved!', 'Stack overflow prevented!'],
                powerUp: ['Power-up acquired!', 'Skills upgraded!', 'Caffeine boost!', 'Documentation found!'],
                levelUp: ['Level up! Promotion time!', 'Congratulations! Salary increased!', 'New responsibilities unlocked!'],
                gameOver: ['Game Over! Time to refactor your approach!', 'Stack trace of failure!', 'Error 404: Skills not found!'],
                victory: ['Congratulations! You\'ve mastered the code!', 'Ultimate developer achieved!', 'Time to start your own company!']
            },
            ja: {
                gameStart: ['コーディング冒険の始まり！', 'キャリアのデバッグ開始！', 'コードマトリックスへようこそ！'],
                bugCaught: ['バグを潰した！', 'コード修正完了！', 'エラー解決！', 'スタックオーバーフロー阻止！'],
                powerUp: ['パワーアップ獲得！', 'スキルアップ！', 'カフェイン補給！', 'ドキュメント発見！'],
                levelUp: ['レベルアップ！昇進だ！', 'おめでとう！給料アップ！', '新しい責任解放！'],
                gameOver: ['ゲームオーバー！アプローチをリファクタしよう！', '失敗のスタックトレース！', 'エラー404：スキルが見つかりません！'],
                victory: ['おめでとう！コードをマスターした！', '究極の開発者達成！', '自分の会社を始める時だ！']
            }
        };
        
        // Initialize
        this.init();
    }
    
    init() {
        this.setupCanvas();
        this.setupEventListeners();
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
        this.canvas.width = this.gameWidth;
        this.canvas.height = this.gameHeight;
        
        // Set canvas style for responsive design
        this.canvas.style.maxWidth = '100%';
        this.canvas.style.height = 'auto';
        this.canvas.style.border = '2px solid var(--accent-primary)';
        this.canvas.style.borderRadius = '12px';
        this.canvas.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    }
    
    setupEventListeners() {
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
            const rect = this.canvas.getBoundingClientRect();
            const touch = e.touches[0];
            this.mousePos.x = (touch.clientX - rect.left) * (this.gameWidth / rect.width);
            this.mousePos.y = (touch.clientY - rect.top) * (this.gameHeight / rect.height);
            this.handleClick();
        });
        
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const rect = this.canvas.getBoundingClientRect();
            const touch = e.touches[0];
            this.mousePos.x = (touch.clientX - rect.left) * (this.gameWidth / rect.width);
            this.mousePos.y = (touch.clientY - rect.top) * (this.gameHeight / rect.height);
        });
    }
    
    createPlayer() {
        this.player = {
            x: this.gameWidth / 2,
            y: this.gameHeight - 80,
            width: 40,
            height: 40,
            speed: 5,
            health: 100,
            maxHealth: 100,
            skills: {
                debugging: 1,
                coffee: 1,
                documentation: 1,
                leadership: 1
            },
            color: '#4CAF50',
            invulnerable: false,
            invulnerabilityTimer: 0
        };
    }
    
    showMenu() {
        this.gameState = 'menu';
        this.drawMenu();
    }
    
    drawMenu() {
        const isJapanese = window.portfolioApp && window.portfolioApp.currentLanguage === 'ja';
        
        // Clear canvas
        this.ctx.fillStyle = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        this.ctx.fillRect(0, 0, this.gameWidth, this.gameHeight);
        
        // Add background pattern
        this.drawCodeBackground();
        
        // Title
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = 'bold 48px "Comic Sans MS", cursive';
        this.ctx.textAlign = 'center';
        const title = isJapanese ? 'エピックコード冒険' : 'Epic Code Adventure';
        this.ctx.fillText(title, this.gameWidth / 2, 150);
        
        // Subtitle
        this.ctx.font = '20px Arial';
        const subtitle = isJapanese ? 'キャリアを通じてバグを倒せ！' : 'Defeat bugs through your career!';
        this.ctx.fillText(subtitle, this.gameWidth / 2, 190);
        
        // Instructions
        this.ctx.font = '16px Arial';
        this.ctx.fillStyle = '#f0f0f0';
        const instructions = [
            isJapanese ? 'マウス/タッチでプレイヤーを移動' : 'Mouse/Touch to move player',
            isJapanese ? 'スペースキーでスキル使用' : 'Spacebar to use skills',
            isJapanese ? 'バグを避けてパワーアップを集めよう' : 'Avoid bugs and collect power-ups'
        ];
        
        instructions.forEach((instruction, index) => {
            this.ctx.fillText(instruction, this.gameWidth / 2, 250 + index * 25);
        });
        
        // Career stage selector
        this.drawStageSelector(isJapanese);
        
        // Start button
        this.drawButton(this.gameWidth / 2 - 100, 480, 200, 50, 
                       isJapanese ? 'ゲーム開始！' : 'Start Game!', '#4CAF50');
        
        // High score
        const highScore = localStorage.getItem('epicGameHighScore') || 0;
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '18px Arial';
        this.ctx.fillText(`${isJapanese ? '最高スコア' : 'High Score'}: ${highScore}`, this.gameWidth / 2, 560);
    }
    
    drawStageSelector(isJapanese) {
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '18px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(isJapanese ? '難易度選択:' : 'Choose Difficulty:', this.gameWidth / 2, 350);
        
        const stages = Object.keys(this.careerStages);
        const buttonWidth = 150;
        const buttonHeight = 40;
        const spacing = 20;
        const totalWidth = (buttonWidth * stages.length) + (spacing * (stages.length - 1));
        const startX = (this.gameWidth - totalWidth) / 2;
        
        stages.forEach((stage, index) => {
            const x = startX + (buttonWidth + spacing) * index;
            const y = 370;
            const stageInfo = this.careerStages[stage];
            const selected = this.currentStage === stage;
            
            this.drawButton(x, y, buttonWidth, buttonHeight, 
                           stageInfo.name[isJapanese ? 'ja' : 'en'], 
                           selected ? stageInfo.color : '#666666');
        });
    }
    
    drawButton(x, y, width, height, text, color) {
        // Button background
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y, width, height);
        
        // Button border
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(x, y, width, height);
        
        // Button text
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '16px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(text, x + width / 2, y + height / 2 + 6);
    }
    
    drawCodeBackground() {
        this.ctx.globalAlpha = 0.1;
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '12px "Courier New", monospace';
        
        const codeLines = [
            'function debugLife() {',
            '  while (bugs.length > 0) {',
            '    fixBug(bugs.pop());',
            '    drinkCoffee();',
            '  }',
            '  return happiness++;',
            '}',
            'class Developer {',
            '  constructor() {',
            '    this.skills = [];',
            '    this.coffee = Infinity;',
            '  }',
            '}'
        ];
        
        for (let i = 0; i < 20; i++) {
            const x = Math.random() * this.gameWidth;
            const y = Math.random() * this.gameHeight;
            const line = codeLines[Math.floor(Math.random() * codeLines.length)];
            this.ctx.fillText(line, x, y);
        }
        
        this.ctx.globalAlpha = 1;
    }
    
    handleClick() {
        if (this.gameState === 'menu') {
            const stages = Object.keys(this.careerStages);
            const buttonWidth = 150;
            const buttonHeight = 40;
            const spacing = 20;
            const totalWidth = (buttonWidth * stages.length) + (spacing * (stages.length - 1));
            const startX = (this.gameWidth - totalWidth) / 2;
            
            // Check stage selection
            stages.forEach((stage, index) => {
                const x = startX + (buttonWidth + spacing) * index;
                const y = 370;
                
                if (this.mousePos.x >= x && this.mousePos.x <= x + buttonWidth &&
                    this.mousePos.y >= y && this.mousePos.y <= y + buttonHeight) {
                    this.currentStage = stage;
                    this.drawMenu();
                }
            });
            
            // Check start button
            if (this.mousePos.x >= this.gameWidth / 2 - 100 && this.mousePos.x <= this.gameWidth / 2 + 100 &&
                this.mousePos.y >= 480 && this.mousePos.y <= 530) {
                this.startGame();
            }
        } else if (this.gameState === 'gameOver' || this.gameState === 'victory') {
            this.showMenu();
        }
    }
    
    handleKeyPress(key) {
        if (key === 'Space' && this.gameState === 'playing') {
            this.useSkill();
        } else if (key === 'KeyP' && this.gameState === 'playing') {
            this.pauseGame();
        } else if (key === 'KeyR' && (this.gameState === 'gameOver' || this.gameState === 'victory')) {
            this.showMenu();
        }
    }
    
    startGame() {
        this.gameState = 'playing';
        this.isGameRunning = true;
        this.score = 0;
        this.level = 1;
        this.lives = 3;
        this.bugs = [];
        this.powerUps = [];
        this.particles = [];
        this.codeBlocks = [];
        this.spawnTimer = 0;
        
        // Reset player
        this.createPlayer();
        this.player.color = this.careerStages[this.currentStage].color;
        
        // Set difficulty
        this.difficultyMultiplier = Object.keys(this.careerStages).indexOf(this.currentStage) + 1;
        
        // Show start message
        this.showMessage(this.getRandomMessage('gameStart'));
        
        // Start game loop
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
        this.updateBugs();
        this.updatePowerUps();
        this.updateParticles();
        this.updateCodeBlocks();
        this.spawnEnemies();
        this.checkCollisions();
        this.checkLevelProgress();
        
        // Update timers
        if (this.player.invulnerabilityTimer > 0) {
            this.player.invulnerabilityTimer--;
            this.player.invulnerable = this.player.invulnerabilityTimer > 0;
        }
    }
    
    updatePlayer() {
        // Move towards mouse position
        const dx = this.mousePos.x - this.player.x;
        const dy = this.mousePos.y - this.player.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 5) {
            this.player.x += (dx / distance) * this.player.speed;
            this.player.y += (dy / distance) * this.player.speed;
        }
        
        // Keep player in bounds
        this.player.x = Math.max(this.player.width / 2, 
                                Math.min(this.gameWidth - this.player.width / 2, this.player.x));
        this.player.y = Math.max(this.player.height / 2, 
                                Math.min(this.gameHeight - this.player.height / 2, this.player.y));
    }
    
    spawnEnemies() {
        this.spawnTimer++;
        
        if (this.spawnTimer % Math.max(60 - this.level * 5, 20) === 0) {
            this.spawnBug();
        }
        
        if (this.spawnTimer % 300 === 0) {
            this.spawnPowerUp();
        }
        
        if (this.spawnTimer % 180 === 0) {
            this.spawnCodeBlock();
        }
    }
    
    spawnBug() {
        const stageInfo = this.careerStages[this.currentStage];
        const bugTypes = stageInfo.bugs;
        const bugType = bugTypes[Math.floor(Math.random() * bugTypes.length)];
        
        const bug = {
            x: Math.random() * this.gameWidth,
            y: -30,
            width: 30,
            height: 30,
            speed: 2 + this.level * 0.5 + this.difficultyMultiplier,
            type: bugType,
            color: '#FF5722',
            health: 1,
            bounty: 10 * this.difficultyMultiplier
        };
        
        this.bugs.push(bug);
    }
    
    spawnPowerUp() {
        const powerUpTypes = ['coffee', 'documentation', 'debugging', 'leadership'];
        const type = powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)];
        
        const powerUp = {
            x: Math.random() * this.gameWidth,
            y: -30,
            width: 25,
            height: 25,
            speed: 1,
            type: type,
            color: '#4CAF50',
            effect: this.getPowerUpEffect(type)
        };
        
        this.powerUps.push(powerUp);
    }
    
    spawnCodeBlock() {
        const codeBlock = {
            x: Math.random() * this.gameWidth,
            y: -40,
            width: 60,
            height: 20,
            speed: 1.5,
            code: this.getRandomCodeSnippet(),
            color: '#2196F3'
        };
        
        this.codeBlocks.push(codeBlock);
    }
    
    updateBugs() {
        for (let i = this.bugs.length - 1; i >= 0; i--) {
            const bug = this.bugs[i];
            bug.y += bug.speed;
            
            // Remove bugs that go off screen
            if (bug.y > this.gameHeight + 50) {
                this.bugs.splice(i, 1);
                continue;
            }
            
            // Add some movement variation
            bug.x += Math.sin(bug.y * 0.01) * 2;
        }
    }
    
    updatePowerUps() {
        for (let i = this.powerUps.length - 1; i >= 0; i--) {
            const powerUp = this.powerUps[i];
            powerUp.y += powerUp.speed;
            
            // Remove power-ups that go off screen
            if (powerUp.y > this.gameHeight + 50) {
                this.powerUps.splice(i, 1);
                continue;
            }
            
            // Add floating effect
            powerUp.x += Math.sin(powerUp.y * 0.02) * 1;
        }
    }
    
    updateCodeBlocks() {
        for (let i = this.codeBlocks.length - 1; i >= 0; i--) {
            const block = this.codeBlocks[i];
            block.y += block.speed;
            
            if (block.y > this.gameHeight + 50) {
                this.codeBlocks.splice(i, 1);
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
            
            if (particle.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }
    
    checkCollisions() {
        // Check bug collisions
        for (let i = this.bugs.length - 1; i >= 0; i--) {
            const bug = this.bugs[i];
            if (this.isColliding(this.player, bug) && !this.player.invulnerable) {
                this.takeDamage(20);
                this.createExplosion(bug.x, bug.y, '#FF5722');
                this.bugs.splice(i, 1);
                continue;
            }
        }
        
        // Check power-up collisions
        for (let i = this.powerUps.length - 1; i >= 0; i--) {
            const powerUp = this.powerUps[i];
            if (this.isColliding(this.player, powerUp)) {
                this.collectPowerUp(powerUp);
                this.createExplosion(powerUp.x, powerUp.y, '#4CAF50');
                this.powerUps.splice(i, 1);
                continue;
            }
        }
        
        // Check code block collisions
        for (let i = this.codeBlocks.length - 1; i >= 0; i--) {
            const block = this.codeBlocks[i];
            if (this.isColliding(this.player, block)) {
                this.score += 50;
                this.createExplosion(block.x, block.y, '#2196F3');
                this.codeBlocks.splice(i, 1);
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
        this.player.invulnerabilityTimer = 60; // 1 second at 60fps
        
        if (this.player.health <= 0) {
            this.lives--;
            if (this.lives > 0) {
                this.player.health = this.player.maxHealth;
                this.showMessage('Life lost! Debugging continues...');
            } else {
                this.gameOver();
            }
        }
    }
    
    collectPowerUp(powerUp) {
        powerUp.effect();
        this.score += 25;
        this.showMessage(this.getRandomMessage('powerUp'));
    }
    
    getPowerUpEffect(type) {
        switch (type) {
            case 'coffee':
                return () => {
                    this.player.speed += 1;
                    setTimeout(() => this.player.speed -= 1, 5000);
                };
            case 'documentation':
                return () => {
                    this.score += 100;
                };
            case 'debugging':
                return () => {
                    this.bugs.forEach(bug => {
                        this.createExplosion(bug.x, bug.y, '#FF5722');
                        this.score += bug.bounty;
                    });
                    this.bugs = [];
                };
            case 'leadership':
                return () => {
                    this.player.health = this.player.maxHealth;
                };
            default:
                return () => {};
        }
    }
    
    useSkill() {
        // Create a skill blast that destroys nearby bugs
        const blastRadius = 100;
        const destroyedBugs = [];
        
        this.bugs.forEach((bug, index) => {
            const dx = bug.x - this.player.x;
            const dy = bug.y - this.player.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance <= blastRadius) {
                destroyedBugs.push(index);
                this.score += bug.bounty;
                this.createExplosion(bug.x, bug.y, '#FFD700');
            }
        });
        
        // Remove destroyed bugs (in reverse order to maintain indices)
        for (let i = destroyedBugs.length - 1; i >= 0; i--) {
            this.bugs.splice(destroyedBugs[i], 1);
        }
        
        if (destroyedBugs.length > 0) {
            this.showMessage(this.getRandomMessage('bugCaught'));
        }
        
        // Create visual effect
        this.createSkillEffect();
    }
    
    createExplosion(x, y, color) {
        for (let i = 0; i < 8; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 10,
                vy: (Math.random() - 0.5) * 10,
                color: color,
                life: 30,
                maxLife: 30,
                alpha: 1,
                size: Math.random() * 5 + 2
            });
        }
    }
    
    createSkillEffect() {
        for (let i = 0; i < 16; i++) {
            const angle = (Math.PI * 2 * i) / 16;
            this.particles.push({
                x: this.player.x,
                y: this.player.y,
                vx: Math.cos(angle) * 8,
                vy: Math.sin(angle) * 8,
                color: '#FFD700',
                life: 20,
                maxLife: 20,
                alpha: 1,
                size: 3
            });
        }
    }
    
    checkLevelProgress() {
        const scoreThreshold = this.level * 500;
        if (this.score >= scoreThreshold) {
            this.level++;
            this.showMessage(this.getRandomMessage('levelUp'));
            
            // Increase player stats
            this.player.maxHealth += 20;
            this.player.health = this.player.maxHealth;
            this.player.speed += 0.5;
            
            // Check for victory condition
            if (this.level >= 10) {
                this.victory();
            }
        }
    }
    
    gameOver() {
        this.gameState = 'gameOver';
        this.isGameRunning = false;
        
        // Save high score
        const highScore = localStorage.getItem('epicGameHighScore') || 0;
        if (this.score > highScore) {
            localStorage.setItem('epicGameHighScore', this.score);
        }
    }
    
    victory() {
        this.gameState = 'victory';
        this.isGameRunning = false;
        
        // Save high score
        const highScore = localStorage.getItem('epicGameHighScore') || 0;
        if (this.score > highScore) {
            localStorage.setItem('epicGameHighScore', this.score);
        }
    }
    
    draw() {
        // Clear canvas
        this.ctx.fillStyle = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        this.ctx.fillRect(0, 0, this.gameWidth, this.gameHeight);
        
        if (this.gameState === 'playing') {
            this.drawGame();
        } else if (this.gameState === 'gameOver') {
            this.drawGameOver();
        } else if (this.gameState === 'victory') {
            this.drawVictory();
        }
    }
    
    drawGame() {
        // Draw background elements
        this.drawCodeBackground();
        
        // Draw game objects
        this.drawCodeBlocks();
        this.drawPowerUps();
        this.drawBugs();
        this.drawPlayer();
        this.drawParticles();
        
        // Draw UI
        this.drawUI();
    }
    
    drawPlayer() {
        this.ctx.save();
        
        if (this.player.invulnerable) {
            this.ctx.globalAlpha = 0.5 + 0.5 * Math.sin(Date.now() * 0.02);
        }
        
        // Player body
        this.ctx.fillStyle = this.player.color;
        this.ctx.fillRect(this.player.x - this.player.width / 2, 
                         this.player.y - this.player.height / 2,
                         this.player.width, this.player.height);
        
        // Player face (simple emoji-style)
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '20px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('🧑‍💻', this.player.x, this.player.y + 5);
        
        this.ctx.restore();
    }
    
    drawBugs() {
        this.bugs.forEach(bug => {
            this.ctx.fillStyle = bug.color;
            this.ctx.fillRect(bug.x - bug.width / 2, bug.y - bug.height / 2, 
                             bug.width, bug.height);
            
            // Bug emoji
            this.ctx.fillStyle = '#ffffff';
            this.ctx.font = '16px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('🐛', bug.x, bug.y + 4);
            
            // Bug type label
            this.ctx.font = '8px Arial';
            this.ctx.fillStyle = '#ffffff';
            this.ctx.fillText(bug.type.substring(0, 8), bug.x, bug.y + 20);
        });
    }
    
    drawPowerUps() {
        this.powerUps.forEach(powerUp => {
            this.ctx.fillStyle = powerUp.color;
            this.ctx.fillRect(powerUp.x - powerUp.width / 2, powerUp.y - powerUp.height / 2,
                             powerUp.width, powerUp.height);
            
            // Power-up emoji
            const emoji = this.getPowerUpEmoji(powerUp.type);
            this.ctx.fillStyle = '#ffffff';
            this.ctx.font = '16px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(emoji, powerUp.x, powerUp.y + 4);
        });
    }
    
    drawCodeBlocks() {
        this.codeBlocks.forEach(block => {
            this.ctx.fillStyle = block.color;
            this.ctx.fillRect(block.x - block.width / 2, block.y - block.height / 2,
                             block.width, block.height);
            
            this.ctx.fillStyle = '#ffffff';
            this.ctx.font = '10px "Courier New", monospace';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(block.code, block.x, block.y + 3);
        });
    }
    
    drawParticles() {
        this.particles.forEach(particle => {
            this.ctx.save();
            this.ctx.globalAlpha = particle.alpha;
            this.ctx.fillStyle = particle.color;
            this.ctx.fillRect(particle.x - particle.size / 2, particle.y - particle.size / 2,
                             particle.size, particle.size);
            this.ctx.restore();
        });
    }
    
    drawUI() {
        const isJapanese = window.portfolioApp && window.portfolioApp.currentLanguage === 'ja';
        
        // Health bar
        this.ctx.fillStyle = '#333333';
        this.ctx.fillRect(10, 10, 200, 20);
        this.ctx.fillStyle = '#4CAF50';
        this.ctx.fillRect(10, 10, (this.player.health / this.player.maxHealth) * 200, 20);
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.strokeRect(10, 10, 200, 20);
        
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '12px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`${isJapanese ? 'HP' : 'Health'}: ${this.player.health}/${this.player.maxHealth}`, 15, 25);
        
        // Score and level
        this.ctx.fillText(`${isJapanese ? 'スコア' : 'Score'}: ${this.score}`, 10, 50);
        this.ctx.fillText(`${isJapanese ? 'レベル' : 'Level'}: ${this.level}`, 10, 70);
        this.ctx.fillText(`${isJapanese ? 'ライフ' : 'Lives'}: ${this.lives}`, 10, 90);
        
        // Current stage
        const stageInfo = this.careerStages[this.currentStage];
        this.ctx.fillText(`${isJapanese ? 'ステージ' : 'Stage'}: ${stageInfo.name[isJapanese ? 'ja' : 'en']}`, 10, 110);
        
        // Instructions
        this.ctx.font = '10px Arial';
        this.ctx.fillStyle = '#cccccc';
        this.ctx.fillText(isJapanese ? 'スペース: スキル使用' : 'Space: Use Skill', this.gameWidth - 150, 20);
        this.ctx.fillText(isJapanese ? 'P: 一時停止' : 'P: Pause', this.gameWidth - 150, 35);
    }
    
    drawGameOver() {
        const isJapanese = window.portfolioApp && window.portfolioApp.currentLanguage === 'ja';
        
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillRect(0, 0, this.gameWidth, this.gameHeight);
        
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = 'bold 48px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(isJapanese ? 'ゲームオーバー' : 'Game Over', this.gameWidth / 2, 200);
        
        this.ctx.font = '24px Arial';
        this.ctx.fillText(`${isJapanese ? '最終スコア' : 'Final Score'}: ${this.score}`, this.gameWidth / 2, 250);
        this.ctx.fillText(`${isJapanese ? 'レベル' : 'Level'}: ${this.level}`, this.gameWidth / 2, 280);
        
        this.ctx.font = '18px Arial';
        this.ctx.fillText(this.getRandomMessage('gameOver'), this.gameWidth / 2, 320);
        
        this.ctx.font = '16px Arial';
        this.ctx.fillText(isJapanese ? 'クリックで再開' : 'Click to restart', this.gameWidth / 2, 400);
    }
    
    drawVictory() {
        const isJapanese = window.portfolioApp && window.portfolioApp.currentLanguage === 'ja';
        
        this.ctx.fillStyle = 'rgba(255, 215, 0, 0.9)';
        this.ctx.fillRect(0, 0, this.gameWidth, this.gameHeight);
        
        this.ctx.fillStyle = '#333333';
        this.ctx.font = 'bold 48px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(isJapanese ? '勝利！' : 'Victory!', this.gameWidth / 2, 200);
        
        this.ctx.font = '24px Arial';
        this.ctx.fillText(`${isJapanese ? '最終スコア' : 'Final Score'}: ${this.score}`, this.gameWidth / 2, 250);
        
        this.ctx.font = '18px Arial';
        this.ctx.fillText(this.getRandomMessage('victory'), this.gameWidth / 2, 320);
        
        this.ctx.font = '16px Arial';
        this.ctx.fillText(isJapanese ? 'クリックで再開' : 'Click to restart', this.gameWidth / 2, 400);
    }
    
    getPowerUpEmoji(type) {
        const emojis = {
            coffee: '☕',
            documentation: '📚',
            debugging: '🔧',
            leadership: '👑'
        };
        return emojis[type] || '💎';
    }
    
    getRandomCodeSnippet() {
        const snippets = ['if()', 'for()', '{...}', 'func', 'var', 'const', 'class', 'return'];
        return snippets[Math.floor(Math.random() * snippets.length)];
    }
    
    getRandomMessage(type) {
        const isJapanese = window.portfolioApp && window.portfolioApp.currentLanguage === 'ja';
        const messages = this.messages[isJapanese ? 'ja' : 'en'][type];
        return messages[Math.floor(Math.random() * messages.length)];
    }
    
    showMessage(text) {
        // Update game message element if it exists
        const gameMessage = document.getElementById('game-message');
        if (gameMessage) {
            gameMessage.textContent = text;
            gameMessage.style.opacity = '1';
            setTimeout(() => {
                gameMessage.style.opacity = '0';
            }, 3000);
        }
    }
    
    start() {
        this.showMenu();
    }
    
    pauseGame() {
        this.gameState = this.gameState === 'playing' ? 'paused' : 'playing';
        if (this.gameState === 'playing') {
            this.gameLoop();
        }
    }
}

// Initialize the epic game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('game-canvas')) {
        window.epicGame = new EpicGame();
    }
});

// Export for global access
window.EpicGame = EpicGame;