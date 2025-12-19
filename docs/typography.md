# Typography System

This project uses a custom typography system based on the brand guidelines with two fonts:
- **PP Neue Machina** (Ultrabold) - Display/title font
- **Manrope** (Regular, Bold, Extrabold) - Body and heading font

## Quick Start

### Using HTML Elements (Automatic Styling)

The easiest way - just use standard HTML elements with automatic brand styling:

```tsx
<h1>Main Page Title</h1>        {/* 40pt, PP Neue Machina */}
<h2>Section Heading</h2>         {/* 25pt, Manrope Bold */}
<p>Body paragraph text</p>       {/* 12pt, Manrope Regular */}
```

### Using Utility Classes (More Control)

For custom components or when you need more control:

```tsx
<div className="text-brand-title">Custom Title</div>
<div className="text-brand-subtitle">Custom Subtitle</div>
<div className="text-brand-body">Custom body text</div>
```

### Using the SectionLabel Component

For small overline labels above main headings:

```tsx
import { SectionLabel } from "@/components/ui/section-label";

<SectionLabel>About Us</SectionLabel>
<h1>Welcome to Chef's Kiss</h1>
```

## Typography Styles

### Title (`text-brand-title` or `<h1>`)
- **Font**: PP Neue Machina Ultrabold
- **Size**: 40pt
- **Line Height**: 40pt (same as font size)
- **Letter Spacing**: 0 (normal)
- **Usage**: Hero headings, main page titles

```tsx
<h1>Chef's Kiss Restaurant</h1>
// or
<div className="text-brand-title">Hero Headline</div>
```

### Subtitle (`text-brand-subtitle` or `<h2>`)
- **Font**: Manrope Bold
- **Size**: 25pt
- **Line Height**: 27pt (+2pt)
- **Letter Spacing**: 0.025em (tracking 25)
- **Usage**: Section headings, major subheadings

```tsx
<h2>Our Story</h2>
// or
<div className="text-brand-subtitle">Section Title</div>
```

### Header/Section Label (`text-brand-header` or `<SectionLabel>`)
- **Font**: Manrope Extrabold
- **Size**: 10pt
- **Line Height**: 12pt (+2pt)
- **Letter Spacing**: 0.1em (tracking 100 - very wide)
- **Transform**: Uppercase
- **Usage**: Small category labels, eyebrow text above main headings

```tsx
<SectionLabel>Featured Menu</SectionLabel>
// or
<span className="text-brand-header">New Arrivals</span>
```

### Body/Main Text (`text-brand-body` or `<p>`)
- **Font**: Manrope Regular
- **Size**: 12pt
- **Line Height**: 16pt (+4pt)
- **Letter Spacing**: 0.05em (tracking 50)
- **Usage**: Paragraph text, descriptions, body copy

```tsx
<p>Welcome to our restaurant...</p>
// or
<div className="text-brand-body">Custom paragraph</div>
```

## Complete Example

```tsx
export function HeroSection() {
  return (
    <section className="py-12">
      <SectionLabel>Welcome</SectionLabel>
      <h1 className="mt-2">Chef's Kiss Restaurant</h1>
      <h2 className="mt-8">Authentic Flavors, Modern Twist</h2>
      <p className="mt-4">
        Experience culinary excellence with our carefully crafted menu
        featuring locally sourced ingredients and innovative techniques.
      </p>
    </section>
  );
}
```

## Additional Headings

For flexibility, `h3` through `h6` are also styled with Manrope Bold and responsive sizing:

- `<h3>`: Extra large (text-xl)
- `<h4>`: Large (text-lg)
- `<h5>`, `<h6>`: Base size (text-base)

All have the same letter spacing as h2 (0.025em).

## Font Variables

Available CSS variables for custom usage:

```css
--font-display      /* PP Neue Machina Ultrabold */
--font-sans         /* Manrope */
--font-mono         /* System monospace */
```

## Tailwind Font Utilities

You can also use Tailwind's font family utilities:

```tsx
<div className="font-display">Uses PP Neue Machina</div>
<div className="font-sans">Uses Manrope</div>
<div className="font-mono">Uses monospace</div>
```

## Responsive Typography

The fixed point sizes (40pt, 25pt, etc.) work well for desktop. For responsive design, you may want to scale these down on mobile:

```tsx
<h1 className="text-[30pt] md:text-[40pt]">
  Responsive Title
</h1>
```

Or create responsive variants of the utility classes in your CSS.

## Notes

- **Point sizes vs pixels**: The brand guide uses pt (points). Tailwind preserves these as specified.
- **Letter spacing**: "Tracking" from design software is converted to `letter-spacing` in CSS
  - Tracking 0 = normal
  - Tracking 25 = 0.025em
  - Tracking 50 = 0.05em
  - Tracking 100 = 0.1em
- **Leading**: "+2pt" means 2pt more than the font size
- **Font loading**: Fonts are optimized by Next.js and load with `font-display: swap`

## Best Practices

1. **Use HTML elements first** (`<h1>`, `<h2>`, `<p>`) for semantic HTML and automatic styling
2. **Use utility classes** when you need the style but not the semantic element
3. **Use SectionLabel component** for consistent overline text
4. **Keep hierarchy clear** - use h1 once per page, h2 for major sections, etc.
5. **Test on multiple screen sizes** - the fixed pt sizes may need responsive variants
