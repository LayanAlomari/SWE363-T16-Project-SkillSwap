import { useEffect, useState } from "react";
import { X } from "lucide-react";

// Box for adding several items (skills, languages) as tags.
// - suggestions: list shown under the box, filtered as you type
// - allowCustom = true: you can also add your own words (skills)
// - allowCustom = false: only items from the list can be added (languages)
// Keyboard: ↓ / ↑ to move in the list, Enter to add, Backspace in an empty box removes the last tag.
export default function TagInput({ id, label, tags, onChange, placeholder, suggestions = [], allowCustom = true, max = 10 }) {
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1); // highlighted suggestion (-1 = none)
  const listId = `${id}-list`;

  const typed = text.trim().toLowerCase();
  const isChosen = (s) => tags.some((t) => t.toLowerCase() === s.toLowerCase());
  const matches = suggestions.filter((s) => !isChosen(s) && s.toLowerCase().includes(typed));

  // Keep the highlighted suggestion visible when moving with the arrow keys
  useEffect(() => {
    if (open && active >= 0) document.getElementById(`${listId}-${active}`)?.scrollIntoView({ block: "nearest" });
  }, [open, active, listId]);

  function add(raw) {
    const value = raw.trim().replace(/,$/, "");
    if (!value) return;
    const known = suggestions.find((s) => s.toLowerCase() === value.toLowerCase());
    if (!allowCustom && !known) return setError("Please choose from the list.");
    const item = known || value; // use the list's spelling when it matches
    if (item.length > 30) return setError("Each item can be at most 30 characters.");
    if (isChosen(item)) return setError(`"${item}" is already added.`);
    if (tags.length >= max) return setError(`You can add up to ${max} items.`);
    onChange([...tags, item]);
    setText("");
    setError("");
    setActive(allowCustom ? -1 : 0);
    setOpen(false); // close the list so it doesn't cover the next field; typing opens it again
  }

  function handleKeyDown(e) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActive((a) => Math.min(a + 1, matches.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, allowCustom ? -1 : 0));
    } else if (e.key === "Enter" || e.key === ",") {
      e.preventDefault(); // don't submit the form
      add(open && active >= 0 && matches[active] ? matches[active] : text);
    } else if (e.key === "Escape" && open) {
      e.stopPropagation();
      setOpen(false);
    } else if (e.key === "Backspace" && !text && tags.length) {
      onChange(tags.slice(0, -1));
    }
  }

  const hint = allowCustom ? "Pick a suggestion or type your own, then press Enter." : "Search and pick from the list.";

  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-semibold text-stone-800">{label}</label>
      <div className="relative">
        <div className="flex flex-wrap items-center gap-2 rounded-lg border border-stone-300 bg-white px-2 py-2 focus-within:ring-2 focus-within:ring-brand">
          {tags.map((tag) => (
            <span key={tag} className="flex items-center gap-1 rounded-full bg-brand-light py-1 pl-3 pr-1 text-sm font-semibold text-brand">
              {tag}
              <button
                type="button"
                onClick={() => onChange(tags.filter((t) => t !== tag))}
                aria-label={`Remove ${tag}`}
                className="rounded-full p-0.5 hover:bg-white"
              >
                <X size={14} />
              </button>
            </span>
          ))}
          <input
            id={id}
            role="combobox"
            aria-expanded={open}
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={open && active >= 0 ? `${listId}-${active}` : undefined}
            aria-describedby={`${id}-hint`}
            autoComplete="off"
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              setError("");
              setOpen(true);
              setActive(allowCustom ? -1 : 0);
            }}
            onFocus={() => setOpen(true)}
            onClick={() => setOpen(true)}
            onBlur={() => {
              setOpen(false);
              if (allowCustom) add(text); // leaving the box adds what was typed
              else setText("");
            }}
            onKeyDown={handleKeyDown}
            placeholder={tags.length ? "Add more…" : placeholder}
            className="min-w-[8rem] flex-1 px-1 py-1 focus:outline-none"
          />
        </div>

        {open && (matches.length > 0 || (!allowCustom && typed)) && (
          <ul
            id={listId}
            role="listbox"
            className="absolute z-10 mt-1 max-h-56 w-full overflow-y-auto rounded-lg border border-stone-200 bg-white py-1 shadow-lg"
          >
            {matches.length === 0 ? (
              <li className="px-3 py-2 text-sm text-stone-500">Nothing matches "{text.trim()}".</li>
            ) : (
              matches.map((s, i) => (
                <li
                  key={s}
                  id={`${listId}-${i}`}
                  role="option"
                  aria-selected={i === active}
                  onMouseDown={(e) => e.preventDefault()} // keep focus in the box so the click registers
                  onClick={() => add(s)}
                  onMouseEnter={() => setActive(i)}
                  className={`cursor-pointer px-3 py-2 text-sm ${i === active ? "bg-cream text-brand" : "text-stone-800"}`}
                >
                  {s}
                </li>
              ))
            )}
          </ul>
        )}
      </div>
      <p id={`${id}-hint`} className={`mt-1 text-xs ${error ? "text-red-700" : "text-stone-500"}`} role={error ? "alert" : undefined}>
        {error || hint}
      </p>
    </div>
  );
}
