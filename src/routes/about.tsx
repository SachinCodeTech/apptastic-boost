import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Ramanujan Magic Square" },
      { name: "description", content: "About the Ramanujan Magic Square app by CodeTech, Lead Developer Sachin Sheth." },
      { property: "og:title", content: "About — Ramanujan Magic Square" },
      { property: "og:description", content: "Learn about the app, the math, and the team behind it." },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "https://apptastic-boost.lovable.app/about" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "About — Ramanujan Magic Square" },
      { name: "twitter:description", content: "Learn about the app, the math, and the team behind it." },
    ],
    links: [{ rel: "canonical", href: "https://apptastic-boost.lovable.app/about" }],
  }),
  component: About,
});

function About() {
  return (
    <article className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-5xl">About</h1>
      <p className="mt-6 text-lg text-muted-foreground">
        Ramanujan Magic Square is a tribute to the Indian mathematician Srinivasa Ramanujan,
        whose famous 4×4 magic square encoded his own birthday — 22-12-1887 — and summed to
        139 across more than two dozen patterns.
      </p>
      <h2 className="mt-12 font-display text-2xl">The math</h2>
      <p className="mt-3 text-muted-foreground">
        Given a date dd-mm-yyyy, we split the year into century (CC) and the last two
        digits (YY) and place them in the first row alongside the day and month. The remaining
        twelve cells are derived through small offsets so that every row, column, diagonal,
        2×2 sub-square, the four corners, and several other four-cell groupings sum to the
        same total: dd + mm + cc + yy.
      </p>
      <h2 className="mt-12 font-display text-2xl">The team</h2>
      <div className="mt-4 rounded-xl border border-border bg-card p-6">
        <p className="text-sm text-muted-foreground">Built by</p>
        <p className="mt-1 font-display text-2xl">CodeTech</p>
        <p className="mt-3 text-sm text-muted-foreground">Lead Developer</p>
        <p className="font-display text-xl">Sachin Sheth</p>
      </div>
      <div className="mt-12">
        <Link to="/app" className="inline-flex h-11 items-center rounded-lg px-5 text-sm font-semibold text-primary-foreground"
          style={{ background: "var(--gradient-hero)" }}>
          Try it now
        </Link>
      </div>
    </article>
  );
}