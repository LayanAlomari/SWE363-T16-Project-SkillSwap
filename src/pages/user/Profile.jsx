import { useState } from "react";
import { Link, Navigate, useLocation, useParams } from "react-router-dom";
import { Pencil, MessageCircle, Star, CalendarDays, GraduationCap, UserX } from "lucide-react";
import PageLayout from "../../components/common/PageLayout";
import ServiceCard from "../../components/common/ServiceCard";
import Stars from "../../components/user/Stars";
import Alert from "../../components/common/Alert";
import { useApp } from "../../context/AppContext";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const formatDate = (iso) => new Date(iso + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

// A titled box used for every section of the profile
function Section({ title, action, children }) {
  return (
    <section className="rounded-xl border border-brand-light bg-white p-5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-stone-900">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

function Chips({ items }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((item) => (
        <li key={item} className="rounded-full bg-brand-light px-3 py-1 text-sm font-semibold text-brand">{item}</li>
      ))}
    </ul>
  );
}

// /profile = my own profile (with Edit), /users/:id = another member's profile
export default function Profile() {
  const { id } = useParams();
  const { currentUser, getUser, services, requests, reviews } = useApp();
  const location = useLocation();
  const [message, setMessage] = useState(location.state?.message || ""); // e.g. after saving Edit profile

  // Opening your own id at /users/:id goes to /profile
  if (id && currentUser && Number(id) === currentUser.id) return <Navigate to="/profile" replace />;

  const user = id ? getUser(Number(id)) : currentUser;
  const isMine = !id;

  if (!user || user.role === "admin" || (user.status === "Suspended" && !isMine)) {
    return (
      <PageLayout>
        <div className="mx-auto max-w-md rounded-xl border border-dashed border-brand-light bg-cream p-10 text-center">
          <UserX size={36} className="mx-auto text-brand" />
          <h1 className="mt-3 text-xl font-bold text-stone-900">Profile not available</h1>
          <p className="mt-1 text-stone-600">This member doesn't exist or their account isn't active.</p>
          <Link to="/browse" className="mt-5 inline-block rounded-lg bg-brand px-4 py-2 font-semibold text-white hover:bg-brand-dark">
            Browse services
          </Link>
        </div>
      </PageLayout>
    );
  }

  const firstName = user.name.split(" ")[0];
  const myServices = services.filter((s) => s.providerId === user.id && (isMine || s.status === "Active"));
  const myReviews = reviews.filter((r) => r.providerId === user.id).sort((a, b) => b.date.localeCompare(a.date));
  const average = myReviews.length ? myReviews.reduce((sum, r) => sum + r.stars, 0) / myReviews.length : 0;
  const sessionsTaught = requests.filter((r) => r.providerId === user.id && r.status === "Completed").length;
  const availability = user.availability || {};
  const hasAvailability = DAYS.some((d) => availability[d]);

  // On my profile, empty sections invite me to fill them in; on others' profiles they are hidden
  const addLink = (text) => (
    <Link to="/profile/edit" className="text-sm font-semibold text-brand hover:underline">{text}</Link>
  );

  return (
    <PageLayout>
      {message && (
        <div className="mb-5">
          <Alert onClose={() => setMessage("")}>{message}</Alert>
        </div>
      )}

      {/* Header */}
      <section className="relative flex flex-col gap-5 rounded-xl border border-brand-light bg-cream p-6 sm:flex-row sm:items-center">
        <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-brand text-3xl font-bold text-white">
          {user.name.charAt(0).toUpperCase()}
        </span>
        <div className="min-w-0 flex-1 sm:pr-44">
          <h1 className="text-3xl font-bold text-stone-900">{user.name}</h1>
          {user.headline ? (
            <p className="mt-1 text-stone-700">{user.headline}</p>
          ) : (
            isMine && <p className="mt-1">{addLink("+ Add a headline")}</p>
          )}
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-stone-700">
            <span className="flex items-center gap-1">
              <Star size={16} className="fill-amber-400 text-amber-400" />
              {myReviews.length ? `${average.toFixed(1)} (${myReviews.length} ${myReviews.length === 1 ? "review" : "reviews"})` : "No reviews yet"}
            </span>
            <span className="flex items-center gap-1">
              <GraduationCap size={16} className="text-brand" /> {sessionsTaught} {sessionsTaught === 1 ? "session" : "sessions"} taught
            </span>
            {user.joined && (
              <span className="flex items-center gap-1"><CalendarDays size={16} className="text-brand" /> Joined {user.joined}</span>
            )}
          </div>
        </div>
        {/* Button in the top-right corner of the card */}
        {isMine ? (
          <Link to="/profile/edit" className="absolute right-4 top-4 flex items-center gap-2 rounded-lg bg-brand px-3 py-2 text-sm font-semibold text-white hover:bg-brand-dark sm:right-6 sm:top-6">
            <Pencil size={16} /> Edit profile
          </Link>
        ) : (
          currentUser && (
            <Link to={`/messages?with=${user.id}`} className="absolute right-4 top-4 flex items-center gap-2 rounded-lg bg-brand px-3 py-2 text-sm font-semibold text-white hover:bg-brand-dark sm:right-6 sm:top-6">
              <MessageCircle size={16} /> Message {firstName}
            </Link>
          )
        )}
      </section>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main column */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          {(user.bio || isMine) && (
            <Section title="About">
              {user.bio ? <p className="text-stone-700">{user.bio}</p> : addLink("+ Write a short bio")}
            </Section>
          )}

          <Section
            title={isMine ? "My services" : `Services by ${firstName}`}
            action={isMine && <Link to="/my-services" className="text-sm font-semibold text-brand hover:underline">Manage →</Link>}
          >
            {myServices.length === 0 ? (
              <p className="text-stone-600">
                {isMine ? (
                  <>You don't offer any services yet. <Link to="/my-services?new=1" className="font-semibold text-brand hover:underline">Add one</Link></>
                ) : (
                  `${firstName} doesn't offer any services right now.`
                )}
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {myServices.map((s) => <ServiceCard key={s.id} service={s} />)}
              </div>
            )}
          </Section>

          <Section title={`Reviews (${myReviews.length})`}>
            {myReviews.length === 0 ? (
              <p className="text-stone-600">{isMine ? "You don't have any reviews yet." : `${firstName} doesn't have any reviews yet.`}</p>
            ) : (
              <ul className="divide-y divide-brand-light">
                {myReviews.map((r) => {
                  const reviewer = getUser(r.reviewerId);
                  return (
                    <li key={r.id} className="py-4 first:pt-0 last:pb-0">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        {/* Only link to reviewers whose profile can be opened */}
                        {reviewer?.status === "Active" ? (
                          <Link to={`/users/${reviewer.id}`} className="font-semibold text-stone-900 hover:text-brand hover:underline">
                            {reviewer.name}
                          </Link>
                        ) : (
                          <span className="font-semibold text-stone-900">{reviewer?.name ?? "Former member"}</span>
                        )}
                        <Stars value={r.stars} />
                      </div>
                      <p className="text-xs text-stone-500">
                        {services.find((s) => s.id === r.serviceId)?.title ?? "Service"} · {formatDate(r.date)}
                      </p>
                      {r.comment && <p className="mt-2 text-stone-700">{r.comment}</p>}
                    </li>
                  );
                })}
              </ul>
            )}
          </Section>
        </div>

        {/* Side column */}
        <div className="flex flex-col gap-6">
          {(user.skills?.length > 0 || isMine) && (
            <Section title="Skills">
              {user.skills?.length ? <Chips items={user.skills} /> : addLink("+ Add your skills")}
            </Section>
          )}
          {(user.wantsToLearn?.length > 0 || isMine) && (
            <Section title="Wants to learn">
              {user.wantsToLearn?.length ? <Chips items={user.wantsToLearn} /> : addLink("+ Add what you want to learn")}
            </Section>
          )}
          {(user.languages?.length > 0 || isMine) && (
            <Section title="Languages">
              {user.languages?.length ? <Chips items={user.languages} /> : addLink("+ Add languages")}
            </Section>
          )}
          {(hasAvailability || isMine) && (
            <Section title="Availability">
              {hasAvailability ? (
                <ul className="flex flex-col gap-2 text-sm">
                  {DAYS.map((day) => (
                    <li key={day} className="flex justify-between gap-3">
                      <span className={availability[day] ? "font-semibold text-stone-800" : "text-stone-400"}>{day}</span>
                      <span className={availability[day] ? "text-stone-700" : "text-stone-400"}>{availability[day] || "Not available"}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                addLink("+ Set your availability")
              )}
            </Section>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
