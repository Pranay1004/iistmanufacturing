# 🏗️ Design Vision: IIST Manufacturing Technology — Immersive 3D Website

---

## The Core Problem with "AI 3D Websites"

They slap a generic spinning globe or floating particles on a dark background and call it "3D." That is decoration, not design. It has no connection to what the page is about. Nobody scrolls a turbine blade website and thinks "ah yes, floating hexagons."

What Apple does with the MacBook page is fundamentally different — the **product IS the 3D object**. The scroll IS the mechanism. Every pixel of motion communicates something about the product. The animation doesn't exist alongside the content; **it IS the content.**

Your department IS manufacturing. The objects you make, the processes you study, the machines you operate — those are your "products." That is what should move, explode, assemble, and reveal on scroll.

---

## Design Philosophy: "The Process IS the Page"

> Every section transition mirrors a real manufacturing process.
> The user doesn't just read about manufacturing — they **experience** it.

| Manufacturing Concept | Web Equivalent |
|---|---|
| **Exploded view** (CAD) | Components separate on scroll to reveal internal structure |
| **Layer-by-layer deposition** (Additive Mfg) | Content builds up progressively as you scroll |
| **Material removal** (Subtractive Mfg) | Background "cuts away" to reveal the next section |
| **Welding/Joining** | Two halves of a section slide and fuse together |
| **Composite layup** | Translucent layers stack with parallax depth |
| **Quality inspection** | A "scan line" reveals hidden data as it sweeps |
| **Heat treatment** | Color temperature shifts as you scroll through a section |
| **CNC toolpath** | Navigation cursor traces a precise geometric path |

---

## Color System: "Forged Metal"

> [!IMPORTANT]
> Not a generic dark theme. Not blue-and-orange tech-bro. This palette comes from the actual colors you see in a manufacturing lab — the blue glow of an arc weld, the amber of heated titanium, the graphite of machined surfaces, the cool green of metrology lasers.

### Primary Palette

| Role | Color | Hex | Source Metaphor |
|---|---:|---:|---|
| **Deep Void** | Near-black with blue undertone | `#0A0E17` | Vacuum chamber / deep space |
| **Machined Surface** | Cool gunmetal | `#1E2A35` | Freshly machined aerospace aluminum |
| **Titanium** | Warm silver | `#B8C4D0` | Aerospace-grade Ti-6Al-4V surface |
| **Arc Blue** | Electric blue | `#2E8CFF` | TIG welding arc, plasma |
| **Forge Amber** | Deep amber-orange | `#E8872B` | Hot-forged aerospace alloy at 800°C |
| **Laser Green** | Bright metrology green | `#00E676` | CMM probe / laser alignment beam |

### Secondary / Accent

| Role | Color | Hex | Usage |
|---|---|---|---|
| **ISRO Saffron** | Warm saffron | `#FF6D00` | CTA buttons, ISRO identity nod |
| **Ceramic White** | Off-white with warmth | `#F0EDE8` | Body text on dark backgrounds |
| **Stress Red** | FEM stress visualization | `#FF1744` | Alerts, high-stress data viz |
| **Cool Zone** | FEM low-stress blue | `#1565C0` | Complementary data viz |
| **Carbon Fiber** | Textured dark gray | `#14181E` | Card backgrounds, subtle panels |

### Gradients

```css
/* Hero gradient — the "vacuum chamber" */
--gradient-void: linear-gradient(165deg, #0A0E17 0%, #1E2A35 50%, #0D1B2A 100%);

/* Section transition — "heating" */
--gradient-forge: linear-gradient(180deg, #1E2A35 0%, #2A1A0A 40%, #E8872B 100%);

/* Accent glow — "arc weld" */
--gradient-arc: radial-gradient(ellipse at 30% 50%, rgba(46, 140, 255, 0.15) 0%, transparent 70%);

/* Metrology scan line */
--gradient-scan: linear-gradient(90deg, transparent 0%, #00E676 50%, transparent 100%);
```

### Surface Treatments (CSS)

```css
/* Carbon fiber weave texture — for card backgrounds */
.surface-carbon {
  background-image:
    linear-gradient(45deg, rgba(255,255,255,0.02) 25%, transparent 25%),
    linear-gradient(-45deg, rgba(255,255,255,0.02) 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, rgba(255,255,255,0.02) 75%),
    linear-gradient(-45deg, transparent 75%, rgba(255,255,255,0.02) 75%);
  background-size: 4px 4px;
}

/* Machined surface — subtle concentric rings */
.surface-machined {
  background-image: repeating-radial-gradient(
    circle at center,
    transparent 0px,
    transparent 2px,
    rgba(255,255,255,0.015) 2px,
    rgba(255,255,255,0.015) 3px
  );
}

/* Brushed metal */
.surface-brushed {
  background-image: linear-gradient(
    90deg,
    rgba(255,255,255,0) 0%,
    rgba(255,255,255,0.03) 20%,
    rgba(255,255,255,0) 40%,
    rgba(255,255,255,0.02) 60%,
    rgba(255,255,255,0) 80%,
    rgba(255,255,255,0.03) 100%
  );
}
```

---

## Typography

| Role | Font | Fallback | Why |
|---|---|---|---|
| **Display / Headlines** | **Space Grotesk** | system-ui | Geometric, engineered feel. Clean like a CAD dimension label. |
| **Body** | **Inter** | system-ui | Maximum legibility on dark backgrounds. Neutral, professional. |
| **Monospace / Data** | **JetBrains Mono** | monospace | For specs, dimensions, code-like data. Lab notebook aesthetic. |
| **Accent / Labels** | **Outfit** or space-grotesk at small weight | — | Uppercase tracking for section labels. |

