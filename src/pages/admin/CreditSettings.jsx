import React, { useState } from "react";
import { useAdmin } from "../../context/AdminContext";
export default function CreditSettings() {
  const { settings, setSettings } = useAdmin();
  const [form, setForm] = useState({ ...settings });
  const [message, setMessage] = useState("");
  function save(e) {
    e.preventDefault();
    const a = Number(form.welcomeCredits),
      b = Number(form.creditsPerHour);
    if (!Number.isInteger(a) || a < 0 || !Number.isInteger(b) || b < 1)
      return setMessage("Enter valid credit values.");
    setSettings({ welcomeCredits: a, creditsPerHour: b });
    setMessage("Settings saved successfully.");
  }
  return (
    <div className="max-w-2xl">
      <h1 className="mb-5 text-3xl font-bold">Time Credits Settings</h1>
      <p className="mb-6 text-stone-600">
        Configure the platform credit rules.
      </p>
      <form
        onSubmit={save}
        className="space-y-5 rounded-xl border bg-[#fbf5f1] p-6"
      >
        <label className="block font-semibold">
          Initial Credit Balance
          <input
            className="mt-2 block w-full rounded-lg border p-3 font-normal"
            type="number"
            min="0"
            step="1"
            value={form.welcomeCredits}
            onChange={(e) =>
              setForm({ ...form, welcomeCredits: e.target.value })
            }
          />
          <span className="text-sm font-normal text-stone-500">
            Credits awarded to new members.
          </span>
        </label>
        <label className="block font-semibold">
          Credits Per Hour
          <input
            className="mt-2 block w-full rounded-lg border p-3 font-normal"
            type="number"
            min="1"
            step="1"
            value={form.creditsPerHour}
            onChange={(e) =>
              setForm({ ...form, creditsPerHour: e.target.value })
            }
          />
        </label>
        {message && (
          <p role="status" className="text-[#945338]">
            {message}
          </p>
        )}
        <button className="rounded-lg bg-[#633725] px-6 py-3 text-white">
          Save Settings
        </button>
      </form>
    </div>
  );
}