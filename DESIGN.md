# 🫧 Liquid Glass Design System (WayaX Spec)

A premium, highly polished glassmorphic design system featuring **organic light reflections**, **chromatic displacements**, and **fluid micro-interactions**. This system is optimized for elevated digital products requiring visceral depth, tactile reassurance, and extreme visual caliber.

---

## 🎨 1. Typography & Hierarchy

### Font Families
- **Primary Display & Interface:** `Sora` (sans-serif) — Bold geometric structure with rounded terminals, optimizing visual rhythm for headers, metrics, and labels.
- **Secondary Body Text:** `Inter` (sans-serif) — Extreme high-legibility sans-serif optimized for deep reading, lists, tables, and system logs.

### Tailwind Theme Declaration
```css
@theme {
  --font-sans: "Sora", ui-sans-serif, system-ui, sans-serif;
  --font-secondary: "Inter", ui-sans-serif, system-ui, sans-serif;
}
```

---

## 🌌 2. Ambient Motion & Organic Backgrounds
A key differentiator of this system is the use of moving backdrop caustics, soft glows, and dotted grids to simulate a physical, fluid medium.

### CSS Keyframes definition
```css
/* Fluid background gradient shift */
@keyframes flowGradient {
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* Polar rotating gradients */
@keyframes spinGradient {
  from { transform: translate(-50%, -50%) rotate(0deg); }
  to   { transform: translate(-50%, -50%) rotate(360deg); }
}

/* Tactile scaling depth glow */
@keyframes softGlow {
  0%, 100% { transform: scale(0.99); opacity: 0.15; filter: blur(5px); }
  50%      { transform: scale(1.005); opacity: 0.35; filter: blur(7px); }
}

/* Organic shifting glass caustics */
@keyframes causticRayRight {
  0%   { transform: translateY(-3%) rotate(-14deg) scaleX(1); opacity: 0.22; }
  50%  { transform: translateY(3%) rotate(-9deg) scaleX(1.2); opacity: 0.42; }
  100% { transform: translateY(-3%) rotate(-14deg) scaleX(1); opacity: 0.22; }
}

@keyframes causticRayLeft {
  0%   { transform: translateY(4%) rotate(12deg) scaleX(1.15); opacity: 0.26; }
  50%  { transform: translateY(-3%) rotate(16deg) scaleX(0.85); opacity: 0.52; }
  100% { transform: translateY(4%) rotate(12deg) scaleX(1.15); opacity: 0.26; }
}

/* Dynamic refractive water ripples */
@keyframes waterRipple {
  0%   { background-position: 0% 0%; }
  50%  { background-position: 50% 100%; }
  100% { background-position: 0% 0%; }
}

/* Floating micro-interactions */
@keyframes floatElement {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50%      { transform: translateY(-8px) rotate(0.5deg); }
}

/* Breathable active outlines */
@keyframes outlineBreathing {
  0%, 100% { opacity: 0.35; filter: blur(2px); }
  50%      { opacity: 0.8; filter: blur(4px); }
}
```

### Utility Animation Classes
- `.animate-outline-breathing` — Slow breathing outline blur (4s)
- `.animate-gradient-flow` — Background flow (6s)
- `.animate-spin-gradient` — Slow rotate backdrop (15s)
- `.animate-soft-glow` — Soft visual pulse (4s)
- `.animate-caustic-right` — Right caustic refraction (10s)
- `.animate-caustic-left` — Left caustic refraction (13s)
- `.animate-ripple` — Complex underwater refractive backdrop movement (22s)
- `.animate-float` — Slow vertical hovering loop (7s)

---

## 🔮 3. Liquid Glass UI Suite
The core design constructs rely on real backdrop saturate and blur filters, paired with dual-layered light/shadow offset maps.

### A. The Glass Panel (`.liquid-glass-panel`)
Provides high separation of concerns by simulating an physical lens resting on top of content.

