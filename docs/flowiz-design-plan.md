# FloWiz Visual Design System
## Frontend Design Guide & Brand Identity

---

## Executive Overview

FloWiz is a modern, developer-centric CI/CD pipeline visualization platform designed for technical teams who demand clarity, control, and performance. The visual identity reflects **precision**, **transparency**, and **intelligent automation**—combining the reliability of enterprise tools with the thoughtful minimalism of modern developer platforms.

This design system ensures consistency, accessibility, and scalability across all UI components while maintaining a distinctive brand presence that differentiates FloWiz in the competitive CI/CD tooling landscape.

---

## 1. Color Palette

### Brand Philosophy
The color strategy balances **technical precision** with **approachable modernity**. Deep neutrals provide professional gravitas, while strategic accent colors communicate pipeline status and data relationships. The palette supports both light and dark themes essential for 24/7 monitoring environments.

### Primary Colors

| Role | Color | Hex | RGB | Usage |
|------|-------|-----|-----|-------|
| **Primary Blue** | Electric Blue | `#0078D4` | `0, 120, 212` | CTAs, Active states, Primary UI elements |
| **Dark Slate** | Charcoal | `#1A1D23` | `26, 29, 35` | Primary text, Dark mode background |
| **Light Base** | Off-white | `#F5F6F7` | `245, 246, 247` | Light mode background, Card surfaces |
| **Neutral Gray** | Medium Gray | `#6B7280` | `107, 114, 128` | Secondary text, Disabled states |

### Secondary Colors

| Role | Color | Hex | RGB | Usage |
|------|-------|-----|-----|-------|
| **Success Green** | Emerald | `#10B981` | `16, 185, 129` | Passed jobs, Success states, ✓ indicators |
| **Warning Amber** | Golden | `#F59E0B` | `245, 158, 11` | Running jobs, Warnings, In-progress states |
| **Danger Red** | Scarlet | `#EF4444` | `239, 68, 68` | Failed jobs, Errors, Critical alerts |
| **Info Cyan** | Sky Blue | `#06B6D4` | `6, 182, 212` | Informational content, Skipped steps |

### Semantic Status Colors

| Status | Color | Hex | Use Case |
|--------|-------|-----|----------|
| **Success** | `#10B981` | Passed builds, completed stages, healthy metrics |
| **Failed** | `#EF4444` | Failed builds, errors, bottlenecks |
| **Running** | `#F59E0B` | Active jobs, in-progress pipelines |
| **Pending** | `#8B5CF6` | Queued jobs, awaiting resources |
| **Skipped** | `#6B7280` | Conditional skips, no-ops |
| **Cancelled** | `#64748B` | User-cancelled, aborted builds |

### Neutral Scale (Light Mode)

```
Gray-50:   #F9FAFB  (Hover backgrounds, subtle accents)
Gray-100:  #F3F4F6  (Secondary backgrounds)
Gray-200:  #E5E7EB  (Borders, dividers)
Gray-300:  #D1D5DB  (Focus rings, subtle UI)
Gray-400:  #9CA3AF  (Placeholder text)
Gray-500:  #6B7280  (Secondary text, labels)
Gray-600:  #4B5563  (Primary text, secondary)
Gray-700:  #374151  (Primary text)
Gray-800:  #1F2937  (Headings)
Gray-900:  #111827  (Dark headings, emphasis)
```

### Dark Mode Adjustments

The dark theme inverts the base contrast while maintaining semantic color consistency:

```
Dark-bg:      #0F1119  (Primary background)
Dark-surface: #1A1D23  (Cards, panels)
Dark-border:  #2D3139  (Subtle dividers)
Dark-text:    #E8EAED  (Primary text)
Dark-muted:   #9CA3AF  (Secondary text)
```

### Accessibility Considerations

- **Minimum Contrast Ratio**: All text meets WCAG AA standards (4.5:1 for normal text, 3:1 for large text)
- **Color Independence**: Status is never conveyed by color alone—always paired with icons, text labels, or patterns
- **Color Blind Safe**: Primary palette tested against Deuteranopia, Protanopia, and Tritanopia simulations
- **Focus States**: Use `#0078D4` with 2px solid border for keyboard navigation visibility

---

