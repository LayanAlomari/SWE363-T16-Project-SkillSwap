
import React from "react";
import AdminNavbar from "./AdminNavbar";
import Footer from "../common/Footer";

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <AdminNavbar />

      <main className="mx-auto w-full max-w-7xl flex-1 px-5 py-8 sm:px-8">
        {children}
      </main>

      <Footer />
    </div>
  );
}
