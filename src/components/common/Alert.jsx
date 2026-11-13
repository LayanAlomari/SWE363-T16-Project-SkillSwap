import { CheckCircle2, AlertCircle, X } from "lucide-react";

// Success or error message box (e.g. "Service added successfully.", "Not enough Time Credits.").
// Usage: <Alert type="error" onClose={() => setError("")}>{error}</Alert>
export default function Alert({ type = "success", children, onClose }) {
  if (!children) return null;
  const isError = type === "error";
  const Icon = isError ? AlertCircle : CheckCircle2;

  return (
    <div
      role={isError ? "alert" : "status"}
      className={`flex items-start gap-3 rounded-lg border px-4 py-3 text-sm font-semibold ${
        isError ? "border-red-200 bg-red-50 text-red-800" : "border-green-200 bg-green-50 text-green-800"
      }`}
    >
      <Icon size={18} className="mt-0.5 shrink-0" />
      <span className="flex-1">{children}</span>
      {onClose && (
        <button type="button" onClick={onClose} aria-label="Close message" className="opacity-70 hover:opacity-100">
          <X size={16} />
        </button>
      )}
    </div>
  );
}