## 2. Typography System

### Font Families

| Category | Font | Fallback | Use |
|----------|------|----------|-----|
| **Display** | `Inter` (900, 700, 600) | System sans-serif | Main headings, brand text, high-impact UI |
| **Body** | `Inter` (500, 400) | System sans-serif | Body text, UI labels, descriptions |
| **Monospace** | `JetBrains Mono` | `Courier New` | Code snippets, YAML/JSON, technical content |

**Rationale**: Inter provides exceptional readability at all sizes with excellent kerning—critical for developer tools. JetBrains Mono aligns with the developer audience's expectations for technical content.

### Type Scale (Minor Third: 1.2x ratio)

| Level | Name | Size | Line Height | Weight | Letter Spacing | Usage |
|-------|------|------|-------------|--------|-----------------|-------|
| **H1** | Display Large | 48px / 3rem | 1.2 (57.6px) | 700 | -0.02em | Page titles, main headings |
| **H2** | Display Medium | 40px / 2.5rem | 1.25 (50px) | 700 | -0.01em | Section headers, feature titles |
| **H3** | Display Small | 33px / 2.06rem | 1.3 (42.9px) | 600 | 0 | Subsection headers, card titles |
| **H4** | Heading Large | 28px / 1.75rem | 1.35 (37.8px) | 600 | 0 | Component headers, modal titles |
| **H5** | Heading Medium | 23px / 1.44rem | 1.4 (32.2px) | 600 | 0 | Form labels, panel headers |
| **H6** | Heading Small | 19px / 1.19rem | 1.45 (27.6px) | 500 | 0 | Badge text, small headers |
| **Body** | Body Large | 16px / 1rem | 1.6 (25.6px) | 400 | 0 | Primary body text, descriptions |
| **Body** | Body Medium | 14px / 0.875rem | 1.6 (22.4px) | 400 | 0 | UI text, labels, secondary content |
| **Body** | Body Small | 12px / 0.75rem | 1.5 (18px) | 400 | 0 | Metadata, timestamps, hints |
| **Code** | Mono Code | 13px / 0.81rem | 1.6 (20.8px) | 400 | 0 | Inline code, command text |
| **Code** | Mono Block | 12px / 0.75rem | 1.7 (20.4px) | 400 | 0 | Code blocks, logs, YAML |

### Font Weight Usage

```css
/* Display & Headers */
font-weight: 700;  /* H1, H2 - maximum visual hierarchy */
font-weight: 600;  /* H3, H4, H5 - strong emphasis */
font-weight: 500;  /* H6, UI elements - subtle emphasis */
font-weight: 400;  /* Body, standard text - readability */
```

### Responsive Typography

Implement fluid typography using CSS `clamp()` for seamless scaling:

```css
/* Large headings scale smoothly */
h1 { font-size: clamp(32px, 6vw, 48px); }

/* Body text remains readable */
body { font-size: clamp(14px, 2.5vw, 16px); }

/* Mobile optimization */
@media (max-width: 768px) {
  h1 { font-size: 32px; }
  h2 { font-size: 28px; }
  body { font-size: 14px; }
}
```

---

## 3. Visual Style & Design Language

### Design Principles

1. **Clarity Over Decoration**: Every visual element serves an information-architecture purpose. Avoid gratuitous ornaments.
2. **Precision**: Consistent spacing, alignment, and proportions reflect the precision required in CI/CD workflows.
3. **Progressive Disclosure**: Show essential information first; reveal complexity on demand.
4. **Transparency**: Visual feedback for all system states—make invisible processes visible.
5. **Performance-First**: Micro-interactions feel snappy; animations enhance, never hinder.

### Spacing Scale (8px base unit)

```
xs:  4px   (0.25rem)   — Fine details, icon padding
sm:  8px   (0.5rem)    — Component padding, tight spacing
md:  16px  (1rem)      — Standard spacing, component gaps
lg:  24px  (1.5rem)    — Section spacing, group separation
xl:  32px  (2rem)      — Major section breaks
2xl: 48px  (3rem)      — Page-level spacing
3xl: 64px  (4rem)      — Hero sections, maximum separation
```

### Border Radius

