function CategoryCard({ icon, title, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-[105px] flex-col items-center justify-center gap-2 rounded-xl border border-[#5b4a42] bg-[#fffaf7] px-3 py-4 text-center transition hover:-translate-y-1 hover:bg-[#f4e7df] focus:outline-none focus:ring-2 focus:ring-[#63351f]"
    >
      <span className="text-2xl" aria-hidden="true">
        {icon}
      </span>

      <span className="text-xs font-semibold text-[#2f211b] sm:text-sm">
        {title}
      </span>
    </button>
  );
}

export default CategoryCard;