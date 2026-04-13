const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

const startScreen = document.getElementById('start-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const finalScoreElement = document.getElementById('final-score');

let gameState = 'START'; // START, PLAYING, GAMEOVER
let score = 0;
let animationFrameId;

canvas.width = 800;
canvas.height = 400;

// Draw initial dark background before image loads
ctx.fillStyle = '#2c3e50';
ctx.fillRect(0, 0, canvas.width, canvas.height);

const bgImage = new Image();
// Pointing to the asset previously used in the React src/assets
bgImage.src = 'src/assets/bgsunset.png';

let player = {};
let keys = {};
let bullets = [];
let enemies = [];
let particles = [];
let currentScore = 0;
let frames = 0;
let lastFireTime = 0;
let bgOffX = 0;

const enemyTypes = ['👾', '🧟', '🐺', '🕷️', '🚁'];

function initGame() {
    player = {
        x: 50,
        y: 200,
        width: 40,
        height: 40,
        speed: 5,
        emoji: '🥷'
    };

    keys = {
        ArrowUp: false,
        ArrowDown: false,
        ArrowLeft: false,
        ArrowRight: false,
        Space: false
    };

    bullets = [];
    enemies = [];
    particles = [];
    currentScore = 0;
    frames = 0;
    lastFireTime = 0;
    bgOffX = 0;
}

function handleKeyDown(e) {
    if (gameState !== 'PLAYING') return;
    if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
        e.preventDefault();
    }
    if (e.code === 'ArrowUp') keys.ArrowUp = true;
    if (e.code === 'ArrowDown') keys.ArrowDown = true;
    if (e.code === 'ArrowLeft') keys.ArrowLeft = true;
    if (e.code === 'ArrowRight') keys.ArrowRight = true;
    if (e.code === 'Space') keys.Space = true;
}

function handleKeyUp(e) {
    if (gameState !== 'PLAYING') return;
    if (e.code === 'ArrowUp') keys.ArrowUp = false;
    if (e.code === 'ArrowDown') keys.ArrowDown = false;
    if (e.code === 'ArrowLeft') keys.ArrowLeft = false;
    if (e.code === 'ArrowRight') keys.ArrowRight = false;
    if (e.code === 'Space') keys.Space = false;
}

window.addEventListener('keydown', handleKeyDown, { passive: false });
window.addEventListener('keyup', handleKeyUp);

function startGame() {
    gameState = 'PLAYING';
    startScreen.style.display = 'none';
    gameOverScreen.style.display = 'none';
    canvas.style.display = 'block';
    
    initGame();
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    gameLoop();
}

function stopGame() {
    gameState = 'GAMEOVER';
    score = currentScore;
    cancelAnimationFrame(animationFrameId);
    
    canvas.style.display = 'none';
    gameOverScreen.style.display = 'flex';
    finalScoreElement.innerText = `PONTUAÇÃO: ${score}`;
}

startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', startGame);

function gameLoop() {
    if (gameState !== 'PLAYING') return;

    frames++;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 1. Update and draw background (Parallax)
    bgOffX -= 0.5; // slow scroll speed
    if (bgOffX <= -canvas.width) {
        bgOffX = 0;
    }
    
    if (bgImage.complete && bgImage.naturalHeight !== 0) {
        ctx.drawImage(bgImage, bgOffX, 0, canvas.width, canvas.height);
        ctx.drawImage(bgImage, bgOffX + canvas.width, 0, canvas.width, canvas.height);
    } else {
        ctx.fillStyle = '#2c3e50';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // 2. Player movement
    if (keys.ArrowUp && player.y > 20) player.y -= player.speed;
    if (keys.ArrowDown && player.y < canvas.height - player.height) player.y += player.speed;
    if (keys.ArrowLeft && player.x > 0) player.x -= player.speed;
    if (keys.ArrowRight && player.x < canvas.width / 2) player.x += player.speed; 

    // 3. Shooting
    if (keys.Space && frames - lastFireTime > 12) {
        bullets.push({
            x: player.x + player.width - 10,
            y: player.y + 20,
            width: 15,
            height: 6,
            speed: 12,
            color: '#f39c12'
        });
        lastFireTime = frames;
    }

    // 4. Enemy Spawning - increasing difficulty
    const spawnRate = Math.max(20, 90 - Math.floor(currentScore / 10));
    if (frames % spawnRate === 0) {
        enemies.push({
            x: canvas.width + 50,
            y: 40 + Math.random() * (canvas.height - 80),
            width: 40,
            height: 40,
            speed: 2 + Math.random() * 3 + (currentScore / 100),
            emoji: enemyTypes[Math.floor(Math.random() * enemyTypes.length)]
        });
    }

    // 5. Update & draw bullets
    for (let i = bullets.length - 1; i >= 0; i--) {
        const b = bullets[i];
        b.x += b.speed;
        
        ctx.fillStyle = b.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = b.color;
        ctx.beginPath();
        ctx.roundRect(b.x, b.y, b.width, b.height, 3);
        ctx.fill();
        ctx.shadowBlur = 0;

        if (b.x > canvas.width) {
            bullets.splice(i, 1);
        }
    }

    // 6. Update & draw enemies
    for (let i = enemies.length - 1; i >= 0; i--) {
        const e = enemies[i];
        e.x -= e.speed;

        ctx.font = '38px Arial';
        ctx.fillText(e.emoji, e.x, e.y + 35);

        // Check collision with player
        const hitBoxTolerance = 10;
        if (
            player.x < e.x + e.width - hitBoxTolerance &&
            player.x + player.width - hitBoxTolerance > e.x &&
            player.y < e.y + e.height - hitBoxTolerance &&
            player.y + player.height - hitBoxTolerance > e.y
        ) {
            stopGame();
            return; 
        }

        // Check collision with bullets
        for (let j = bullets.length - 1; j >= 0; j--) {
            const b = bullets[j];
            if (
                b.x < e.x + e.width &&
                b.x + b.width > e.x &&
                b.y < e.y + e.height &&
                b.y + b.height > e.y
            ) {
                // Visual particles explosion
                for (let p = 0; p < 8; p++) {
                    particles.push({
                        x: e.x + 20,
                        y: e.y + 20,
                        vx: (Math.random() - 0.5) * 12,
                        vy: (Math.random() - 0.5) * 12,
                        size: Math.random() * 4 + 2,
                        color: ['#e74c3c', '#f1c40f', '#e67e22'][Math.floor(Math.random() * 3)],
                        life: 1.0
                    });
                }
                enemies.splice(i, 1);
                bullets.splice(j, 1);
                currentScore += 10;
                break;
            }
        }

        // Remove if off screen
        if (enemies[i] && e.x + e.width < -50) {
            enemies.splice(i, 1);
        }
    }

    // 7. Particles Update
    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.04;
        
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;

        if (p.life <= 0) particles.splice(i, 1);
    }

    // 8. Draw Player
    ctx.font = '38px Arial';
    ctx.fillText(player.emoji, player.x, player.y + 35);

    // Score UI overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.beginPath();
    ctx.roundRect(15, 15, 180, 40, 8);
    ctx.fill();
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 22px Arial';
    ctx.fillText(`SCORE: ${currentScore}`, 30, 43);

    animationFrameId = requestAnimationFrame(gameLoop);
}
