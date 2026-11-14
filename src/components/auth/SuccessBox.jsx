import { CheckCircle2 } from "lucide-react";

// Confirmation card shown after a successful action (account created, password reset).
export default function SuccessBox({ title, message }) {
  return (
    <div className="mx-auto max-w-[720px] rounded-xl border border-black bg-[#fbf6f3] px-6 py-8 text-center">
      <CheckCircle2 className="mx-auto mb-3 text-white" fill="#2fa84f" size={48} />
      <h2 className="mb-4 text-3xl font-bold text-black">{title}</h2>
      <p className="text-lg font-bold leading-relaxed text-[#533222]">{message}</p>
    </div>
  );
}
