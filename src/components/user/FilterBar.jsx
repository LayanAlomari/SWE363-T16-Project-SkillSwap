import { useApp } from "../../context/AppContext";

function FilterBar({ selectedCategory, setSelectedCategory }) {
  const { categories: shared } = useApp();
  const categories = ["All Categories", ...shared.map((c) => c.name)];

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <button
          key={category}
          type="button"
          onClick={() => setSelectedCategory(category)}
          className={`rounded-full border px-3 py-2 text-xs transition ${
            selectedCategory === category
              ? "border-[#63351f] bg-[#63351f] text-white"
              : "border-[#8b7568] bg-[#fffaf7] text-[#63351f] hover:bg-[#ead7ca]"
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}

export default FilterBar;