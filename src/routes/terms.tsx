import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Use — Ramanujan Magic Square" },
      { name: "description", content: "Terms of use for the Ramanujan Magic Square app by CodeTech." },
      { property: "og:title", content: "Terms of Use" },
      { property: "og:description", content: "Terms of use for the Ramanujan Magic Square app." },
      { property: "og:url", content: "https://apptastic-boost.lovable.app/terms" },
    ],
    links: [{ rel: "canonical", href: "https://apptastic-boost.lovable.app/terms" }],
  }),
  component: Terms,
});

function Terms() {
  return (
    <article className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-5xl">Terms of Use</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: June 15, 2026</p>
      <section className="mt-8 space-y-6 text-muted-foreground">
        <p>By using Ramanujan Magic Square ("the app"), you agree to use it for personal, educational, and non-commercial enjoyment. The app is provided "as is" without warranties of any kind.</p>
        <p>The mathematical content is based on the well-known construction popularized by Srinivasa Ramanujan. The app itself, its design, code, and brand assets are © {new Date().getFullYear()} CodeTech.</p>
        <p>You are free to share your generated PDF with friends and family. Redistribution of the app's source code, branding, or assets requires written permission from CodeTech.</p>
        <p>CodeTech and the lead developer, Sachin Sheth, are not liable for any losses or damages arising from use of the app.</p>
      </section>
    </article>
  );
}