> [!NOTE]
> The current site uses EB Garamond (serif) and Source Serif 4. Those are beautiful for an academic journal. But for a 3D manufacturing site, serif fonts work against you — they say "library," not "lab." The geometric sans-serif family (Space Grotesk + Inter) says "precision engineering."

---

## Technology Stack for Motion & 3D

### Core Libraries

| Library | Version | Purpose |
|---|---|---|
| **Three.js** | latest (r170+) | WebGL 3D rendering — exploded views, rotating models, environment lighting |
| **@react-three/fiber** | ^9 | React bindings for Three.js — integrates with Next.js component model |
| **@react-three/drei** | ^10 | Pre-built Three.js helpers — `OrbitControls`, `Environment`, `Float`, `useGLTF` |
| **GSAP** | ^3.12 | Timeline-based scroll animations, `ScrollTrigger` for scroll-linked 3D control |
| **Lenis** | ^1.1 | Smooth scroll normalization — required for GSAP ScrollTrigger accuracy |
| **CSS Scroll-driven Animations** | Native | Zero-JS parallax, entry/exit reveals, lightweight scroll effects |
| **View Transitions API** | Native | Cross-page morphing transitions (profile card → profile page) |

### Why This Combination

- **Three.js** handles the heavy 3D hero scenes (exploded turbine, additive build, etc.)
- **GSAP ScrollTrigger** drives the 3D scenes from scroll position (Apple-style scrub)
- **CSS scroll-driven animations** handle all the "lighter" effects (text reveals, parallax layers, section transitions) with zero JavaScript overhead
- **View Transitions API** makes page-to-page navigation feel like a single continuous experience

---

## Page-by-Page Cinematic Breakdown

### 🏠 Homepage: "The Forge"

**Hero Section — Full-viewport 3D scene**

The user lands in a dark void. A single aerospace bracket (or turbine blade) floats, barely visible. As they scroll:

1. **0–20% scroll**: The part rotates slowly, environment-lit with a subtle blue rim light. Title text fades in with a slow upward drift: *"Manufacturing Technology"*
2. **20–40%**: The part begins an **exploded view** — fasteners pull away, internal channels reveal, cross-section appears. Subtitle materializes: *"for aerospace systems, space missions, and national capability"*
3. **40–60%**: The exploded components reassemble via a different path (additive layering, bottom-up). Stats counter animates in: **3 Faculty · 28 Scholars · 10 PhD**
4. **60–80%**: Camera pulls back to reveal the full assembly. The background transitions from void-black to machined-surface gray. Faculty cards emerge from below with staggered entry animations.
5. **80–100%**: Smooth transition to the "Current Cohort" section. Student names appear with a "laser etching" text reveal (left-to-right wipe with a green glow leading edge).

**3D Asset needed**: A single aerospace bracket or turbine blade component (~50K polygons, `.glb` format).

---

### 👥 People Directory: "The Assembly Line"

**Transition in**: A conveyor-belt metaphor. Cards "arrive" from the right edge of the screen.

**Profile cards**: Dark glass panels (`backdrop-filter: blur(12px)`) with a subtle carbon-fiber texture underneath. On hover, the card lifts (`translateZ(20px)` with `perspective`) and a blue arc-weld glow appears at the edges.

**Profile preview modal**: Uses the **View Transitions API** — when you click a card, the portrait morphs smoothly from the card position to the modal position. The card's background expands to fill the modal.

**Cohort filter buttons**: Styled as CNC control panel buttons — dark recessed surfaces with illuminated text, active state glows blue.

---

### 🔬 Research: "The Build Chamber"

**Section metaphor**: Additive manufacturing — content builds layer by layer.

Each project card fades in from below with a slight Z-rotation, as if being deposited by a print head. A subtle horizontal "scan line" (green laser) sweeps across each card as it enters the viewport.

**Project filter tabs**: Styled as a machining control panel — segmented metal buttons with engraved labels.

**Collaboration section**: Two institutional logos/names slide in from opposite sides and "weld" together at the center with a brief bright flash.

---

### 🏭 Facilities: "The Shop Floor"

This is the crown jewel page for 3D.

**Each facility gets a dedicated scroll section** with:

1. A 3D model of the key equipment (CNC machine, 3D printer, welding station, CMM probe) that rotates/reveals on scroll
2. Capabilities appear as floating labels that attach to specific parts of the 3D model
3. The camera orbits around the equipment as the user scrolls

**Industrial visits section**: The ISRO centre names (CMSE, IISU, VSSC, LPSC) appear as large monospace text that "stamps" onto the page (impact animation with a slight screen shake and dust particles).

---

### 📚 About / Curriculum: "The Blueprint"

**Background**: A dark surface with a faint isometric grid pattern (like graph paper / engineering drawing).

**Semester blocks**: Appear as technical drawing "views" — front, side, top — that rotate into position. Each course code is styled like a dimension callout with leader lines.

**Vision / Mission / Objective**: Revealed with a "section cut" animation — a cutting plane sweeps through a block, revealing the text inside.

**Elective chips**: Scatter randomly then magnetically snap into a neat grid (physics simulation feel).

---

### 💼 Placements: "Quality Assured"

**Metaphor**: Quality inspection and certification.

