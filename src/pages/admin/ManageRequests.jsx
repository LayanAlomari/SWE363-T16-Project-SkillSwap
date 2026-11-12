
import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";

const mockRequests = [
  {
    id: "REQ-001",
    service: "Web Design",
    requester: "Sara Ahmed",
    provider: "Ahmed Ali",
    credits: 2,
    status: "Pending",
    date: "2026-11-01",
  },
  {
    id: "REQ-002",
    service: "English Tutoring",
    requester: "Mohammed Saad",
    provider: "Sara Ahmed",
    credits: 3,
    status: "Accepted",
    date: "2026-11-02",
  },
  {
    id: "REQ-003",
    service: "Photography",
    requester: "Sara Ahmed",
    provider: "Ahmed Ali",
    credits: 2,
    status: "Completed",
    date: "2026-11-03",
  },
  {
    id: "REQ-004",
    service: "Video Editing",
    requester: "Ahmed Ali",
    provider: "Mohammed Saad",
    credits: 4,
    status: "Rejected",
    date: "2026-11-04",
  },
  {
    id: "REQ-005",
    service: "Programming",
    requester: "Mohammed Saad",
    provider: "Sara Ahmed",
    credits: 3,
    status: "Completed",
    date: "2026-11-05",
  },
];

export default function ManageRequests() {
  const [search, setSearch] = useState("");
const [searchParams, setSearchParams] = useSearchParams();

const statusFilter = searchParams.get("status") || "All";

const setStatusFilter = (status) => {
  setSearchParams(status === "All" ? {} : { status });
};

  const filteredRequests = mockRequests.filter((request) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      request.id.toLowerCase().includes(searchText) ||
      request.service.toLowerCase().includes(searchText) ||
      request.requester.toLowerCase().includes(searchText) ||
      request.provider.toLowerCase().includes(searchText);

    const matchesStatus =
      statusFilter === "All" ||
      request.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const statusColors = {
    Pending: "bg-yellow-100 text-yellow-800",
    Accepted: "bg-blue-100 text-blue-800",
    Completed: "bg-green-100 text-green-800",
    Rejected: "bg-red-100 text-red-800",
  };

  return (
    <div className="space-y-7">
      <div>
        <h1 className="text-3xl font-bold text-[#633725]">
          Manage Requests
        </h1>
        <p className="mt-2 text-stone-500">
          View and monitor all service requests on Skill Swap.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Total Requests",
            value: mockRequests.length,
          },
          {
            label: "Pending",
            value: mockRequests.filter(
              (r) => r.status === "Pending"
            ).length,
          },
          {
            label: "Accepted",
            value: mockRequests.filter(
              (r) => r.status === "Accepted"
            ).length,
          },
          {
            label: "Completed",
            value: mockRequests.filter(
              (r) => r.status === "Completed"
            ).length,
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-[#ebddd5] bg-white p-5"
          >
            <p className="text-sm text-stone-500">
              {stat.label}
            </p>
            <p className="mt-2 text-3xl font-bold text-[#633725]">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-[#ebddd5] bg-white p-5">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            placeholder="Search requests..."
            aria-label="Search requests"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 rounded-lg border border-[#ebddd5] p-3 outline-none focus:border-[#633725]"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-[#ebddd5] p-3"
            aria-label="Filter by status"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Accepted">Accepted</option>
            <option value="Completed">Completed</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead className="bg-[#f3e2d8] text-[#633725]">
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
                  className="border-b border-[#f0e7e2] hover:bg-[#fcf8f5]"
                >
                  <td className="p-4 font-medium">
                    {request.id}
                  </td>
                  <td className="p-4">{request.service}</td>
                  <td className="p-4">{request.requester}</td>
                  <td className="p-4">{request.provider}</td>
                  <td className="p-4">{request.credits}</td>
                  <td className="p-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        statusColors[request.status]
                      }`}
                    >
                      {request.status}
                    </span>
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