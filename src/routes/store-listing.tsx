import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/store-listing")({
  head: () => ({
    meta: [
      { title: "Store Listing — Ramanujan Magic Square" },
      { name: "description", content: "Store-ready listing copy, screenshots, privacy notes, and platform details for Ramanujan Magic Square by CodeTech." },
      { property: "og:title", content: "Store Listing — Ramanujan Magic Square" },
      { property: "og:description", content: "Store-ready copy and screenshots for the personal birthday magic-square app." },
      { property: "og:type", content: "product" },
      { property: "og:url", content: "https://apptastic-boost.lovable.app/store-listing" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "Store Listing — Ramanujan Magic Square" },
      { name: "twitter:description", content: "Store-ready copy and screenshots for the personal birthday magic-square app." },
    ],
    links: [{ rel: "canonical", href: "https://apptastic-boost.lovable.app/store-listing" }],
  }),
  component: StoreListing,
});

const screenshots = [
  { src: "/screenshot-mobile-home.png", alt: "Ramanujan Magic Square home screen on a phone", label: "Start screen" },
  { src: "/screenshot-mobile-app.png", alt: "Magic square generator form on a phone", label: "Generate" },
  { src: "/screenshot-wide-home.png", alt: "Ramanujan Magic Square home screen on a wide display", label: "Wide layout" },
  { src: "/screenshot-wide-app.png", alt: "Magic square generator on a wide display", label: "Square view" },
];

function StoreListing() {
  return (
    <article className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <header className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-foreground">CodeTech · Store materials</p>
        <h1 className="mt-3 font-display text-5xl leading-none sm:text-7xl">Ramanujan Magic Square</h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">A complete listing draft for the installable web app, with the real project identity, store-ready descriptions, screenshots, privacy details, and submission notes.</p>
      </header>

      <section className="mt-12 grid gap-5 sm:grid-cols-3" aria-label="App details">
        {[
          ["Developer", "CodeTech"],
          ["Lead developer", "Sachin Sheth"],
          ["Category", "Education · Utilities"],
        ].map(([label, value]) => (
          <div key={label} className="border-t-2 border-accent pt-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">{label}</p>
            <p className="mt-2 font-display text-2xl text-foreground">{value}</p>
          </div>
        ))}
      </section>

      <section className="mt-14 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <h2 className="font-display text-3xl">Short description</h2>
          <p className="mt-3 rounded-2xl border border-border bg-card p-5 text-lg leading-relaxed shadow-[var(--shadow-card)]">Turn your birthday into a personal Ramanujan-inspired 4×4 magic square.</p>

          <h2 className="mt-10 font-display text-3xl">Full description</h2>
          <div className="mt-3 space-y-4 leading-relaxed text-muted-foreground">
            <p>Discover the mathematics of Srinivasa Ramanujan by turning any birthday into a personal 4×4 magic square.</p>
            <p>Enter a name and date of birth to generate a beautiful square where rows, columns, diagonals, corners, sub-squares, and other four-cell patterns can share the same total. Cycle through the verified patterns and see the highlighted relationships come alive.</p>
            <p>Save your creation as a polished image card or PDF, then share it with friends, family, students, or classmates. The calculation and card creation happen locally in your browser, with no sign-up required.</p>
            <p>Install it for a focused standalone experience and open the app again when you are offline. It is a small educational utility inspired by a remarkable piece of number theory.</p>
          </div>

          <h2 className="mt-10 font-display text-3xl">Features</h2>
          <ul className="mt-4 grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
            {["Personal 4×4 square from any birthday", "21 verified pattern highlights", "PDF and image card export", "Native share and download fallbacks", "Installable standalone experience", "Offline app shell support", "No account required", "No advertising profile"].map((feature) => <li key={feature} className="rounded-xl border border-border bg-secondary/40 px-4 py-3">{feature}</li>)}
          </ul>
        </div>

        <aside className="h-fit rounded-2xl border border-border bg-secondary/40 p-6">
          <h2 className="font-display text-3xl">Privacy and safety</h2>
          <ul className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
            <li>• Name and birthday are processed locally for the current page session.</li>
            <li>• Generated cards are created on the device and are not uploaded by the app.</li>
            <li>• No account, advertising SDK, or personal-data profile is required.</li>
            <li>• The app is suitable for general audiences as an educational utility.</li>
          </ul>
          <Link to="/privacy" className="mt-6 inline-flex text-sm font-semibold text-primary hover:underline">Read the full privacy policy →</Link>
        </aside>
      </section>

      <section className="mt-16 border-t border-border pt-10">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-foreground">Store screenshots</p>
            <h2 className="mt-2 font-display text-3xl">Show the experience clearly</h2>
          </div>
          <p className="max-w-sm text-sm text-muted-foreground">These polished phone and wide-screen captures are already included in the installable app metadata.</p>
        </div>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {screenshots.map((screenshot) => (
            <figure key={screenshot.src} className="overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-card)]">
              <img src={screenshot.src} alt={screenshot.alt} loading="lazy" className="h-auto w-full" />
              <figcaption className="px-4 py-3 text-sm font-medium text-foreground">{screenshot.label}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="mt-16 grid gap-8 border-t border-border pt-10 md:grid-cols-2">
        <div>
          <h2 className="font-display text-3xl">Platform and age guidance</h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">Responsive browser app for modern Android, iPhone, iPad, Windows, macOS, Linux, and Chromebook browsers. Install support depends on the browser and operating system. Suggested store classification: Education or Utilities; general audience; no user-generated public content; no in-app purchases.</p>
        </div>
        <div>
          <h2 className="font-display text-3xl">Submission checklist</h2>
          <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted-foreground">
            <li>✓ App name, descriptions, developer identity, and screenshots prepared</li>
            <li>✓ Privacy policy: <span className="text-foreground">https://apptastic-boost.lovable.app/privacy</span></li>
            <li>✓ Installable web app and offline shell configured</li>
            <li>□ Add your verified support email and store account details</li>
            <li>□ Complete the Play Console and App Store Connect questionnaires</li>
            <li>□ Submit platform-specific packages or web-install listing, as applicable</li>
          </ul>
        </div>
      </section>

      <div className="mt-12 flex flex-wrap gap-3">
        <Link to="/app" className="inline-flex h-12 items-center rounded-lg px-6 text-sm font-semibold text-primary-foreground" style={{ background: "var(--gradient-hero)" }}>Open the app</Link>
        <Link to="/version-history" className="inline-flex h-12 items-center rounded-lg border border-border bg-card px-6 text-sm font-medium text-foreground hover:bg-secondary">See version history</Link>
      </div>
    </article>
  );
}