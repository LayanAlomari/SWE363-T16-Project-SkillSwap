function SearchBar({ searchTerm, setSearchTerm }) {
  return (
    <div className="flex w-full items-center rounded-full border border-brand-light bg-white px-4 py-2">
      <input
        type="text"
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
        placeholder="Search for a skill or service..."
        className="w-full bg-transparent text-sm text-stone-900 outline-none placeholder:text-stone-500"
      />

      <span className="text-lg text-brand">⌕</span>
    </div>
  );
}

export default SearchBar;