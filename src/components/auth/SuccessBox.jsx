import { CheckCircle2 } from "lucide-react";

// Confirmation card shown after a successful action (account created, password reset).
export default function SuccessBox({ title, message }) {
  return (
    <div className="mx-auto max-w-[720px] rounded-xl border border-brand-light bg-cream px-6 py-8 text-center">
      <CheckCircle2 className="mx-auto mb-3 fill-green-600 text-white" size={48} />
      <h2 className="mb-3 text-2xl font-bold text-stone-900">{title}</h2>
      <p className="font-semibold leading-relaxed text-brand">{message}</p>
    </div>
  );
}