**Batch readiness cards**: Styled like inspection certificates with a stamp of approval animation. When they enter viewport, a "CERTIFIED" stamp slams down with a satisfying thud effect (visual only — no sound unless opted in).

**Role interest tags**: Appear like measurement callout bubbles that point to different career paths on a schematic roadmap.

---

### 🔐 Login / Dashboard: "Control Room"

**Background**: Dark with a subtle radar-sweep animation (rotating scan line in the corner).

**Login form**: Styled like a machine control panel — recessed input fields with illuminated borders that pulse blue when focused.

**Dashboard**: After login, content reveals with a "system boot" sequence — elements appear in sequence with terminal-style text animation.

---

## How to Obtain 3D Assets, Videos, and Animations

> [!IMPORTANT]
> This is the most critical section. Real 3D assets are what separate this from every generic "3D website" you see online.

### Strategy 1: CAD-to-Web Pipeline (Best quality, your own parts)

Your department teaches CAD/CAM. You likely already have `.step`, `.iges`, or `.stl` files from coursework and projects. This is gold.

| Step | Tool | What |
|---|---|---|
| 1. Export from CAD | SolidWorks / Fusion 360 / FreeCAD | Export as `.step` or `.stl` |
| 2. Optimize & UV | **Blender** (free) | Import, decimate to <100K polys, apply PBR materials |
| 3. Bake textures | Blender | Bake normal maps, AO, roughness for realistic metal look |
| 4. Export for web | Blender glTF exporter | Export as `.glb` (binary glTF), optimized for web |
| 5. Compress | **gltf-transform** CLI | Compress with Draco/Meshopt, strip unused data |
| 6. Load in Three.js | `useGLTF` from drei | Load and render in React |

**Recommended assets to prepare from your own CAD work:**
- An aerospace bracket (simple, clean geometry, good for exploded view)
- A composite layup mold (shows layers, great for the additive metaphor)
- A welding fixture or joint cross-section
- A CMM probe or measuring instrument
- Any ISRO-related component you have drawings of (even simplified)

### Strategy 2: Scroll-scrubbed Video Sequences (Apple's technique)

This is literally what Apple uses. They render a 3D animation in Blender, export it as an image sequence (300-600 frames as `.webp`), and scrub through the frames based on scroll position.

| Step | Tool | What |
|---|---|---|
| 1. Animate in Blender | Blender | Create a 10-second turntable / exploded view animation |
| 2. Render image sequence | Blender | Render at 1920×1080, 30fps = 300 frames as `.webp` |
| 3. Preload on page | JavaScript | Load all frames into an `Image[]` array |
| 4. Scrub with scroll | GSAP ScrollTrigger | Map scroll progress (0→1) to frame index (0→299) |
| 5. Paint to `<canvas>` | Canvas 2D API | Draw current frame to a fixed-position canvas |

**Pros**: Pixel-perfect, works on all devices, no WebGL needed.
**Cons**: 300 frames × ~30KB each = ~9MB (mitigated with progressive loading).

### Strategy 3: Lottie / Rive for 2D Motion Graphics

For section transitions, icons, and UI micro-animations:

| Tool | Best For |
|---|---|
| **Rive** (rive.app) | Interactive state machines — hover effects, loading states, process diagrams |
| **Lottie** (lottiefiles.com) | After Effects animations exported as JSON — exploded diagrams, process flows |

**Examples to create:**
- A "manufacturing process flow" animation (raw material → machining → inspection → assembly)
- An "additive layer build" loop animation for the Research page
- A "welding arc" micro-animation for the joining/welding section

### Strategy 4: Motion Video Backgrounds (for hero sections)

Short (5-8 second) looping videos of real manufacturing processes. These are incredibly impactful.

| Source | Content | Format |
|---|---|---|
| **Film in your own labs** | CNC running, 3D printer building, welding arc, specimen testing | `.mp4` / `.webm`, 1080p, loop, muted |
| **Pexels / Pixabay** (free) | Generic manufacturing footage as fallback | `.mp4` loop |
| **Stock (Artgrid, Storyblocks)** | Aerospace-specific manufacturing, if needed | Licensed `.mp4` |

> [!TIP]
> Even a single 6-second clip of a 3D printer depositing layers or a CNC spindle cutting aluminum, filmed on a phone in your lab with good lighting, will outperform any stock footage. It's *your* lab. That authenticity is irreplaceable.

### Strategy 5: CSS-only 3D Effects (no assets needed)

For elements that don't need photorealistic 3D but still need depth:

```css
/* Perspective card hover — profile cards */
.card-3d {
  perspective: 1000px;
  transform-style: preserve-3d;
}
.card-3d:hover {
  transform: rotateY(5deg) rotateX(-3deg) translateZ(20px);
  box-shadow:
    -20px 20px 40px rgba(0, 0, 0, 0.4),
    inset 0 0 0 1px rgba(46, 140, 255, 0.2);
}

/* Layered parallax depth — composite metaphor */
.parallax-layer-1 { transform: translateZ(-200px) scale(1.2); }
.parallax-layer-2 { transform: translateZ(-100px) scale(1.1); }
.parallax-layer-3 { transform: translateZ(0px) scale(1); }
```

---

## Scroll-Driven Animation Architecture

### The Scroll Narrative (Full-page flow)

