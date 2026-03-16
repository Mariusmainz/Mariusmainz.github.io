# Circuit Trace Rewrite — Scroll-Driven Dot Spirit
**Date:** 2026-03-16
**Status:** Approved

## Goal
Replace the static SVG circuit trace with a living canvas-based dot cloud that travels down the page along a loose curved path, driven entirely by scroll. The cloud feels like a spirit — organic, pulsing, active in the gaps between sections, retreating during content zones.

---

## 1. Architecture

- **Replace** `components/CircuitTrace.tsx` entirely — same filename, same usage in `app/page.tsx`
- Single `<canvas>` element: `fixed`, full viewport, `z-0`, `pointer-events-none`
- Visible only on `xl` screens (`hidden xl:block`) — same as current
- Plain `useEffect` + `requestAnimationFrame` + scroll listener — no new libraries
- Dots exist in **page coordinates** (`dotY` = absolute page position). Rendered at `dotY - scrollY` to appear to travel with the page
- `ResizeObserver` on `document.body` to detect page height changes (accordion expand/collapse in Experience section) → recompute waypoints + path on change

---

## 2. Path

- **8 waypoints** — one at the top, one between each pair of sections, one at the bottom
- Waypoints measured from actual section `getBoundingClientRect()` positions at runtime
- **Between-section zones**: waypoint x = 50% viewport width (cloud blooms center-screen)
- **Inside section zones**: waypoint x alternates 15% / 85% (cloud retreats to edges)
- Path smoothed with **Catmull-Rom interpolation** — no sharp corners, organic curve
- Cloud center position = `scrollY / maxScrollY` mapped to `t ∈ [0, 1]` along the path
- On page height change: re-measure sections, recompute waypoints, snap cloud to new correct position

---

## 3. Dot Appearance & Config

Config object at top of file (easy to tune):

```ts
const CONFIG = {
  dotCount:    100,   // number of dots
  opacity:     0.7,   // max opacity of center dots (0–1)
  cloudRadius: 120,   // px — spread of cloud at rest
  glowSize:    3,     // multiplier on dot radius for glow extent
}
```

Per dot (randomized on init, fixed after):
- **Radius**: 1.5–2.5px
- **Offset from cloud center**: random within `cloudRadius`, with slight oscillation driven by `scrollY`
- **Color**: `rgba(56, 189, 248, α)` — sky-400 / accent cyan
- **Glow**: radial gradient, center → transparent, radius = `dotRadius * glowSize`
- **Opacity**: distance-based — center dots at `CONFIG.opacity`, edge dots near 0. Creates natural density gradient.

---

## 4. Scroll Behaviour

Each `requestAnimationFrame`:
1. `velocity = currentScrollY - previousScrollY` — smoothed with lerp (factor 0.15)
2. `progress = scrollY / maxScrollY` — maps to Catmull-Rom path position
3. Cloud center moves to path position at `progress`
4. **velocity = 0**: all movement freezes exactly — no idle drift, no settling, no time-based animation
5. **velocity > 0**: dots stretch slightly in scroll direction (`yOffset += velocity * stretchFactor`)

**Zone detection** — each frame, check if cloud center is in a "between-section" zone or "inside-section" zone:

| Zone | Cloud radius | Opacity multiplier | Pulse |
|------|--------------|--------------------|-------|
| Between sections | `cloudRadius * 1.6` | `1.0` | Yes — radial oscillation driven by `scrollY` |
| Inside section | `cloudRadius * 0.5` | `0.25` | No |

Zone transitions are lerped (factor 0.08) so the cloud smoothly contracts/expands as it enters/exits content.

**Pulse**: In between-section zones, each dot's distance from center oscillates as:
```
offset *= 1 + 0.2 * sin(scrollY * 0.01 + dotPhase)
```
`dotPhase` is a random per-dot constant. Since `scrollY` drives the sin, pulse only occurs when scrolling.

---

## 5. Files Changed

| File | Change |
|------|--------|
| `components/CircuitTrace.tsx` | Full rewrite — canvas-based dot cloud |

No other files change. `app/page.tsx` already uses `<CircuitTrace />` with no props.

---

## Out of Scope
- Mobile / tablet (component stays hidden below xl)
- Dark/light mode (cloud is always cyan)
- User interaction (hover, click)
- Connecting lines between dots
