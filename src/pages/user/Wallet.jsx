import { useState } from "react";
import { Link } from "react-router-dom";
import { Lock, Gift, ArrowDownLeft, ArrowUpRight, RotateCcw, ShieldCheck, Info, Clock } from "lucide-react";
import PageLayout from "../../components/common/PageLayout";
import { useApp, AWAITING } from "../../context/AppContext";

// How each type of transaction looks in the history
const TYPES = {
  earned: { label: "Earned", icon: ArrowDownLeft, style: "bg-green-100 text-green-700" },
  spent: { label: "Spent", icon: ArrowUpRight, style: "bg-red-100 text-red-700" },
  held: { label: "On hold", icon: Lock, style: "bg-blue-100 text-blue-700" },
  refunded: { label: "Refund", icon: RotateCcw, style: "bg-green-100 text-green-700" },
  welcome: { label: "Welcome", icon: Gift, style: "bg-brand-light text-brand" },
  admin: { label: "Adjustment", icon: ShieldCheck, style: "bg-stone-200 text-stone-700" },
};
// Each filter decides which entries it shows. Welcome credits count as earned;
// admin changes count as earned or spent depending on whether they add or take credits.
const FILTERS = [
  ["all", "All", () => true],
  ["earned", "Earned", (t) => ["earned", "welcome"].includes(t.type) || (t.type === "admin" && t.amount > 0)],
  ["spent", "Spent", (t) => t.type === "spent" || (t.type === "admin" && t.amount < 0)],
  ["held", "On hold", (t) => t.type === "held"],
  ["refunded", "Refunds", (t) => t.type === "refunded"],
];

const creditsText = (n) => `${n} ${Math.abs(n) === 1 ? "credit" : "credits"}`;
const monthOf = (iso) => new Date(iso + "T00:00:00").toLocaleDateString("en-US", { month: "long", year: "numeric" });
const dayOf = (iso) => new Date(iso + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" });

export default function Wallet() {
  const { currentUser, transactions, requests, settings } = useApp();
  const [filter, setFilter] = useState("all");
  const me = currentUser.id;

  // Credits held for my accepted sessions (not part of the balance until refunded)
  const onHold = requests
    .filter((r) => r.seekerId === me && ["Accepted", AWAITING].includes(r.status))
    .reduce((sum, r) => sum + r.credits, 0);

  const mine = transactions
    .filter((t) => t.userId === me)
    .sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id); // newest first


  const shown = mine.filter(FILTERS.find(([value]) => value === filter)[2]);

  // Group the history by month: [["November 2026", [...]], ["October 2026", [...]]]
  const groups = [];
  shown.forEach((t) => {
    const month = monthOf(t.date);
    const last = groups[groups.length - 1];
    if (last && last[0] === month) last[1].push(t);
    else groups.push([month, [t]]);
  });

  return (
    <PageLayout>
      <h1 className="text-3xl font-bold text-stone-900">Wallet</h1>
      <p className="mt-1 text-stone-600">Your Time Credits and everything that changed them.</p>

      {/* Balance */}
      <section aria-label="Your balance" className="mt-6 flex flex-col gap-4 rounded-xl bg-brand p-6 text-white sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/15">
            <Clock size={28} />
          </span>
          <div>
            <p className="text-sm font-semibold text-white/80">Your balance</p>
            <p className="text-4xl font-bold">
              {currentUser.credits} <span className="text-xl font-semibold">Time {currentUser.credits === 1 ? "Credit" : "Credits"}</span>
            </p>
          </div>
        </div>
        {onHold > 0 && (
          <p className="flex items-center gap-2 rounded-lg bg-white/15 px-4 py-2 text-sm font-semibold">
            <Lock size={16} /> {creditsText(onHold)} on hold for your accepted sessions
          </p>
        )}
      </section>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* History */}
        <section className="rounded-xl border border-brand-light bg-white p-4 sm:p-5 lg:col-span-2">
          <h2 className="text-xl font-bold text-stone-900">Credit history</h2>

          <div className="mt-4 flex flex-wrap gap-2" aria-label="Filter by type">
            {FILTERS.map(([value, label]) => (
              <button
                key={value}
                type="button"
                aria-pressed={filter === value}
                onClick={() => setFilter(value)}
                className={`rounded-full border px-3 py-1 text-sm font-semibold transition ${
                  filter === value ? "border-brand bg-brand text-white" : "border-brand-light text-stone-700 hover:border-brand"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {shown.length === 0 ? (
            <p className="mt-6 rounded-lg bg-cream p-6 text-center text-stone-600">Nothing here yet.</p>
          ) : (
            groups.map(([month, items]) => (
              <div key={month} className="mt-6">
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-stone-500">{month}</h3>
                <ul className="divide-y divide-brand-light rounded-lg border border-brand-light">
                  {items.map((t) => {
                    const type = TYPES[t.type] || TYPES.admin;
                    const Icon = type.icon;
                    return (
                      <li key={t.id} className="flex items-center gap-3 px-3 py-3 sm:px-4">
                        <span className={`hidden h-9 w-9 shrink-0 items-center justify-center rounded-full sm:flex ${type.style}`} aria-hidden="true">
                          <Icon size={18} />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-stone-900 sm:text-base">{t.description}</p>
                          <p className="text-xs text-stone-500">{type.label} · {dayOf(t.date)}</p>
                        </div>
                        <span className={`shrink-0 text-sm font-bold sm:text-base ${t.amount > 0 ? "text-green-700" : "text-red-700"}`}>
                          {t.amount > 0 ? "+" : "−"}{creditsText(Math.abs(t.amount))}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))
          )}
        </section>

        {/* How it works */}
        <aside className="h-fit rounded-xl border border-brand-light bg-cream p-5">
          <h2 className="flex items-center gap-2 text-lg font-bold text-stone-900">
            <Info size={18} className="text-brand" /> How Time Credits work
          </h2>
          <ol className="mt-3 flex flex-col gap-3 text-sm text-stone-700">
            <li><span className="font-semibold text-stone-900">1 hour = {settings.creditsPerHour} {settings.creditsPerHour === 1 ? "credit" : "credits"}.</span> Every member starts with {settings.welcomeCredits} welcome credits.</li>
            <li><span className="font-semibold text-stone-900">Request a session:</span> nothing is taken yet.</li>
            <li><span className="font-semibold text-stone-900">It's accepted:</span> the credits are put on hold, so you can't spend them twice.</li>
            <li><span className="font-semibold text-stone-900">You confirm it took place:</span> the credits go to the teacher.</li>
            <li><span className="font-semibold text-stone-900">Cancelled or rejected:</span> held credits come back to you.</li>
          </ol>
          <p className="mt-4 text-sm text-stone-700">
            Teach a skill to earn credits. <Link to="/my-services" className="font-semibold text-brand hover:underline">Go to My Services →</Link>
          </p>
        </aside>
      </div>
    </PageLayout>
  );
}
