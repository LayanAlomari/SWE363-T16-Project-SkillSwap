// Label + dark brown input field (same colors as the Figma design).
export default function FormInput({ label, id, type = "text", value, onChange, placeholder, autoComplete }) {
  return (
    <div className="mb-8">
      <label htmlFor={id} className="mb-2 block text-xl font-bold text-[#533222]">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="w-full bg-[#533222] px-3 py-2 text-lg font-bold text-white placeholder:font-bold placeholder:text-white/80 focus:outline-none focus:ring-2 focus:ring-[#c99b84]"
      />
    </div>
  );
}
