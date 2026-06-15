import { Link } from "@tanstack/react-router";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg text-primary-foreground font-display text-lg" style={{ background: "var(--gradient-hero)" }}>
            R
          </span>
          <span className="font-display text-xl">Ramanujan Square</span>
        </Link>
        <nav className="hidden items-center gap-7 text-sm text-muted-foreground sm:flex">
          <Link to="/app" activeProps={{ className: "text-foreground" }} className="hover:text-foreground transition-colors">App</Link>
          <Link to="/about" activeProps={{ className: "text-foreground" }} className="hover:text-foreground transition-colors">About</Link>
          <Link to="/privacy" activeProps={{ className: "text-foreground" }} className="hover:text-foreground transition-colors">Privacy</Link>
        </nav>
        <Link
          to="/app"
          className="inline-flex h-9 items-center rounded-md px-4 text-sm font-medium text-primary-foreground shadow-sm transition-transform hover:-translate-y-0.5"
          style={{ background: "var(--gradient-hero)" }}
        >
          Launch
        </Link>
      </div>
    </header>
  );
}