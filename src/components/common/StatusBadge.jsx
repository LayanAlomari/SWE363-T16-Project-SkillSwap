// Colored label for request and account statuses.
// Same colors everywhere: Requests page, Dashboard, Admin > Manage Requests.
const STYLES = {
  Pending: "bg-yellow-100 text-yellow-800",
  Accepted: "bg-blue-100 text-blue-800",
  Completed: "bg-green-100 text-green-800",
  Rejected: "bg-red-100 text-red-800",
  Cancelled: "bg-stone-200 text-stone-700",
  Active: "bg-green-100 text-green-800",
  Suspended: "bg-red-100 text-red-800",
  Hidden: "bg-stone-200 text-stone-700",
};

export default function StatusBadge({ status }) {
  return (
    <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${STYLES[status] || "bg-stone-100 text-stone-700"}`}>
      {status}
    </span>
  );
}
