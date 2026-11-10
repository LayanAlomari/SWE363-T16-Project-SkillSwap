
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import StatsCard from "../../components/admin/StatsCard";
import { useAdmin } from "../../context/AdminContext";

export default function AdminDashboard() {
  const { users, settings } = useAdmin();
  const navigate = useNavigate();


  const totalRequests = 5;
  const completedSessions = 2;

  return (
    <>
      <h1 className="mb-7 text-3xl font-bold">
        Welcome, Admin
      </h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Users */}
        <button
          type="button"
          onClick={() => navigate("/admin/users")}
          className="w-full cursor-pointer text-left"
        >
          <StatsCard
            label="Total Users"
            value={users.length}
          />
        </button>

        {/* Active Services */}
        <StatsCard
          label="Active Services"
          value={users.reduce(
            (total, user) => total + user.services,
            0
          )}
        />

        {/* All Requests */}
        <button
          type="button"
          onClick={() => navigate("/admin/requests")}
          className="w-full cursor-pointer text-left"
        >
          <StatsCard
            label="Requests"
            value={totalRequests}
          />
        </button>

        {/* Completed Sessions */}
        <button
          type="button"
          onClick={() =>
            navigate("/admin/requests?status=Completed")
          }
          className="w-full cursor-pointer text-left"
        >
          <StatsCard
            label="Completed Sessions"
            value={completedSessions}
          />
        </button>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-3">
        {/* Recent Activity */}
        <section className="rounded-xl border border-stone-300 bg-[#fbf5f1] p-5 md:col-span-2">
          <h2 className="mb-4 text-xl font-bold">
            Recent Activity
          </h2>

          <p className="mb-3">
            New user joined: Nora Khalid
          </p>

          <p className="mb-3">
            Session completed: Web Design
          </p>

          <p>
            Account suspended: Najlaa Alanzi
          </p>

          <div className="mt-5 text-right">
            <Link
              to="/admin/users"
              className="rounded-lg bg-[#633725] px-4 py-2 text-white"
            >
              View Users
            </Link>
          </div>
        </section>

        {/* Credit Settings */}
        <section className="rounded-xl border border-stone-300 bg-[#fbf5f1] p-5">
          <h2 className="text-lg font-bold">
            Initial Credit Balance
          </h2>

          <p className="mt-3 text-sm text-[#945338]">
            Credits given to new users on sign-up
          </p>

          <p className="my-5 rounded-lg bg-[#f3e2d8] p-3 text-center font-bold">
            {settings.welcomeCredits} Credits
          </p>

          <Link
            to="/admin/credits"
            className="block rounded-lg bg-[#633725] px-4 py-2 text-center text-white"
          >
            Edit Settings
          </Link>
        </section>
      </div>
    </>
  );
}