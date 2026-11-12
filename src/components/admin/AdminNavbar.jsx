import React from "react";
import { NavLink } from "react-router-dom";
import { useAdmin } from "../../context/AdminContext";
import { Bell } from "lucide-react";


const links = [
  ["Dashboard", "/admin"],
  ["Users", "/admin/users"],
  ["Requests", "/admin/requests"],
  ["Categories", "/admin/categories"],
  ["Credits", "/admin/credits"],
  ["Messages", "/admin/messages"],
];


export default function AdminNavbar() {
  const { notifications } = useAdmin();
  const count = notifications.filter((n) => !n.read).length;
  return (
    <header className="border-b border-[#ebddd5] bg-[#fcf5f1]">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-4 px-4 py-3">
        <NavLink
          to="/admin"
          className="mr-4 text-lg font-black tracking-wide text-[#633725]"
        >
          SKILL SWAP
        </NavLink>
        <nav className="flex flex-1 flex-wrap gap-2">
          {links.map(([label, path]) => (
            <NavLink
  key={path}
  to={path}
  end={path === "/admin"}
  className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm ${isActive ? "bg-[#633725] text-white" : "text-[#633725] hover:bg-[#efe1d8]"}`
              }
            >
              {label}
              {label === "Notifications" && count > 0 ? ` (${count})` : ""}
            </NavLink>
          ))}
        </nav>

<div className="ml-auto flex items-center gap-4">
  <NavLink
    to="/admin/notifications"
    aria-label="Admin notifications"
    className="relative flex items-center justify-center text-[#633725]"
  >
    <Bell size={24} fill="currentColor" strokeWidth={1.8} />

    {count > 0 && (
      <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white">
        {count}
      </span>
    )}
  </NavLink>

  <NavLink
    to="/admin/account"
    className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f2dfd3] font-bold text-[#633725] hover:bg-[#e8cbbb]"
  >
    AD
  </NavLink>
</div>

      </div>
    </header>
  );
}