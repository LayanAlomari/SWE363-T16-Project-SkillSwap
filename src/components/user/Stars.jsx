import { Star } from "lucide-react";

// Shows a rating as 5 stars, e.g. <Stars value={4} /> -> ★★★★☆
export default function Stars({ value, size = 16 }) {
  return (
    <span className="inline-flex items-center gap-0.5" role="img" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} size={size} className={n <= value ? "fill-amber-400 text-amber-400" : "text-stone-300"} />
      ))}
    </span>
  );
}
