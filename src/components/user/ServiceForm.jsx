import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useApp } from "../../context/AppContext";

const HOURS = [1, 2, 3, 4, 5, 6, 7, 8];
const MAX_DESCRIPTION = 300;

// Pop-up form to add a new service or edit one of yours.
// Price rule: 1 hour = 1 Time Credit, so the credits are calculated from the duration.
export default function ServiceForm({ service, onSave, onCancel }) {
  const { categories } = useApp();
  const [form, setForm] = useState({
    title: service?.title ?? "",
    category: service?.category ?? "",
    durationHours: service?.durationHours ?? 1,
    description: service?.description ?? "",
  });
  const [errors, setErrors] = useState({});

  // Close the form with the Escape key
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onCancel();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCancel]);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: "" })); // hide the error once the user fixes the field
  }

  function validate() {
    const e = {};
    const title = form.title.trim();
    const description = form.description.trim();
    if (title.length < 3) e.title = "Please enter a title of at least 3 characters.";
    else if (title.length > 60) e.title = "The title can be at most 60 characters.";
    if (!form.category) e.category = "Please choose a category.";
    if (description.length < 20) e.description = "Please describe your service in at least 20 characters.";
    return e;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    onSave({
      title: form.title.trim(),
      category: form.category,
      durationHours: Number(form.durationHours),
      description: form.description.trim(),
    });
  }

  const hours = Number(form.durationHours);
  const inputStyle = (field) =>
    `w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand ${
      errors[field] ? "border-red-500" : "border-stone-300"
    }`;
  const errorText = (field) =>
    errors[field] && (
      <p id={`${field}-error`} className="mt-1 text-sm text-red-700">{errors[field]}</p>
    );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="service-form-title"
      onClick={onCancel}
    >
      <form
        noValidate
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-xl"
      >
        <div className="mb-5 flex items-center justify-between gap-3">
          <h2 id="service-form-title" className="text-xl font-bold text-stone-900">
            {service ? "Edit service" : "Add a new service"}
          </h2>
          <button type="button" onClick={onCancel} aria-label="Close" className="rounded-lg p-1 text-stone-500 hover:bg-stone-100">
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <label htmlFor="title" className="mb-1 block text-sm font-semibold text-stone-800">Title</label>
            <input
              id="title"
              autoFocus
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
              placeholder="e.g. Python Basics"
              maxLength={60}
              aria-invalid={!!errors.title}
              aria-describedby={errors.title ? "title-error" : undefined}
              className={inputStyle("title")}
            />
            {errorText("title")}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="category" className="mb-1 block text-sm font-semibold text-stone-800">Category</label>
              <select
                id="category"
                value={form.category}
                onChange={(e) => update("category", e.target.value)}
                aria-invalid={!!errors.category}
                aria-describedby={errors.category ? "category-error" : undefined}
                className={`${inputStyle("category")} bg-white`}
              >
                <option value="">Choose a category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
              {errorText("category")}
            </div>

            <div>
              <label htmlFor="duration" className="mb-1 block text-sm font-semibold text-stone-800">Session length</label>
              <select
                id="duration"
                value={form.durationHours}
                onChange={(e) => update("durationHours", e.target.value)}
                className={`${inputStyle("durationHours")} bg-white`}
              >
                {HOURS.map((h) => (
                  <option key={h} value={h}>{h} {h === 1 ? "hour" : "hours"}</option>
                ))}
              </select>
            </div>
          </div>

          <p className="rounded-lg bg-cream px-3 py-2 text-sm text-stone-700">
            Price: <span className="font-bold text-brand">{hours} Time {hours === 1 ? "Credit" : "Credits"}</span>
            <span className="text-stone-500"> (1 hour = 1 credit)</span>
          </p>

          <div>
            <label htmlFor="description" className="mb-1 block text-sm font-semibold text-stone-800">Description</label>
            <textarea
              id="description"
              rows={4}
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              placeholder="What will the other member learn or get from this session?"
              maxLength={MAX_DESCRIPTION}
              aria-invalid={!!errors.description}
              aria-describedby={errors.description ? "description-error" : undefined}
              className={inputStyle("description")}
            />
            <div className="flex justify-between gap-3">
              <div>{errorText("description")}</div>
              <p className="mt-1 shrink-0 text-xs text-stone-500">{form.description.length}/{MAX_DESCRIPTION}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={onCancel} className="rounded-lg border border-stone-300 px-4 py-2 hover:bg-stone-50">
            Cancel
          </button>
          <button type="submit" className="rounded-lg bg-brand px-4 py-2 font-semibold text-white hover:bg-brand-dark">
            {service ? "Save changes" : "Add service"}
          </button>
        </div>
      </form>
    </div>
  );
}
