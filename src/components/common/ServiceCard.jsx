import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import { useApp } from "../../context/AppContext";

// Usage: <ServiceCard service={service} />
export default function ServiceCard({ service }) {
  const { getUser } = useApp();
  const provider = getUser(service.providerId);

  return (
    <article className="flex min-h-[170px] flex-col justify-between rounded-xl border border-stone-400 bg-cream p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div>
        <div className="mb-3 flex items-start justify-between gap-3">
          <span className="rounded-full bg-brand-light px-2 py-1 text-[10px] font-semibold text-brand">
            {service.category}
          </span>
          <span className="flex items-center gap-1 text-xs text-brand">
            <Star size={14} fill="currentColor" />
            {service.reviewsCount > 0 ? service.rating.toFixed(1) : "New"}
          </span>
        </div>
        <h3 className="text-sm font-bold text-stone-900 sm:text-base">{service.title}</h3>
        <p className="mt-2 text-xs text-stone-600">
          By <Link to={`/users/${service.providerId}`} className="hover:underline">{provider?.name}</Link>
        </p>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <span className="text-xs font-semibold text-brand">
          {service.credits} {service.credits === 1 ? "Credit" : "Credits"}
        </span>
        <Link
          to={`/services/${service.id}`}
          className="rounded-full bg-brand px-3 py-2 text-[10px] font-semibold text-white hover:bg-brand-dark sm:text-xs"
        >
          View Details
        </Link>
      </div>
    </article>
  );
}
