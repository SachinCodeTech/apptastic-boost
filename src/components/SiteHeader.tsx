import { Link } from "@tanstack/react-router";
import { useState } from "react";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-md pt-[env(safe-area-inset-top)]">
      <div className="mx-auto grid h-16 max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 sm:h-16 sm:px-6">
        <Link to="/" onClick={() => setOpen(false)} className="flex min-w-0 items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground font-display text-xl shadow-sm sm:h-10 sm:w-10 sm:text-lg">
            R
          </span>
          <span className="truncate font-display text-xl leading-none sm:text-xl">Ramanujan Square</span>
        </Link>
        <div className="flex items-center gap-2">
          <nav className="hidden items-center gap-6 text-sm text-muted-foreground sm:flex">
            <Link to="/app" activeProps={{ className: "text-foreground" }} className="hover:text-foreground transition-colors">App</Link>
            <Link to="/about" activeProps={{ className: "text-foreground" }} className="hover:text-foreground transition-colors">About</Link>
            <Link to="/privacy" activeProps={{ className: "text-foreground" }} className="hover:text-foreground transition-colors">Privacy</Link>
            <Link to="/store-listing" activeProps={{ className: "text-foreground" }} className="hover:text-foreground transition-colors">Store</Link>
          </nav>
          <Link
            to="/app"
            className="hidden sm:inline-flex h-9 items-center rounded-md px-4 text-sm font-medium text-primary-foreground shadow-sm transition-transform hover:-translate-y-0.5"
            style={{ background: "var(--gradient-hero)" }}
          >
            Launch
          </Link>
          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen(v => !v)}
            className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-border bg-card sm:hidden"
          >
            <span className="relative block h-3 w-4">
              <span className={"absolute left-0 h-0.5 w-4 bg-foreground transition-all " + (open ? "top-1.5 rotate-45" : "top-0")} />
              <span className={"absolute left-0 top-1.5 h-0.5 w-4 bg-foreground transition-opacity " + (open ? "opacity-0" : "opacity-100")} />
              <span className={"absolute left-0 h-0.5 w-4 bg-foreground transition-all " + (open ? "top-1.5 -rotate-45" : "top-3")} />
            </span>
          </button>
        </div>
      </div>
      {open && (
        <nav className="border-t border-border/60 bg-background sm:hidden">
          <div className="mx-auto flex max-w-6xl flex-col px-4 py-2 text-sm">
            {[
              { to: "/app", label: "Open App" },
              { to: "/about", label: "About" },
              { to: "/privacy", label: "Privacy" },
              { to: "/version-history", label: "Version history" },
              { to: "/store-listing", label: "Store listing" },
              { to: "/terms", label: "Terms" },
            ].map(l => (
              <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="rounded-md px-3 py-3 text-foreground hover:bg-secondary">
                {l.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}