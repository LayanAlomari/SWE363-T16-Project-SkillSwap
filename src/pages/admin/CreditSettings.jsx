
import React, { useState } from "react";
import { useApp } from "../../context/AppContext";

export default function CreditSettings() {
  const { settings, setSettings } = useApp();

  const [form, setForm] = useState({ ...settings });
  const [message, setMessage] = useState("");

  function save(e) {
    e.preventDefault();

    const welcomeCredits = Number(form.welcomeCredits);
    const creditsPerHour = Number(form.creditsPerHour);

    if (
      !Number.isInteger(welcomeCredits) ||
      welcomeCredits < 0 ||
      !Number.isInteger(creditsPerHour) ||
      creditsPerHour < 1
    ) {
      setMessage("Enter valid credit values.");
      return;
    }

    setSettings({
      welcomeCredits,
      creditsPerHour,
    });

    setMessage("Settings saved successfully.");
  }

  return (
    <div className="max-w-2xl">
      <h1 className="mb-5 text-3xl font-bold">
        Time Credits Settings
      </h1>

      <p className="mb-6 text-stone-600">
        Configure the platform credit rules.
      </p>

      <form
        onSubmit={save}
        className="space-y-5 rounded-xl border border-brand-light bg-cream p-6"
      >
        {/* Initial Credit Balance */}
        <label className="block font-semibold">
          Initial Credit Balance

          <input
            className="mt-2 block w-full rounded-lg border border-stone-300 p-3 font-normal"
            type="number"
            min="0"
            step="1"
            value={form.welcomeCredits}
            onChange={(e) => {
              setForm({
                ...form,
                welcomeCredits: e.target.value,
              });
              setMessage("");
            }}
            required
          />

          <span className="mt-2 block text-sm font-normal text-stone-500">
            Credits awarded to new members.
          </span>
        </label>

        {/* Credits Per Hour */}
        <label className="block font-semibold">
          Credits Per Hour

          <input
            className="mt-2 block w-full rounded-lg border border-stone-300 p-3 font-normal"
            type="number"
            min="1"
            step="1"
            value={form.creditsPerHour}
            onChange={(e) => {
              setForm({
                ...form,
                creditsPerHour: e.target.value,
              });
              setMessage("");
            }}
            required
          />

          <span className="mt-2 block text-sm font-normal text-stone-500">
            Number of Time Credits earned per hour of service.
          </span>
        </label>

        {/* Success or Error Message */}
        {message && (
          <p role="status" className="text-stone-600">
            {message}
          </p>
        )}

        {/* Save Button */}
        <button
          type="submit"
          className="rounded-lg bg-brand px-6 py-3 text-white hover:bg-brand-dark"
        >
          Save Settings
        </button>
      </form>
    </div>
  );
}
