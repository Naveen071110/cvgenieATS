
# CVGenie Blog System

A scalable MDX-powered blog system integrated into the CVGenie application.

## Features

- ✅ MDX posts with frontmatter
- ✅ Dynamic routing (`/blog` and `/blog/[slug]`)
- ✅ SEO optimization (meta tags, JSON-LD, sitemap, RSS)
- ✅ Search functionality (client-side fuzzy search)
- ✅ Tag filtering with query parameters
- ✅ Pagination
- ✅ Related posts
- ✅ Homepage integration
- ✅ Responsive design with CVGenie theme
- ✅ ATS/TXT format compliance

## File Structure

```
content/posts/           # MDX blog posts
├── ats-resume-guide-2025.mdx
├── cover-letter-templates-2025.mdx
└── remote-work-resume-tips.mdx

client/src/
├── lib/
│   ├── posts.ts         # Post utilities and data layer
│   ├── sitemap.ts       # Sitemap generator
│   └── rss.ts           # RSS feed generator
├── components/
│   ├── blog-card.tsx    # Blog post card component
│   ├── blog-search.tsx  # Search functionality
│   ├── blog-tag-filter.tsx  # Tag filtering
│   ├── blog-pagination.tsx  # Pagination component
│   └── latest-blog-posts.tsx  # Homepage blog section
└── pages/
    ├── blog.tsx         # Blog index page
    └── blog-post.tsx    # Individual blog post page
```

## Adding a New Blog Post

1. Create a new `.mdx` file in `content/posts/` directory:

```bash
content/posts/my-new-article.mdx
```

2. Add frontmatter at the top of your MDX file:

```yaml
---
title: "Your Article Title"
slug: "your-article-slug"
description: "A compelling description for SEO and social sharing"
date: "2025-01-15"
updated: "2025-01-15"  # Optional: only if you update the post
author: "CVGenie Editorial Team"
tags: ["resume", "career-tips", "job-search"]  # Use relevant tags
ogImage: "/images/blog/your-image.png"  # Optional: social sharing image
draft: false  # Optional: set to true to hide from public
---

# Your Article Content

Write your article content here using Markdown/MDX syntax...
```

3. **Important**: Use only "DOCX" and "TXT" when referring to file formats (never "DOC" or "PDF")

4. Commit your changes - the post will appear automatically in the blog

## Recommended Tags

Use these existing tags for consistency:
- `ats`
- `resume`
- `cover-letter`
- `job-search`
- `career-tips`
- `optimization`
- `templates`
- `remote-work`
- `interview`
- `career-development`

## Content Guidelines

1. **File Formats**: Always mention "DOCX and TXT" formats (not DOC or PDF)
2. **SEO**: Include relevant keywords naturally
3. **Length**: Aim for 1,000-2,500 words for optimal SEO
4. **Headers**: Use proper heading hierarchy (H1 → H2 → H3)
5. **CTAs**: Include calls-to-action linking to `/generator`
6. **Links**: Link to relevant internal content when possible

## URL Structure

- Blog index: `/blog`
- Individual posts: `/blog/[slug]`
- Tag filtering: `/blog?tag=resume`
- Pagination: `/blog?page=2`
- Combined: `/blog?tag=resume&page=2`

## SEO Features

Each blog post automatically generates:
- Page title and meta description
- Canonical URLs
- Open Graph tags
- Twitter Card metadata
- JSON-LD Article schema
- Sitemap entries
- RSS feed entries

## Performance

- Posts are statically rendered for fast loading
- Images are optimized and lazy-loaded
- Search is client-side for instant results
- Pagination reduces initial load time

## Development

To validate a post's frontmatter:

```javascript
import { validatePost } from '@/lib/posts';
const { isValid, errors } = validatePost('your-post-slug');
```

To generate sitemap/RSS locally:

```javascript
import { generateSitemap } from '@/lib/sitemap';
import { generateRSSFeed } from '@/lib/rss';

console.log(generateSitemap());
console.log(generateRSSFeed());
```

## Deployment

The blog system works with static site generation:
- Posts are built at build time
- No database required
- Fast CDN delivery
- SEO-friendly URLs

Changes to posts require a rebuild/redeploy to be visible in production.
