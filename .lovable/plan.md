## Goal
Create the remaining public-facing store materials and verify the app’s key flows without changing square-generation behavior.

## Plan
1. Expand `/privacy` to clearly explain local name/birthday processing, generated squares, exports, offline storage, browser data, and what is not collected.
2. Add a `/version-history` page documenting the visual iterations, sharing fixes, installability work, and current release status.
3. Add a polished `/store-listing` page with the app title, short/full descriptions, feature highlights, screenshots, privacy notes, age/platform guidance, and store-ready copy.
4. Add route metadata and navigation links for the new pages, plus the sitemap entries.
5. Test all public routes at phone, tablet, and desktop widths; test generate, image/PDF fallback behavior, and offline loading with browser automation.
6. Publish the web app only if the deployment scan is clean; native Google Play or Apple App Store submission remains blocked without the developer account and store-console credentials.

## Technical details
- Keep all data processing client-side and preserve the existing square/share implementation.
- Use the existing warm ivory, navy, blue, and gold design tokens and bundled screenshots.
- Use TanStack file-based routes and route-specific SEO metadata.
- Do not claim a native store submission or physical-device test that cannot be performed from this workspace.
