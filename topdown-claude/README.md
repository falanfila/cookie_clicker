# Top-down Shooter game

A top-down survival game inspired by Brotato. Survive waves of enemies, auto-fire at the nearest target, and pick upgrades between rounds.

## Controls

| Key | Action |
|-----|--------|
| `W` / `↑` | Move up |
| `S` / `↓` | Move down |
| `A` / `←` | Move left |
| `D` / `→` | Move right |

Shooting is **automatic** — your character always targets the nearest enemy.

## Upgrades

| Icon | Name | Effect |
|------|------|--------|
| ⚔️ | Damage + | Bullet damage increases |
| 👟 | Speed + | Movement speed increases |
| 🔥 | Fire Rate + | Shoot faster |
| ❤️ | Max HP + | Max health increases and heals |
| 🎯 | Range + | Bullets travel farther |
| 💥 | Multi-Shot | Fire in extra directions |

## Enemy Types

| Color | Type | Description |
|-------|------|-------------|
| 🟠 Orange | Basic | Standard enemy |
| 🟢 Green | Fast | Small and quick |
| 🔴 Red | Tank | Slow but high HP (appears from wave 4) |

## Deploy to Vercel

### Option 1 — Vercel CLI
```bash
npm i -g vercel
vercel
```

### Option 2 — GitHub + Vercel Dashboard
1. Push this folder to a GitHub repo
2. Go to [vercel.com](https://vercel.com) → **New Project**
3. Import your repo
4. Framework Preset: **Other**
5. Click **Deploy** — done!

## File Structure

```
brotato-game/
├── index.html    # HTML structure & markup
├── style.css     # All styles
├── game.js       # Game logic (canvas, enemies, bullets, shop)
├── vercel.json   # Vercel config (caching, headers)
└── README.md
```
