import { useState } from "react";
  import { Link } from "react-router-dom";
  import AuthLayout from "../../components/auth/AuthLayout";
import FormInput from "../../components/auth/FormInput";
import Checkbox from "../../components/auth/Checkbox";
import SuccessBox from "../../components/auth/SuccessBox";
import { findUserByEmail, INITIAL_CREDITS } from "../../data/mockUsers";
import { useApp } from "../../context/AppContext";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Register() {
  const { registerUser } = useApp();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const [created, setCreated] = useState(false);

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
          message={`You have received ${INITIAL_CREDITS} Time Credits. You can now log in to your account...`}
        />
        <div className="mx-auto mt-6 max-w-[720px]">
          <Link to="/login" className="block rounded-full bg-[#533222] py-3 text-center text-xl font-bold text-white hover:bg-[#3f2519]">
            Go to Log In
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit} noValidate className="w-full max-w-[760px]">
        <h1 className="mb-6 text-3xl font-bold text-black">Create Your Account</h1>

        <div className="max-w-[720px]">
          <FormInput label="Full Name" id="fullName" value={fullName} onChange={setFullName} autoComplete="name" />
          <FormInput label="Email" id="email" type="email" value={email} onChange={setEmail} autoComplete="email" />
          <FormInput label="Password" id="password" type="password" value={password} onChange={setPassword} autoComplete="new-password" />
          <FormInput label="Confirm Password" id="confirmPassword" type="password" value={confirmPassword} onChange={setConfirmPassword} autoComplete="new-password" />
        </div>

        <div className="-mt-2">
          <Checkbox label="I agree to the Terms & Conditions" checked={agreed} onChange={setAgreed} />
        </div>

        {/* "Already have an account?" on the left, Create Account button on the right */}
        <div className="mt-8 flex flex-col-reverse gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="sm:pt-6">
            <p className="text-lg font-bold text-black">
              Already have an account?{" "}
              <Link to="/login" className="hover:underline">
                Log In
              </Link>
            </p>
            {error && <p className="mt-3 text-lg font-bold text-[#c75138]">{error}</p>}
          </div>

          <button
            type="submit"
            className="w-full rounded-full bg-[#533222] px-8 py-3 text-xl font-bold text-white hover:bg-[#3f2519] sm:w-auto"
          >
            Create Account
          </button>
        </div>
      </form>
    </AuthLayout>
  );
}
