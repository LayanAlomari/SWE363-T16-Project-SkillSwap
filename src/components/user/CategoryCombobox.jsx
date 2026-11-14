import { useEffect, useState } from "react";
import { ChevronDown, Check } from "lucide-react";

// Category field you can type in: the list filters as you type, then you pick one.
// options = [{ name }]
// Keyboard: ↓ / ↑ to move, Enter to choose, Escape to close the list.
export default function CategoryCombobox({ id, options, value, onChange, invalid, describedBy }) {
  const [query, setQuery] = useState(value); // the text in the box
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0); // highlighted option
  const listId = `${id}-list`;

  // Show every category until the user types something different from the chosen one
  const typed = query.trim().toLowerCase();
  const matches =
    typed && query !== value
      ? options.filter((o) => o.name.toLowerCase().includes(typed))
      : options;

  // Keep the highlighted option visible when moving with the arrow keys
  useEffect(() => {
    if (open) document.getElementById(`${listId}-${active}`)?.scrollIntoView({ block: "nearest" });
  }, [open, active, listId]);

  // Open the list with the current category highlighted
  function openList() {
    if (open) return;
    setActive(Math.max(0, matches.findIndex((o) => o.name === value)));
    setOpen(true);
  }

  function choose(name) {
    onChange(name);
    setQuery(name);
    setOpen(false);
  }

  function handleType(text) {
    setQuery(text);
    setOpen(true);
    setActive(0);
    // Typing the full name counts as choosing it; anything else clears the choice
    const exact = options.find((o) => o.name.toLowerCase() === text.trim().toLowerCase());
    onChange(exact?.name || "");
  }

  function handleKeyDown(e) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!open) return openList();
      setActive((a) => Math.min(a + 1, matches.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter" && open && matches[active]) {
      e.preventDefault(); // choose the option instead of submitting the form
      choose(matches[active].name);
    } else if (e.key === "Escape" && open) {
      e.stopPropagation(); // close only the list, not the whole pop-up
      setOpen(false);
    }
  }

  return (
    <div className="relative">
      <input
        id={id}
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={open && matches[active] ? `${listId}-${active}` : undefined}
        aria-invalid={invalid}
        aria-describedby={describedBy}
        autoComplete="off"
        value={query}
        placeholder="Search categories"
        onChange={(e) => handleType(e.target.value)}
        onFocus={openList}
        onClick={openList}
        onBlur={() => setOpen(false)}
        onKeyDown={handleKeyDown}
        className={`w-full rounded-lg border bg-white py-2 pl-3 pr-9 focus:outline-none focus:ring-2 focus:ring-brand ${
          invalid ? "border-red-500" : "border-stone-300"
        }`}
      />
      <ChevronDown
        size={18}
        className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 transition ${open ? "rotate-180" : ""}`}
      />

      {open && (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-10 mt-1 max-h-56 w-full overflow-y-auto rounded-lg border border-stone-200 bg-white py-1 shadow-lg"
        >
          {matches.length === 0 ? (
            <li className="px-3 py-2 text-sm text-stone-500">Nothing matches "{query}". Choose "Other" if none fits.</li>
          ) : (
            matches.map((o, i) => (
              <li
                key={o.name}
                id={`${listId}-${i}`}
                role="option"
                aria-selected={o.name === value}
                onMouseDown={(e) => e.preventDefault()} // keep focus in the box so the click registers
                onClick={() => choose(o.name)}
                onMouseEnter={() => setActive(i)}
                className={`flex cursor-pointer items-center justify-between gap-2 px-3 py-2 text-sm ${
                  i === active ? "bg-cream text-brand" : "text-stone-800"
                } ${o.name === value ? "font-semibold" : ""}`}
              >
                {o.name}
                {o.name === value && <Check size={16} className="text-brand" />}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
