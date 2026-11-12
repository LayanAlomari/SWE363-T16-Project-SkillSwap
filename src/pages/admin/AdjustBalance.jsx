import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAdmin } from "../../context/AdminContext";
export default function AdjustBalance() {
  const { id } = useParams();
  const { users, updateUser } = useAdmin();
  const user = users.find((u) => u.id === Number(id));
  const [type, setType] = useState("add");
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");
  if (!user) return <p>User not found.</p>;
  function save(e) {
    e.preventDefault();
    const n = Number(amount);
    if (!Number.isInteger(n) || n <= 0)
      return setMessage("Enter a positive whole number.");
    if (type === "deduct" && n > user.credits)
      return setMessage("Insufficient credits.");
    if (!reason.trim()) return setMessage("Please provide a reason.");
    updateUser(id, { credits: user.credits + (type === "add" ? n : -n) });
    setAmount("");
    setReason("");
    setMessage("Balance updated successfully.");
  }
  return (
    <div className="mx-auto max-w-2xl">
      <Link to={`/admin/users/${id}`} className="text-[#633725]">
        ← Back to user
      </Link>
      <div className="mt-5 rounded-xl border border-stone-300 bg-white p-6">
        <h1 className="text-center text-3xl font-bold">Adjust Balance</h1>
        <p className="mb-6 text-center text-[#945338]">
          {user.name} · Current balance: {user.credits} credits
        </p>
        <form onSubmit={save} className="space-y-5">
          <div>
            <label className="mb-2 block font-bold">Action</label>
            <div className="grid grid-cols-2 gap-4">
              {["add", "deduct"].map((v) => (
                <button
                  type="button"
                  key={v}
                  onClick={() => setType(v)}
                  className={`rounded-full px-5 py-3 ${type === v ? "bg-[#633725] text-white" : "bg-stone-200"}`}
                >
                  {v === "add" ? "Add" : "Deduct"}
                </button>
              ))}
            </div>
          </div>
          <label className="block font-bold">
            Amount
            <input
              className="mt-2 w-full rounded-lg border p-3 font-normal"
              type="number"
              min="1"
              step="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter number of credits"
              required
            />
          </label>
          <label className="block font-bold">
            Reason
            <textarea
              className="mt-2 w-full rounded-lg border p-3 font-normal"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Reason for this change"
              required
            />
          </label>
          {message && (
            <p role="status" className="text-[#945338]">
              {message}
            </p>
          )}
          <div className="flex justify-end gap-3">
            <Link
              to={`/admin/users/${id}`}
              className="rounded-full bg-stone-200 px-6 py-2"
            >
              Cancel
            </Link>
            <button className="rounded-full bg-[#633725] px-8 py-2 text-white">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}