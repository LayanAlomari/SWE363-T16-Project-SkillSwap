import { useState } from "react";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import AuthLayout from "../../components/auth/AuthLayout";
import FormInput from "../../components/auth/FormInput";
import { useApp } from "../../context/AppContext";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ForgotPassword() {
  const { users } = useApp();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (!EMAIL_PATTERN.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    const user = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    if (!user) {
      setError("No account uses this email.");
      return;
    }
    setError("");
    // No real email in this prototype: we show the "Check Your Email" screen
    // and a demo link that opens the Reset Password page.
    setSent(true);
  }

  return (
    <AuthLayout>
      <h1 className="mb-6 text-3xl font-bold text-stone-900">Forgot Your Password?</h1>

      {sent ? (
        // Screen 2: "Check Your Email"
        <div className="max-w-[780px]">
          <div className="rounded-xl border border-brand-light bg-cream px-6 py-8">
            <h2 className="mb-4 flex items-center gap-3 text-3xl font-bold text-stone-900">
              Check Your Email
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-600">
                <Check size={18} strokeWidth={3.5} className="text-white" />
              </span>
            </h2>
            <p className="font-semibold text-brand">
              Password reset instructions have been sent to your email.
            </p>
          </div>

          {/* Demo only: stands in for the link the user would get by email */}
          <Link
            to={`/reset-password?email=${encodeURIComponent(email.trim())}`}
            className="mt-4 inline-block font-semibold text-brand underline"
          >
            Open reset link (demo)
          </Link>

          <div className="mt-16">
            <Link to="/login" className="font-semibold text-stone-900 hover:text-brand hover:underline">
              ← Back to Login
            </Link>
          </div>
        </div>
      ) : (
        // Screen 1: enter email
        <form onSubmit={handleSubmit} noValidate className="w-full max-w-[1000px]">
          <p className="mb-12 text-lg font-semibold text-brand">
            Enter your registered email and we'll send you instructions to reset your password.
          </p>

          <div className="max-w-[720px]">
            <FormInput label="Email Address" id="email" type="email" value={email} onChange={setEmail} autoComplete="email" />
          </div>
          <p className={`-mt-3 ml-1 text-sm font-semibold ${error ? "text-red-600" : "text-stone-600"}`}>
            {error || "Please enter a valid email address"}
          </p>

          <div className="mt-20 flex flex-col-reverse gap-6 sm:flex-row sm:items-center sm:justify-between">
            <Link to="/login" className="font-semibold text-stone-900 hover:text-brand hover:underline">
              ← Back to Login
            </Link>
            <button
              type="submit"
              className="w-full rounded-full bg-brand px-6 py-2.5 text-lg font-semibold text-white hover:bg-brand-dark sm:w-auto"
            >
              Send Reset Link
            </button>
          </div>
        </form>
      )}
    </AuthLayout>
  );
}
