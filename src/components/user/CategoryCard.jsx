function CategoryCard({ icon, title, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-[105px] flex-col items-center justify-center gap-2 rounded-xl border border-brand-light bg-cream px-3 py-4 text-center transition hover:-translate-y-1 hover:bg-brand-light focus:outline-none focus:ring-2 focus:ring-brand"
    >
      <span className="text-2xl" aria-hidden="true">
        {icon}
      </span>

      <span className="text-xs font-semibold text-stone-900 sm:text-sm">
        {title}
      </span>
    </button>
  );
}

export default CategoryCard;