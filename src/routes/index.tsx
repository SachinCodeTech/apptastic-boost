import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ramanujan Magic Square — Generate yours from your birthday" },
      { name: "description", content: "A beautiful tribute to Srinivasa Ramanujan. Generate a personal 4×4 magic square from any date of birth. By CodeTech." },
      { property: "og:title", content: "Ramanujan Magic Square" },
      { property: "og:description", content: "Turn your birthday into a magical 4×4 number square." },
      { property: "og:url", content: "https://apptastic-boost.lovable.app/" },
    ],
    links: [{ rel: "canonical", href: "https://apptastic-boost.lovable.app/" }],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="relative overflow-hidden">
      {/* Hero */}
      <section className="relative mx-auto max-w-6xl px-4 pt-20 pb-24 sm:px-6 sm:pt-28 sm:pb-32">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 left-1/2 h-[480px] w-[480px] -translate-x-1/2 rounded-full opacity-30 blur-3xl"
          style={{ background: "var(--gradient-hero)" }}
        />
        <div className="relative text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Inspired by Srinivasa Ramanujan (1887–1920)
          </span>
          <h1 className="mt-6 font-display text-5xl leading-[1.05] tracking-tight text-foreground sm:text-7xl">
            Your birthday,<br />
            <em className="not-italic" style={{ backgroundImage: "var(--gradient-hero)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>
              as a magic square.
            </em>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base text-muted-foreground sm:text-lg">
            Enter any date of birth and watch a 4×4 grid appear where rows, columns,
            diagonals and 18 other patterns all sum to the same number.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/app"
              className="inline-flex h-12 items-center rounded-lg px-6 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
              style={{ background: "var(--gradient-hero)", boxShadow: "var(--shadow-elegant)" }}
            >
              Generate your square
            </Link>
            <Link
              to="/about"
              className="inline-flex h-12 items-center rounded-lg border border-border bg-card px-6 text-sm font-medium text-foreground hover:bg-secondary"
            >
              Learn the math
            </Link>
          </div>
        </div>

        {/* Preview card */}
        <div className="relative mx-auto mt-16 max-w-md">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
            <div className="mb-4 flex items-center justify-between">
              <p className="font-display text-lg">22-12-1887</p>
              <span className="rounded-full bg-accent/20 px-2 py-0.5 text-xs font-semibold text-foreground">Sum = 139</span>
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {[22,12,18,87, 88,17,9,25, 10,24,89,16, 19,86,23,11].map((n, i) => (
                <div
                  key={i}
                  className="flex aspect-square items-center justify-center rounded-md bg-secondary font-display text-lg text-foreground"
                >{n}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border/60 bg-secondary/30">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-20 sm:grid-cols-3 sm:px-6">
          {[
            { t: "21 hidden patterns", d: "Rows, columns, diagonals, corners, sub-squares — all sum to your birthday total." },
            { t: "Animated reveal", d: "Cycle through every pattern with smooth highlights, perfect for sharing in class." },
            { t: "Export as PDF", d: "Save your personalized square with a wish — ready to print, frame, or gift." },
          ].map(f => (
            <div key={f.t} className="rounded-xl border border-border bg-card p-6">
              <h3 className="font-display text-xl">{f.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6">
        <h2 className="font-display text-4xl sm:text-5xl">Try it with your birthday.</h2>
        <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
          No sign-up, no tracking. Just pure mathematics — running entirely in your browser.
        </p>
        <Link
          to="/app"
          className="mt-8 inline-flex h-12 items-center rounded-lg px-6 text-sm font-semibold text-primary-foreground"
          style={{ background: "var(--gradient-hero)", boxShadow: "var(--shadow-elegant)" }}
        >
          Open the app
        </Link>
      </section>
    </div>
  );
}
