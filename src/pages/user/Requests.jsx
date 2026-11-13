import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Inbox, Send } from "lucide-react";
import PageLayout from "../../components/common/PageLayout";
import ConfirmModal from "../../components/common/ConfirmModal";
import Alert from "../../components/common/Alert";
import RequestCard from "../../components/user/RequestCard";
import RateModal from "../../components/user/RateModal";
import { useApp, AWAITING, CONFIRM_HOURS } from "../../context/AppContext";

const FILTERS = [
  ["all", "All"],
  ["Pending", "Pending"],
  ["Accepted", "Accepted"],
  ["Completed", "Completed"],
  ["closed", "Rejected / Cancelled"],
];
// Active requests first, then the newest
const STATUS_ORDER = { [AWAITING]: 0, Pending: 1, Accepted: 2, Completed: 3, Rejected: 4, Cancelled: 4 };
const creditsText = (n) => `${n} ${n === 1 ? "credit" : "credits"}`;

export default function Requests() {
  const { currentUser, requests, getService, getUser, acceptRequest, rejectRequest, cancelRequest, markDone, confirmDone, reportNotDone, addReview } =
    useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get("tab") === "sent" ? "sent" : "received"; // /requests?tab=sent opens the Sent tab
  const [filter, setFilter] = useState("all");
  const [confirm, setConfirm] = useState(null); // { action: "reject" | "cancel" | "markDone" | "confirmDone" | "notDone", request }
  const [rating, setRating] = useState(null); // request being rated
  const [justConfirmed, setJustConfirmed] = useState(false); // rating pop-up opened right after confirming
  const [message, setMessage] = useState(null); // { type, text }

  const me = currentUser.id;
  const received = requests.filter((r) => r.providerId === me);
  const sent = requests.filter((r) => r.seekerId === me);
  // Numbers on the tabs = requests waiting for you to do something
  const receivedToDo = received.filter((r) => ["Pending", "Accepted"].includes(r.status)).length;
  const sentToDo = sent.filter((r) => r.status === AWAITING || (r.status === "Completed" && !r.rated)).length;

  const shown = (tab === "sent" ? sent : received)
    .filter((r) =>
      filter === "all"
        ? true
        : filter === "closed"
          ? ["Rejected", "Cancelled"].includes(r.status)
          : filter === "Accepted"
            ? ["Accepted", AWAITING].includes(r.status) // includes sessions waiting for confirmation
            : r.status === filter
    )
    .sort((a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status] || b.date.localeCompare(a.date));

  function switchTab(next) {
    setSearchParams(next === "sent" ? { tab: "sent" } : {});
    setFilter("all");
    setMessage(null);
  }

  // Left / right arrow keys move between the two tabs
  function handleTabKey(e) {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      const next = tab === "received" ? "sent" : "received";
      switchTab(next);
      document.getElementById(`tab-${next}`)?.focus();
    }
  }

  function showResult(result) {
    setMessage(result.ok ? { type: "success", text: result.message } : { type: "error", text: result.error });
  }

  function handleConfirm() {
    const { action, request } = confirm;
    const run = { reject: rejectRequest, cancel: cancelRequest, markDone, confirmDone, notDone: reportNotDone }[action];
    const result = run(request.id);
    showResult(result);
    setConfirm(null);
    // After the student confirms the session, ask for a rating straight away (they can skip it)
    if (action === "confirmDone" && result.ok) {
      setJustConfirmed(true);
      setRating(request);
    }
  }

  function handleRate(stars, comment) {
    showResult(addReview(rating.id, stars, comment));
    setRating(null);
  }

  // Text of the confirmation pop-up for each action
  function confirmText({ action, request: r }) {
    const credits = creditsText(r.credits);
    const seeker = getUser(r.seekerId)?.name;
    const provider = getUser(r.providerId)?.name;
    if (action === "reject")
      return {
        title: "Reject this request?",
        message: `${seeker} won't be charged anything. This can't be undone.`,
        confirmLabel: "Reject",
        danger: true,
      };
    if (action === "markDone")
      return {
        title: "Mark this session as done?",
        message: `Only do this after the session has taken place. ${seeker} will be asked to confirm it. If they don't answer within ${CONFIRM_HOURS} hours, the ${credits} ${r.credits === 1 ? "is" : "are"} sent to you automatically.`,
        confirmLabel: "Mark as done",
      };
    if (action === "confirmDone")
      return {
        title: `Confirm your session with ${provider}?`,
        message: `The ${credits} held from your balance will be sent to ${provider}.`,
        confirmLabel: "Yes, confirm",
        cancelLabel: "Go back",
      };
    if (action === "notDone")
      return {
        title: "Session hasn't happened yet?",
        message: `No problem. It will go back to Accepted and your ${credits} ${r.credits === 1 ? "stays" : "stay"} held. You can message ${provider} to set a new time.`,
        confirmLabel: "Move back to Accepted",
        cancelLabel: "Go back",
      };
    return {
      title: "Cancel this request?",
      message:
        r.status === "Accepted"
          ? `The ${credits} held for this session will be returned to your balance.`
          : `${provider} hasn't responded yet, so no credits were taken.`,
      confirmLabel: "Cancel request",
      cancelLabel: "Keep request",
      danger: true,
    };
  }

  const tabs = [
    { id: "received", label: "Received", icon: Inbox, count: receivedToDo, hint: "requests waiting for you" },
    { id: "sent", label: "Sent", icon: Send, count: sentToDo, hint: "sessions to confirm or rate" },
  ];

  return (
    <PageLayout>
      <h1 className="text-3xl font-bold text-stone-900">Requests</h1>
      <p className="mt-1 text-stone-600">Manage the sessions other members requested from you, and the ones you requested.</p>

      {/* Tabs */}
      <div role="tablist" aria-label="Requests" className="mt-6 flex gap-2 border-b border-brand-light">
        {tabs.map(({ id, label, icon: Icon, count, hint }) => (
          <button
            key={id}
            id={`tab-${id}`}
            type="button"
            role="tab"
            aria-selected={tab === id}
            aria-controls="requests-panel"
            tabIndex={tab === id ? 0 : -1}
            onClick={() => switchTab(id)}
            onKeyDown={handleTabKey}
            className={`-mb-px flex items-center gap-2 border-b-2 px-4 py-3 font-semibold transition ${
              tab === id ? "border-brand text-brand" : "border-transparent text-stone-600 hover:text-brand"
            }`}
          >
            <Icon size={18} /> {label}
            {count > 0 && (
              <span className="rounded-full bg-brand px-2 text-xs text-white" aria-label={`${count} ${hint}`}>{count}</span>
            )}
          </button>
        ))}
      </div>

      <div id="requests-panel" role="tabpanel" aria-labelledby={`tab-${tab}`}>
        {/* Status filter */}
        <div className="mt-5 flex flex-wrap gap-2" aria-label="Filter by status">
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

        {message && (
          <div className="mt-5">
            <Alert type={message.type} onClose={() => setMessage(null)}>{message.text}</Alert>
          </div>
        )}

        {shown.length === 0 ? (
          <div className="mt-6 rounded-xl border border-dashed border-brand-light bg-cream p-10 text-center text-stone-600">
            {filter !== "all" ? (
              <p>No {FILTERS.find(([v]) => v === filter)[1].toLowerCase()} requests here.</p>
            ) : tab === "received" ? (
              <p>
                No one has requested your services yet.{" "}
                <Link to="/my-services" className="font-semibold text-brand hover:underline">Add a service</Link> so members can find you.
              </p>
            ) : (
              <p>
                You haven't requested any sessions yet.{" "}
                <Link to="/browse" className="font-semibold text-brand hover:underline">Browse services</Link> to find one.
              </p>
            )}
          </div>
        ) : (
          <ul className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
            {shown.map((r) => (
              <RequestCard
                key={r.id}
                request={r}
                view={tab}
                onAccept={(req) => showResult(acceptRequest(req.id))}
                onReject={(req) => setConfirm({ action: "reject", request: req })}
                onCancel={(req) => setConfirm({ action: "cancel", request: req })}
                onMarkDone={(req) => setConfirm({ action: "markDone", request: req })}
                onConfirm={(req) => setConfirm({ action: "confirmDone", request: req })}
                onNotDone={(req) => setConfirm({ action: "notDone", request: req })}
                onRate={(req) => {
                  setJustConfirmed(false);
                  setRating(req);
                }}
              />
            ))}
          </ul>
        )}
      </div>

      {confirm && <ConfirmModal {...confirmText(confirm)} onConfirm={handleConfirm} onCancel={() => setConfirm(null)} />}

      {rating && (
        <RateModal
          serviceTitle={getService(rating.serviceId)?.title}
          providerName={getUser(rating.providerId)?.name}
          onSubmit={handleRate}
          justConfirmed={justConfirmed}
          onCancel={() => setRating(null)}
        />
      )}
    </PageLayout>
  );
}