```
SCROLL POSITION    WHAT HAPPENS
─────────────────────────────────────────────────
0vh                Black void. Single floating 3D object.
                   Title: "Manufacturing Technology"

10vh               Object begins rotating. Subtitle fades in.

25vh               EXPLODED VIEW begins. Parts separate.
                   Stats counter starts.

50vh               Reassembly (additive style). Background
                   transitions from void to machined gray.

70vh               Faculty section slides up. Cards stagger in
                   with 3D perspective tilt.

100vh              Current cohort section. Names etch in
                   with laser-scan reveal.

150vh              Feature cards. Each enters with a different
                   manufacturing metaphor:
                   Card 1: Deposited (drops from above)
                   Card 2: Machined (slides in from side)
                   Card 3: Stamped (impact from above)

200vh              Footer. Dark. Minimal. "Forged at IIST."
```

### CSS Scroll-Driven Implementation (for lightweight effects)

```css
/* Entry reveal — elements fade and rise as they enter viewport */
@supports (animation-timeline: view()) {
  .scroll-reveal {
    animation: revealUp auto linear both;
    animation-timeline: view();
    animation-range: entry 10% cover 40%;
  }
}

@keyframes revealUp {
  from {
    opacity: 0;
    transform: translateY(60px) scale(0.95);
    filter: blur(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
    filter: blur(0);
  }
}

/* Parallax background layers */
@supports (animation-timeline: scroll()) {
  .parallax-bg {
    animation: parallaxShift auto linear both;
    animation-timeline: scroll();
  }
}

@keyframes parallaxShift {
  from { transform: translateY(0); }
  to { transform: translateY(-30%); }
}

/* Mandatory: respect user preferences */
@media (prefers-reduced-motion: reduce) {
  .scroll-reveal,
  .parallax-bg {
    animation: none !important;
    opacity: 1 !important;
    transform: none !important;
    filter: none !important;
  }
}
```

---

## Page Transitions (View Transitions API)

When navigating between pages (e.g., People → Profile), elements morph smoothly:

```css
/* In globals.css — enable cross-document view transitions */
@view-transition {
  navigation: auto;
}

/* Shared elements that morph across pages */
.person-portrait {
  view-transition-name: var(--person-id);
}

.page-title {
  view-transition-name: page-heading;
}

/* Transition animation customization */
::view-transition-old(page-heading) {
  animation: slideOutLeft 0.3s ease-in both;
}
::view-transition-new(page-heading) {
  animation: slideInRight 0.3s ease-out both;
}

@keyframes slideOutLeft {
  to { transform: translateX(-100px); opacity: 0; }
}
@keyframes slideInRight {
  from { transform: translateX(100px); opacity: 0; }
}
```

---

## File Structure (New Components)

```
src/
├── components/
│   ├── three/                    # 3D scene components
│   │   ├── HeroScene.tsx         # Main homepage 3D scene
│   │   ├── ExplodedView.tsx      # Scroll-driven exploded view
│   │   ├── FacilityModel.tsx     # Per-facility 3D equipment
│   │   └── CanvasProvider.tsx    # Shared R3F Canvas wrapper
│   ├── motion/                   # Animation components
│   │   ├── ScrollReveal.tsx      # Scroll-triggered reveal wrapper
│   │   ├── LaserEtchText.tsx     # Left-to-right text reveal
│   │   ├── ScanLine.tsx          # Green metrology scan effect
│   │   ├── StampEffect.tsx       # Impact stamp animation
│   │   └── ParallaxLayer.tsx     # Depth parallax wrapper
│   ├── ui/                       # Redesigned UI primitives
│   │   ├── GlassCard.tsx         # Dark glassmorphism card
│   │   ├── MetalButton.tsx       # CNC-panel-style button
│   │   ├── ControlPanel.tsx      # Filter bar (machine control style)
│   │   └── DataCallout.tsx       # Dimension/spec callout bubble
│   └── ...existing components
├── assets/
│   ├── models/                   # .glb files
│   ├── sequences/                # Image sequences for scrub
│   ├── videos/                   # Hero loop videos
│   └── lottie/                   # Lottie JSON animations
```

---

## Performance Guardrails

| Concern | Mitigation |
|---|---|
| 3D scene loading time | Lazy-load Three.js canvas. Show a CSS-only shimmer placeholder. Load `.glb` with `Suspense`. |
| Mobile GPU limits | Detect mobile → replace 3D scenes with scroll-scrubbed image sequences or static hero image with CSS parallax. |
| Image sequence size | Use `.webp` at 80% quality. Progressive load: first 30 frames immediately, rest on scroll intent. |
| GSAP bundle size | Tree-shake: import only `gsap` and `ScrollTrigger` (~28KB gzipped total). |
| Layout shifts | Reserve exact dimensions for 3D canvases and video containers. |
| Accessibility | `prefers-reduced-motion: reduce` disables all animations. All content remains readable without motion. |

---

## What to Do First (Actionable Next Steps)

1. **Approve this color system and philosophy** — confirm the "forged metal" dark theme direction
2. **Gather 3-5 CAD files** from your coursework (bracket, fixture, any aerospace part)
3. **Film 2-3 short clips** in your labs (CNC running, printer building, welding — phone is fine, steady hands, good light)
4. **I will build the foundation**: new `globals.css` with the full design system, `ScrollReveal` component, `GlassCard`, page transitions, and the homepage redesign as a proof of concept
5. **Then iterate**: add 3D scenes as assets become available, refine animations per-page

---

> *"The best interface is one where the medium and the message are the same thing."*
>
> Your medium is manufacturing. Your message is manufacturing. The website should **manufacture itself** as the user scrolls.
# 🏗️ Design Vision: IIST Manufacturing Technology — Immersive 3D Website

