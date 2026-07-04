// Guarded PWA registration wrapper — safe for Lovable preview and dev.
// See PWA skill: never register in preview/dev/iframe; support ?sw=off kill switch.

const APP_SW_PATH = "/sw.js";

function isBlockedEnvironment(): boolean {
  if (typeof window === "undefined") return true;
  if (!import.meta.env.PROD) return true;
  try {
    if (window.self !== window.top) return true;
  } catch {
    return true;
  }
  const host = window.location.hostname;
  const blockedHosts = [
    host.startsWith("id-preview--"),
    host.startsWith("preview--"),
    host === "lovableproject.com",
    host.endsWith(".lovableproject.com"),
    host === "lovableproject-dev.com",
    host.endsWith(".lovableproject-dev.com"),
    host === "beta.lovable.dev",
    host.endsWith(".beta.lovable.dev"),
  ];
  if (blockedHosts.some(Boolean)) return true;
  if (new URLSearchParams(window.location.search).has("sw")) {
    if (new URLSearchParams(window.location.search).get("sw") === "off") return true;
  }
  return false;
}

async function unregisterAppSW() {
  if (!("serviceWorker" in navigator)) return;
  const regs = await navigator.serviceWorker.getRegistrations();
  await Promise.allSettled(
    regs
      .filter((r) => {
        const url = r.active?.scriptURL || r.installing?.scriptURL || r.waiting?.scriptURL || "";
        return url.endsWith(APP_SW_PATH);
      })
      .map((r) => r.unregister()),
  );
}

export function registerPWA() {
  if (typeof window === "undefined") return;
  if (!("serviceWorker" in navigator)) return;

  if (isBlockedEnvironment()) {
    void unregisterAppSW();
    return;
  }

  window.addEventListener("load", () => {
    navigator.serviceWorker.register(APP_SW_PATH, { scope: "/" }).catch(() => {
      /* ignore */
    });
  });
}