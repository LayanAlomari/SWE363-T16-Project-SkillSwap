function SearchBar({ searchTerm, setSearchTerm }) {
  return (
    <div className="flex w-full items-center rounded-full border border-[#5b4a42] bg-white px-4 py-2">
      <input
        type="text"
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
        placeholder="Search for a skill or service..."
        className="w-full bg-transparent text-sm text-[#2f211b] outline-none placeholder:text-[#927d70]"
      />

      <span className="text-lg text-[#63351f]">⌕</span>
    </div>
  );
}

export default SearchBar;