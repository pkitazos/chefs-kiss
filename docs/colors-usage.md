# Color System Usage Guide

This project uses a custom color palette with **default Tailwind colors disabled**.

## Available Colors

### Shadcn Semantic Colors (Primary Usage)

**Always prefer these for UI components** - they automatically adapt to light/dark mode:

```tsx
// Backgrounds & Text
bg-background text-foreground       // Main page background and text
bg-card text-card-foreground        // Card surfaces
bg-popover text-popover-foreground  // Dropdown menus, tooltips

// Interactive Elements
bg-primary text-primary-foreground       // Magenta - main CTAs, primary buttons
bg-secondary text-secondary-foreground   // Slate blue - secondary actions
bg-accent text-accent-foreground         // Pink - highlights, hover states
bg-muted text-muted-foreground           // Subtle backgrounds, disabled states

// States
bg-destructive text-destructive-foreground  // Rose red - errors, delete actions

// Form Elements
border-border    // Default borders
border-input     // Input borders
ring-ring        // Focus rings
```

### Gray Scale (50-950)

Full Tailwind-style gray scale from light to dark:

```tsx
bg-gray-50    // Lightest - nearly white
bg-gray-100   // Very light
bg-gray-200   // Light
bg-gray-300   // Light medium (borders)
bg-gray-400   // Medium light
bg-gray-500   // True medium
bg-gray-600   // Medium dark (muted text)
bg-gray-700   // Dark
bg-gray-800   // Very dark
bg-gray-900   // Nearly black
bg-gray-950   // Darkest - brand black (#232F20)

// Usage examples
<div className="bg-gray-100 border border-gray-300">
  <p className="text-gray-600">Muted text</p>
  <p className="text-gray-950">Dark text</p>
</div>
```

### Brand Colors (Use Intentionally)

Brand colors using Tailwind naming conventions. Use these when you specifically need a brand color:

```tsx
// Magenta - Primary brand color (400, 500, 600)
bg-magenta-400  // Dark
bg-magenta-500  // Medium (default primary)
bg-magenta-600  // Light

// Rose - Destructive/Error + Logo color (500, 600)
bg-rose-500
bg-rose-600

// Sky - Info, links (400, 500, 600)
bg-sky-400      // Dark
bg-sky-500      // Medium
bg-sky-600      // Light (info messages)

// Slate - Dark blue for secondary (600, 700, 800)
bg-slate-600    // Darkest
bg-slate-700    // Medium (default secondary)
bg-slate-800    // Lightest

// Amber - Warnings (400, 500, 600)
bg-amber-400    // Dark
bg-amber-500    // Medium (warnings)
bg-amber-600    // Light

// Pink - Accents (400, 500, 600)
bg-pink-400     // Dark
bg-pink-500     // Medium (default accent)
bg-pink-600     // Light

// Orange - Use sparingly (500, 600, 700)
bg-orange-500   // Darkest
bg-orange-600   // Medium
bg-orange-700   // Lightest
```

## Usage Examples

### Buttons

```tsx
// Primary CTA
<button className="bg-primary text-primary-foreground hover:bg-magenta-600">
  Sign Up
</button>

// Secondary action
<button className="bg-secondary text-secondary-foreground hover:bg-slate-800">
  Learn More
</button>

// Destructive action
<button className="bg-destructive text-destructive-foreground hover:bg-rose-500">
  Delete Account
</button>

// Ghost button with accent on hover
<button className="text-foreground hover:bg-accent hover:text-accent-foreground">
  View Details
</button>
```

### Cards & Containers

```tsx
// Standard card
<div className="bg-card text-card-foreground border border-border rounded-lg p-6">
  <h3 className="text-xl font-semibold text-foreground">Card Title</h3>
  <p className="text-muted-foreground mt-2">Card description...</p>
</div>

// Subtle background section
<section className="bg-muted">
  <div className="container">
    <h2 className="text-foreground">Section Title</h2>
    <p className="text-muted-foreground">Section content...</p>
  </div>
</section>
```

