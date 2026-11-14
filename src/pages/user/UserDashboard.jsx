import { Link } from "react-router-dom";
import { Clock, Lock, Briefcase, CheckCircle2, Bell, Star, ArrowRight, GraduationCap, BookOpen } from "lucide-react";
import PageLayout from "../../components/common/PageLayout";
import StatusBadge from "../../components/common/StatusBadge";
import { useApp, AWAITING } from "../../context/AppContext";

const byNewest = (a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0);
const formatAmount = (n) => `${n > 0 ? "+" : ""}${n} ${Math.abs(n) === 1 ? "credit" : "credits"}`;

// Small summary card (balance, on hold, ...). Becomes a link when "to" is given.
function StatCard({ icon: Icon, label, value, hint, to }) {
  const content = (
    <>
      <div className="flex items-center gap-2 text-sm font-semibold text-stone-600">
        <Icon size={18} className="text-brand" /> {label}
      </div>
      <p className="mt-2 text-3xl font-bold text-brand">{value}</p>
      {hint && <p className="mt-1 text-xs text-stone-500">{hint}</p>}
    </>
  );
  const style = "block rounded-xl border border-brand-light bg-cream p-5";
  return to ? (
    <Link to={to} className={`${style} transition hover:border-brand`}>{content}</Link>
  ) : (
    <div className={style}>{content}</div>
  );
}

