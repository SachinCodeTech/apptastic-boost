## Goal
Deliver a single, reliable one-click flow for both **Share PDF** and **Share Image** that works across:
- iOS Safari / installed iOS web app
- Android Chrome / installed Android web app
- Desktop Chrome/Safari/Firefox/Edge

## Plan
1. **Audit the current share/export path**
   - Inspect the current PDF/PNG generation, file creation, native share detection, iframe checks, and download fallback.
   - Identify where desktop preview differs from real mobile browsers, especially iOS Safari’s stricter Web Share requirements.

2. **Replace fragile share detection with a cross-browser share strategy**
   - Generate PDF and PNG only inside the user click handler when needed, so browsers treat the action as user-initiated.
   - Try native file sharing first only when `navigator.share` and `navigator.canShare({ files })` support the exact file.
   - If PDF file sharing is unsupported, try image sharing before falling back.
   - If native sharing is blocked, cancelled, framed, or unsupported, fall back to a guaranteed browser download.

3. **Make the one-click flow explicit and consistent**
   - Keep separate buttons: **Share PDF** and **Share Image**.
   - Each button performs one action: native share sheet when supported, otherwise saves the file.
   - Show accurate status messages such as “Opening share sheet…”, “Saved PDF”, “Sharing is not available in this browser, file saved instead”, or “Share cancelled”.

4. **Harden PDF/PNG generation**
   - Keep canvas-based card rendering to avoid DOM screenshot/CSS color failures.
   - Ensure generated files have valid MIME types, simple filenames, and mobile-safe sizes.
   - Add fallback paths for browsers that lack `File`, `canvas.toBlob`, or strict PDF sharing support.

5. **Test in desktop automation**
   - Use Playwright to generate a square and click both share buttons.
   - Verify files are produced/downloaded in desktop Chromium.
   - Verify no console errors during generation, sharing fallback, or download.

6. **Add mobile-behavior checks where automation can simulate them**
   - Test mobile viewport/touch layout for the same flow.
   - Validate capability detection branches with mocked `navigator.share` / `navigator.canShare` in browser runtime.
   - Document the real-device expectation: iOS/Android native share sheets can only be fully confirmed on physical devices because desktop automation cannot open mobile OS share sheets.

## Expected result
- On supported mobile browsers: tapping **Share PDF** or **Share Image** opens the native share sheet.
- On unsupported/framed/desktop browsers: the same tap/click saves the PDF or PNG instead of failing silently.
- Users always get either a share sheet or a saved file, with a clear message.