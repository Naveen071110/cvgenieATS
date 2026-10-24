import { useEffect } from "react";
import { useLocation } from "wouter";
import { trackPageView } from "@/lib/analytics";

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  ogType?: "website" | "article" | "profile";
  ogImage?: string;
  noindex?: boolean;
  keywords?: string;
}

export function SEO({
  title,
  description,
  canonical,
  ogType = "website",
  ogImage = "https://cvgenieats.com/og-image.jpg",
  noindex = false,
  keywords,
}: SEOProps) {
  const [location] = useLocation();
  const canonicalUrl = canonical || `https://cvgenieats.com${location === "/" ? "" : location}`;

  useEffect(() => {
    // 1. Update Document Title
    document.title = title;

    // Helper to safely set or create meta tag
    const setMeta = (nameOrProperty: "name" | "property", key: string, content: string) => {
      let tag = document.querySelector<HTMLMetaElement>(`meta[${nameOrProperty}="${key}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute(nameOrProperty, key);
        document.head.appendChild(tag);
      }
      tag.content = content;
    };

    // 2. Primary Meta Tags
    setMeta("name", "description", description);
    if (keywords) {
      setMeta("name", "keywords", keywords);
    }
    setMeta("name", "robots", noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1");

    // 3. Canonical Link Tag
    let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = canonicalUrl;

    // 4. OpenGraph Tags
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("property", "og:url", canonicalUrl);
    setMeta("property", "og:type", ogType);
    setMeta("property", "og:image", ogImage);
    setMeta("property", "og:site_name", "CVGenie ATS");

    // 5. Twitter Card Tags
    setMeta("name", "twitter:title", title);
    setMeta("name", "twitter:description", description);
    setMeta("name", "twitter:image", ogImage);

    // 6. Analytics Page View Tracking
    trackPageView(location, title);
  }, [title, description, canonicalUrl, ogType, ogImage, noindex, keywords, location]);

  return null;
}