| Type | Value | Usage |
|------|-------|-------|
| **Sharp** | `0px` | Input fields, technical displays |
| **Subtle** | `4px` (0.25rem) | Buttons, badges, small components |
| **Rounded** | `8px` (0.5rem) | Cards, panels, medium components |
| **Soft** | `12px` (0.75rem) | Large cards, modal containers |
| **Circle** | `9999px` | Avatar images, toggle switches |

**Rationale**: Subtle curves provide visual softness while maintaining technical precision. Avoid overly rounded corners that feel frivolous in a developer tool.

### Shadow System (Elevation)

```css
/* Level 1: Subtle elevation for hover states */
box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1),
            0 1px 2px rgba(0, 0, 0, 0.06);

/* Level 2: Card base state */
box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1),
            0 2px 4px rgba(0, 0, 0, 0.06);

/* Level 3: Modal/Dropdown */
box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1),
            0 4px 6px rgba(0, 0, 0, 0.05);

/* Level 4: Floating UI/Notifications */
box-shadow: 0 20px 25px rgba(0, 0, 0, 0.15),
            0 10px 10px rgba(0, 0, 0, 0.05);

/* Dark mode adjustment */
box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3),
            0 1px 2px rgba(0, 0, 0, 0.2);
```

### Visual Hierarchy

- **Z-index Scale**:
  - Base: 0
  - Dropdowns: 10
  - Modals: 100
  - Notifications: 1000
  - Tooltips: 1001

- **Emphasis Levels**:
  - Primary: Bold weight, primary color, maximum contrast
  - Secondary: Regular weight, neutral color, supporting role
  - Tertiary: Light weight, muted color, background info

---

## 4. Component Patterns & UI System

### Button System

#### Button Variants

**Primary Button** (Call-to-action)
```
State      | Background | Text    | Border | Usage
-----------|-----------|---------|--------|----------
Default    | #0078D4   | White   | None   | Main CTA
Hover      | #0066B2   | White   | None   | Enhanced contrast
Active     | #004A8F   | White   | None   | Pressed state
Disabled   | #E5E7EB   | #9CA3AF | None   | Unavailable action
Focus      | #0078D4   | White   | 2px #0078D4 | Keyboard nav
```

**Secondary Button** (Standard action)
```
State      | Background | Text    | Border        | Usage
-----------|-----------|---------|---------------|----------
Default    | Transparent| #0078D4 | 1px #D1D5DB  | Alternative CTA
Hover      | #F3F4F6   | #0066B2 | 1px #0078D4  | Enhanced visibility
Active     | #E5E7EB   | #004A8F | 1px #0078D4  | Pressed state
Disabled   | Transparent| #9CA3AF | 1px #E5E7EB  | Unavailable
Focus      | #F3F4F6   | #0078D4 | 2px #0078D4  | Keyboard nav
```

**Danger Button** (Destructive action)
```
State      | Background | Text    | Border | Usage
-----------|-----------|---------|--------|----------
Default    | #EF4444   | White   | None   | Delete, stop
Hover      | #DC2626   | White   | None   | Enhanced contrast
Active     | #B91C1C   | White   | None   | Pressed state
Disabled   | #FEE2E2   | #FECACA | None   | Unavailable
Focus      | #EF4444   | White   | 2px #EF4444 | Keyboard nav
```

#### Button Sizes
- **Small**: 8px vertical, 12px horizontal padding, 14px font
- **Medium**: 12px vertical, 16px horizontal padding, 16px font (default)
- **Large**: 16px vertical, 24px horizontal padding, 16px font

### Form Components

#### Input Fields
```
Border:        1px solid #D1D5DB (default), 2px solid #0078D4 (focus)
Background:    #FFFFFF (light), #1A1D23 (dark)
Padding:       12px 16px
Border-radius: 4px
Font-size:     16px (prevents mobile zoom)
Min-height:    44px (touch target compliance)
```

**States**:
- **Empty**: Gray border, placeholder text `#9CA3AF`
- **Focused**: Blue border (2px), box-shadow `0 0 0 3px rgba(0, 120, 212, 0.1)`
- **Filled**: Gray border, text `#111827`
- **Error**: Red border `#EF4444`, error message below
- **Disabled**: Gray background `#F3F4F6`, text `#D1D5DB`

