import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-secondary/40 pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-2 sm:px-6 sm:py-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-primary-foreground font-display" style={{ background: "var(--gradient-hero)" }}>R</span>
            <span className="truncate font-display text-lg">Ramanujan Magic Square</span>
          </div>
          <p className="mt-3 max-w-sm text-sm text-muted-foreground">
            A tribute to Srinivasa Ramanujan — turn any birthday into a personal 4×4 magic square.
          </p>
        </div>
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">Product</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/app" className="hover:text-foreground">Open App</Link></li>
            <li><Link to="/about" className="hover:text-foreground">About</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">Legal</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/privacy" className="hover:text-foreground">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-foreground">Terms of Use</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-1.5 px-4 py-5 text-center text-xs text-muted-foreground sm:flex-row sm:gap-2 sm:px-6 sm:text-left">
          <p>© {new Date().getFullYear()} CodeTech. All rights reserved.</p>
          <p>Lead Developer: <span className="text-foreground font-medium">Sachin Sheth</span></p>
        </div>
      </div>
    </footer>
  );
}