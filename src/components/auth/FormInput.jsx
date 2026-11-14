// Label + brown input field (Figma design, with rounded corners like the rest of the app).
export default function FormInput({ label, id, type = "text", value, onChange, placeholder, autoComplete }) {
  return (
    <div className="mb-6">
      <label htmlFor={id} className="mb-2 block text-base font-semibold text-brand">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="w-full rounded-lg bg-brand px-4 py-2.5 font-medium text-white placeholder:text-white/70 focus:outline-none focus:ring-2 focus:ring-brand-light focus:ring-offset-2"
      />
    </div>
  );
}
