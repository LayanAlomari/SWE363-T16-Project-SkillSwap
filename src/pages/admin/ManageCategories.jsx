import React, { useState } from "react";
import { useAdmin } from "../../context/AdminContext";
import ConfirmModal from "../../components/admin/ConfirmModal";
export default function ManageCategories() {
  const { categories, setCategories } = useAdmin();
  const [name, setName] = useState("");
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [error, setError] = useState("");
  function save(e) {
    e.preventDefault();
    const value = name.trim();
    if (!value) return setError("Enter a category name.");
    if (
      categories.some(
        (c) => c.name.toLowerCase() === value.toLowerCase() && c.id !== editing,
      )
    )
      return setError("Category already exists.");
    if (editing !== null)
      setCategories((prev) =>
        prev.map((c) => (c.id === editing ? { ...c, name: value } : c)),
      );
    else
      setCategories((prev) => [
        ...prev,
        { id: Date.now(), name: value, services: 0 },
      ]);
    setName("");
    setEditing(null);
    setError("");
  }
  return (
    <>
      <h1 className="mb-6 text-3xl font-bold">Manage Categories</h1>
      <form
        onSubmit={save}
        className="mb-6 flex flex-wrap gap-3 rounded-xl border bg-[#fbf5f1] p-4"
      >
        <input
          aria-label="Category name"
          className="min-w-0 flex-1 rounded-lg border p-3"
          placeholder="Category name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button className="rounded-lg bg-[#633725] px-5 py-2 text-white">
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
          >
            Cancel
          </button>
        )}
        {error && (
          <p role="alert" className="w-full text-red-600">
            {error}
          </p>
        )}
      </form>
      <div className="overflow-x-auto rounded-xl border">
        <table className="w-full min-w-[450px] text-left">
          <thead className="bg-[#633725] text-white">
            <tr>
              <th className="p-3">Category</th>
              <th className="p-3">Services</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.id} className="border-t bg-[#fbf5f1]">
                <td className="p-3">{c.name}</td>
                <td className="p-3">{c.services}</td>
                <td className="p-3">
                  <button
                    className="mr-4 text-[#633725] underline"
                    onClick={() => {
                      setEditing(c.id);
                      setName(c.name);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-700 underline"
                    onClick={() => setDeleting(c.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {deleting !== null && (
        <ConfirmModal
          title="Delete Category"
          message="Are you sure you want to delete this category?"
          confirmLabel="Delete"
          onCancel={() => setDeleting(null)}
          onConfirm={() => {
            setCategories((prev) => prev.filter((c) => c.id !== deleting));
            setDeleting(null);
          }}
        />
      )}
    </>
  );
}