---

## The Core Problem with "AI 3D Websites"

They slap a generic spinning globe or floating particles on a dark background and call it "3D." That is decoration, not design. It has no connection to what the page is about. Nobody scrolls a turbine blade website and thinks "ah yes, floating hexagons."

What Apple does with the MacBook page is fundamentally different — the **product IS the 3D object**. The scroll IS the mechanism. Every pixel of motion communicates something about the product. The animation doesn't exist alongside the content; **it IS the content.**

Your department IS manufacturing. The objects you make, the processes you study, the machines you operate — those are your "products." That is what should move, explode, assemble, and reveal on scroll.

---

## Design Philosophy: "The Process IS the Page"

> Every section transition mirrors a real manufacturing process.
> The user doesn't just read about manufacturing — they **experience** it.

| Manufacturing Concept | Web Equivalent |
|---|---|
| **Exploded view** (CAD) | Components separate on scroll to reveal internal structure |
| **Layer-by-layer deposition** (Additive Mfg) | Content builds up progressively as you scroll |
| **Material removal** (Subtractive Mfg) | Background "cuts away" to reveal the next section |
| **Welding/Joining** | Two halves of a section slide and fuse together |
| **Composite layup** | Translucent layers stack with parallax depth |
| **Quality inspection** | A "scan line" reveals hidden data as it sweeps |
| **Heat treatment** | Color temperature shifts as you scroll through a section |
| **CNC toolpath** | Navigation cursor traces a precise geometric path |

---

## Color System: "Forged Metal"

> [!IMPORTANT]
> Not a generic dark theme. Not blue-and-orange tech-bro. This palette comes from the actual colors you see in a manufacturing lab — the blue glow of an arc weld, the amber of heated titanium, the graphite of machined surfaces, the cool green of metrology lasers.

### Primary Palette

| Role | Color | Hex | Source Metaphor |
|---|---|---|---|
| **Deep Void** | Near-black with blue undertone | `#0A0E17` | Vacuum chamber / deep space |
| **Machined Surface** | Cool gunmetal | `#1E2A35` | Freshly machined aerospace aluminum |
| **Titanium** | Warm silver | `#B8C4D0` | Aerospace-grade Ti-6Al-4V surface |
| **Arc Blue** | Electric blue | `#2E8CFF` | TIG welding arc, plasma |
| **Forge Amber** | Deep amber-orange | `#E8872B` | Hot-forged aerospace alloy at 800°C |
| **Laser Green** | Bright metrology green | `#00E676` | CMM probe / laser alignment beam |

### Secondary / Accent

| Role | Color | Hex | Usage |
|---|---|---|---|
| **ISRO Saffron** | Warm saffron | `#FF6D00` | CTA buttons, ISRO identity nod |
| **Ceramic White** | Off-white with warmth | `#F0EDE8` | Body text on dark backgrounds |
| **Stress Red** | FEM stress visualization | `#FF1744` | Alerts, high-stress data viz |
| **Cool Zone** | FEM low-stress blue | `#1565C0` | Complementary data viz |
| **Carbon Fiber** | Textured dark gray | `#14181E` | Card backgrounds, subtle panels |

### Gradients

```css
/* Hero gradient — the "vacuum chamber" */
--gradient-void: linear-gradient(165deg, #0A0E17 0%, #1E2A35 50%, #0D1B2A 100%);

/* Section transition — "heating" */
--gradient-forge: linear-gradient(180deg, #1E2A35 0%, #2A1A0A 40%, #E8872B 100%);

/* Accent glow — "arc weld" */
--gradient-arc: radial-gradient(ellipse at 30% 50%, rgba(46, 140, 255, 0.15) 0%, transparent 70%);

/* Metrology scan line */
--gradient-scan: linear-gradient(90deg, transparent 0%, #00E676 50%, transparent 100%);
```

### Surface Treatments (CSS)

```css
/* Carbon fiber weave texture — for card backgrounds */
.surface-carbon {
  background-image:
    linear-gradient(45deg, rgba(255,255,255,0.02) 25%, transparent 25%),
    linear-gradient(-45deg, rgba(255,255,255,0.02) 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, rgba(255,255,255,0.02) 75%),
    linear-gradient(-45deg, transparent 75%, rgba(255,255,255,0.02) 75%);
  background-size: 4px 4px;
}

/* Machined surface — subtle concentric rings */
.surface-machined {
  background-image: repeating-radial-gradient(
    circle at center,
    transparent 0px,
    transparent 2px,
    rgba(255,255,255,0.015) 2px,
    rgba(255,255,255,0.015) 3px
  );
}

/* Brushed metal */
.surface-brushed {
  background-image: linear-gradient(
    90deg,
    rgba(255,255,255,0) 0%,
    rgba(255,255,255,0.03) 20%,
    rgba(255,255,255,0) 40%,
    rgba(255,255,255,0.02) 60%,
    rgba(255,255,255,0) 80%,
    rgba(255,255,255,0.03) 100%
  );
}
```

---

## Typography

| Role | Font | Fallback | Why |
|---|---|---|---|
| **Display / Headlines** | **Space Grotesk** | system-ui | Geometric, engineered feel. Clean like a CAD dimension label. |
| **Body** | **Inter** | system-ui | Maximum legibility on dark backgrounds. Neutral, professional. |
| **Monospace / Data** | **JetBrains Mono** | monospace | For specs, dimensions, code-like data. Lab notebook aesthetic. |
| **Accent / Labels** | **Outfit** or space-grotesk at small weight | — | Uppercase tracking for section labels. |

