import { Check } from "lucide-react";

// Grey square checkbox (like the Figma design) that turns brown with a tick when checked.
export default function Checkbox({ label, checked, onChange }) {
  return (
    <label className="flex w-fit cursor-pointer items-center gap-2 text-base font-bold text-black">
      <span className="relative flex h-5 w-5 items-center justify-center">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="peer h-5 w-5 cursor-pointer appearance-none border border-stone-400 bg-[#d9d9d9] checked:border-[#533222] checked:bg-[#533222] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c99b84]"
        />
        <Check size={14} strokeWidth={3} className="pointer-events-none absolute hidden text-white peer-checked:block" />
      </span>
      {label}
    </label>
  );
}
