import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import AuthLayout from "../../components/auth/AuthLayout";
import FormInput from "../../components/auth/FormInput";
import Checkbox from "../../components/auth/Checkbox";
import SuccessBox from "../../components/auth/SuccessBox";
import { findUserByEmail, INITIAL_CREDITS } from "../../data/mockUsers";
import { useApp } from "../../context/AppContext";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Register() {
  const { registerUser, currentUser } = useApp();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const [created, setCreated] = useState(false);

  // Already logged in: go to the right dashboard
  if (currentUser) {
    return <Navigate to={currentUser.role === "admin" ? "/admin" : "/dashboard"} replace />;
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!fullName || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    if (!EMAIL_PATTERN.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!agreed) {
      setError("Please agree to the Terms & Conditions.");
      return;
    }
    if (findUserByEmail(email)) {
      setError("This email is already registered.");
      return;
    }

    registerUser({ name: fullName, email, password });
    setCreated(true);
  }

  // Success screen ("Account Created Successfully!")
  if (created) {
    return (
      <AuthLayout>
        <SuccessBox
          title="Account Created Successfully!"
          message={`You have received ${INITIAL_CREDITS} Time Credits. You can now log in to your account.`}
        />
        <div className="mx-auto mt-6 max-w-[720px]">
          <Link to="/login" className="block rounded-full bg-brand py-2.5 text-center text-lg font-semibold text-white hover:bg-brand-dark">
            Go to Log In
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit} noValidate className="w-full max-w-[760px]">
        <h1 className="mb-6 text-3xl font-bold text-stone-900">Create Your Account</h1>

        <div className="max-w-[720px]">
          <FormInput label="Full Name" id="fullName" value={fullName} onChange={setFullName} autoComplete="name" />
          <FormInput label="Email" id="email" type="email" value={email} onChange={setEmail} autoComplete="email" />
          <FormInput label="Password" id="password" type="password" value={password} onChange={setPassword} autoComplete="new-password" />
          <FormInput label="Confirm Password" id="confirmPassword" type="password" value={confirmPassword} onChange={setConfirmPassword} autoComplete="new-password" />
        </div>

        <Checkbox label="I agree to the Terms & Conditions" checked={agreed} onChange={setAgreed} />

        {/* "Already have an account?" on the left, Create Account button on the right */}
        <div className="mt-8 flex flex-col-reverse gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="sm:pt-5">
            <p className="font-semibold text-stone-900">
              Already have an account?{" "}
              <Link to="/login" className="text-brand hover:underline">
                Log In
              </Link>
            </p>
            {error && <p className="mt-3 font-semibold text-red-600">{error}</p>}
          </div>

          <button
            type="submit"
            className="w-full rounded-full bg-brand px-8 py-2.5 text-lg font-semibold text-white hover:bg-brand-dark sm:w-auto"
          >
            Create Account
          </button>
        </div>
      </form>
    </AuthLayout>
  );
}
