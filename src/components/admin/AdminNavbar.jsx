
import React from "react";
import { NavLink } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { Bell } from "lucide-react";
import logo from "../../assets/logo.png";

const links = [
  ["Dashboard", "/admin"],
  ["Users", "/admin/users"],
  ["Requests", "/admin/requests"],
  ["Categories", "/admin/categories"],
  ["Credits", "/admin/credits"],
  ["Messages", "/admin/messages"],
];

export default function AdminNavbar() {
  const { unreadCount, unreadMessages } = useApp();

  const linkStyle = ({ isActive }) =>
    `rounded-lg px-3 py-2 text-sm transition ${
      isActive
        ? "bg-brand-light font-bold text-brand"
        : "text-stone-800 hover:text-brand"
    }`;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-brand-light bg-cream">
      <div className="mx-auto flex min-h-[72px] max-w-7xl flex-wrap items-center gap-4 px-5 py-3 sm:px-8">

        {/* Skill Swap Logo */}
        <NavLink to="/admin" className="shrink-0">
          <img
            src={logo}
            alt="Skill Swap"
            className="h-11 w-auto"
          />
        </NavLink>

        {/* Admin Navigation */}
        <nav className="flex flex-1 flex-wrap items-center gap-1">
          {links.map(([label, path]) => (
            <NavLink
              key={path}
              to={path}
              end={path === "/admin"}
              className={linkStyle}
            >
              {label}

              {path === "/admin/messages" &&
                unreadMessages > 0 && (
                  <span className="ml-1.5 rounded-full bg-red-600 px-1.5 text-xs font-bold text-white">
                    {unreadMessages}
                  </span>
                )}
            </NavLink>
          ))}
        </nav>

        {/* Notifications and Admin Account */}
        <div className="ml-auto flex items-center gap-3">

          {/* Notifications */}
          <NavLink
            to="/admin/notifications"
            aria-label={
              unreadCount
                ? `Notifications, ${unreadCount} unread`
                : "Notifications"
            }
            className={({ isActive }) =>
              `relative flex items-center justify-center rounded-full p-2 text-brand hover:bg-brand-light ${
                isActive ? "bg-brand-light" : ""
              }`
            }
          >
            <Bell size={22} />

            {unreadCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-xs font-bold text-white">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </NavLink>

          {/* Admin Account */}
          <NavLink
            to="/admin/account"
            aria-label="Admin account"
            title="Admin Account"
            className={({ isActive }) =>
              `flex h-10 w-10 items-center justify-center rounded-full font-bold text-brand transition ${
                isActive
                  ? "bg-brand-light"
                  : "bg-brand-light hover:bg-cream"
              }`
            }
          >
            AD
          </NavLink>
        </div>
      </div>
    </header>
  );
}

