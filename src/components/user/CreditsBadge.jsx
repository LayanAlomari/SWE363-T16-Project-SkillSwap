function CreditsBadge({ credits = 2 }) {
  return (
    <div className="flex items-center gap-2 rounded-full bg-[#ead7ca] px-3 py-2 text-xs font-semibold text-[#63351f]">
      <span>◆</span>
      <span>{credits} Credits</span>
    </div>
  );
}

export default CreditsBadge;