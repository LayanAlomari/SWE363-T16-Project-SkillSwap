import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Clock, Coins, Star, Pencil, Trash2, Plus, Briefcase } from "lucide-react";
import PageLayout from "../../components/common/PageLayout";
import StatusBadge from "../../components/common/StatusBadge";
import ConfirmModal from "../../components/common/ConfirmModal";
import Alert from "../../components/common/Alert";
import ServiceForm from "../../components/user/ServiceForm";
import { useApp } from "../../context/AppContext";

export default function MyServices() {
  const { currentUser, services, requests, addService, editService, deleteService } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const [editing, setEditing] = useState(null); // null = form closed, "new" = adding, or the service being edited
  const [toDelete, setToDelete] = useState(null); // service waiting for delete confirmation
  const [message, setMessage] = useState(null); // { type: "success" | "error", text }

  // /my-services?new=1 opens the Add form
  useEffect(() => {
    if (searchParams.get("new")) {
      setEditing("new");
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const myServices = services.filter((s) => s.providerId === currentUser.id);
  const activeRequests = (serviceId) =>
    requests.filter((r) => r.serviceId === serviceId && ["Pending", "Accepted"].includes(r.status)).length;

  function showResult(result) {
    setMessage(result.ok ? { type: "success", text: result.message } : { type: "error", text: result.error });
  }

  function handleSave(data) {
    const result = editing === "new" ? addService(data) : editService(editing.id, data);
    showResult(result);
    if (result.ok) setEditing(null);
  }

  function handleDelete() {
    showResult(deleteService(toDelete.id));
    setToDelete(null);
  }

  return (
    <PageLayout>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-stone-900">My Services</h1>
          <p className="mt-1 text-stone-600">The skills you offer to other members. You earn 1 Time Credit for every hour you teach.</p>
        </div>
        <button
          type="button"
          onClick={() => setEditing("new")}
          className="flex items-center gap-2 rounded-lg bg-brand px-4 py-2 font-semibold text-white hover:bg-brand-dark"
        >
          <Plus size={18} /> Add service
        </button>
      </div>

      {message && (
        <div className="mt-6">
          <Alert type={message.type} onClose={() => setMessage(null)}>{message.text}</Alert>
        </div>
      )}

      {myServices.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-brand-light bg-cream p-10 text-center">
          <Briefcase size={36} className="mx-auto text-brand" />
          <h2 className="mt-3 text-lg font-bold text-stone-900">You haven't added any services yet</h2>
          <p className="mt-1 text-stone-600">Share a skill you're good at, and start earning Time Credits.</p>
          <button
            type="button"
            onClick={() => setEditing("new")}
            className="mt-5 rounded-lg bg-brand px-4 py-2 font-semibold text-white hover:bg-brand-dark"
          >
            Add your first service
          </button>
        </div>
      ) : (
        <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {myServices.map((s) => {
            const active = activeRequests(s.id);
            return (
              <li key={s.id} className="flex flex-col rounded-xl border border-brand-light bg-white p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wide text-brand">{s.category}</p>
                    <h2 className="mt-1 text-lg font-bold text-stone-900">{s.title}</h2>
                  </div>
                  {s.status !== "Active" && <StatusBadge status={s.status} />}
                </div>

                <p className="mt-2 line-clamp-3 text-sm text-stone-600">{s.description}</p>

                <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm text-stone-700">
                  <span className="flex items-center gap-1"><Clock size={15} className="text-brand" /> {s.durationHours} {s.durationHours === 1 ? "hour" : "hours"}</span>
                  <span className="flex items-center gap-1"><Coins size={15} className="text-brand" /> {s.credits} {s.credits === 1 ? "credit" : "credits"}</span>
                  <span className="flex items-center gap-1">
                    <Star size={15} className="text-brand" />
                    {s.reviewsCount > 0 ? `${s.rating.toFixed(1)} (${s.reviewsCount} ${s.reviewsCount === 1 ? "review" : "reviews"})` : "No reviews yet"}
                  </span>
                </div>

                {active > 0 && (
                  <Link to="/requests" className="mt-3 text-sm font-semibold text-yellow-800 hover:underline">
                    {active} active {active === 1 ? "request" : "requests"} →
                  </Link>
                )}

                <div className="mt-auto flex gap-2 pt-5">
                  <button
                    type="button"
                    onClick={() => setEditing(s)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg border-2 border-brand px-3 py-2 text-sm font-semibold text-brand hover:bg-brand-light"
                  >
                    <Pencil size={15} /> Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => setToDelete(s)}
                    disabled={active > 0}
                    title={active > 0 ? "Finish or reject its active requests before deleting it." : undefined}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg border-2 border-red-200 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent"
                  >
                    <Trash2 size={15} /> Delete
                  </button>
                </div>
                {active > 0 && (
                  <p className="mt-2 text-xs text-stone-500">You can delete it after its active requests are finished.</p>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {editing && (
        <ServiceForm
          service={editing === "new" ? null : editing}
          onSave={handleSave}
          onCancel={() => setEditing(null)}
        />
      )}

      {toDelete && (
        <ConfirmModal
          title="Delete this service?"
          message={`"${toDelete.title}" will be removed and other members won't be able to request it anymore.`}
          confirmLabel="Delete"
          danger
          onConfirm={handleDelete}
          onCancel={() => setToDelete(null)}
        />
      )}
    </PageLayout>
  );
}
