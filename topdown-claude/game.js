// ── Constants ──────────────────────────────────────────────
const WAVE_DURATION = 1800; // frames (~30s at 60fps)

const UPGRADES = [
  { id: 'dmg',   icon: '⚔️', name: 'Damage +',    desc: 'Bullet damage increases' },
  { id: 'spd',   icon: '👟', name: 'Speed +',     desc: 'Movement speed increases' },
  { id: 'fire',  icon: '🔥', name: 'Fire Rate +', desc: 'Shoot faster' },
  { id: 'hp',    icon: '❤️', name: 'Max HP +',    desc: 'Max health increases and heals' },
  { id: 'range', icon: '🎯', name: 'Range +',     desc: 'Bullets travel farther' },
  { id: 'multi', icon: '💥', name: 'Multi-Shot',  desc: 'Fire in extra directions' },
];

// ── Canvas Setup ───────────────────────────────────────────
const canvas  = document.getElementById('gc');
const ctx     = canvas.getContext('2d');
const wrapper = canvas.parentElement;
let W, H;

function resizeCanvas() {
  W = wrapper.clientWidth;
  H = wrapper.clientHeight;
  canvas.width  = W;
  canvas.height = H;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// ── Game State ─────────────────────────────────────────────
let game = null;

// ── Shop ──────────────────────────────────────────────────
function pickUpgrades() {
  return [...UPGRADES].sort(() => Math.random() - 0.5).slice(0, 3);
}

function showShop(wave) {
  const el   = document.getElementById('shopOverlay');
  const opts = pickUpgrades();

  el.innerHTML = `
    <h2>WAVE ${wave} COMPLETE!</h2>
    <p>Choose 1 of 3 upgrades</p>
    <div class="shop-cards">
      ${opts.map(u => `
        <div class="shop-card" data-id="${u.id}">
          <div class="icon">${u.icon}</div>
          <div class="name">${u.name}</div>
          <div class="desc">${u.desc}</div>
        </div>`).join('')}
    </div>`;

  el.classList.remove('hidden');

  el.querySelectorAll('.shop-card').forEach(card => {
    card.addEventListener('click', () => applyUpgrade(card.dataset.id));
  });
}

function applyUpgrade(id) {
  if (!game) return;
  const p = game.player;
  if (id === 'dmg')   p.damage    += 5;
  if (id === 'spd')   p.speed     += 0.8;
  if (id === 'fire')  p.fireRate   = Math.max(5, p.fireRate - 4);
  if (id === 'hp')  { p.maxHp     += 30; p.hp = Math.min(p.maxHp, p.hp + 30); }
  if (id === 'range') p.bulletRange += 60;
  if (id === 'multi') p.multiShot  = Math.min(5, (p.multiShot || 1) + 1);

  document.getElementById('shopOverlay').classList.add('hidden');
  game.startWave(game.wave + 1);
}

// ── Particle ───────────────────────────────────────────────
class Particle {
  constructor(x, y, col) {
    this.x    = x;
    this.y    = y;
    this.col  = col || '#ff8844';
    this.vx   = (Math.random() - 0.5) * 4;
    this.vy   = (Math.random() - 0.5) * 4;
    this.life    = 20 + Math.random() * 15;
    this.maxLife = this.life;
  }

  update() {
    this.x  += this.vx;
    this.y  += this.vy;
    this.vx *= 0.92;
    this.vy *= 0.92;
    this.life--;
  }

  draw() {
    ctx.globalAlpha = this.life / this.maxLife;
    ctx.fillStyle   = this.col;
    ctx.beginPath();
    ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

// ── Game Class ─────────────────────────────────────────────
class Game {
  constructor() {
    this.player = {
      x: W / 2, y: H / 2,
      hp: 100, maxHp: 100,
      speed: 3, damage: 12,
      fireRate: 18, bulletRange: 200,
      multiShot: 1, fireCd: 0,
      xp: 0, xpNext: 30,
      level: 1, kills: 0,
    };

    this.bullets   = [];
    this.enemies   = [];
    this.particles = [];

    this.wave         = 1;
    this.waveTimer    = 0;
    this.spawnTimer   = 0;
    this.spawnRate    = 80;
    this.running      = false;
    this.gameOver     = false;
    this.raf          = null;
    this.keys         = {};

    this._onKeyDown = e => {
      this.keys[e.key] = true;
      if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key)) {
        e.preventDefault();
      }
    };
    this._onKeyUp = e => { this.keys[e.key] = false; };

    document.addEventListener('keydown', this._onKeyDown);
    document.addEventListener('keyup',   this._onKeyUp);
  }

  // ── Wave Management ──
  startWave(w) {
    this.wave       = w;
    this.waveTimer  = 0;
    this.running    = true;
    this.enemies    = [];
    this.bullets    = [];
    this.particles  = [];
    this.spawnRate  = Math.max(20, 80 - w * 7);

    document.getElementById('waveTxt').textContent = w;

    const ann = document.getElementById('waveAnn');
    ann.textContent = 'WAVE ' + w;
    ann.style.opacity = '1';
    setTimeout(() => { ann.style.opacity = '0'; }, 1600);

    if (this.raf) cancelAnimationFrame(this.raf);
    this.loop();
  }

  // ── Enemy Spawning ──
  spawnEnemy() {
    const side = Math.floor(Math.random() * 4);
    const m    = 30;
    let x, y;

    if      (side === 0) { x = Math.random() * W; y = -m; }
    else if (side === 1) { x = W + m; y = Math.random() * H; }
    else if (side === 2) { x = Math.random() * W; y = H + m; }
    else                 { x = -m; y = Math.random() * H; }

    const roll = Math.random();
    const type =
      this.wave >= 4 && roll < 0.12 ? 'tank' :
      this.wave >= 2 && roll < 0.20 ? 'fast' : 'basic';

    const hp =
      type === 'tank'  ? 40 + this.wave * 15 :
      type === 'fast'  ? 15 + this.wave * 3  :
                         20 + this.wave * 5;

    this.enemies.push({
      x, y, hp, maxHp: hp, type,
      spd:  type === 'fast'  ? 2.8 + this.wave * 0.15 :
            type === 'tank'  ? 0.9 + this.wave * 0.05 :
                               1.6 + this.wave * 0.10,
      size: type === 'tank' ? 18 : type === 'fast' ? 9 : 13,
      col:  type === 'tank' ? '#e84040' : type === 'fast' ? '#40e8a0' : '#e87020',
    });
  }

  // ── Auto-Shoot ──
  autoShoot() {
    const p = this.player;
    if (p.fireCd > 0) { p.fireCd--; return; }
    if (this.enemies.length === 0) return;

    let nearest = null, minD = Infinity;
    for (const e of this.enemies) {
      const d = Math.hypot(e.x - p.x, e.y - p.y);
      if (d < minD) { minD = d; nearest = e; }
    }
    if (!nearest) return;

    p.fireCd = p.fireRate;
    const shots = p.multiShot || 1;
    for (let i = 0; i < shots; i++) {
      const angle = Math.atan2(nearest.y - p.y, nearest.x - p.x)
                  + (i - (shots - 1) / 2) * 0.25;
      this.bullets.push({
        x: p.x, y: p.y,
        vx: Math.cos(angle) * 9,
        vy: Math.sin(angle) * 9,
        dmg: p.damage,
        dist: 0,
        maxDist: p.bulletRange,
      });
    }
  }

  // ── Update ──
  update() {
    const p   = this.player;
    const spd = p.speed;

    if (this.keys['ArrowLeft']  || this.keys['a']) p.x -= spd;
    if (this.keys['ArrowRight'] || this.keys['d']) p.x += spd;
    if (this.keys['ArrowUp']    || this.keys['w']) p.y -= spd;
    if (this.keys['ArrowDown']  || this.keys['s']) p.y += spd;

    p.x = Math.max(16, Math.min(W - 16, p.x));
    p.y = Math.max(16, Math.min(H - 16, p.y));

    this.autoShoot();

    // Wave & spawn timers
    this.waveTimer++;
    this.spawnTimer++;
    if (this.spawnTimer >= this.spawnRate) {
      this.spawnTimer = 0;
      this.spawnEnemy();
    }

    // Move bullets
    for (const b of this.bullets) {
      b.x += b.vx; b.y += b.vy;
      b.dist += Math.hypot(b.vx, b.vy);
    }
    this.bullets = this.bullets.filter(
      b => b.dist < b.maxDist && b.x > -20 && b.x < W + 20 && b.y > -20 && b.y < H + 20
    );

    // Move enemies & deal contact damage
    for (const e of this.enemies) {
      const dx = p.x - e.x, dy = p.y - e.y;
      const d  = Math.hypot(dx, dy);
      if (d > 0) { e.x += e.spd * dx / d; e.y += e.spd * dy / d; }
      if (d < 16 + e.size) p.hp -= 0.35;
    }

    // Bullet ↔ enemy collisions
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      const b = this.bullets[i];
      for (let j = this.enemies.length - 1; j >= 0; j--) {
        const e = this.enemies[j];
        if (Math.hypot(b.x - e.x, b.y - e.y) < e.size + 4) {
          e.hp -= b.dmg;
          for (let k = 0; k < 5; k++) this.particles.push(new Particle(e.x, e.y, e.col));
          this.bullets.splice(i, 1);
          if (e.hp <= 0) {
            p.xp += e.type === 'tank' ? 8 : e.type === 'fast' ? 3 : 5;
            p.kills++;
            for (let k = 0; k < 10; k++) this.particles.push(new Particle(e.x, e.y, e.col));
            this.enemies.splice(j, 1);
          }
          break;
        }
      }
    }

    // Level up
    while (p.xp >= p.xpNext) {
      p.xp     -= p.xpNext;
      p.level++;
      p.xpNext  = Math.floor(p.xpNext * 1.5);
    }

    // Particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      this.particles[i].update();
      if (this.particles[i].life <= 0) this.particles.splice(i, 1);
    }

    // End conditions
    if (p.hp <= 0) { p.hp = 0; this.gameOver = true; this.running = false; }
    if (this.waveTimer >= WAVE_DURATION) { this.running = false; showShop(this.wave); }

    this.updateHUD();
  }

  // ── HUD ──
  updateHUD() {
    const p = this.player;
    document.getElementById('healthFill').style.width = Math.max(0, (p.hp / p.maxHp) * 100) + '%';
    document.getElementById('hpTxt').textContent      = Math.ceil(p.hp);
    document.getElementById('xpFill').style.width     = (p.xp / p.xpNext * 100) + '%';
    document.getElementById('lvlTxt').textContent     = 'Lv' + p.level;
    document.getElementById('killTxt').textContent    = p.kills;
    document.getElementById('timerTxt').textContent   = Math.ceil((WAVE_DURATION - this.waveTimer) / 60);
  }

  // ── Draw ──
  drawArena() {
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = '#1e1e2e';
    ctx.lineWidth   = 1;
    const gs = 60;
    for (let x = 0; x < W; x += gs) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = 0; y < H; y += gs) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
  }

  draw() {
    this.drawArena();

    for (const pt of this.particles) pt.draw();

    // Enemies
    for (const e of this.enemies) {
      ctx.fillStyle = e.col;
      ctx.beginPath();
      ctx.arc(e.x, e.y, e.size, 0, Math.PI * 2);
      ctx.fill();

      // Health bar
      ctx.fillStyle = '#2a2a2a';
      ctx.fillRect(e.x - e.size, e.y - e.size - 8, e.size * 2, 4);
      ctx.fillStyle = '#e84040';
      ctx.fillRect(e.x - e.size, e.y - e.size - 8, e.size * 2 * (e.hp / e.maxHp), 4);

      if (e.type === 'tank') {
        ctx.strokeStyle = '#fff';
        ctx.lineWidth   = 1.5;
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.size, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    // Bullets
    for (const b of this.bullets) {
      ctx.fillStyle = '#ffe060';
      ctx.beginPath();
      ctx.arc(b.x, b.y, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    // Player
    const p = this.player;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.fillStyle = '#60aaff';
    ctx.beginPath(); ctx.arc(0, 0, 16, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(0, 0, 8, 0, Math.PI * 2); ctx.fill();

    // Directional arrow toward nearest enemy
    const nearest = this.enemies.reduce((n, e) => {
      const d = Math.hypot(e.x - p.x, e.y - p.y);
      return (!n || d < Math.hypot(n.x - p.x, n.y - p.y)) ? e : n;
    }, null);

    if (nearest) {
      const a = Math.atan2(nearest.y - p.y, nearest.x - p.x);
      ctx.fillStyle = '#60aaff';
      ctx.beginPath();
      ctx.moveTo(Math.cos(a) * 10,        Math.sin(a) * 10);
      ctx.lineTo(Math.cos(a + 0.5) * 6,   Math.sin(a + 0.5) * 6);
      ctx.lineTo(Math.cos(a - 0.5) * 6,   Math.sin(a - 0.5) * 6);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();

    // Game Over screen
    if (this.gameOver) {
      ctx.fillStyle = 'rgba(0,0,0,0.75)';
      ctx.fillRect(0, 0, W, H);
      ctx.textAlign  = 'center';
      ctx.fillStyle  = '#e84040';
      ctx.font       = `bold ${Math.round(W * 0.055)}px 'Courier New'`;
      ctx.fillText('GAME OVER', W / 2, H / 2 - 30);
      ctx.fillStyle  = '#aaa';
      ctx.font       = `${Math.round(W * 0.022)}px 'Courier New'`;
      ctx.fillText(`Wave ${this.wave}  •  ${p.kills} kills  •  Lv${p.level}`, W / 2, H / 2 + 10);
      ctx.fillStyle  = '#f0c040';
      ctx.font       = `bold ${Math.round(W * 0.020)}px 'Courier New'`;
      ctx.fillText('Refresh the page to play again', W / 2, H / 2 + 50);
    }
  }

  // ── Game Loop ──
  loop() {
    if (!this.running && !this.gameOver) return;
    this.update();
    this.draw();
    this.raf = requestAnimationFrame(() => this.loop());
  }

  destroy() {
    if (this.raf) cancelAnimationFrame(this.raf);
    document.removeEventListener('keydown', this._onKeyDown);
    document.removeEventListener('keyup',   this._onKeyUp);
  }
}

// ── Start Button ───────────────────────────────────────────
document.getElementById('startBtn').addEventListener('click', () => {
  document.getElementById('overlay').classList.add('hidden');
  document.getElementById('hud').classList.remove('hidden');
  if (game) game.destroy();
  game = new Game();
  game.startWave(1);
});
