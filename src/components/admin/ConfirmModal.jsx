import React from "react";
export default function ConfirmModal({
  title = "Confirm action",
  message,
  onConfirm,
  onCancel,
  confirmLabel = "Confirm",
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <h2 className="text-xl font-bold">{title}</h2>
        <p className="my-5 text-stone-600">{message}</p>
        <div className="flex justify-end gap-3">
          <button className="rounded-lg border px-4 py-2" onClick={onCancel}>
            Cancel
          </button>
          <button
            className="rounded-lg bg-[#633725] px-4 py-2 text-white"
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}