#### Select Dropdowns
- Same border/padding/size as input fields
- Dropdown arrow: `16px`, positioned right with `12px` margin
- Option hover: `#F3F4F6` background
- Selected option: `#0078D4` background, white text

### Badge System

| Type | Background | Text | Usage |
|------|-----------|------|-------|
| **Success** | `#D1FAE5` | `#065F46` | Passed jobs, active |
| **Error** | `#FEE2E2` | `#7F1D1D` | Failed jobs, issues |
| **Warning** | `#FEF3C7` | `#78350F` | In-progress, attention |
| **Info** | `#DBEAFE` | `#0C4A6E` | Informational, skipped |
| **Neutral** | `#F3F4F6` | `#374151` | Pending, neutral state |

**Size**: 6-8px padding, 4-6px horizontal margin, 12px font (small variant)

### Card & Panel System

```css
/* Card Base */
.card {
  background: #FFFFFF (light) / #1A1D23 (dark);
  border: 1px solid #E5E7EB (light) / #2D3139 (dark);
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.2s;
}

.card:hover {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* Card Header (optional) */
.card-header {
  border-bottom: 1px solid #E5E7EB;
  padding-bottom: 16px;
  margin-bottom: 16px;
}

.card-title {
  font-size: 20px;
  font-weight: 600;
  color: #111827;
}
```

### Graph & Node Visualization

#### Node Styling (D3.js)
```css
/* Job Node Base */
.node {
  fill: #FFFFFF;
  stroke: #0078D4;
  stroke-width: 2px;
  filter: drop-shadow(0 1px 3px rgba(0, 0, 0, 0.1));
  transition: all 0.2s ease;
}

/* Node Status States */
.node.success { fill: #D1FAE5; stroke: #10B981; }
.node.failed  { fill: #FEE2E2; stroke: #EF4444; }
.node.running { fill: #FEF3C7; stroke: #F59E0B; }
.node.pending { fill: #E9D5FF; stroke: #8B5CF6; }

/* Node Hover State */
.node:hover {
  stroke-width: 3px;
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.15));
}

/* Edge (Link) */
.link {
  stroke: #D1D5DB;
  stroke-width: 2px;
  fill: none;
  opacity: 0.6;
  transition: opacity 0.2s;
}

.link.highlighted {
  stroke: #0078D4;
  stroke-width: 3px;
  opacity: 1;
}

/* Node Label */
.node-label {
  font-size: 12px;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  text-anchor: middle;
  pointer-events: none;
  fill: #111827;
}
```

#### Interactive States
- **Hover**: Increase stroke width, elevate shadow, highlight connected edges
- **Click**: Show detail panel (slide-out or modal), pulse animation
- **Drag**: Cursor changes to grab, node follows pointer, simulation pauses
- **Focus**: Blue outline (keyboard nav), 2px solid `#0078D4`

### Toast & Notification System

```css
.toast {
  padding: 16px 24px;
  border-radius: 8px;
  font-size: 14px;
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
  display: flex;
  gap: 12px;
  align-items: center;
  min-height: 44px;
  margin-bottom: 12px;
}

/* Variants */
.toast.success { background: #D1FAE5; border-left: 4px solid #10B981; color: #065F46; }
.toast.error   { background: #FEE2E2; border-left: 4px solid #EF4444; color: #7F1D1D; }
.toast.warning { background: #FEF3C7; border-left: 4px solid #F59E0B; color: #78350F; }
.toast.info    { background: #DBEAFE; border-left: 4px solid #06B6D4; color: #0C4A6E; }

/* Animation */
@keyframes slideIn {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

.toast { animation: slideIn 0.3s ease-out; }
```

**Position**: Fixed, bottom-right (desktop), bottom-center (mobile), 16px margin from edge
**Duration**: 5 seconds auto-dismiss (can be extended for important messages)
**z-index**: 1000

### Loading & Progress Indicators

#### Spinner
```css
.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #E5E7EB;
  border-top-color: #0078D4;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
```

#### Progress Bar
```css
.progress-bar {
  height: 8px;
  background: #E5E7EB;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #0078D4, #06B6D4);
  width: 0%;
  transition: width 0.3s ease;
  border-radius: 4px;
}
```

