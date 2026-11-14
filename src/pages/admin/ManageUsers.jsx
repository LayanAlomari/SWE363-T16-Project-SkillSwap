import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../../context/AppContext";
export default function ManageUsers() {
const { users: allUsers } = useApp();
const users = allUsers.filter((user) => user.role !== "admin");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const visible = users.filter(
    (u) =>
      (u.name + " " + u.email).toLowerCase().includes(search.toLowerCase()) &&
      (filter === "All" || u.status === filter),
  );
  return (
    <>
      <h1 className="mb-6 text-3xl font-bold">Users</h1>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row">
        <input
          aria-label="Search users"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email"
          className="flex-1 rounded-lg border border-stone-300 p-3"
        />
        <select
          aria-label="Filter status"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded-lg border border-stone-300 p-3"
        >
          <option value="All">All statuses</option>
          <option>Active</option>
          <option>Suspended</option>
        </select>
      </div>
      <div className="overflow-x-auto rounded-xl border border-stone-300">
        <table className="w-full min-w-[600px] text-left">
          <thead className="bg-[#633725] text-white">
            <tr>
              {["Name", "Email", "Status", "Credits", "Action"].map((x) => (
                <th className="p-3" key={x}>
                  {x}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.map((u) => (
              <tr key={u.id} className="border-t bg-[#fbf5f1]">
                <td className="p-3">{u.name}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3">
                  <span
                    className={`rounded-full px-3 py-1 text-xs ${u.status === "Active" ? "bg-green-200" : "bg-red-200"}`}
                  >
                    {u.status}
                  </span>
                </td>
                <td className="p-3">{u.credits}</td>
                <td className="p-3">
                  <Link
                    className="rounded-lg bg-[#633725] px-4 py-2 text-white"
                    to={`/admin/users/${u.id}`}
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!visible.length && <p className="p-5">No users found.</p>}
      </div>
    </>
  );
}