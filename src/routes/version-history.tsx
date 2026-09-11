import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/version-history")({
  head: () => ({
    meta: [
      { title: "Version History — Ramanujan Magic Square" },
      { name: "description", content: "See the layout, installability, offline, and sharing improvements made to Ramanujan Magic Square by CodeTech." },
      { property: "og:title", content: "Version History — Ramanujan Magic Square" },
      { property: "og:description", content: "A clear record of the app's visual, sharing, and installability improvements." },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "https://apptastic-boost.lovable.app/version-history" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "Version History — Ramanujan Magic Square" },
      { name: "twitter:description", content: "A clear record of the app's visual, sharing, and installability improvements." },
    ],
    links: [{ rel: "canonical", href: "https://apptastic-boost.lovable.app/version-history" }],
  }),
  component: VersionHistory,
});

const releases = [
  {
    label: "Current release",
    title: "Store-ready web app foundation",
    detail: "Added install metadata, app icons, store screenshots, standalone display settings, offline shell caching, safe-area support, and responsive behavior for phone, tablet, and desktop layouts.",
  },
  {
    label: "Layout iteration",
    title: "Screenshot-matched mobile experience",
    detail: "Refined the warm ivory page, navy brand header, serif display type, rounded white surfaces, blue Generate action, gold highlights, mobile menu, form spacing, and 4×4 square sizing to match the supplied reference screens.",
  },
  {
    label: "Share fix",
    title: "Reliable PDF and image card exports",
    detail: "Replaced fragile page capture with a dedicated canvas card, added PDF generation, cached prepared files, and preserved the original click action so mobile share sheets can open without losing browser permission.",
  },
  {
    label: "Share fix",
    title: "Cross-browser fallback path",
    detail: "Added native file-share detection, PDF-to-image fallback, direct downloads, and an open-in-browser fallback for iOS Safari, desktop browsers, and embedded previews where native sharing is unavailable.",
  },
  {
    label: "Product foundation",
    title: "Landing page and local-first generator",
    detail: "Introduced the public landing page, dedicated generator, About page, Terms, Privacy, CodeTech credits, 21 pattern highlights, and the birthday-based square calculation without changing the core generation behavior.",
  },
];

function VersionHistory() {
  return (
    <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
      <header className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-foreground">CodeTech · Changelog</p>
        <h1 className="mt-3 font-display text-5xl leading-none sm:text-6xl">Version history</h1>
        <p className="mt-5 text-lg leading-relaxed text-muted-foreground">A plain-language record of the layout, share, offline, and installability work behind Ramanujan Magic Square.</p>
      </header>

      <ol className="mt-12 space-y-5 border-l border-border pl-6 sm:pl-8">
        {releases.map((release) => (
          <li key={release.title} className="relative rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)] sm:p-7">
            <span aria-hidden className="absolute -left-[2.05rem] top-7 h-3 w-3 rounded-full border-2 border-background bg-accent sm:-left-[2.55rem]" />
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-foreground">{release.label}</p>
            <h2 className="mt-2 font-display text-2xl text-foreground sm:text-3xl">{release.title}</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">{release.detail}</p>
          </li>
        ))}
      </ol>

      <div className="mt-12 border-t border-border pt-8">
        <p className="text-sm leading-relaxed text-muted-foreground">Native Google Play and Apple App Store submission has not been completed from this workspace. The remaining step is the store-console submission using the listing copy, screenshots, privacy URL, and developer account details on the submission checklist.</p>
        <Link to="/store-listing" className="mt-5 inline-flex h-11 items-center rounded-lg px-5 text-sm font-semibold text-primary-foreground" style={{ background: "var(--gradient-hero)" }}>Open store listing</Link>
      </div>
    </article>
  );
}