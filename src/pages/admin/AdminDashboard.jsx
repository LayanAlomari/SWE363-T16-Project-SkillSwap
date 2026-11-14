
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import StatsCard from "../../components/admin/StatsCard";
import { useApp } from "../../context/AppContext";

export default function AdminDashboard() {
  const { users, services, requests, settings } = useApp();
  const navigate = useNavigate();

  const totalUsers = users.filter(
    (user) => user.role !== "admin"
  ).length;

  const activeServices = services.filter(
    (service) => service.status === "Active"
  ).length;

  const totalRequests = requests.length;

  const completedSessions = requests.filter(
    (request) => request.status === "Completed"
  ).length;

  const recentActivity = [...requests]
    .sort((a, b) => (b.date || "").localeCompare(a.date || ""))
    .slice(0, 3);

  return (
    <>
      <h1 className="mb-7 text-3xl font-bold">
        Welcome, Admin
      </h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <button
          type="button"
          onClick={() => navigate("/admin/users")}
          className="w-full cursor-pointer text-left"
        >
          <StatsCard label="Total Users" value={totalUsers} />
        </button>

        <StatsCard
          label="Active Services"
          value={activeServices}
        />

        <button
          type="button"
          onClick={() => navigate("/admin/requests")}
          className="w-full cursor-pointer text-left"
        >
          <StatsCard label="Requests" value={totalRequests} />
        </button>

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
        <section className="rounded-xl border border-brand-light bg-cream p-5 md:col-span-2">
          <h2 className="mb-4 text-xl font-bold">
            Recent Activity
          </h2>

          {recentActivity.length > 0 ? (
            <div className="space-y-3">
              {recentActivity.map((request) => (
                <div
                  key={request.id}
                  className="border-b border-brand-light pb-3"
                >
                  <p className="font-medium">
                    Request {request.id} — {request.status}
                  </p>
                  <p className="text-sm text-stone-600">
                    {request.date}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-stone-500">
              No recent activity.
            </p>
          )}

          <div className="mt-5 text-right">
            <Link
              to="/admin/requests"
              className="inline-block rounded-lg bg-brand px-4 py-2 text-white hover:bg-brand-dark"
            >
              View Requests
            </Link>
          </div>
        </section>

        <section className="rounded-xl border border-brand-light bg-cream p-5">
          <h2 className="text-lg font-bold">
            Time Credit System
          </h2>

          <p className="mt-3 text-sm text-stone-600">
            Skill Swap uses time credits to exchange
            services without money.
          </p>

          <p className="my-5 rounded-lg bg-brand-light p-3 text-center font-bold text-brand">
            1 Hour = {settings.creditsPerHour} Time {settings.creditsPerHour === 1 ? "Credit" : "Credits"}
          </p>

          <Link
            to="/admin/credits"
            className="block rounded-lg bg-brand px-4 py-2 text-center text-white hover:bg-brand-dark"
          >
            Edit Settings
          </Link>
        </section>
      </div>
    </>
  );
}
