import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../components/auth/AuthLayout";
import FormInput from "../../components/auth/FormInput";
import Checkbox from "../../components/auth/Checkbox";
import { findUserByEmail, setCurrentUser } from "../../data/mockUsers";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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

    setCurrentUser({ ...user, rememberMe });
    setSuccess("Login successful! Welcome back to Skill Swap.");

    // Admins go to the Admin Dashboard, regular users go to the User Dashboard
    setTimeout(() => navigate(user.role === "admin" ? "/admin" : "/dashboard"), 1200);
  }

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit} noValidate className="flex flex-col">
        <h1 className="mb-6 text-3xl font-bold text-black">Welcome Back</h1>

        <div className="w-full max-w-[720px]">
          <FormInput label="Email Address" id="email" type="email" value={email} onChange={setEmail} placeholder="Fatimah@example.com" autoComplete="email" />

          <div className="-mb-6">
            <FormInput label="Password" id="password" type="password" value={password} onChange={setPassword} autoComplete="current-password" />
          </div>
          <div className="mt-[-8px] text-right">
            <Link to="/forgot-password" className="text-base font-bold text-black hover:underline">
              Forgot Password?
            </Link>
          </div>

          <div className="mt-8">
            <Checkbox label="Remember Me" checked={rememberMe} onChange={setRememberMe} />
          </div>

          <p className="mt-20 text-lg font-bold text-black">
            Don't have an account?{" "}
            <Link to="/register" className="hover:underline">
              Sign Up
            </Link>
          </p>

          {error && <p className="mt-4 font-bold text-red-600">{error}</p>}
          {success && <p className="mt-4 font-bold text-green-700">{success}</p>}
        </div>

        {/* LOGIN button sits on the right, under the form (like the Figma) */}
        <div className="mt-10 flex w-full max-w-[960px] justify-center sm:justify-end">
          <button
            type="submit"
            className="w-full rounded-full bg-[#533222] px-14 py-3 text-xl font-bold text-white hover:bg-[#3f2519] sm:w-auto"
          >
            LOGIN
          </button>
        </div>
      </form>
    </AuthLayout>
  );
}
