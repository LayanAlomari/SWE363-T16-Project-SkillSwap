import { Link } from "react-router-dom";

function LoginRequired() {
  return (
    <section className="mx-auto flex max-w-4xl flex-col items-center justify-center px-5 py-16 text-center">
      <div className="w-full rounded-xl border border-[#5b4a42] bg-[#fffaf7] px-5 py-10">
        <div className="mb-4 text-5xl">🔒</div>

        <h1 className="text-2xl font-bold text-[#1f1713] sm:text-3xl">
          Login Required
        </h1>

        <p className="mt-3 text-sm font-medium text-[#63351f]">
          Please log in or create an account to request a service.
        </p>
      </div>

      <div className="mt-5 flex gap-3">
        <Link
          to="/login"
          className="rounded-full border border-[#63351f] px-5 py-2 text-sm font-semibold text-[#63351f] hover:bg-[#ead7ca]"
        >
          Log In
        </Link>

        <Link
          to="/register"
          className="rounded-full bg-[#63351f] px-5 py-2 text-sm font-semibold text-white hover:bg-[#4e2818]"
        >
          Sign Up
        </Link>
      </div>

      <Link
        to="/browse"
        className="mt-5 text-xs font-semibold text-[#63351f] underline"
      >
        Want to keep exploring?
      </Link>
    </section>
  );
}

export default LoginRequired;