import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";

// Notifications of the logged-in user.
// New ones are created automatically by the request actions.
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
          <h1 className="text-3xl font-bold text-stone-900">Notifications</h1>
          <p className="mt-1 text-stone-600">{unread} unread {unread === 1 ? "notification" : "notifications"}</p>
        </div>
        <button
          onClick={markAllNotificationsRead}
          disabled={!unread}
          className="rounded-lg bg-brand px-4 py-2 font-semibold text-white hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-50"
        >
          Mark All as Read
        </button>
      </div>
      <div className="my-5 flex flex-wrap gap-2">
        <button
          className={`rounded-full border px-3 py-1 text-sm font-semibold transition ${filter === "all" ? "border-brand bg-brand text-white" : "border-brand-light text-stone-700 hover:border-brand"}`}
          onClick={() => setFilter("all")}
          aria-pressed={filter === "all"}
        >
          All
        </button>
        <button
          className={`rounded-full border px-3 py-1 text-sm font-semibold transition ${filter === "unread" ? "border-brand bg-brand text-white" : "border-brand-light text-stone-700 hover:border-brand"}`}
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
            className={`flex flex-wrap items-start justify-between gap-4 rounded-xl border p-5 ${n.read ? "border-brand-light bg-white" : "border-brand bg-cream"}`}
          >
            <div>
              {/* Clicking the title opens the related page and marks it as read */}
              <h2 className="flex items-center gap-2 font-bold text-stone-900">
                {!n.read && <span className="h-2 w-2 shrink-0 rounded-full bg-brand" aria-label="Unread" />}
                {n.link ? (
                  <Link to={n.link} onClick={() => markNotificationRead(n.id)} className="hover:text-brand hover:underline">
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
                <button className="text-sm font-semibold text-brand hover:underline" onClick={() => markNotificationRead(n.id)}>
                  Mark Read
                </button>
              )}
              <button className="text-sm font-semibold text-red-700 hover:underline" onClick={() => deleteNotification(n.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
        {visible.length === 0 && (
          <p className="rounded-xl border border-dashed border-brand-light bg-cream p-10 text-center text-stone-600">No notifications here.</p>
        )}
      </div>
    </>
  );
}
