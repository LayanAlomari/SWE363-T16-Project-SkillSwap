
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";

export default function AdminAccount() {
  const { currentUser, logout } = useApp();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-6 text-3xl font-bold text-brand">
        Admin Account
      </h1>

      <div className="rounded-xl border border-brand-light bg-cream p-6">
        <div className="flex items-center gap-4 border-b pb-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-light text-xl font-bold text-brand">
            AD
          </div>

          <div>
            <h2 className="text-xl font-bold">
              {currentUser?.name || "Skill Swap Admin"}
            </h2>
            <p className="text-sm text-stone-500">
              Administrator Account
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <p className="text-sm text-stone-500">Account Name</p>
            <p className="font-semibold">
              {currentUser?.name || "Skill Swap Admin"}
            </p>
          </div>

          <div>
            <p className="text-sm text-stone-500">Email</p>
            <p className="font-semibold">
              {currentUser?.email || "Not available"}
            </p>
          </div>

          <div>
            <p className="text-sm text-stone-500">Role</p>
            <p className="font-semibold">Administrator</p>
          </div>

          <div>
            <p className="text-sm text-stone-500">Account Status</p>
            <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-700">
              {currentUser?.status || "Active"}
            </span>
          </div>
        </div>

        <div className="mt-8 border-t pt-5">
          <h3 className="mb-3 font-bold">Administrative Access</h3>
          <p className="mb-5 text-sm text-stone-600">
            Manage users, service requests, categories,
            time credits, and administrative support.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/admin"
              className="rounded-lg bg-brand px-5 py-3 text-white hover:bg-brand-dark"
            >
              Back to Dashboard
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg border border-brand px-5 py-3 text-brand hover:bg-brand-light"
            >
              Log Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
