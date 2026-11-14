import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import PageLayout from "../../components/common/PageLayout";
import Alert from "../../components/common/Alert";
import TagInput from "../../components/user/TagInput";
import SelectMenu from "../../components/user/SelectMenu";
import { useApp } from "../../context/AppContext";
import { languageOptions } from "../../data/languages";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// Times are stored as minutes after midnight while editing (6:00 AM = 360), and saved as text like "6:00 – 9:00 PM"
const toLabel = (m) => {
  const h = Math.floor(m / 60);
  return `${h % 12 || 12}:${String(m % 60).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`;
};
const TIMES = [];
for (let m = 6 * 60; m <= 23 * 60; m += 30) TIMES.push({ value: m, label: toLabel(m) });

const toMinutes = (time, period) => {
  const [h, min] = time.split(":").map(Number);
  return ((h % 12) + (period === "PM" ? 12 : 0)) * 60 + min;
};
// "6:00 – 9:00 PM" or "11:00 AM – 2:00 PM" -> { from: 1080, to: 1260 }
function parseRange(text) {
  const match = text?.match(/(\d{1,2}:\d{2})\s*(AM|PM)?\s*[–-]\s*(\d{1,2}:\d{2})\s*(AM|PM)/);
  if (!match) return { from: 18 * 60, to: 21 * 60 };
  const [, start, startPeriod, end, endPeriod] = match;
  return { from: toMinutes(start, startPeriod || endPeriod), to: toMinutes(end, endPeriod) };
}
// { from: 1080, to: 1260 } -> "6:00 – 9:00 PM"
function formatRange({ from, to }) {
  const [a, b] = [toLabel(from), toLabel(to)];
  return a.slice(-2) === b.slice(-2) ? `${a.slice(0, -3)} – ${b}` : `${a} – ${b}`;
}

const MAX = { name: 50, headline: 80, bio: 300 };

