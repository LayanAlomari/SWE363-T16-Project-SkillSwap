import { useState } from "react";
import { useApp } from "../../context/AppContext";

function RequestSessionForm({ service, onClose, onSubmitted }) {
  const { sendRequest } = useApp();

  const [sessionType, setSessionType] = useState("Online");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [meetingLink, setMeetingLink] = useState("");
  const [location, setLocation] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    // Same format as the other requests, e.g. "Fri, Nov 20 · 6:00 PM"
    const when = new Date(`${date}T${time}`);
    if (when < new Date()) {
      setError("Please choose a date and time in the future.");
      return;
    }
    const sessionTime =
      when.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }) +
      " · " +
      when.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

    const result = sendRequest(
      service.id,
      sessionTime,
      message,
      {
        sessionType,
        meetingLink: sessionType === "Online" ? meetingLink : "",
        location: sessionType === "In-person" ? location : "",
      }
    );

    if (!result.ok) {
      setError(result.error);
      return;
    }

    onSubmitted();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-5">
      <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-cream p-6 shadow-xl">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-3 text-2xl font-bold text-brand hover:text-stone-900"
          aria-label="Close request form"
        >
          ×
        </button>

        <h2 className="text-2xl font-bold text-stone-900">
          Request Service
        </h2>

        <p className="mt-2 text-sm text-stone-600">
          Requesting: {service.title}
        </p>

        {error && (
          <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {/* Session Type */}
          <div>
            <label className="text-sm font-semibold text-stone-900">
              Session Type
            </label>

            <div className="mt-2 flex gap-3">
              {["Online", "In-person"].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setSessionType(type)}
                  className={`rounded-full border px-4 py-2 text-sm transition ${
                    sessionType === type
                      ? "border-brand bg-brand text-white"
                      : "border-stone-300 text-brand hover:bg-brand-light"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Date */}
          <div>
            <label
              htmlFor="session-date"
              className="text-sm font-semibold text-stone-900"
            >
              Date
            </label>

            <input
              id="session-date"
              type="date"
              min={new Date().toLocaleDateString("en-CA")}
              value={date}
              onChange={(event) => setDate(event.target.value)}
              required
              className="mt-2 w-full rounded-lg border border-stone-300 bg-white p-3 text-sm outline-none focus:ring-2 focus:ring-brand"
            />
          </div>

          {/* Time */}
          <div>
            <label
              htmlFor="session-time"
              className="text-sm font-semibold text-stone-900"
            >
              Time
            </label>

            <input
              id="session-time"
              type="time"
              value={time}
              onChange={(event) => setTime(event.target.value)}
              required
              className="mt-2 w-full rounded-lg border border-stone-300 bg-white p-3 text-sm outline-none focus:ring-2 focus:ring-brand"
            />
          </div>

          {/* Online Meeting Link */}
          {sessionType === "Online" && (
            <div>
              <label
                htmlFor="meeting-link"
                className="text-sm font-semibold text-stone-900"
              >
                Meeting Link
              </label>

              <input
                id="meeting-link"
                type="url"
                value={meetingLink}
                onChange={(event) => setMeetingLink(event.target.value)}
                placeholder="https://zoom.us/..."
                required
                className="mt-2 w-full rounded-lg border border-stone-300 bg-white p-3 text-sm outline-none focus:ring-2 focus:ring-brand"
              />
            </div>
          )}

          {/* In-person Location */}
          {sessionType === "In-person" && (
            <div>
              <label
                htmlFor="meeting-location"
                className="text-sm font-semibold text-stone-900"
              >
                Meeting Location
              </label>

              <input
                id="meeting-location"
                type="text"
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                placeholder="Example: KFUPM Library or a coffee shop"
                required
                className="mt-2 w-full rounded-lg border border-stone-300 bg-white p-3 text-sm outline-none focus:ring-2 focus:ring-brand"
              />
            </div>
          )}

          {/* Additional Message */}
          <div>
            <label
              htmlFor="request-message"
              className="text-sm font-semibold text-stone-900"
            >
              Additional Message
            </label>

            <textarea
              id="request-message"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Add any additional details..."
              className="mt-2 min-h-[90px] w-full resize-none rounded-lg border border-stone-300 bg-white p-3 text-sm outline-none focus:ring-2 focus:ring-brand"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-brand px-5 py-3 text-sm font-semibold text-brand hover:bg-brand-light"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white hover:bg-brand-dark"
            >
              Send Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RequestSessionForm;