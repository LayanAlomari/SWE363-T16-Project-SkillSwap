import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import AuthLayout from "../../components/auth/AuthLayout";
import FormInput from "../../components/auth/FormInput";
import SuccessBox from "../../components/auth/SuccessBox";
import { useApp } from "../../context/AppContext";

export default function ResetPassword() {
  const { users, updateUser } = useApp();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || ""; // comes from the reset link
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (!user) {
      setError("This reset link is not valid. Please request a new one.");
      return;
    }
    if (!newPassword || !confirmPassword) {
      setError("Please fill in both fields.");
      return;
    }
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    updateUser(user.id, { password: newPassword });
    setDone(true);
  }

  // Success screen ("Password Reset Successful!")
  if (done) {
    return (
      <AuthLayout>
        <SuccessBox
          title="Password Reset Successful!"
          message="Your password has been updated successfully. You can now log in with your new password."
        />
        <div className="mx-auto mt-6 max-w-[720px]">
          <Link to="/login" className="block rounded-full bg-brand py-3 text-center text-xl font-bold text-white hover:bg-brand-dark">
            Back to Log In
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit} noValidate className="w-full max-w-[1000px]">
        <h1 className="mb-4 text-3xl font-bold text-black">Reset Your Password</h1>
        <p className="mb-10 text-xl font-bold text-brand">Enter a new password for your account</p>

        <div className="max-w-[720px]">
          <FormInput label="New Password" id="newPassword" type="password" value={newPassword} onChange={setNewPassword} placeholder="Enter New Password......" autoComplete="new-password" />
          <FormInput label="Confirm New Password" id="confirmPassword" type="password" value={confirmPassword} onChange={setConfirmPassword} placeholder="Confirm New Password......" autoComplete="new-password" />
        </div>

        {error && <p className="text-lg font-bold text-red-600">{error}</p>}
        {!user && !error && (
          <p className="text-lg font-bold text-red-600">
            This reset link is not valid.{" "}
            <Link to="/forgot-password" className="underline">Request a new one</Link>
          </p>
        )}

        <div className="mt-16 flex flex-col-reverse gap-6 sm:flex-row sm:items-center sm:justify-between">
          <Link to="/login" className="text-lg font-bold text-black hover:underline">
            ← Back to Login
          </Link>
          <button
            type="submit"
            className="w-full rounded-full bg-brand px-6 py-3 text-lg font-bold text-white hover:bg-brand-dark sm:w-auto"
          >
            Reset Password
          </button>
        </div>
      </form>
    </AuthLayout>
  );
}
