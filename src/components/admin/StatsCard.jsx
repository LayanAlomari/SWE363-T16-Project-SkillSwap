import React from "react";
export default function StatsCard({ label, value }) {
  return (
    <div className="rounded-xl border border-stone-300 bg-[#fbf5f1] p-4">
      <div className="text-sm font-semibold">{label}</div>
      <div className="text-2xl font-bold text-[#633725]">{value}</div>
    </div>
  );
}