### Brand Elements

```tsx
// Logo or hero section
<div className="bg-gray-950 text-white">
  <h1 className="text-rose-600 text-4xl font-bold">Chef's Kiss</h1>
  <p className="text-gray-300">Tagline here</p>
</div>

// Info badge
<span className="bg-sky-600 text-white px-3 py-1 rounded-full text-sm">
  New Feature
</span>

// Warning banner
<div className="bg-amber-500 text-gray-950 p-4 rounded-lg">
  ⚠️ Please verify your email address
</div>
```

### Forms

```tsx
// Input field
<input
  className="border-input bg-background text-foreground rounded-md px-3 py-2
             focus:ring-2 focus:ring-ring focus:outline-none"
  type="text"
/>

// Error state
<input
  className="border-destructive bg-background text-foreground rounded-md px-3 py-2
             focus:ring-2 focus:ring-destructive"
  type="email"
/>
<p className="text-destructive text-sm mt-1">Invalid email address</p>
```

### Text Hierarchy

```tsx
<div>
  <h1 className="text-4xl font-bold text-foreground">Main Heading</h1>
  <h2 className="text-2xl font-semibold text-gray-900">Subheading</h2>
  <p className="text-foreground">Body text with normal importance</p>
  <p className="text-muted-foreground">Less important, muted text</p>
  <p className="text-gray-600">Even more subtle text</p>
</div>
```

### Hover States & Transitions

```tsx
// Card with hover effect
<div className="bg-card hover:bg-accent transition-colors cursor-pointer p-4 rounded-lg">
  Interactive card
</div>

// Button with smooth color transition
<button className="bg-primary hover:bg-magenta-600 transition-colors duration-200">
  Smooth Hover
</button>

// Link with underline and color change
<a className="text-sky-600 hover:text-sky-500 underline underline-offset-4">
  Learn more
</a>
```

## Best Practices

1. **Start with semantic colors** - Use `bg-primary`, `bg-secondary`, `bg-accent` for UI
2. **Use gray scale for neutrals** - `text-gray-600`, `bg-gray-100`, `border-gray-300`
3. **Brand colors for specific needs**:
   - Logo and branding: `bg-gray-950`, `text-rose-600`
   - Info/help text: `text-sky-600`
   - Warnings: `bg-amber-500`
   - Success (if needed): `bg-sky-500` or add a new green later
4. **Test in dark mode** - Semantic colors adapt, but brand colors don't
5. **Keep it minimal** - Your client wants fewer colors, not more
6. **No default Tailwind colors** - `bg-blue-500`, `text-red-400` won't work

## Color Naming Guide

**Tailwind numbers explained:**
- **50-100**: Very light, almost white
- **200-300**: Light (borders, subtle backgrounds)
- **400-500**: Medium (text, buttons)
- **600-700**: Dark (headings, emphasis)
- **800-950**: Very dark, almost black

**Why these specific names:**
- **Magenta**: Primary brand color (instead of "brand-magenta")
- **Rose**: Red but softer name (for logo red + errors)
- **Sky**: Light blue (for info)
- **Slate**: Dark blue (for secondary actions)
- **Amber**: Yellow-orange (for warnings)
- **Pink**: Accent color
- **Orange**: Use sparingly

## Adding New Colors

If you need a color not in the palette:

1. Identify the gap (e.g., "I need a success green")
2. Choose a Tailwind color or find a hex value
3. Convert to OKLCH: `pastel format oklch "#hexcode"`
4. Add to [app/globals.css](../app/globals.css) in the appropriate section
5. Follow naming conventions (color name + number)
6. Update this doc

**Example:**
```bash
# Find a green you like
pastel format oklch "#10b981"  # Tailwind green-500

# Add to globals.css:
--color-emerald-500: var(--emerald-500);
# Then in :root:
--emerald-500: oklch(0.6815 0.1723 155.4983);
```

## Complete Color Reference

See [lib/colors-reference.txt](./colors-reference.txt) for hex codes and OKLCH values of all colors.