* **Dark Mode Spec:**
  ```css
  .liquid-glass-panel {
    background: rgba(255, 255, 255, 0.02);
    backdrop-filter: blur(28px) saturate(175%);
    -webkit-backdrop-filter: blur(28px) saturate(175%);
    border: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow: 
      inset 0 1.5px 1.5px 0 rgba(255, 255, 255, 0.15),
      inset 0 -1.5px 3px 0 rgba(0, 0, 0, 0.25),
      0 12px 40px 0 rgba(0, 0, 0, 0.45);
  }
  ```
* **Light Mode Override:**
  ```css
  .light .liquid-glass-panel {
    background: rgba(255, 255, 255, 0.45);
    backdrop-filter: blur(28px) saturate(180%);
    -webkit-backdrop-filter: blur(28px) saturate(180%);
    border: 1px solid rgba(0, 0, 0, 0.08);
    box-shadow: 
      inset 0 1.5px 1.5px 0 rgba(255, 255, 255, 0.55),
      inset 0 -1.5px 3px 0 rgba(0, 0, 0, 0.02),
      0 12px 40px 0 rgba(0, 0, 0, 0.08);
  }
  ```

---

### B. The Glass Button (`.liquid-glass-button`)
Interactive element responding smoothly with a subtle lift + custom dynamic outer glow on hover.

* **Dark Mode Spec:**
  ```css
  .liquid-glass-button {
    background: rgba(255, 255, 255, 0.035);
    backdrop-filter: blur(14px) saturate(150%);
    -webkit-backdrop-filter: blur(14px) saturate(150%);
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 
      inset 0 1px 0 0 rgba(255, 255, 255, 0.18), 
      0 4px 15px 0 rgba(0, 0, 0, 0.2);
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .liquid-glass-button:hover {
    background: rgba(255, 255, 255, 0.085);
    border-color: rgba(255, 255, 255, 0.24);
    box-shadow: 
      inset 0 1px 0 0 rgba(255, 255, 255, 0.35), 
      0 0 25px 0 rgba(255, 255, 255, 0.12);
    transform: translateY(-1.5px);
  }
  ```
* **Light Mode Override:**
  ```css
  .light .liquid-glass-button {
    background: rgba(0, 0, 0, 0.035);
    border: 1px solid rgba(0, 0, 0, 0.08);
    box-shadow: 
      inset 0 1px 0 0 rgba(255, 255, 255, 0.6), 
      0 4px 15px 0 rgba(0, 0, 0, 0.03);
    color: #1c1c1f;
  }
  .light .liquid-glass-button:hover {
    background: rgba(0, 0, 0, 0.075);
    border-color: rgba(0, 0, 0, 0.16);
    box-shadow: 
      inset 0 1px 0 0 rgba(255, 255, 255, 0.75), 
      0 0 25px 0 rgba(0, 0, 0, 0.04);
  }
  ```

---

### C. Glass Input Well (`.liquid-glass-input`)
Recessed visual structure capturing focus tightly using nested offset drop-shadow boundaries.

* **Dark Mode Spec:**
  ```css
  .liquid-glass-input {
    background: rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid rgba(255, 255, 255, 0.07);
    box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.35);
    transition: all 0.25s ease;
  }
  .liquid-glass-input:focus {
    border-color: rgba(255, 255, 255, 0.22);
    background: rgba(0, 0, 0, 0.3);
    box-shadow: 
      inset 0 2px 4px 0 rgba(0, 0, 0, 0.45), 
      0 0 18px 0 rgba(255, 255, 255, 0.06);
  }
  ```
* **Light Mode Override:**
  ```css
  .light .liquid-glass-input {
    background: rgba(255, 255, 255, 0.55);
    border: 1px solid rgba(0, 0, 0, 0.08);
    box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.03);
  }
  .light .liquid-glass-input:focus {
    border-color: rgba(99, 102, 241, 0.35);
    background: rgba(255, 255, 255, 0.75);
    box-shadow: 
      inset 0 2px 4px 0 rgba(0, 0, 0, 0.04), 
      0 0 18px 0 rgba(99, 102, 241, 0.05);
  }
  ```