export default function EditProfile() {
  const { currentUser, updateProfile, users, categories } = useApp();

  // Skill suggestions: the category names plus every skill other members already use (no duplicates, A–Z)
  const skillSuggestions = useMemo(() => {
    const all = [...categories.map((c) => c.name), ...users.flatMap((u) => [...(u.skills || []), ...(u.wantsToLearn || [])])];
    const unique = new Map(all.map((s) => [s.toLowerCase(), s]));
    unique.delete("other");
    return [...unique.values()].sort((a, b) => a.localeCompare(b));
  }, [users, categories]);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: currentUser.name,
    headline: currentUser.headline || "",
    bio: currentUser.bio || "",
    skills: currentUser.skills || [],
    wantsToLearn: currentUser.wantsToLearn || [],
    languages: currentUser.languages || [],
  });
  // { Sunday: { on: true, from: 1080, to: 1260 }, ... }
  const [days, setDays] = useState(() =>
    Object.fromEntries(DAYS.map((d) => [d, { on: !!currentUser.availability?.[d], ...parseRange(currentUser.availability?.[d]) }]))
  );
  const [errors, setErrors] = useState({});
  const [saveError, setSaveError] = useState("");

  const update = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: "" }));
  };
  const updateDay = (day, patch) => {
    setDays((prev) => ({ ...prev, [day]: { ...prev[day], ...patch } }));
    setErrors((e) => ({ ...e, [day]: "" }));
  };

  function validate() {
    const e = {};
    const name = form.name.trim();
    if (name.length < 3) e.name = "Please enter your full name (at least 3 characters).";
    else if (!/^[\p{L}\s'.-]+$/u.test(name)) e.name = "Your name can only contain letters and spaces.";
    DAYS.forEach((d) => {
      if (days[d].on && days[d].to <= days[d].from) e[d] = "The end time must be after the start time.";
    });
    return e;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length) return setSaveError("Please fix the highlighted fields.");
    const result = updateProfile({
      name: form.name.trim(),
      headline: form.headline.trim(),
      bio: form.bio.trim(),
      skills: form.skills,
      wantsToLearn: form.wantsToLearn,
      languages: form.languages,
      availability: Object.fromEntries(DAYS.map((d) => [d, days[d].on ? formatRange(days[d]) : null])),
    });
    if (!result.ok) return setSaveError(result.error);
    navigate("/profile", { state: { message: "Your profile was updated." } });
  }

  const inputStyle = (field) =>
    `w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand ${errors[field] ? "border-red-500" : "border-stone-300"}`;
  const counter = (field) => <p className="mt-1 text-right text-xs text-stone-500">{form[field].length}/{MAX[field]}</p>;
  const card = "rounded-xl border border-brand-light bg-white p-5 sm:p-6";

  return (
    <PageLayout>
      <div className="mx-auto max-w-3xl">
        <Link to="/profile" className="flex w-fit items-center gap-1 text-sm font-semibold text-brand hover:underline">
          <ArrowLeft size={16} /> Back to profile
        </Link>
        <h1 className="mt-3 text-3xl font-bold text-stone-900">Edit profile</h1>
        <p className="mt-1 text-stone-600">This is what other members see when they visit your profile.</p>

        <form noValidate onSubmit={handleSubmit} className="mt-6 flex flex-col gap-6">
          {saveError && <Alert type="error" onClose={() => setSaveError("")}>{saveError}</Alert>}

          {/* About */}
          <section className={card}>
            <h2 className="mb-4 text-lg font-bold text-stone-900">About you</h2>
            <div className="flex flex-col gap-4">
              <div>
                <label htmlFor="name" className="mb-1 block text-sm font-semibold text-stone-800">Full name</label>
                <input
                  id="name"
                  value={form.name}
                  maxLength={MAX.name}
                  onChange={(e) => update("name", e.target.value)}
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? "name-error" : undefined}
                  className={inputStyle("name")}
                />
                {errors.name && <p id="name-error" className="mt-1 text-sm text-red-700">{errors.name}</p>}
              </div>
              <div>
                <label htmlFor="email" className="mb-1 block text-sm font-semibold text-stone-800">Email</label>
                <input id="email" value={currentUser.email} disabled className="w-full rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-stone-500" />
                <p className="mt-1 text-xs text-stone-500">Your email is used to log in and can't be changed here.</p>
              </div>
              <div>
                <label htmlFor="headline" className="mb-1 block text-sm font-semibold text-stone-800">
                  Headline <span className="font-normal text-stone-500">(optional)</span>
                </label>
                <input
                  id="headline"
                  value={form.headline}
                  maxLength={MAX.headline}
                  onChange={(e) => update("headline", e.target.value)}
                  placeholder="e.g. English teacher · Riyadh"
                  className={inputStyle("headline")}
                />
                {counter("headline")}
              </div>
              <div>
                <label htmlFor="bio" className="mb-1 block text-sm font-semibold text-stone-800">
                  Bio <span className="font-normal text-stone-500">(optional)</span>
                </label>
                <textarea
                  id="bio"
                  rows={4}
                  value={form.bio}
                  maxLength={MAX.bio}
                  onChange={(e) => update("bio", e.target.value)}
                  placeholder="Tell other members what you can teach and what you enjoy."
                  className={inputStyle("bio")}
                />
                {counter("bio")}
              </div>
            </div>
          </section>

          {/* Skills */}
          <section className={card}>
            <h2 className="mb-4 text-lg font-bold text-stone-900">Skills and languages</h2>
            <div className="flex flex-col gap-4">
              <TagInput id="skills" label="Skills I can teach" tags={form.skills} onChange={(t) => update("skills", t)} suggestions={skillSuggestions} placeholder="e.g. Python" />
              <TagInput id="wantsToLearn" label="Skills I want to learn" tags={form.wantsToLearn} onChange={(t) => update("wantsToLearn", t)} suggestions={skillSuggestions} placeholder="e.g. Photography" />
              <TagInput id="languages" label="Languages I speak" tags={form.languages} onChange={(t) => update("languages", t)} suggestions={languageOptions} allowCustom={false} placeholder="Search languages" />
            </div>
          </section>

          {/* Availability */}
          <section className={card}>
            <h2 className="text-lg font-bold text-stone-900">Availability</h2>
            <p className="mb-4 mt-1 text-sm text-stone-600">Turn on the days you're free, and choose the times members can request sessions.</p>
            <ul className="divide-y divide-brand-light">
              {DAYS.map((day) => {
                const d = days[day];
                return (
                  <li key={day} className="py-3">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                      {/* On / off switch */}
                      <label className="flex w-40 cursor-pointer items-center gap-3">
                        <input
                          type="checkbox"
                          role="switch"
                          checked={d.on}
                          onChange={(e) => updateDay(day, { on: e.target.checked })}
                          className="peer sr-only"
                        />
                        <span className="relative h-6 w-11 shrink-0 rounded-full bg-stone-300 transition peer-checked:bg-brand peer-focus-visible:ring-2 peer-focus-visible:ring-brand peer-focus-visible:ring-offset-2 after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:transition peer-checked:after:translate-x-5" />
                        <span className={`font-semibold ${d.on ? "text-stone-900" : "text-stone-500"}`}>{day}</span>
                      </label>

                      {d.on ? (
                        <div className="flex flex-1 items-center gap-2">
                          <span id={`${day}-from-label`} className="sr-only">{day} from</span>
                          <div className="flex-1">
                            <SelectMenu id={`${day}-from`} labelId={`${day}-from-label`} options={TIMES} value={d.from} onChange={(v) => updateDay(day, { from: v })} />
                          </div>
                          <span className="text-stone-500">to</span>
                          <span id={`${day}-to-label`} className="sr-only">{day} to</span>
                          <div className="flex-1">
                            <SelectMenu id={`${day}-to`} labelId={`${day}-to-label`} options={TIMES} value={d.to} onChange={(v) => updateDay(day, { to: v })} />
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm text-stone-400">Not available</span>
                      )}
                    </div>
                    {errors[day] && <p className="mt-2 text-sm text-red-700 sm:ml-40">{errors[day]}</p>}
                  </li>
                );
              })}
            </ul>
          </section>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Link to="/profile" className="rounded-lg border border-stone-300 px-5 py-2 text-center font-semibold text-stone-700 hover:bg-stone-50">
              Cancel
            </Link>
            <button type="submit" className="rounded-lg bg-brand px-5 py-2 font-semibold text-white hover:bg-brand-dark">
              Save changes
            </button>
          </div>
        </form>
      </div>
    </PageLayout>
  );
}
