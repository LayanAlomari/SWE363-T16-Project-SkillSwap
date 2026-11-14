import { Link } from "react-router-dom";
import { CalendarDays, Coins, Info, Check, X, Star, CheckCheck, MessageCircle, Video, MapPin } from "lucide-react";
import StatusBadge from "../common/StatusBadge";
import { useApp, AWAITING, confirmDeadline } from "../../context/AppContext";

const creditsText = (n) => `${n} ${n === 1 ? "credit" : "credits"}`;
const formatDeadline = (date) =>
  date.toLocaleString("en-US", { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });

// One request on the Requests page.
// view = "received" (someone requested my service) or "sent" (I requested someone's service)
export default function RequestCard({ request: r, view, onAccept, onReject, onCancel, onMarkDone, onConfirm, onNotDone, onRate }) {
  const { getService, getUser } = useApp();
  const received = view === "received";
  const service = getService(r.serviceId);
  const other = getUser(received ? r.seekerId : r.providerId);
  const firstName = other?.name.split(" ")[0];
  const credits = creditsText(r.credits);
  const isAre = r.credits === 1 ? "is" : "are";
  const deadline = r.status === AWAITING ? formatDeadline(confirmDeadline(r)) : "";

  // One line that explains what happens with the credits at this stage
  const notes = {
    received: {
      Pending: `Accepting will hold ${credits} from ${firstName} for this session.`,
      Accepted: r.notYet
        ? `${firstName} said the session hasn't happened yet. Message them to set a new time, then mark it as done again.`
        : `${credits} ${isAre} held from ${firstName}. After the session, mark it as done to get ${r.credits === 1 ? "it" : "them"}.`,
      [AWAITING]: `Waiting for ${firstName} to confirm. You'll get the ${credits} when they do, or automatically on ${deadline}.`,
      Completed: `You earned ${credits} for this session.`,
      Rejected: "You rejected this request. No credits were taken.",
      Cancelled: `${firstName} cancelled this request.`,
    },
    sent: {
      Pending: `Waiting for ${firstName} to respond. No credits have been taken yet.`,
      Accepted: `${credits} ${isAre} held from your balance for this session.`,
      [AWAITING]: `${firstName} marked this session as done. Please confirm it. If you don't answer by ${deadline}, it will be confirmed automatically.`,
      Completed: `You paid ${credits} for this session.`,
      Rejected: `${firstName} couldn't take this request. No credits were taken.`,
      Cancelled: "You cancelled this request. Any held credits were returned to you.",
    },
  };

  const canMessage = ["Pending", "Accepted", AWAITING].includes(r.status);
  // The meeting link and place are only needed while the session is still coming up
  const showPlace = canMessage;
  const safeLink = /^https?:\/\//i.test(r.meetingLink ?? "") ? r.meetingLink : "";
  const primary = "flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark";
  const danger = "flex items-center gap-2 rounded-lg border-2 border-red-200 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50";

  return (
    <li className={`flex flex-col rounded-xl border bg-white p-5 ${r.status === AWAITING && !received ? "border-brand" : "border-brand-light"}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-lg font-bold text-stone-900">{service?.title ?? "Deleted service"}</h3>
          <p className="text-sm text-stone-600">
            {received ? "Student" : "Teacher"}:{" "}
            <Link to={`/users/${other?.id}`} className="font-semibold text-brand hover:underline">{other?.name}</Link>
          </p>
        </div>
        <StatusBadge status={r.status} />
      </div>

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-stone-700">
        <span className="flex items-center gap-1"><CalendarDays size={15} className="text-brand" /> {r.sessionTime}</span>
        <span className="flex items-center gap-1"><Coins size={15} className="text-brand" /> {credits}</span>
        {r.sessionType === "Online" && (
          <span className="flex items-center gap-1">
            <Video size={15} className="text-brand" /> Online
            {showPlace && safeLink && (
              <>
                {" · "}
                <a href={safeLink} target="_blank" rel="noopener noreferrer" className="font-semibold text-brand underline underline-offset-2 hover:no-underline">
                  Meeting link
                </a>
              </>
            )}
          </span>
        )}
        {r.sessionType === "In-person" && (
          <span className="flex min-w-0 items-center gap-1">
            <MapPin size={15} className="shrink-0 text-brand" /> In person
            {showPlace && r.location && <span className="break-words">{` · ${r.location}`}</span>}
          </span>
        )}
      </div>

      {!received && r.status === AWAITING ? (
        // The student is asked a simple question instead of seeing a note
        <div className="mt-3 rounded-lg bg-cream p-4">
          <p className="font-semibold text-stone-900">Did your session with {firstName} take place?</p>
          <p className="mt-1 text-sm text-stone-600">
            {firstName} marked it as done. When you confirm, the {credits} {r.credits === 1 ? "goes" : "go"} to {firstName}. If you don't answer by {deadline}, it
            counts as yes.
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-4">
            <button type="button" onClick={() => onConfirm(r)} className={primary}><Check size={16} /> Yes, confirm</button>
            <button type="button" onClick={() => onNotDone(r)} className="text-sm font-semibold text-brand underline underline-offset-2 hover:no-underline">
              No
            </button>
          </div>
        </div>
      ) : (
        <p className="mt-3 flex items-start gap-2 text-sm text-stone-600">
          <Info size={16} className="mt-0.5 shrink-0 text-brand" /> {notes[view][r.status]}
        </p>
      )}

      {/* Bottom row: Message on the left, decision buttons on the right */}
      <div className="mt-auto flex flex-wrap items-center gap-2 pt-4">
        {canMessage && (
          <Link
            to={`/messages?with=${other?.id}`}
            className="flex items-center gap-2 rounded-lg border-2 border-brand px-4 py-2 text-sm font-semibold text-brand hover:bg-brand-light"
          >
            <MessageCircle size={16} /> Message
          </Link>
        )}
        <div className="ml-auto flex flex-wrap justify-end gap-2">
          {received && r.status === "Pending" && (
            <>
              <button type="button" onClick={() => onAccept(r)} className={primary}><Check size={16} /> Accept</button>
              <button type="button" onClick={() => onReject(r)} className={danger}><X size={16} /> Reject</button>
            </>
          )}
          {received && r.status === "Accepted" && (
            <button type="button" onClick={() => onMarkDone(r)} className={primary}><CheckCheck size={16} /> Mark as done</button>
          )}
          {!received && ["Pending", "Accepted"].includes(r.status) && (
            <button type="button" onClick={() => onCancel(r)} className={danger}><X size={16} /> Cancel request</button>
          )}
          {!received && r.status === "Completed" && !r.rated && (
            <button type="button" onClick={() => onRate(r)} className={primary}><Star size={16} /> Rate session</button>
          )}
        </div>
      </div>
    </li>
  );
}
