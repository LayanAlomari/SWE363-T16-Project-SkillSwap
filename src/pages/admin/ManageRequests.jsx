
import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import StatusBadge from "../../components/common/StatusBadge";

export default function ManageRequests() {
  const { requests, getUser, getService } = useApp();

  const [search, setSearch] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();

  const statusFilter = searchParams.get("status") || "All";

  const allRequests = requests.map((r) => ({
    id: r.id,
    service: getService(r.serviceId)?.title || "Unknown Service",
    requester: getUser(r.seekerId)?.name || "Unknown User",
    provider: getUser(r.providerId)?.name || "Unknown User",
    credits: r.credits,
    status: r.status,
    date: r.date,
  }));

  const filteredRequests = allRequests.filter((request) => {
    const query = search.trim().toLowerCase();

    const matchesSearch = [
      request.id,
      request.service,
      request.requester,
      request.provider,
    ].some((value) => value.toLowerCase().includes(query));

    return (
      matchesSearch &&
      (statusFilter === "All" || request.status === statusFilter)
    );
  });

  const stats = [
    { label: "Total Requests", value: allRequests.length },
    {
      label: "Pending",
      value: allRequests.filter((r) => r.status === "Pending").length,
    },
    {
      label: "Accepted",
      value: allRequests.filter((r) => r.status === "Accepted").length,
    },
    {
      label: "Completed",
      value: allRequests.filter((r) => r.status === "Completed").length,
    },
  ];

  return (
    <div className="space-y-7">
      <div>
        <h1 className="text-3xl font-bold text-brand">
          Manage Requests
        </h1>
        <p className="mt-2 text-stone-500">
          View and monitor all service requests on Skill Swap.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-brand-light bg-white p-5"
          >
            <p className="text-sm text-stone-500">{stat.label}</p>
            <p className="mt-2 text-3xl font-bold text-brand">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-brand-light bg-white p-5">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            placeholder="Search requests..."
            aria-label="Search requests"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 rounded-lg border border-stone-300 p-3 focus:border-brand"
          />

          <select
            value={statusFilter}
            onChange={(e) =>
              setSearchParams(
                e.target.value === "All"
                  ? {}
                  : { status: e.target.value }
              )
            }
            className="rounded-lg border border-stone-300 bg-white p-3"
            aria-label="Filter by status"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Accepted">Accepted</option>
            <option value="Awaiting confirmation">
              Awaiting confirmation
            </option>
            <option value="Completed">Completed</option>
            <option value="Rejected">Rejected</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead className="bg-brand-light text-brand">
              <tr>
                <th className="p-4">Request ID</th>
                <th className="p-4">Service</th>
                <th className="p-4">Requester</th>
                <th className="p-4">Provider</th>
                <th className="p-4">Credits</th>
                <th className="p-4">Status</th>
                <th className="p-4">Date</th>
              </tr>
            </thead>

            <tbody>
              {filteredRequests.map((request) => (
                <tr
                  key={request.id}
                  className="border-b border-brand-light hover:bg-cream"
                >
                  <td className="p-4 font-medium">{request.id}</td>
                  <td className="p-4">{request.service}</td>
                  <td className="p-4">{request.requester}</td>
                  <td className="p-4">{request.provider}</td>
                  <td className="p-4">{request.credits}</td>
                  <td className="p-4">
                    <StatusBadge status={request.status} />
                  </td>
                  <td className="p-4">{request.date}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredRequests.length === 0 && (
            <p className="p-8 text-center text-stone-500">
              No requests found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

