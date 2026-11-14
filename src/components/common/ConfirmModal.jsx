import { useEffect } from "react";

// Pop-up that asks the user to confirm an action.
export default function ConfirmModal({
  title = "Confirm action",
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  danger = false, // true = red button, for actions like Delete
  onConfirm,
  onCancel,
}) {
  // Close the pop-up with the Escape key
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onCancel();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCancel]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
      onClick={onCancel} // clicking outside the box closes it
    >
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <h2 id="confirm-title" className="text-xl font-bold">{title}</h2>
        <p className="my-5 text-stone-600">{message}</p>
        <div className="flex justify-end gap-3">
          <button type="button" onClick={onCancel} className="rounded-lg border border-stone-300 px-4 py-2 hover:bg-stone-50">
            {cancelLabel}
          </button>
          <button
            type="button"
            autoFocus
            onClick={onConfirm}
            className={`rounded-lg px-4 py-2 text-white ${danger ? "bg-red-700 hover:bg-red-800" : "bg-brand hover:bg-brand-dark"}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
