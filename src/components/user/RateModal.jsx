import { useEffect, useState } from "react";
import { Star, X, CheckCircle2 } from "lucide-react";

const LABELS = ["", "Poor", "Fair", "Good", "Very good", "Excellent"];
const MAX_COMMENT = 300;

// Pop-up to rate a completed session with 1–5 stars and an optional comment.
// justConfirmed = opened right after the student confirmed the session
export default function RateModal({ serviceTitle, providerName, justConfirmed = false, onSubmit, onCancel }) {
  const [stars, setStars] = useState(0);
  const [hover, setHover] = useState(0); // star under the mouse, to preview the rating
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const shown = hover || stars;

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onCancel();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCancel]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!stars) return setError("Please choose a rating from 1 to 5 stars.");
    onSubmit(stars, comment);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="rate-title"
      onClick={onCancel}
    >
      <form noValidate onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()} className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between gap-3">
          <div>
            {justConfirmed && (
              <p className="mb-1 flex items-center gap-1 text-sm font-semibold text-green-700">
                <CheckCircle2 size={16} /> Session confirmed
              </p>
            )}
            <h2 id="rate-title" className="text-xl font-bold text-stone-900">
              {justConfirmed ? `How was your session with ${providerName.split(" ")[0]}?` : "Rate your session"}
            </h2>
            <p className="mt-1 text-sm text-stone-600">{serviceTitle} with {providerName}</p>
          </div>
          <button type="button" onClick={onCancel} aria-label="Close" className="rounded-lg p-1 text-stone-500 hover:bg-stone-100">
            <X size={20} />
          </button>
        </div>

        <p id="stars-label" className="mt-5 text-sm font-semibold text-stone-800">Your rating</p>
        <div className="mt-2 flex items-center gap-3">
          <div role="radiogroup" aria-labelledby="stars-label" className="flex gap-1" onMouseLeave={() => setHover(0)}>
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                role="radio"
                aria-checked={stars === n}
                aria-label={`${n} ${n === 1 ? "star" : "stars"}, ${LABELS[n]}`}
                onClick={() => {
                  setStars(n);
                  setError("");
                }}
                onMouseEnter={() => setHover(n)}
                className="rounded p-0.5 focus:outline-none focus:ring-2 focus:ring-brand"
              >
                <Star size={32} className={n <= shown ? "fill-amber-400 text-amber-400" : "text-stone-300"} />
              </button>
            ))}
          </div>
          <span className="text-sm font-semibold text-stone-700" aria-live="polite">{LABELS[shown]}</span>
        </div>
        {error && <p className="mt-2 text-sm text-red-700" role="alert">{error}</p>}

        <label htmlFor="comment" className="mt-5 block text-sm font-semibold text-stone-800">
          Comment <span className="font-normal text-stone-500">(optional)</span>
        </label>
        <textarea
          id="comment"
          rows={3}
          value={comment}
          maxLength={MAX_COMMENT}
          onChange={(e) => setComment(e.target.value)}
          placeholder="What did you like? What could be better?"
          className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand"
        />
        <p className="text-right text-xs text-stone-500">{comment.length}/{MAX_COMMENT}</p>

        <div className="mt-4 flex justify-end gap-3">
          <button type="button" onClick={onCancel} className="rounded-lg border border-stone-300 px-4 py-2 hover:bg-stone-50">
            {justConfirmed ? "Maybe later" : "Cancel"}
          </button>
          <button type="submit" className="rounded-lg bg-brand px-4 py-2 font-semibold text-white hover:bg-brand-dark">Submit rating</button>
        </div>
      </form>
    </div>
  );
}
