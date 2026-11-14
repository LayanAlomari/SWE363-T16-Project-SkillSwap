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

    const sessionTime = `${date} at ${time}`;

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
      <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-[#fffaf7] p-6 shadow-xl">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-3 text-2xl font-bold text-[#63351f] hover:text-[#2f211b]"
          aria-label="Close request form"
        >
          ×
        </button>

        <h2 className="text-2xl font-bold text-[#2f211b]">
          Request Service
        </h2>

        <p className="mt-2 text-sm text-[#705d52]">
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
            <label className="text-sm font-semibold text-[#2f211b]">
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
                      ? "border-[#63351f] bg-[#63351f] text-white"
                      : "border-[#8b7568] text-[#63351f] hover:bg-[#ead7ca]"
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
              className="text-sm font-semibold text-[#2f211b]"
            >
              Date
            </label>

            <input
              id="session-date"
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              required
              className="mt-2 w-full rounded-lg border border-[#8b7568] bg-white p-3 text-sm outline-none focus:ring-2 focus:ring-[#63351f]"
            />
          </div>

          {/* Time */}
          <div>
            <label
              htmlFor="session-time"
              className="text-sm font-semibold text-[#2f211b]"
            >
              Time
            </label>

            <input
              id="session-time"
              type="time"
              value={time}
              onChange={(event) => setTime(event.target.value)}
              required
              className="mt-2 w-full rounded-lg border border-[#8b7568] bg-white p-3 text-sm outline-none focus:ring-2 focus:ring-[#63351f]"
            />
          </div>

          {/* Online Meeting Link */}
          {sessionType === "Online" && (
            <div>
              <label
                htmlFor="meeting-link"
                className="text-sm font-semibold text-[#2f211b]"
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
                className="mt-2 w-full rounded-lg border border-[#8b7568] bg-white p-3 text-sm outline-none focus:ring-2 focus:ring-[#63351f]"
              />
            </div>
          )}

          {/* In-person Location */}
          {sessionType === "In-person" && (
            <div>
              <label
                htmlFor="meeting-location"
                className="text-sm font-semibold text-[#2f211b]"
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
                className="mt-2 w-full rounded-lg border border-[#8b7568] bg-white p-3 text-sm outline-none focus:ring-2 focus:ring-[#63351f]"
              />
            </div>
          )}

          {/* Additional Message */}
          <div>
            <label
              htmlFor="request-message"
              className="text-sm font-semibold text-[#2f211b]"
            >
              Additional Message
            </label>

            <textarea
              id="request-message"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Add any additional details..."
              className="mt-2 min-h-[90px] w-full resize-none rounded-lg border border-[#8b7568] bg-white p-3 text-sm outline-none focus:ring-2 focus:ring-[#63351f]"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-[#63351f] px-5 py-3 text-sm font-semibold text-[#63351f] hover:bg-[#ead7ca]"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-full bg-[#63351f] px-5 py-3 text-sm font-semibold text-white hover:bg-[#4e2818]"
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