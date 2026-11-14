import { Link } from "react-router-dom";

function ServiceCard({
  id,
  title,
  category,
  provider,
  credits,
  rating,
}) {
  return (
    <article className="flex min-h-[170px] flex-col justify-between rounded-xl border border-[#5b4a42] bg-[#fffaf7] p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div>
        <div className="mb-3 flex items-start justify-between gap-3">
          <span className="rounded-full bg-[#ead7ca] px-2 py-1 text-[10px] font-semibold text-[#63351f]">
            {category}
          </span>

          <span className="text-xs text-[#63351f]">
            ⭐ {rating || "4.5"}
          </span>
        </div>

        <h3 className="text-sm font-bold text-[#2f211b] sm:text-base">
          {title}
        </h3>

        <p className="mt-2 text-xs text-[#705d52]">
          By {provider}
        </p>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <span className="text-xs font-semibold text-[#63351f]">
          {credits} Credits
        </span>

        <Link
          to={`/services/${id}`}
          className="rounded-full bg-[#63351f] px-3 py-2 text-[10px] font-semibold text-white transition hover:bg-[#4e2818] sm:text-xs"
        >
          View Details
        </Link>
      </div>
    </article>
  );
}

export default ServiceCard;