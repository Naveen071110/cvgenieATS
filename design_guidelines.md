# CVGenie Dark Mode Design Guidelines

## Design Approach
**System**: Custom dark mode implementation maintaining brand identity
**Reference**: Linear's dark mode elegance + Notion's smooth transitions + professional SaaS standards

## Dark Mode Color Strategy

### Brand Color Adaptation
- **Light Mode Primary**: Blue/purple gradient (#4F46E5 to #7C3AED range)
- **Dark Mode Primary**: Lighter, more vibrant versions (#6366F1 to #8B5CF6) - increased luminosity by 10-15%
- **Gradient Treatment**: Maintain gradients but reduce intensity/saturation by 20% in dark mode for eye comfort

### Background System
```
Light Mode:
- Primary BG: Pure white (#FFFFFF)
- Secondary BG: Soft gray (#F9FAFB)
- Card BG: White with subtle shadow

Dark Mode:
- Primary BG: Deep charcoal (#0F172A)
- Secondary BG: Slightly lighter (#1E293B)
- Card BG: Elevated surface (#1E293B) with subtle border (#334155)
```

### Text Hierarchy
```
Light Mode → Dark Mode:
- Headings: #111827 → #F1F5F9
- Body: #374151 → #CBD5E1
- Muted: #6B7280 → #64748B
- Links: Brand blue → Lighter brand blue
```

### Borders & Dividers
- Light: #E5E7EB
- Dark: #334155 (not too stark, subtle separation)

## Dark Mode Toggle Button

**Location**: Top-right navbar, after main navigation links, before primary CTA

**Design Specifications**:
- Icon-based toggle (sun/moon symbols using Heroicons)
- Size: 40×40px touch target, 20px icon
- Background: Transparent in navbar, subtle hover state
- Border: 1px solid with theme-aware color (#E5E7EB light / #334155 dark)
- Border radius: Full (rounded-full)
- Hover: Background fill with low opacity (#F3F4F6 light / #1E293B dark)
- Active state: Scale down slightly (95%)

**Interaction**: Single click toggles, icon morphs between sun/moon with 200ms transition

## Transition System

**Critical Rule**: All theme transitions use 200ms cubic-bezier(0.4, 0, 0.2, 1)

**Apply transitions to**:
- background-color
- color (text)
- border-color
- box-shadow
- fill (for SVG icons)

**Do NOT transition**:
- transform (keep instant for interactions)
- opacity changes on hover (keep snappy)
- layout properties

## Component-Specific Guidelines

### Hero Section
**Image Treatment**:
- Use professional workspace/productivity hero image
- Light mode: Normal image with subtle overlay (rgba(0,0,0,0.1))
- Dark mode: Darken image with overlay (rgba(0,0,0,0.5))
- Buttons on hero: Backdrop blur (blur-xl), semi-transparent white/dark backgrounds with proper contrast

### Pricing Cards
```
Light Mode:
- Background: White
- Border: Light gray
- Highlight card (featured): Gradient border with blue/purple
- Shadow: Soft, elevated

Dark Mode:
- Background: #1E293B
- Border: #334155
- Highlight card: Same gradient border (slightly brighter)
- Shadow: None or very subtle glow
- Price text: Keep high contrast white
```

### Feature Cards
- Icon containers: Use gradient backgrounds in both modes (adjust opacity: 100% light, 80% dark)
- Card hover: Subtle lift with shadow in light, subtle glow in dark
- Icons: Use outline style, white in dark mode

### Forms & Inputs
```
Light Mode:
- Input BG: White
- Border: #D1D5DB
- Focus: Brand gradient border
- Placeholder: #9CA3AF

Dark Mode:
- Input BG: #1E293B
- Border: #475569
- Focus: Lighter brand gradient border
- Placeholder: #64748B
- Text: #F1F5F9 (high contrast)
```

### Navigation Bar
- Light: White background, subtle bottom border
- Dark: #1E293B background, subtle border (#334155)
- Logo: Use SVG that adapts fill color to theme
- Maintain consistent spacing/height across modes

## Typography Adjustments
- Font weights stay identical across themes
- Letter spacing: Increase by 0.01em in dark mode for better readability
- Line height: Keep consistent
- Headings in dark mode: Use slightly lighter weight appearance through color (#F8FAFC) instead of changing actual weight

## Image Handling

**Hero Image**:
- Large full-width hero showcasing professional resume/workspace scene
- Dimensions: Full width, 60vh height
- Position: Top of page after navbar
- Treatment: Apply overlay as specified above

**Additional Images**:
- Feature section illustrations: Use SVG illustrations that adapt stroke/fill to theme
- Testimonial avatars: Maintain original colors with subtle border adjustments
- Logo/brand assets: Ensure SVG versions for theme adaptation

## Accessibility Requirements
- Maintain WCAG AAA contrast ratios (7:1 for normal text, 4.5:1 for large)
- Dark mode must pass same contrast checks as light mode
- Focus indicators: Highly visible in both modes (use brand color with 3px outline)
- Preference detection: Respect user's system preference on first load
- Toggle state: Clearly indicate current mode

## Shadow System
```
Light Mode:
- sm: 0 1px 2px rgba(0,0,0,0.05)
- md: 0 4px 6px rgba(0,0,0,0.1)
- lg: 0 10px 15px rgba(0,0,0,0.1)

Dark Mode:
- sm: 0 1px 3px rgba(0,0,0,0.3)
- md: 0 4px 8px rgba(0,0,0,0.4)
- lg: 0 10px 20px rgba(0,0,0,0.5)
```

**Implementation Priority**: Start with navbar toggle, then backgrounds/text, then component refinements, finally transitions.