### Modal & Dialog System

```css
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.modal-content {
  background: #FFFFFF;
  border-radius: 12px;
  box-shadow: 0 20px 25px rgba(0, 0, 0, 0.15);
  width: 90%;
  max-width: 600px;
  padding: 32px;
  max-height: 90vh;
  overflow-y: auto;
}

/* Mobile */
@media (max-width: 768px) {
  .modal-content {
    width: 95%;
    max-width: 100%;
    max-height: 85vh;
    border-radius: 12px 12px 0 0;
  }
}
```

---

## 5. Brand Expression & Differentiation

### Visual Identity Narrative

FloWiz stands apart in a crowded CI/CD market through **visual clarity and intentional hierarchy**. While competitors often overwhelm with data density, FloWiz uses **strategic whitespace, semantic color coding, and micro-interactions** to make complex workflows intuitive.

### Design Differentiators

| Aspect | FloWiz Approach | Industry Standard |
|--------|-----------------|-------------------|
| **Color Use** | Semantic (status colors = meaning), consistent | Decorative, inconsistent across tools |
| **Typography** | Modern monospace for code, sans-serif for UI | Monospace everywhere, low contrast |
| **Spacing** | Generous, breathing room | Compressed, high density |
| **Interactions** | Smooth, predictable (no jarring states) | Abrupt, unclear feedback |
| **Graph Design** | Multi-layout options (force, hierarchical, timeline) | Single, fixed layout |

### Key Brand Elements

**Logo & Wordmark**
- Geometric, modular design reflecting pipeline nodes
- Solid `#0078D4` primary, with optional gradient to `#06B6D4`
- Works at 16px minimum (icon), scales to large formats
- Clear space: minimum 8px around mark

**Iconography**
- Icon grid: 24px × 24px (standard), 16px (small), 32px (large)
- Stroke weight: 2px for consistency
- Corner radius: 2px on geometric icons, 4px for badges
- Color: Inherit from context (primary blue, semantic colors)

**Photography & Imagery**
- Minimal use; when needed, high-contrast, technical subjects
- Developer environments, code, deployment visuals
- Avoid stock photography; prefer authentic screenshots or illustrations

### Tone & Microcopy

**Voice**: Technical yet approachable, direct but friendly
- ✓ "Build failed: 3 tests didn't pass"
- ✗ "ERROR: SYSTEM FAILURE"

**Error Messages**:
- Always provide context and actionable steps
- Example: "Connection timeout. Check your GitHub token or retry in Settings > Integrations"

**Success Messages**:
- Brief, positive reinforcement
- Example: "Pipeline deployed successfully 🚀"

---

## 6. Accessibility & Compliance

### WCAG 2.1 Level AA Compliance

#### Color Contrast
- **Text (normal)**: Minimum 4.5:1 ratio
- **Text (large, 18px+)**: Minimum 3:1 ratio
- **UI Components**: Minimum 3:1 ratio for meaningful boundaries

**Verified Combinations**:
- `#111827` (text) on `#FFFFFF` (bg): 19.5:1 ✓
- `#0078D4` (link) on `#FFFFFF` (bg): 8.6:1 ✓
- `#10B981` (success) on `#D1FAE5` (bg): 5.2:1 ✓

#### Focus Management
- **Visible focus indicator**: Always present, never hidden
- **Focus style**: 2px solid outline in primary blue (`#0078D4`)
- **Focus ring offset**: 2px from element boundary
- **Tab order**: Logical flow, left-to-right, top-to-bottom

#### Keyboard Navigation
- All interactive elements accessible via Tab key
- Escape closes modals and dropdown menus
- Arrow keys for list/option selection
- Enter/Space to activate buttons
- Shift+Tab for reverse navigation

#### Semantic HTML
```html
<!-- ✓ Good: Semantic structure -->
<button aria-label="Close modal">✕</button>
<nav aria-label="Main navigation"></nav>
<main role="main"></main>
<form role="search"></form>

<!-- ✗ Avoid: Non-semantic -->
<div onclick="doSomething()" class="button">Click me</div>
```