> [!NOTE]
> The current site uses EB Garamond (serif) and Source Serif 4. Those are beautiful for an academic journal. But for a 3D manufacturing site, serif fonts work against you — they say "library," not "lab." The geometric sans-serif family (Space Grotesk + Inter) says "precision engineering."

---

## Technology Stack for Motion & 3D

### Core Libraries

| Library | Version | Purpose |
|---|---|---|
| **Three.js** | latest (r170+) | WebGL 3D rendering — exploded views, rotating models, environment lighting |
| **@react-three/fiber** | ^9 | React bindings for Three.js — integrates with Next.js component model |
| **@react-three/drei** | ^10 | Pre-built Three.js helpers — `OrbitControls`, `Environment`, `Float`, `useGLTF` |
| **GSAP** | ^3.12 | Timeline-based scroll animations, `ScrollTrigger` for scroll-linked 3D control |
| **Lenis** | ^1.1 | Smooth scroll normalization — required for GSAP ScrollTrigger accuracy |
| **CSS Scroll-driven Animations** | Native | Zero-JS parallax, entry/exit reveals, lightweight scroll effects |
| **View Transitions API** | Native | Cross-page morphing transitions (profile card → profile page) |

### Why This Combination

- **Three.js** handles the heavy 3D hero scenes (exploded turbine, additive build, etc.)
- **GSAP ScrollTrigger** drives the 3D scenes from scroll position (Apple-style scrub)
- **CSS scroll-driven animations** handle all the "lighter" effects (text reveals, parallax layers, section transitions) with zero JavaScript overhead
- **View Transitions API** makes page-to-page navigation feel like a single continuous experience

---

## Page-by-Page Cinematic Breakdown

### 🏠 Homepage: "The Forge"

**Hero Section — Full-viewport 3D scene**

The user lands in a dark void. A single aerospace bracket (or turbine blade) floats, barely visible. As they scroll:

1. **0–20% scroll**: The part rotates slowly, environment-lit with a subtle blue rim light. Title text fades in with a slow upward drift: *"Manufacturing Technology"*
2. **20–40%**: The part begins an **exploded view** — fasteners pull away, internal channels reveal, cross-section appears. Subtitle materializes: *"for aerospace systems, space missions, and national capability"*
3. **40–60%**: The exploded components reassemble via a different path (additive layering, bottom-up). Stats counter animates in: **3 Faculty · 28 Scholars · 10 PhD**
4. **60–80%**: Camera pulls back to reveal the full assembly. The background transitions from void-black to machined-surface gray. Faculty cards emerge from below with staggered entry animations.
5. **80–100%**: Smooth transition to the "Current Cohort" section. Student names appear with a "laser etching" text reveal (left-to-right wipe with a green glow leading edge).

**3D Asset needed**: A single aerospace bracket or turbine blade component (~50K polygons, `.glb` format).

---

### 👥 People Directory: "The Assembly Line"

**Transition in**: A conveyor-belt metaphor. Cards "arrive" from the right edge of the screen.

**Profile cards**: Dark glass panels (`backdrop-filter: blur(12px)`) with a subtle carbon-fiber texture underneath. On hover, the card lifts (`translateZ(20px)` with `perspective`) and a blue arc-weld glow appears at the edges.

**Profile preview modal**: Uses the **View Transitions API** — when you click a card, the portrait morphs smoothly from the card position to the modal position. The card's background expands to fill the modal.

**Cohort filter buttons**: Styled as CNC control panel buttons — dark recessed surfaces with illuminated text, active state glows blue.

---

### 🔬 Research: "The Build Chamber"

**Section metaphor**: Additive manufacturing — content builds layer by layer.

Each project card fades in from below with a slight Z-rotation, as if being deposited by a print head. A subtle horizontal "scan line" (green laser) sweeps across each card as it enters the viewport.

**Project filter tabs**: Styled as a machining control panel — segmented metal buttons with engraved labels.

**Collaboration section**: Two institutional logos/names slide in from opposite sides and "weld" together at the center with a brief bright flash.

---

### 🏭 Facilities: "The Shop Floor"

This is the crown jewel page for 3D.

**Each facility gets a dedicated scroll section** with:

1. A 3D model of the key equipment (CNC machine, 3D printer, welding station, CMM probe) that rotates/reveals on scroll
2. Capabilities appear as floating labels that attach to specific parts of the 3D model
3. The camera orbits around the equipment as the user scrolls

**Industrial visits section**: The ISRO centre names (CMSE, IISU, VSSC, LPSC) appear as large monospace text that "stamps" onto the page (impact animation with a slight screen shake and dust particles).

---

### 📚 About / Curriculum: "The Blueprint"

**Background**: A dark surface with a faint isometric grid pattern (like graph paper / engineering drawing).

**Semester blocks**: Appear as technical drawing "views" — front, side, top — that rotate into position. Each course code is styled like a dimension callout with leader lines.

**Vision / Mission / Objective**: Revealed with a "section cut" animation — a cutting plane sweeps through a block, revealing the text inside.

**Elective chips**: Scatter randomly then magnetically snap into a neat grid (physics simulation feel).

---

### 💼 Placements: "Quality Assured"

**Metaphor**: Quality inspection and certification.

