import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Ramanujan Magic Square" },
      { name: "description", content: "Learn how Ramanujan Magic Square handles names, birthdays, generated squares, downloads, and offline app data." },
      { property: "og:title", content: "Privacy Policy" },
      { property: "og:description", content: "How names, birthdays, generated squares, downloads, and offline app data are handled." },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "https://apptastic-boost.lovable.app/privacy" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "Privacy Policy" },
      { name: "twitter:description", content: "How we handle your data — short answer: we don't collect any." },
    ],
    links: [{ rel: "canonical", href: "https://apptastic-boost.lovable.app/privacy" }],
  }),
  component: Privacy,
});

function Privacy() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <header className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-foreground">CodeTech · Privacy</p>
        <h1 className="mt-3 font-display text-5xl leading-none sm:text-6xl">Privacy Policy</h1>
        <p className="mt-4 text-sm text-muted-foreground">Last updated: September 11, 2026</p>
        <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
          Ramanujan Magic Square is designed to work without an account, advertising profile, or personal-data collection system.
        </p>
      </header>

      <div className="mt-12 space-y-10 text-muted-foreground">
        <section>
          <h2 className="font-display text-3xl text-foreground">What happens when you generate a square</h2>
          <p className="mt-3 leading-relaxed">The name and birthday you enter are held in the page while you use the app. The birthday is split into day, month, century, and year values in your browser, then used to calculate and display the 4×4 magic square and its matching patterns. This calculation happens locally on your device.</p>
        </section>
        <section>
          <h2 className="font-display text-3xl text-foreground">What is stored</h2>
          <p className="mt-3 leading-relaxed">The app does not create an account or send your name, birthday, or square to CodeTech. The current page does not use local storage, session storage, or a personal-data database. Generated values and prepared share files exist in temporary page memory and are cleared when you clear the form or close the page.</p>
          <p className="mt-3 leading-relaxed">Your browser or operating system may keep files you choose to download, such as a PNG or PDF, in its own Downloads area. That storage is controlled by your device, not by this app.</p>
        </section>
        <section>
          <h2 className="font-display text-3xl text-foreground">Sharing and exports</h2>
          <p className="mt-3 leading-relaxed">When you choose Share PDF, Share Image, or a download fallback, the card is created on your device. If you use your operating system’s share sheet, the destination you select receives the file according to that service’s own privacy policy. CodeTech does not receive a copy through this app.</p>
        </section>
        <section>
          <h2 className="font-display text-3xl text-foreground">Offline use and technical data</h2>
          <p className="mt-3 leading-relaxed">The installable version caches the app shell and its published assets so the interface can open when you are offline. This cache contains app files, icons, and screenshots—not your name, birthday, or generated square. The hosting platform and your network provider may process standard technical request data when the app files are requested; CodeTech does not use this app to build a personal profile.</p>
        </section>
        <section>
          <h2 className="font-display text-3xl text-foreground">Children and age guidance</h2>
          <p className="mt-3 leading-relaxed">The app is an educational mathematics utility and contains no account, social feed, advertising, or in-app purchase flow. Parents and guardians should remember that anything shared through the device’s share sheet is handled by the selected service.</p>
        </section>
        <section>
          <h2 className="font-display text-3xl text-foreground">Changes and contact</h2>
          <p className="mt-3 leading-relaxed">If the app’s data practices change, this page will be updated before the change takes effect. Privacy questions can be directed to CodeTech, Lead Developer Sachin Sheth. A public support email has not been supplied for this listing yet, so the store submission should add the verified contact address you want customers to use.</p>
        </section>
      </div>
    </article>
  );
}