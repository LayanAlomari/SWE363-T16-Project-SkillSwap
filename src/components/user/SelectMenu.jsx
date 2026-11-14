import { useEffect, useState } from "react";
import { ChevronDown, Check } from "lucide-react";

// Styled dropdown list.
// options = [{ value, label }]. Keyboard: ↓ / ↑ to move, Enter or Space to choose, Escape to close.
export default function SelectMenu({ id, labelId, options, value, onChange }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0); // highlighted option
  const listId = `${id}-list`;
  const selectedIndex = Math.max(0, options.findIndex((o) => o.value === value));

  // Keep the highlighted option visible when moving with the arrow keys
  useEffect(() => {
    if (open) document.getElementById(`${listId}-${active}`)?.scrollIntoView({ block: "nearest" });
  }, [open, active, listId]);

  function openList() {
    setActive(selectedIndex);
    setOpen(true);
  }

  function choose(i) {
    onChange(options[i].value);
    setOpen(false);
  }

  function handleKeyDown(e) {
    if (!open) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
        e.preventDefault();
        openList();
      }
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, options.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      choose(active);
    } else if (e.key === "Escape") {
      e.stopPropagation(); // close only the list, not the whole pop-up
      setOpen(false);
    } else if (e.key === "Tab") {
      setOpen(false);
    }
  }

  return (
    <div className="relative">
      <button
        type="button"
        id={id}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-labelledby={`${labelId} ${id}`}
        aria-activedescendant={open ? `${listId}-${active}` : undefined}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={handleKeyDown}
        onBlur={() => setOpen(false)}
        className="w-full rounded-lg border border-stone-300 bg-white py-2 pl-3 pr-9 text-left focus:outline-none focus:ring-2 focus:ring-brand"
      >
        {options[selectedIndex]?.label}
      </button>
      <ChevronDown
        size={18}
        className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 transition ${open ? "rotate-180" : ""}`}
      />

      {open && (
        <ul
          id={listId}
          role="listbox"
          aria-labelledby={labelId}
          className="absolute z-10 mt-1 max-h-56 w-full overflow-y-auto rounded-lg border border-stone-200 bg-white py-1 shadow-lg"
        >
          {options.map((o, i) => (
            <li
              key={o.value}
              id={`${listId}-${i}`}
              role="option"
              aria-selected={o.value === value}
              onMouseDown={(e) => e.preventDefault()} // keep focus on the button so the click registers
              onClick={() => choose(i)}
              onMouseEnter={() => setActive(i)}
              className={`flex cursor-pointer items-center justify-between gap-2 px-3 py-2 text-sm ${
                i === active ? "bg-cream text-brand" : "text-stone-800"
              } ${o.value === value ? "font-semibold" : ""}`}
            >
              {o.label}
              {o.value === value && <Check size={16} className="text-brand" />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
