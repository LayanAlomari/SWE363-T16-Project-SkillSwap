function RequestModal({ service, onClose, onConfirm }) {
  if (!service) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-5">
      <div className="w-full max-w-md rounded-xl border border-[#5b4a42] bg-[#fffaf7] p-6 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-[#2f211b]">
              Request Service
            </h2>

            <p className="mt-1 text-sm text-[#705d52]">
              You are requesting: {service.title}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-xl text-[#63351f]"
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        <label className="mt-5 block text-sm font-semibold text-[#63351f]">
          Add a message
        </label>

        <textarea
          placeholder="Write a short message to the service provider..."
          className="mt-2 min-h-[110px] w-full resize-none rounded-lg border border-[#8b7568] bg-white p-3 text-sm outline-none focus:ring-2 focus:ring-[#63351f]"
        />

        <div className="mt-5 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-[#63351f] px-4 py-2 text-sm font-semibold text-[#63351f]"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="rounded-full bg-[#63351f] px-4 py-2 text-sm font-semibold text-white"
          >
            Send Request
          </button>
        </div>
      </div>
    </div>
  );
}

export default RequestModal;