import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import AuthLayout from "../../components/auth/AuthLayout";
import FormInput from "../../components/auth/FormInput";
import Checkbox from "../../components/auth/Checkbox";
import { findUserByEmail } from "../../data/mockUsers";
import { useApp } from "../../context/AppContext";

export default function Login() {
  const navigate = useNavigate();
  const { login, currentUser } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Already logged in (and not in the middle of logging in): go to the right dashboard
  if (currentUser && !success) {
    return <Navigate to={currentUser.role === "admin" ? "/admin" : "/dashboard"} replace />;
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    const user = findUserByEmail(email);
    if (!user || user.password !== password) {
      setError("Invalid email or password.");
      return;
    }

    if (user.status === "Suspended") {
      setError("Your account has been suspended. Please contact the admin.");
      return;
    }

    setSuccess("Login successful! Welcome back to Skill Swap.");
    login({ ...user, rememberMe });

    // Admins go to the Admin Dashboard, regular users go to the User Dashboard
    setTimeout(() => navigate(user.role === "admin" ? "/admin" : "/dashboard"), 1200);
  }

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit} noValidate className="flex flex-col">
        <h1 className="mb-6 text-3xl font-bold text-stone-900">Welcome Back</h1>

        <div className="w-full max-w-[720px]">
          <FormInput label="Email Address" id="email" type="email" value={email} onChange={setEmail} placeholder="Fatimah@example.com" autoComplete="email" />

          <div className="-mb-4">
            <FormInput label="Password" id="password" type="password" value={password} onChange={setPassword} autoComplete="current-password" />
          </div>
          <div className="text-right">
            <Link to="/forgot-password" className="text-sm font-semibold text-stone-900 hover:text-brand hover:underline">
              Forgot Password?
            </Link>
          </div>

          <div className="mt-6">
            <Checkbox label="Remember Me" checked={rememberMe} onChange={setRememberMe} />
          </div>

          <p className="mt-14 font-semibold text-stone-900">
            Don't have an account?{" "}
            <Link to="/register" className="text-brand hover:underline">
              Sign Up
            </Link>
          </p>

          {error && <p className="mt-4 font-semibold text-red-600">{error}</p>}
          {success && <p className="mt-4 font-semibold text-green-700">{success}</p>}
        </div>

        {/* LOGIN button on the right, under the form */}
        <div className="mt-8 flex w-full max-w-[960px] justify-center sm:justify-end">
          <button
            type="submit"
            className="w-full rounded-full bg-brand px-12 py-2.5 text-lg font-semibold text-white hover:bg-brand-dark sm:w-auto"
          >
            LOGIN
          </button>
        </div>
      </form>
    </AuthLayout>
  );
}
