import { Check } from "lucide-react";

// Grey checkbox (like the Figma design) that turns brown with a tick when checked.
export default function Checkbox({ label, checked, onChange }) {
  return (
    <label className="flex w-fit cursor-pointer items-center gap-2 text-sm font-semibold text-stone-900">
      <span className="relative flex h-5 w-5 items-center justify-center">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-stone-300 bg-stone-200 checked:border-brand checked:bg-brand focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
        />
        <Check size={14} strokeWidth={3} className="pointer-events-none absolute hidden text-white peer-checked:block" />
      </span>
      {label}
    </label>
  );
}
