import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAdmin } from "../../context/AdminContext";
import StatsCard from "../../components/admin/StatsCard";
import ConfirmModal from "../../components/admin/ConfirmModal";
export default function UserDetails() {
  const { id } = useParams();
  const { users, updateUser } = useAdmin();
  const [confirm, setConfirm] = useState(false);
  const user = users.find((u) => u.id === Number(id));
  if (!user)
    return (
      <p>
        User not found. <Link to="/admin/users">Back to Users</Link>
      </p>
    );
  return (
    <>
      <Link to="/admin/users" className="text-[#633725]">
        ← Back to users
      </Link>
      <h1 className="my-5 text-3xl font-bold">{user.name}</h1>
      <div className="grid gap-4 sm:grid-cols-3">
        <StatsCard label="Credits" value={user.credits} />
        <StatsCard label="Services" value={`${user.services} Active`} />
        <StatsCard label="Status" value={user.status} />
      </div>
      <section className="my-6 rounded-xl border border-stone-300 bg-[#fbf5f1] p-5">
        <h2 className="mb-3 font-bold">User Information</h2>
        <p>Email: {user.email}</p>
        <p>Joined: {user.joined}</p>
        <p>Skills: {user.skills}</p>
      </section>
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-stone-300 p-4">
        <strong>Current Balance: {user.credits} credits</strong>
        <div className="flex flex-wrap gap-3">
          <button
            className="rounded-lg bg-stone-200 px-4 py-2"
            onClick={() => setConfirm(true)}
          >
            {user.status === "Active" ? "Suspend Account" : "Activate Account"}
          </button>
          <Link
            className="rounded-lg bg-[#633725] px-4 py-2 text-white"
            to={`/admin/users/${id}/balance`}
          >
            Adjust Balance
          </Link>
        </div>
      </div>
      {confirm && (
        <ConfirmModal
          title="Confirm Account Status"
          message={`Are you sure you want to ${user.status === "Active" ? "suspend" : "activate"} ${user.name}?`}
          onCancel={() => setConfirm(false)}
          onConfirm={() => {
            updateUser(id, {
              status: user.status === "Active" ? "Suspended" : "Active",
            });
            setConfirm(false);
          }}
        />
      )}
    </>
  );
}