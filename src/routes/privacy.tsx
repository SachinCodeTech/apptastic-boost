import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Ramanujan Magic Square" },
      { name: "description", content: "Privacy policy for the Ramanujan Magic Square app by CodeTech. We do not collect any personal data." },
      { property: "og:title", content: "Privacy Policy" },
      { property: "og:description", content: "How we handle your data — short answer: we don't collect any." },
      { property: "og:url", content: "https://apptastic-boost.lovable.app/privacy" },
    ],
    links: [{ rel: "canonical", href: "https://apptastic-boost.lovable.app/privacy" }],
  }),
  component: Privacy,
});

function Privacy() {
  return (
    <article className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-5xl">Privacy Policy</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: June 15, 2026</p>
      <section className="mt-8 space-y-6 text-muted-foreground">
        <div>
          <h2 className="font-display text-2xl text-foreground">Summary</h2>
          <p className="mt-2">Ramanujan Magic Square does not collect, store, or transmit any personal information. The name and birthday you enter stay entirely inside your browser and are used only to compute and display your magic square locally.</p>
        </div>
        <div>
          <h2 className="font-display text-2xl text-foreground">Data we collect</h2>
          <p className="mt-2">None. We do not use cookies, analytics, advertising SDKs, or any third-party services that profile users. There is no account system and no server-side database of users.</p>
        </div>
        <div>
          <h2 className="font-display text-2xl text-foreground">PDF export</h2>
          <p className="mt-2">When you tap "Share PDF", the document is generated entirely on your device and downloaded directly. It is never uploaded to a server.</p>
        </div>
        <div>
          <h2 className="font-display text-2xl text-foreground">Children's privacy</h2>
          <p className="mt-2">The app is safe for all ages. Because we collect no data, there are no special considerations for users under 13.</p>
        </div>
        <div>
          <h2 className="font-display text-2xl text-foreground">Contact</h2>
          <p className="mt-2">For questions, contact CodeTech — Lead Developer Sachin Sheth.</p>
        </div>
      </section>
    </article>
  );
}