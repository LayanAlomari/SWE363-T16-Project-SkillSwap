import { Link } from "react-router-dom";

function LoginRequired({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-5">
      <div className="relative w-full max-w-lg rounded-xl border border-brand-light bg-cream p-8 text-center shadow-xl">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-3 text-2xl font-bold text-brand hover:text-stone-900"
          aria-label="Close"
        >
          ×
        </button>

        <div className="text-5xl">🔒</div>

        <h2 className="mt-5 text-2xl font-bold text-stone-900 sm:text-3xl">
          Login Required
        </h2>

        <p className="mt-3 text-sm text-brand sm:text-base">
          Please log in or create an account to request a service.
        </p>

        <div className="mt-7 flex justify-center gap-3">
          <Link
            to="/login"
            className="rounded-full border border-brand px-6 py-3 text-sm font-semibold text-brand hover:bg-brand-light"
          >
            Log In
          </Link>

          <Link
            to="/register"
            className="rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white hover:bg-brand-dark"
          >
            Sign Up
          </Link>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-5 text-xs font-semibold text-brand underline"
        >
          Continue Exploring
        </button>
      </div>
    </div>
  );
}

export default LoginRequired;