**Batch readiness cards**: Styled like inspection certificates with a stamp of approval animation. When they enter viewport, a "CERTIFIED" stamp slams down with a satisfying thud effect (visual only — no sound unless opted in).

**Role interest tags**: Appear like measurement callout bubbles that point to different career paths on a schematic roadmap.

---

### 🔐 Login / Dashboard: "Control Room"

**Background**: Dark with a subtle radar-sweep animation (rotating scan line in the corner).

**Login form**: Styled like a machine control panel — recessed input fields with illuminated borders that pulse blue when focused.

**Dashboard**: After login, content reveals with a "system boot" sequence — elements appear in sequence with terminal-style text animation.

---

## How to Obtain 3D Assets, Videos, and Animations

> [!IMPORTANT]
> This is the most critical section. Real 3D assets are what separate this from every generic "3D website" you see online.

### Strategy 1: CAD-to-Web Pipeline (Best quality, your own parts)

Your department teaches CAD/CAM. You likely already have `.step`, `.iges`, or `.stl` files from coursework and projects. This is gold.

| Step | Tool | What |
|---|---|---|
| 1. Export from CAD | SolidWorks / Fusion 360 / FreeCAD | Export as `.step` or `.stl` |
| 2. Optimize & UV | **Blender** (free) | Import, decimate to <100K polys, apply PBR materials |
| 3. Bake textures | Blender | Bake normal maps, AO, roughness for realistic metal look |
| 4. Export for web | Blender glTF exporter | Export as `.glb` (binary glTF), optimized for web |
| 5. Compress | **gltf-transform** CLI | Compress with Draco/Meshopt, strip unused data |
| 6. Load in Three.js | `useGLTF` from drei | Load and render in React |

**Recommended assets to prepare from your own CAD work:**
- An aerospace bracket (simple, clean geometry, good for exploded view)
- A composite layup mold (shows layers, great for the additive metaphor)
- A welding fixture or joint cross-section
- A CMM probe or measuring instrument
- Any ISRO-related component you have drawings of (even simplified)

### Strategy 2: Scroll-scrubbed Video Sequences (Apple's technique)

This is literally what Apple uses. They render a 3D animation in Blender, export it as an image sequence (300-600 frames as `.webp`), and scrub through the frames based on scroll position.

| Step | Tool | What |
|---|---|---|
| 1. Animate in Blender | Blender | Create a 10-second turntable / exploded view animation |
| 2. Render image sequence | Blender | Render at 1920×1080, 30fps = 300 frames as `.webp` |
| 3. Preload on page | JavaScript | Load all frames into an `Image[]` array |
| 4. Scrub with scroll | GSAP ScrollTrigger | Map scroll progress (0→1) to frame index (0→299) |
| 5. Paint to `<canvas>` | Canvas 2D API | Draw current frame to a fixed-position canvas |

**Pros**: Pixel-perfect, works on all devices, no WebGL needed.
**Cons**: 300 frames × ~30KB each = ~9MB (mitigated with progressive loading).

### Strategy 3: Lottie / Rive for 2D Motion Graphics

For section transitions, icons, and UI micro-animations:

| Tool | Best For |
|---|---|
| **Rive** (rive.app) | Interactive state machines — hover effects, loading states, process diagrams |
| **Lottie** (lottiefiles.com) | After Effects animations exported as JSON — exploded diagrams, process flows |

**Examples to create:**
- A "manufacturing process flow" animation (raw material → machining → inspection → assembly)
- An "additive layer build" loop animation for the Research page
- A "welding arc" micro-animation for the joining/welding section

### Strategy 4: Motion Video Backgrounds (for hero sections)

Short (5-8 second) looping videos of real manufacturing processes. These are incredibly impactful.

| Source | Content | Format |
|---|---|---|
| **Film in your own labs** | CNC running, 3D printer building, welding arc, specimen testing | `.mp4` / `.webm`, 1080p, loop, muted |
| **Pexels / Pixabay** (free) | Generic manufacturing footage as fallback | `.mp4` loop |
| **Stock (Artgrid, Storyblocks)** | Aerospace-specific manufacturing, if needed | Licensed `.mp4` |

> [!TIP]
> Even a single 6-second clip of a 3D printer depositing layers or a CNC spindle cutting aluminum, filmed on a phone in your lab with good lighting, will outperform any stock footage. It's *your* lab. That authenticity is irreplaceable.

### Strategy 5: CSS-only 3D Effects (no assets needed)

For elements that don't need photorealistic 3D but still need depth:

```css
/* Perspective card hover — profile cards */
.card-3d {
  perspective: 1000px;
  transform-style: preserve-3d;
}
.card-3d:hover {
  transform: rotateY(5deg) rotateX(-3deg) translateZ(20px);
  box-shadow:
    -20px 20px 40px rgba(0, 0, 0, 0.4),
    inset 0 0 0 1px rgba(46, 140, 255, 0.2);
}

/* Layered parallax depth — composite metaphor */
.parallax-layer-1 { transform: translateZ(-200px) scale(1.2); }
.parallax-layer-2 { transform: translateZ(-100px) scale(1.1); }
.parallax-layer-3 { transform: translateZ(0px) scale(1); }
```

---

## Scroll-Driven Animation Architecture

### The Scroll Narrative (Full-page flow)

