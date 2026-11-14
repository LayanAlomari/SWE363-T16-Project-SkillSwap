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
              ? "border-brand bg-brand text-white"
              : "border-stone-300 bg-cream text-brand hover:bg-brand-light"
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}

export default FilterBar;