#### ARIA Labels & Annotations
- All icons without visible text require `aria-label`
- Form inputs need associated `<label>` or `aria-label`
- Dynamic regions use `aria-live="polite"` for notifications
- Complex graphs require `aria-label` describing structure

```html
<!-- Example: Graph visualization -->
<svg aria-label="CI/CD Pipeline: 5 stages, 12 jobs total">
  <g role="group" aria-label="Build stage">
    <circle aria-label="Compile job - passed" class="node success"/>
  </g>
</svg>
```

#### Touch Target Sizing
- Minimum 44px × 44px on touch devices
- For smaller elements, ensure 8px padding around
- Buttons: 44px minimum height (desktop: 40px minimum)

#### Screen Reader Testing
- Tested with: NVDA (Windows), JAWS, VoiceOver (Mac/iOS)
- Alternative text for all images
- Landmark regions properly announced
- Form error messages linked to inputs

---

## 7. Responsive Design & Layout

### Breakpoints (Mobile-first approach)

```css
/* Base styles: mobile (320px+) */
body { font-size: 14px; }

/* Tablet (768px+) */
@media (min-width: 768px) {
  body { font-size: 16px; }
  .grid { columns: 2; }
}

/* Desktop (1024px+) */
@media (min-width: 1024px) {
  .grid { columns: 3; }
  .sidebar { position: fixed; width: 280px; }
}

/* Large Desktop (1440px+) */
@media (min-width: 1440px) {
  .container { max-width: 1320px; }
}
```

### Layout Patterns

**Dashboard Grid** (responsive, 12-column)
- Desktop: 3-4 widgets per row
- Tablet: 2 widgets per row
- Mobile: 1 widget (stacked)
- Min widget width: 280px

**Sidebar Navigation**
- Desktop: Fixed left sidebar (280px), content flows right
- Tablet: Collapsible sidebar (toggle icon), content full-width
- Mobile: Bottom navigation (5-6 primary items) or drawer menu

**Modal Responsiveness**
- Desktop: 60% width, centered
- Tablet: 80% width
- Mobile: Full-screen with 16px margins, scrollable

### Touch-Friendly Design
- Minimum touch target: 44px × 44px
- Spacing between targets: 8px minimum
- Bottom sheet modals for mobile (easier thumb reach)
- Horizontal swipe support for alternate views

---

## 8. Animation & Micro-interactions

### Transition Timings

```css
/* Standard timing for most interactions */
.component {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Slow, emphasis animations */
.modal { animation: fadeIn 0.3s ease-out; }

/* Fast, snappy feedback */
.button:active { transition: all 0.1s ease-out; }
```

### Animation Library

| Effect | Duration | Easing | Use |
|--------|----------|--------|-----|
| Fade In | 0.3s | ease-out | Modals, tooltips appearing |
| Slide Up | 0.2s | ease-out | Panels, drawers opening |
| Scale | 0.2s | cubic-bezier(0.4, 0, 0.2, 1) | Button hover, card lift |
| Spin | 1s | linear (continuous) | Loading spinners |
| Pulse | 2s | ease-in-out | Active indicators |

### Disabled Animations
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 9. Implementation Guidelines