// One list of current sessions: the ones I teach, or the ones I booked
function SessionGroup({ icon: Icon, title, subtitle, items, providing, emptyText }) {
  const { getUser, getService } = useApp();
  return (
    <div className={`rounded-lg border-l-4 p-4 ${providing ? "border-brand bg-cream" : "border-stone-400 bg-stone-50"}`}>
      <div className="mb-2 flex items-center gap-2">
        <Icon size={20} className={providing ? "text-brand" : "text-stone-600"} />
        <h3 className="font-bold text-stone-900">{title}</h3>
        <span className="rounded-full bg-white px-2 text-sm font-semibold text-stone-600">{items.length}</span>
      </div>
      <p className="mb-2 text-sm text-stone-600">{subtitle}</p>

      {items.length === 0 ? (
        <p className="py-2 text-sm text-stone-500">{emptyText}</p>
      ) : (
        <ul className="divide-y divide-brand-light">
          {items.map((r) => {
            const other = getUser(providing ? r.seekerId : r.providerId);
            return (
              <li key={r.id} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:gap-3">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-stone-900">{getService(r.serviceId)?.title}</p>
                  <p className="text-sm text-stone-600">
                    {providing ? `Student: ${other?.name}` : `Teacher: ${other?.name}`} · {r.sessionTime}
                  </p>
                </div>
                <div>
                  <StatusBadge status={r.status} />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default function UserDashboard() {
  const { currentUser, requests, services, transactions, getUser, getService } = useApp();
  const me = currentUser.id;
  const firstName = currentUser.name.split(" ")[0];

  // ----- Numbers for the summary cards -----
  const myServices = services.filter((s) => s.providerId === me);
  const onHold = requests
    .filter((r) => r.seekerId === me && ["Accepted", AWAITING].includes(r.status))
    .reduce((sum, r) => sum + r.credits, 0);
  const completedCount = requests.filter(
    (r) => r.status === "Completed" && (r.providerId === me || r.seekerId === me)
  ).length;

  // ----- Lists -----
  const waitingForMe = requests.filter((r) => r.providerId === me && r.status === "Pending");
  const toRate = requests.filter((r) => r.seekerId === me && r.status === "Completed" && !r.rated);
  const toConfirm = requests.filter((r) => r.seekerId === me && r.status === AWAITING);
  const isCurrent = (r) => ["Pending", "Accepted", AWAITING].includes(r.status);
  const teaching = requests.filter((r) => r.providerId === me && isCurrent(r)).sort(byNewest);
  const booked = requests.filter((r) => r.seekerId === me && isCurrent(r)).sort(byNewest);
  const recentActivity = transactions.filter((t) => t.userId === me).sort(byNewest).slice(0, 4);

  return (
    <PageLayout>
      {/* Welcome */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-stone-900">Welcome back, {firstName}</h1>
          <p className="mt-1 text-stone-600">Here's what's happening with your skill exchanges.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link to="/browse" className="rounded-lg border-2 border-brand px-4 py-2 font-semibold text-brand hover:bg-brand-light">
            Browse services
          </Link>
          <Link to="/my-services?new=1" className="rounded-lg bg-brand px-4 py-2 font-semibold text-white hover:bg-brand-dark">
            + Offer a service
          </Link>
        </div>
      </div>

      {/* Needs your attention */}
      {(waitingForMe.length > 0 || toRate.length > 0 || toConfirm.length > 0) && (
        <section aria-label="Needs your attention" className="mt-6 flex flex-col gap-3">
          {waitingForMe.length > 0 && (
            <Link
              to="/requests"
              className="flex items-center gap-3 rounded-xl border border-yellow-300 bg-yellow-50 p-4 text-yellow-900 hover:border-yellow-500"
            >
              <Bell size={20} className="shrink-0" />
              <span className="flex-1 font-semibold">
                You have {waitingForMe.length} new request{waitingForMe.length > 1 ? "s" : ""} waiting for your response.
              </span>
              <ArrowRight size={18} />
            </Link>
          )}
          {toConfirm.map((r) => (
            <Link
              key={r.id}
              to="/requests?tab=sent"
              className="flex items-center gap-3 rounded-xl border border-brand-light bg-cream p-4 text-stone-800 hover:border-brand"
            >
              <CheckCircle2 size={20} className="shrink-0 text-brand" />
              <span className="flex-1 font-semibold">
                {getUser(r.providerId)?.name} marked "{getService(r.serviceId)?.title}" as done. Please confirm it.
              </span>
              <ArrowRight size={18} />
            </Link>
          ))}
          {toRate.map((r) => (
            <Link
              key={r.id}
              to="/requests?tab=sent"
              className="flex items-center gap-3 rounded-xl border border-brand-light bg-cream p-4 text-stone-800 hover:border-brand"
            >
              <Star size={20} className="shrink-0 text-brand" />
              <span className="flex-1 font-semibold">
                Rate your session "{getService(r.serviceId)?.title}" with {getUser(r.providerId)?.name}.
              </span>
              <ArrowRight size={18} />
            </Link>
          ))}
        </section>
      )}

      {/* Summary cards */}
      <section aria-label="Summary" className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <StatCard icon={Clock} label="Available credits" value={currentUser.credits} hint="View wallet" to="/wallet" />
        <StatCard icon={Lock} label="On hold" value={onHold} hint="Held for your accepted requests" />
        <StatCard icon={Briefcase} label="Services offered" value={myServices.length} hint="Manage services" to="/my-services" />
        <StatCard icon={CheckCircle2} label="Sessions completed" value={completedCount} />
      </section>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Current requests */}
        <section className="rounded-xl border border-brand-light p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-xl font-bold text-stone-900">Current sessions</h2>
            <Link to="/requests" className="text-sm font-semibold text-brand hover:underline">View all →</Link>
          </div>

          <div className="flex flex-col gap-4">
            <SessionGroup
              icon={GraduationCap}
              title="Sessions I'm teaching"
              subtitle="Other members requested your services."
              items={teaching}
              providing
              emptyText="No one has requested your services right now."
            />
            <SessionGroup
              icon={BookOpen}
              title="Sessions I booked"
              subtitle="Services you requested from other members."
              items={booked}
              providing={false}
              emptyText="You haven't booked any sessions. Browse services to find one."
            />
          </div>
        </section>

        {/* Recent credit activity */}
        <section className="rounded-xl border border-brand-light p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-xl font-bold text-stone-900">Recent activity</h2>
            <Link to="/wallet" className="text-sm font-semibold text-brand hover:underline">Wallet →</Link>
          </div>

          {recentActivity.length === 0 ? (
            <p className="text-sm text-stone-600">No credit activity yet.</p>
          ) : (
            <ul className="flex flex-col gap-3">
              {recentActivity.map((t) => (
                <li key={t.id} className="flex items-start justify-between gap-3 text-sm">
                  <div className="min-w-0">
                    <p className="font-medium text-stone-800">{t.description}</p>
                    <p className="text-xs text-stone-500">{t.date}</p>
                  </div>
                  <span className={`shrink-0 font-bold ${t.amount > 0 ? "text-green-700" : "text-red-700"}`}>
                    {formatAmount(t.amount)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </PageLayout>
  );
}
