
import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import ConfirmModal from "../../components/common/ConfirmModal";

export default function ManageCategories() {
  const {
    categories,
    services,
    addCategory,
    renameCategory,
    deleteCategory,
  } = useApp();

  const [name, setName] = useState("");
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [error, setError] = useState("");

  // Add or edit a category
  function save(e) {
    e.preventDefault();

    const value = name.trim();

    const result =
      editing !== null
        ? renameCategory(editing, value)
        : addCategory(value);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    setName("");
    setEditing(null);
    setError("");
  }

  // Delete a category
  function handleDelete() {
    const result = deleteCategory(deleting);

    if (!result.ok) {
      setError(result.error);
    } else {
      setError("");
    }

    setDeleting(null);
  }

  return (
    <>
      <h1 className="mb-6 text-3xl font-bold">
        Manage Categories
      </h1>

      {/* Add / Edit Category Form */}
      <form
        onSubmit={save}
        className="mb-6 flex flex-wrap gap-3 rounded-xl border border-brand-light bg-cream p-4"
      >
        <input
          aria-label="Category name"
          className="min-w-0 flex-1 rounded-lg border border-stone-300 p-3"
          placeholder="Category name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setError("");
          }}
        />

        <button
          type="submit"
          className="rounded-lg bg-brand px-5 py-2 text-white hover:bg-brand-dark"
        >
          {editing === null ? "Add Category" : "Save Changes"}
        </button>

        {editing !== null && (
          <button
            type="button"
            onClick={() => {
              setEditing(null);
              setName("");
              setError("");
            }}
            className="rounded-lg bg-stone-200 px-5 py-2"
          >
            Cancel
          </button>
        )}
      </form>

      {/* Error Message */}
      {error && (
        <p
          role="alert"
          className="mb-5 rounded-lg border border-red-200 bg-red-50 p-3 text-red-700"
        >
          {error}
        </p>
      )}

      {/* Categories Table */}
      <div className="overflow-x-auto rounded-xl border border-brand-light">
        <table className="w-full min-w-[450px] text-left">
          <thead className="bg-brand text-white">
            <tr>
              <th className="p-3">Category</th>
              <th className="p-3">Services</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {categories.map((c) => (
              <tr
                key={c.id}
                className="border-t border-brand-light bg-cream"
              >
                <td className="p-3">{c.name}</td>

                <td className="p-3">
                  {
                    services.filter(
                      (s) => s.category === c.name
                    ).length
                  }
                </td>

                <td className="p-3">
                  <button
                    type="button"
                    className="mr-4 text-brand underline"
                    onClick={() => {
                      setEditing(c.id);
                      setName(c.name);
                      setError("");
                    }}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    className="text-red-700 underline"
                    onClick={() => {
                      setDeleting(c.id);
                      setError("");
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {deleting !== null && (
        <ConfirmModal
          title="Delete Category"
          message="Are you sure you want to delete this category?"
          confirmLabel="Delete"
          onCancel={() => setDeleting(null)}
          onConfirm={handleDelete}
          danger={true}
        />
      )}
    </>
  );
}