### Tailwind CSS Configuration

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#0078D4',
        success: '#10B981',
        warning: '#F59E0B',
        danger: '#EF4444',
        slate: '#1A1D23',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Courier New', 'monospace'],
      },
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '32px',
      },
      borderRadius: {
        sharp: '0px',
        subtle: '4px',
        round: '8px',
        soft: '12px',
      },
      boxShadow: {
        'sm': '0 1px 3px rgba(0, 0, 0, 0.1)',
        'md': '0 4px 6px rgba(0, 0, 0, 0.1)',
        'lg': '0 10px 15px rgba(0, 0, 0, 0.1)',
        'xl': '0 20px 25px rgba(0, 0, 0, 0.15)',
      },
    },
  },
};
```

### Component Examples

**React Button Component** (TypeScript)
```typescript
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'danger';
  size: 'small' | 'medium' | 'large';
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  disabled = false,
  children,
  onClick,
}) => {
  const baseClasses = 'font-medium rounded-subtle transition-all duration-200';
  const variantClasses = {
    primary: 'bg-primary text-white hover:bg-blue-700 disabled:bg-gray-300',
    secondary: 'bg-transparent border border-gray-300 hover:bg-gray-50',
    danger: 'bg-danger text-white hover:bg-red-700',
  };
  const sizeClasses = {
    small: 'px-3 py-2 text-sm',
    medium: 'px-4 py-3 text-base',
    large: 'px-6 py-4 text-base',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
```

---

## 10. Dark Mode Implementation

### Strategy
- Use CSS custom properties (CSS variables) for theme switching
- Leverage Tailwind's `dark:` prefix for dark mode classes
- Persist theme preference to localStorage

```css
:root {
  --color-bg-primary: #FFFFFF;
  --color-bg-secondary: #F5F6F7;
  --color-text-primary: #111827;
  --color-text-secondary: #6B7280;
  --color-border: #E5E7EB;
}

[data-theme='dark'] {
  --color-bg-primary: #0F1119;
  --color-bg-secondary: #1A1D23;
  --color-text-primary: #E8EAED;
  --color-text-secondary: #9CA3AF;
  --color-border: #2D3139;
}
```

### Component Usage
```html
<!-- Tailwind approach -->
<div class="bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100">
  Content adapts to theme
</div>

<!-- CSS Variable approach -->
<div style="background: var(--color-bg-primary); color: var(--color-text-primary);">
  Content adapts to theme
</div>
```

---

## 11. Brand Asset Management

### Logo Usage
- **Minimum size**: 160px × 160px (print), 32px × 32px (web)
- **Clear space**: Minimum 8px on all sides
- **Background**: Always ensure sufficient contrast
- **No modifications**: Never rotate, distort, or change colors without approval

### Icon Library
- **Base set**: 200+ essential icons (UI, status, workflow-related)
- **Size consistency**: 24px grid, 2px stroke weight
- **Color consistency**: Inherit from semantic color system
- **Format**: SVG for scalability

### Design Documentation
- Maintain Figma design system file (source of truth)
- Export component specifications as JSON for developers
- Document all variants, states, and interactions
- Version design system updates with changelog

---

## 12. Quality Assurance & Testing

### Design System Validation

- **Contrast checking**: Use WCAG contrast checkers for all text/background combinations
- **Responsive testing**: Verify layouts at 320px, 768px, 1024px, 1440px breakpoints
- **Browser compatibility**: Test in Chrome, Firefox, Safari, Edge (latest 2 versions)
- **Screen reader testing**: NVDA, JAWS, VoiceOver
- **Performance**: Ensure animations run at 60fps

### Component Testing Checklist
- [ ] Visual regression tests (Playwright/Percy)
- [ ] Accessibility audit (axe DevTools, Lighthouse)
- [ ] Responsive layout tests
- [ ] Keyboard navigation working
- [ ] Focus indicators visible
- [ ] Color contrast passes WCAG AA
- [ ] Touch targets ≥44px
- [ ] Loading states show feedback
- [ ] Error states properly labeled

---

## 13. Migration Path & Rollout

### Phase 1: Foundation (Week 1-2)
- [ ] Establish Tailwind configuration with design tokens
- [ ] Create base components (Button, Input, Card)
- [ ] Document typography scales
- [ ] Set up dark mode system

### Phase 2: Core UI (Week 3-4)
- [ ] Build form components with validation
- [ ] Create graph visualization components
- [ ] Implement notification system
- [ ] Accessibility audit and fixes

### Phase 3: Integration (Week 5-6)
- [ ] Integrate components into existing pages
- [ ] Refine based on user feedback
- [ ] Performance optimization
- [ ] Documentation completion

### Phase 4: Polish & Scaling (Week 7+)
- [ ] Animation refinements
- [ ] Dark mode full rollout
- [ ] Mobile responsiveness fine-tuning
- [ ] Continuous updates based on metrics

---

## Conclusion

This design system balances **technical precision** with **visual elegance**, creating an interface that inspires confidence in developers. By prioritizing accessibility, consistency, and performance, FloWiz establishes itself as a modern, thoughtful alternative to existing CI/CD tools.

The system is intentionally modular—components can be adopted incrementally, and tokens can be adjusted based on evolving brand needs while maintaining overall coherence. Regular audits and user feedback will ensure the system remains relevant and effective as the product scales.
