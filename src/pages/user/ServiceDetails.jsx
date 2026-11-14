import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import LoginRequired from "../../components/user/LoginRequired";
import CreditsBadge from "../../components/user/CreditsBadge";
import RequestSessionForm from "../../components/user/RequestSessionForm";
import Stars from "../../components/user/Stars";

import { useApp } from "../../context/AppContext";

function ServiceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, getService, getUser, reviews } = useApp();

  const [showLoginRequired, setShowLoginRequired] = useState(false);
  const [showRequestForm, setShowRequestForm] = useState(false);

  const isLoggedIn = Boolean(currentUser);
  const credits = currentUser?.credits ?? 0;

  const found = getService(Number(id));
  const service = found?.status === "Active" ? found : null;
  const provider = service && getUser(service.providerId);
  const serviceReviews = reviews.filter((r) => r.serviceId === service?.id);
  const isOwn = currentUser?.id === service?.providerId;

  if (!service) {
    return (
      <div className="flex min-h-screen flex-col bg-white">
        <Navbar />

        <main className="flex flex-1 flex-col items-center justify-center px-5 py-20 text-center">
          <h1 className="text-2xl font-bold text-stone-900">
            Service Not Found
          </h1>

          <Link
            to="/browse"
            className="mt-5 rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white"
          >
            Back to Browse
          </Link>
        </main>

        <Footer />
      </div>
    );
  }

  const handleRequest = () => {
    if (!isLoggedIn) {
      setShowLoginRequired(true);
      return;
    }

    if (credits < service.credits) {
      alert("You do not have enough credits.");
      return;
    }

    setShowRequestForm(true);
  };

  const handleRequestSubmitted = () => {
    setShowRequestForm(false);
    navigate("/requests");
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />

      <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-8 sm:px-8">
        <Link
          to="/browse"
          className="text-sm font-semibold text-brand underline"
        >
          ← Back to Browse
        </Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-[2fr_1fr]">
          <section className="rounded-xl border border-brand-light bg-cream p-6">
            <span className="rounded-full bg-brand-light px-3 py-1 text-xs font-semibold text-brand">
              {service.category}
            </span>

            <h1 className="mt-6 text-3xl font-bold text-stone-900">
              {service.title}
            </h1>

            <p className="mt-4 text-sm leading-6 text-stone-600">
              {service.description}
            </p>

            <div className="mt-8 border-t border-brand-light pt-6">
              <h2 className="font-bold text-stone-900">
                Service Provider
              </h2>

              <p className="mt-2 text-sm text-stone-600">
                <Link
                  to={`/users/${service.providerId}`}
                  className="font-semibold text-brand hover:underline"
                >
                  {provider?.name}
                </Link>
              </p>

              <p className="mt-3 text-sm text-brand">
                {service.reviewsCount > 0
                  ? `⭐ ${service.rating.toFixed(1)} (${service.reviewsCount} ${service.reviewsCount === 1 ? "review" : "reviews"})`
                  : "⭐ New"}
              </p>
            </div>

            {/* Reviews */}
            <div className="mt-8 border-t border-brand-light pt-6">
              <h2 className="font-bold text-stone-900">Reviews</h2>

              {serviceReviews.length === 0 ? (
                <p className="mt-2 text-sm text-stone-600">No reviews yet.</p>
              ) : (
                <ul className="mt-3 space-y-4">
                  {serviceReviews.map((r) => (
                    <li key={r.id} className="text-sm">
                      <div className="flex flex-wrap items-center gap-2">
                        <Stars value={r.stars} size={14} />
                        <span className="font-semibold text-stone-900">
                          {getUser(r.reviewerId)?.name}
                        </span>
                        <span className="text-xs text-stone-500">{r.date}</span>
                      </div>
                      {r.comment && (
                        <p className="mt-1 leading-6 text-stone-600">{r.comment}</p>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>

          <aside className="h-fit rounded-xl border border-brand-light bg-cream p-6">
            <h2 className="text-xl font-bold text-stone-900">
              Service Details
            </h2>

            <div className="mt-5 space-y-4 text-sm text-stone-600">
              <div className="flex justify-between">
                <span>Duration</span>
                <span className="font-semibold text-stone-900">
                  {service.durationHours} {service.durationHours === 1 ? "hour" : "hours"}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Cost</span>
                <span className="font-semibold text-brand">
                  {service.credits} {service.credits === 1 ? "Credit" : "Credits"}
                </span>
              </div>

              {isLoggedIn && <CreditsBadge credits={credits} />}
            </div>

            {isOwn ? (
              <button
                type="button"
                disabled
                className="mt-7 w-full cursor-not-allowed rounded-full bg-stone-200 px-5 py-3 font-semibold text-stone-500"
              >
                This is your service
              </button>
            ) : (
              <button
                type="button"
                onClick={handleRequest}
                className="mt-7 w-full rounded-full bg-brand px-5 py-3 font-semibold text-white hover:bg-brand-dark"
              >
                Request Service
              </button>
            )}
          </aside>
        </div>
      </main>

      <Footer />

      {showLoginRequired && (
        <LoginRequired
          onClose={() => setShowLoginRequired(false)}
        />
      )}

      {showRequestForm && (
        <RequestSessionForm
          service={service}
          onClose={() => setShowRequestForm(false)}
          onSubmitted={handleRequestSubmitted}
        />
      )}
    </div>
  );
}

export default ServiceDetails;