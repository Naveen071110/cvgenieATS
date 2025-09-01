
# CVGenie Icon Placement Suggestions

## Current UI Integration Recommendations

### Features Section (`features-section.tsx`)
Replace or enhance existing feature cards with custom icons:

1. **ATS Optimization** (`ats-optimization.svg`)
   - Current: "ATS-Optimized Resumes" feature
   - Placement: Replace existing icon in feature card
   - Size: `w-16 h-16` (64px)

2. **AI-Powered Tailoring** (`ai-powered.svg`)
   - Current: "AI-Powered Customization" feature
   - Placement: Feature card icon
   - Size: `w-16 h-16` (64px)

3. **Multi-Format Export** (`multi-format.svg`)
   - Current: Could enhance "Multiple Format Downloads" feature
   - Placement: Feature card icon
   - Size: `w-16 h-16` (64px)

4. **Skill Matching** (`skill-matching.svg`)
   - Current: Could be added as new feature highlighting job-specific optimization
   - Placement: New feature card or existing customization feature
   - Size: `w-16 h-16` (64px)

### Generator Page (`generator.tsx`)

5. **Document Upload** (`document-upload.svg`)
   - Placement: File upload section
   - Size: `w-12 h-12` (48px) above upload area
   - Context: Visual cue for drag-and-drop zone

6. **Cover Letter Generation** (`cover-letter.svg`)
   - Placement: Next to cover letter preview/download section
   - Size: `w-8 h-8` (32px) as section icon

### Hero Section (`hero-section.tsx`)

7. **Speed Optimization** (`speed-optimization.svg`)
   - Placement: As floating illustration or in hero content
   - Size: `w-20 h-20` (80px)
   - Context: Emphasize quick generation time

### Testimonials Section (`testimonials-section.tsx`)

8. **Testimonials/Social Proof** (`testimonials.svg`)
   - Placement: Section header icon
   - Size: `w-12 h-12` (48px)

### Footer/About Sections

9. **Trusted Security** (`trusted-security.svg`)
   - Placement: Footer trust indicators or privacy policy page
   - Size: `w-10 h-10` (40px)

10. **Dashboard Analytics** (`dashboard-analytics.svg`)
    - Placement: Future pro user dashboard or pricing section
    - Size: `w-14 h-14` (56px)

### Job Matching Feature

11. **Job Matching** (`job-matching.svg`)
    - Placement: New feature highlighting or CTA section
    - Size: `w-16 h-16` (64px)

## Implementation Example

To integrate these icons into your existing components:

```tsx
import AtsOptimizationIcon from '@/assets/icons/ats-optimization.svg?react';
import AiPoweredIcon from '@/assets/icons/ai-powered.svg?react';

// In your feature card:
<div className="feature-icon-hover p-4 rounded-2xl bg-primary/5 mb-6">
  <AtsOptimizationIcon className="w-16 h-16" />
</div>
```

## Brand Consistency Notes
- All icons use CVGenie brand colors and maintain visual harmony
- Designed to work with your existing floating card animations
- Compatible with dark/light mode using CSS custom properties
- Optimized for web performance and accessibility
