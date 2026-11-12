
import React from "react";
import { Link } from "react-router-dom";

export default function AdminAccount() {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-6 text-3xl font-bold text-[#633725]">
        Admin Account
      </h1>

      <div className="rounded-xl border border-[#ebddd5] bg-[#fbf5f1] p-6">
        <div className="flex items-center gap-4 border-b pb-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#f2dfd3] text-xl font-bold text-[#633725]">
            AD
          </div>

          <div>
            <h2 className="text-xl font-bold">Skill Swap Admin</h2>
            <p className="text-sm text-stone-500">
              Administrator Account
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <p className="text-sm text-stone-500">Account Name</p>
            <p className="font-semibold">Skill Swap Admin</p>
          </div>

          <div>
            <p className="text-sm text-stone-500">Role</p>
            <p className="font-semibold">Administrator</p>
          </div>

          <div>
            <p className="text-sm text-stone-500">Account Status</p>
            <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-700">
              Active
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
    className="inline-block rounded-lg bg-[#633725] px-5 py-3 text-white"
  >
    Back to Dashboard
  </Link>


  <span className="inline-block rounded-lg border border-[#633725] px-5 py-3 text-[#633725]">
    Log Out
  </span>
</div>

        </div>
      </div>
    </div>
  );
}