```
SCROLL POSITION    WHAT HAPPENS
─────────────────────────────────────────────────
0vh                Black void. Single floating 3D object.
                   Title: "Manufacturing Technology"

10vh               Object begins rotating. Subtitle fades in.

25vh               EXPLODED VIEW begins. Parts separate.
                   Stats counter starts.

50vh               Reassembly (additive style). Background
                   transitions from void to machined gray.

70vh               Faculty section slides up. Cards stagger in
                   with 3D perspective tilt.

100vh              Current cohort section. Names etch in
                   with laser-scan reveal.

150vh              Feature cards. Each enters with a different
                   manufacturing metaphor:
                   Card 1: Deposited (drops from above)
                   Card 2: Machined (slides in from side)
                   Card 3: Stamped (impact from above)

200vh              Footer. Dark. Minimal. "Forged at IIST."
```

### CSS Scroll-Driven Implementation (for lightweight effects)

```css
/* Entry reveal — elements fade and rise as they enter viewport */
@supports (animation-timeline: view()) {
  .scroll-reveal {
    animation: revealUp auto linear both;
    animation-timeline: view();
    animation-range: entry 10% cover 40%;
  }
}

@keyframes revealUp {
  from {
    opacity: 0;
    transform: translateY(60px) scale(0.95);
    filter: blur(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
    filter: blur(0);
  }
}

/* Parallax background layers */
@supports (animation-timeline: scroll()) {
  .parallax-bg {
    animation: parallaxShift auto linear both;
    animation-timeline: scroll();
  }
}

@keyframes parallaxShift {
  from { transform: translateY(0); }
  to { transform: translateY(-30%); }
}

/* Mandatory: respect user preferences */
@media (prefers-reduced-motion: reduce) {
  .scroll-reveal,
  .parallax-bg {
    animation: none !important;
    opacity: 1 !important;
    transform: none !important;
    filter: none !important;
  }
}
```

---

## Page Transitions (View Transitions API)

When navigating between pages (e.g., People → Profile), elements morph smoothly:

```css
/* In globals.css — enable cross-document view transitions */
@view-transition {
  navigation: auto;
}

/* Shared elements that morph across pages */
.person-portrait {
  view-transition-name: var(--person-id);
}

.page-title {
  view-transition-name: page-heading;
}

/* Transition animation customization */
::view-transition-old(page-heading) {
  animation: slideOutLeft 0.3s ease-in both;
}
::view-transition-new(page-heading) {
  animation: slideInRight 0.3s ease-out both;
}

@keyframes slideOutLeft {
  to { transform: translateX(-100px); opacity: 0; }
}
@keyframes slideInRight {
  from { transform: translateX(100px); opacity: 0; }
}
```

---

## File Structure (New Components)

```
src/
├── components/
│   ├── three/                    # 3D scene components
│   │   ├── HeroScene.tsx         # Main homepage 3D scene
│   │   ├── ExplodedView.tsx      # Scroll-driven exploded view
│   │   ├── FacilityModel.tsx     # Per-facility 3D equipment
│   │   └── CanvasProvider.tsx    # Shared R3F Canvas wrapper
│   ├── motion/                   # Animation components
│   │   ├── ScrollReveal.tsx      # Scroll-triggered reveal wrapper
│   │   ├── LaserEtchText.tsx     # Left-to-right text reveal
│   │   ├── ScanLine.tsx          # Green metrology scan effect
│   │   ├── StampEffect.tsx       # Impact stamp animation
│   │   └── ParallaxLayer.tsx     # Depth parallax wrapper
│   ├── ui/                       # Redesigned UI primitives
│   │   ├── GlassCard.tsx         # Dark glassmorphism card
│   │   ├── MetalButton.tsx       # CNC-panel-style button
│   │   ├── ControlPanel.tsx      # Filter bar (machine control style)
│   │   └── DataCallout.tsx       # Dimension/spec callout bubble
│   └── ...existing components
├── assets/
│   ├── models/                   # .glb files
│   ├── sequences/                # Image sequences for scrub
│   ├── videos/                   # Hero loop videos
│   └── lottie/                   # Lottie JSON animations
```

---

## Performance Guardrails

| Concern | Mitigation |
|---|---|
| 3D scene loading time | Lazy-load Three.js canvas. Show a CSS-only shimmer placeholder. Load `.glb` with `Suspense`. |
| Mobile GPU limits | Detect mobile → replace 3D scenes with scroll-scrubbed image sequences or static hero image with CSS parallax. |
| Image sequence size | Use `.webp` at 80% quality. Progressive load: first 30 frames immediately, rest on scroll intent. |
| GSAP bundle size | Tree-shake: import only `gsap` and `ScrollTrigger` (~28KB gzipped total). |
| Layout shifts | Reserve exact dimensions for 3D canvases and video containers. |
| Accessibility | `prefers-reduced-motion: reduce` disables all animations. All content remains readable without motion. |

---

## What to Do First (Actionable Next Steps)

1. **Approve this color system and philosophy** — confirm the "forged metal" dark theme direction
2. **Gather 3-5 CAD files** from your coursework (bracket, fixture, any aerospace part)
3. **Film 2-3 short clips** in your labs (CNC running, printer building, welding — phone is fine, steady hands, good light)
4. **I will build the foundation**: new `globals.css` with the full design system, `ScrollReveal` component, `GlassCard`, page transitions, and the homepage redesign as a proof of concept
5. **Then iterate**: add 3D scenes as assets become available, refine animations per-page

---

> *"The best interface is one where the medium and the message are the same thing."*
>
> Your medium is manufacturing. Your message is manufacturing. The website should **manufacture itself** as the user scrolls.
