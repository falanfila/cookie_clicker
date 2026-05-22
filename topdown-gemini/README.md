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

| Icon | Name       | Effect                       |
|------|------------|------------------------------|
| 💥️  | Damage     | Increase your damage         |
| 👟   | Move Speed | Increase your movement speed |
| ❤️   | Max HP     | Increase your maximum HP     |

## File Structure

```
brotato-game/
├── index.html    # HTML structure & markup
├── style.css     # All styles
├── game.js       # Game logic (canvas, enemies, bullets, shop)
├── vercel.json   # Vercel config (caching, headers)
└── README.md
```
