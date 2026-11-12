import React from "react";
import AdminNavbar from "./AdminNavbar";
export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-white">
      <AdminNavbar />
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}