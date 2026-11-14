
import React from "react";
import { NavLink } from "react-router-dom";
import { useApp } from "../../context/AppContext";
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
  const { unreadCount: count } = useApp();

  return (
    <header className="border-b border-brand-light bg-cream">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-4 px-4 py-3">

        
        <NavLink
          to="/admin"
          className="mr-4 text-lg font-black tracking-wide text-brand"
        >
          SKILL SWAP
        </NavLink>

        {/* Admin Navigation Links */}
        <nav className="flex flex-1 flex-wrap gap-2">
          {links.map(([label, path]) => (
            <NavLink
              key={path}
              to={path}
              end={path === "/admin"}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm ${
                  isActive
                    ? "bg-brand text-white"
                    : "text-brand hover:bg-brand-light"
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Notifications and Admin Account */}
        <div className="ml-auto flex items-center gap-4">

          
          <NavLink
            to="/admin/notifications"
            aria-label="Admin notifications"
            title="Notifications"
            className="relative flex items-center justify-center text-brand hover:text-brand-dark"
          >
            <Bell
              size={24}
              fill="currentColor"
              strokeWidth={1.8}
            />

            {count > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white">
                {count}
              </span>
            )}
          </NavLink>

          
          <NavLink
            to="/admin/account"
            aria-label="Admin account"
            title="Admin Account"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-light font-bold text-brand hover:bg-brand-dark hover:text-white"
          >
            AD
          </NavLink>

        </div>
      </div>
    </header>
  );
}
