/** Inline SVG — no network request, always available as fallback. */
export const PROPERTY_IMAGE_PLACEHOLDER =
  "data:image/svg+xml;charset=UTF-8," +
  encodeURIComponent(
    `
<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="0 0 640 360">
  <rect width="640" height="360" fill="#e2e8f0"/>
  <g fill="#94a3b8" transform="translate(270 90)">
    <path d="M50 20 100 50v90H0V50Z"/>
    <rect x="20" y="80" width="25" height="35" rx="2"/>
    <rect x="55" y="80" width="25" height="35" rx="2"/>
    <rect x="38" y="55" width="24" height="18" rx="2"/>
  </g>
  <text x="320" y="270" text-anchor="middle" fill="#64748b" font-family="system-ui,sans-serif" font-size="16">Property image unavailable</text>
</svg>`.trim(),
  );
