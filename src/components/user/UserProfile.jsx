import CreditsBadge from "./CreditsBadge";

function UserProfile({ user, credits = 2 }) {
  return (
    <section className="rounded-xl border border-[#5b4a42] bg-[#fffaf7] p-5">
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#ead7ca] text-2xl font-bold text-[#63351f]">
          {user?.name?.charAt(0).toUpperCase() || "U"}
        </div>

        <div className="flex-1">
          <h2 className="text-xl font-bold text-[#2f211b]">
            {user?.name || "User Name"}
          </h2>

          <p className="mt-1 text-sm text-[#705d52]">
            {user?.email || "user@example.com"}
          </p>
        </div>

        <CreditsBadge credits={credits} />
      </div>
    </section>
  );
}

export default UserProfile;