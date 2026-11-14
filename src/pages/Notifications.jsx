import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";

// Layan2's Notifications page, now reading the shared notifications from AppContext.
// Each user only sees their own; new ones are created automatically (new request, accepted, marked done, ...).
// Works for users (/notifications) and for the admin.
export default function Notifications() {
  const { myNotifications: notifications, unreadCount: unread, markNotificationRead, markAllNotificationsRead, deleteNotification } =
    useApp();
  const [filter, setFilter] = useState("all");
  const visible = notifications.filter((n) => filter === "all" || !n.read);
  const formatDate = (iso) => new Date(iso + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="mt-2 text-stone-500">{unread} unread {unread === 1 ? "notification" : "notifications"}</p>
        </div>
        <button
          onClick={markAllNotificationsRead}
          disabled={!unread}
          className="rounded-lg bg-[#633725] px-4 py-3 text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          Mark All as Read
        </button>
      </div>
      <div className="my-5 flex gap-2">
        <button
          className={`rounded-lg px-4 py-2 ${filter === "all" ? "bg-[#633725] text-white" : "bg-stone-200"}`}
          onClick={() => setFilter("all")}
          aria-pressed={filter === "all"}
        >
          All
        </button>
        <button
          className={`rounded-lg px-4 py-2 ${filter === "unread" ? "bg-[#633725] text-white" : "bg-stone-200"}`}
          onClick={() => setFilter("unread")}
          aria-pressed={filter === "unread"}
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
              {/* Clicking the title opens the related page and marks it as read */}
              <h2 className="font-bold">
                {n.link ? (
                  <Link to={n.link} onClick={() => markNotificationRead(n.id)} className="hover:text-[#633725] hover:underline">
                    {n.title}
                  </Link>
                ) : (
                  n.title
                )}
              </h2>
              <p className="mt-1 text-stone-600">{n.description}</p>
              <p className="mt-1 text-xs text-stone-500">{formatDate(n.date)}</p>
            </div>
            <div className="flex gap-3">
              {!n.read && (
                <button className="text-[#633725] underline" onClick={() => markNotificationRead(n.id)}>
                  Mark Read
                </button>
              )}
              <button className="text-red-700 underline" onClick={() => deleteNotification(n.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
        {visible.length === 0 && <p className="rounded-xl border p-6">No notifications found.</p>}
      </div>
    </>
  );
}
