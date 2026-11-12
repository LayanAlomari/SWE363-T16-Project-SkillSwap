import React, { useState } from "react";
import { userNotifications } from "../data/mockAdminData";
import { useAdmin } from "../context/AdminContext";
export default function Notifications({ role = "user" }) {
  const {
    notifications: adminNotifications,
    setNotifications: setAdminNotifications,
  } = useAdmin();

  const [regularNotifications, setRegularNotifications] =
    useState(() => structuredClone(userNotifications));

  const notifications =
    role === "admin" ? adminNotifications : regularNotifications;

  const setNotifications =
    role === "admin" ? setAdminNotifications : setRegularNotifications;
  const [filter, setFilter] = useState("all");
  const unread = notifications.filter((n) => !n.read).length;
  const visible = notifications.filter((n) => filter === "all" || !n.read);
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="mt-2 text-stone-500">{unread} unread notifications</p>
        </div>
        <button
          onClick={() =>
            setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
          }
          className="rounded-lg bg-[#633725] px-4 py-3 text-white"
        >
          Mark All as Read
        </button>
      </div>
      <div className="my-5 flex gap-2">
        <button
          className={`rounded-lg px-4 py-2 ${filter === "all" ? "bg-[#633725] text-white" : "bg-stone-200"}`}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button
          className={`rounded-lg px-4 py-2 ${filter === "unread" ? "bg-[#633725] text-white" : "bg-stone-200"}`}
          onClick={() => setFilter("unread")}
        >
          Unread
        </button>
      </div>
      <div className="space-y-3">
        {visible.map((n) => (
          <div
            key={n.id}
            className={`flex flex-wrap items-start justify-between gap-4 rounded-xl border p-5 ${n.read ? "bg-white" : "bg-[#fbf0e9]"}`}
          >
            <div>
              <h2 className="font-bold">{n.title}</h2>
              <p className="mt-1 text-stone-600">{n.description}</p>
            </div>
            <div className="flex gap-3">
              {!n.read && (
                <button
                  className="text-[#633725] underline"
                  onClick={() =>
                    setNotifications((prev) =>
                      prev.map((x) =>
                        x.id === n.id ? { ...x, read: true } : x,
                      ),
                    )
                  }
                >
                  Mark Read
                </button>
              )}
              <button
                className="text-red-700 underline"
                onClick={() =>
                  setNotifications((prev) => prev.filter((x) => x.id !== n.id))
                }
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {visible.length === 0 && (
          <p className="rounded-xl border p-6">No notifications found.</p>
        )}
      </div>
    </>
  );
}