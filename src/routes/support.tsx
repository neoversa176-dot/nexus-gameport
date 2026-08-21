import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { LifeBuoy, MessagesSquare, Send, Shield, Wallet } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/support")({
  head: () => ({
    meta: [
      { title: "GameVault support — 24/7 human help" },
      {
        name: "description",
        content: "Get help with orders, disputes, payouts and account security. GameVault support answers in a median of 11 minutes, around the clock.",
      },
      { property: "og:title", content: "GameVault support" },
      { property: "og:description", content: "Order help, disputes, payouts and account security — answered by humans 24/7." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SupportPage,
});

const TOPICS = [
  { icon: Shield, t: "Order dispute", d: "Delivery didn't match the listing? Escalate to our resolution team." },
  { icon: Wallet, t: "Payments & payouts", d: "Wallet top-ups, refunds, payout timing and fee questions." },
  { icon: MessagesSquare, t: "Seller & buyer chat", d: "Report a message, unblock a chat or recover order history." },
  { icon: LifeBuoy, t: "Account security", d: "Recover access, enable 2FA or review suspicious sign-ins." },
];

function SupportPage() {
  const [topic, setTopic] = useState(TOPICS[0]!.t);
  const [message, setMessage] = useState("");

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-bold sm:text-5xl">
        Support that <span className="gradient-text">answers</span>
      </h1>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
        Real people, 24/7, median first reply in 11 minutes. Pick a topic and we'll route you to the right specialist.
      </p>

      <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="grid gap-3 sm:grid-cols-2">
          {TOPICS.map((t) => (
            <button
              key={t.t}
              onClick={() => setTopic(t.t)}
              aria-pressed={topic === t.t}
              className={`rounded-3xl border p-5 text-left transition-all ${
                topic === t.t ? "border-primary bg-card shadow-[var(--shadow-glow)]" : "border-glass bg-card hover:border-primary/40"
              }`}
            >
              <span className="grid h-10 w-10 place-items-center rounded-2xl border border-glass bg-elevated text-primary-glow">
                <t.icon className="h-5 w-5" />
              </span>
              <h2 className="mt-3 font-display text-sm font-bold">{t.t}</h2>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{t.d}</p>
            </button>
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            toast.success("Ticket opened", { description: `${topic} · a specialist will reply in chat shortly.` });
            setMessage("");
          }}
          className="rounded-3xl border border-glass bg-card p-6"
        >
          <h2 className="font-display text-lg font-bold">Open a ticket</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Topic: <span className="font-medium text-foreground">{topic}</span>
          </p>
          <label className="mt-5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground" htmlFor="msg">
            What's going on?
          </label>
          <textarea
            id="msg"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={6}
            required
            placeholder="Share the order ID and what happened…"
            className="mt-2 w-full resize-y rounded-2xl border border-glass bg-elevated p-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary/60"
          />
          <button
            type="submit"
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[image:var(--gradient-primary)] px-5 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.03]"
          >
            <Send className="h-4 w-4" /> Send to support
          </button>
        </form>
      </div>
    </div>
  );
}
