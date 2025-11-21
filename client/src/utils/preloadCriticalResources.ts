
/**
 * Preload critical above-the-fold resources to improve initial render performance
 * Only includes hero section icons and primary images visible without scrolling
 */
export const preloadCriticalResources = (): void => {
  if (typeof document === "undefined") return;

  // Only preload truly critical assets used in hero/header (above the fold)
  const criticalResources = [
    // Hero section icons (used in hero-section.tsx)
    "/src/assets/icons/ai-powered.svg",
    "/src/assets/icons/ats-shield.svg",
    "/src/assets/icons/multi-format-export.svg",
    
    // Header/navigation icons if any are critical
    "/src/assets/icons/seamless-login.svg",
  ];

  criticalResources.forEach((resource) => {
    // Avoid duplicating <link> tags if they already exist
    const alreadyExists = document.querySelector(
      `link[rel="preload"][href="${resource}"]`
    );
    if (alreadyExists) return;

    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = resource;
    document.head.appendChild(link);
  });
};