---

### D. Dynamic Light Shimmer Overlay (`.liquid-shimmer`)
Generates an interactive, moving laser-sliced light sheet reflection sweeping diagonally across the component upon hover.

```css
.liquid-shimmer {
  position: relative;
  overflow: hidden;
}

.liquid-shimmer::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    35deg,
    transparent 45%,
    rgba(255, 255, 255, 0.06) 48%,
    rgba(255, 255, 255, 0.12) 50%,
    rgba(255, 255, 255, 0.06) 52%,
    transparent 55%
  );
  transform: rotate(-25deg);
  pointer-events: none;
  transition: transform 0.6s ease;
}

.liquid-shimmer:hover::before {
  transform: translate(15%, 15%) rotate(-25deg);
}
```

---

## 🎛️ 4. Advanced Artworks & Accents

### RGB Chromatic Abberation (`.text-chromatic` / `.border-chromatic`)
Adds sub-pixel high-tech alignment layers.

* **Text Chromatic Accent:**
  ```css
  .text-chromatic {
    text-shadow: 
      -0.8px -0.8px 0.5px rgba(0, 240, 255, 0.35), 
      0.8px 0.8px 0.5px rgba(255, 0, 128, 0.35);
  }
  ```
* **Border Chromatic Anchor:**
  ```css
  .border-chromatic {
    border-color: rgba(193, 114, 241, 0.2);
    box-shadow: 
      -1px -1px 2px rgba(6, 182, 212, 0.12),
      1px 1px 2px rgba(236, 72, 153, 0.12);
  }
  ```

---

### Geometric Grounding Grid (`.bg-dotted-grid` / `.bg-dotted-grid-light`)
Creates an invisible, mathematical sub-structure that grounds floating elements.

* **Dark Grid:**
  ```css
  .bg-dotted-grid {
    background-image: radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px);
    background-size: 12px 12px;
  }
  ```
* **Light Grid:**
  ```css
  .bg-dotted-grid-light {
    background-image: radial-gradient(rgba(0, 0, 0, 0.08) 1px, transparent 1px);
    background-size: 12px 12px;
  }
  ```

---

### E. Optimized Institutional Stock Table & Metric Grid Specs
Our tables prioritize intense, lightning-fast structural scannability, utilizing deep horizontal layouts, high contrast color coding, and responsive collapsible panels.

* **Contrast & Accents Rule:** 
  Make numbers and indicators extremely legible by pairing standard numerical sizes with specialized text styles:
  * Green Targets: `text-emerald-500 font-bold font-mono` with dynamic upward trend icons.
  * Stop Losses: `text-rose-400 font-semibold font-mono` for critical risk visualization tags.
  * Trigger Zones: `#428fdc` / `#6bb6f3` font-semibold monospace identifiers.
  * Calls / Actions: Glowing active-status indicator dots (pulse animations) styled dynamically within contrastive border badges.
* **Separation of Details:**
  Always segment supplementary detail structures (e.g. Technical metrics, Fundamental metrics, and Analyst investment theses) into clean collapsible multi-column layouts with subtle border lines instead of cluttering primary table rows.

---

## 🚀 5. How to Port/Apply to Your Projects

1. **Import Fonts:** Include `'Sora'` and `'Inter'` in your project's stylesheet or index file.
2. **Setup Custom Theme:** Ensure custom font aliases exist in your Tailwind Config/CSS variables.
3. **Copy Global CSS block:** Directly inject `.liquid-glass-panel`, `.liquid-glass-button`, `.liquid-glass-input`, and background keyframes into your central `.css` entry point.
4. **Utilize Motion Layout Transitions:** Combine these static patterns with the powerful animations found in libraries like `motion/react` (transition duration: 0.3s/0.4s with smooth cubic-bezier easing e.g., `[0.16, 1, 0.3, 1]` or standard spring configurations) to create a fully kinetic luxury interface.
