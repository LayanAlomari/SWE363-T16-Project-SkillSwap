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
      <div className="flex min-h-screen flex-col bg-[#fffaf7]">
        <Navbar />

        <main className="flex flex-1 flex-col items-center justify-center px-5 py-20 text-center">
          <h1 className="text-2xl font-bold text-[#2f211b]">
            Service Not Found
          </h1>

          <Link
            to="/browse"
            className="mt-5 rounded-full bg-[#63351f] px-5 py-3 text-sm font-semibold text-white"
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
    <div className="flex min-h-screen flex-col bg-[#fffaf7]">
      <Navbar />

      <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-8 sm:px-8">
        <Link
          to="/browse"
          className="text-sm font-semibold text-[#63351f] underline"
        >
          ← Back to Browse
        </Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-[2fr_1fr]">
          <section className="rounded-xl border border-[#5b4a42] bg-[#fffaf7] p-6">
            <span className="rounded-full bg-[#ead7ca] px-3 py-1 text-xs font-semibold text-[#63351f]">
              {service.category}
            </span>

            <h1 className="mt-6 text-3xl font-bold text-[#2f211b]">
              {service.title}
            </h1>

            <p className="mt-4 text-sm leading-6 text-[#705d52]">
              {service.description}
            </p>

            <div className="mt-8 border-t border-[#eadfd8] pt-6">
              <h2 className="font-bold text-[#2f211b]">
                Service Provider
              </h2>

              <p className="mt-2 text-sm text-[#705d52]">
                <Link
                  to={`/users/${service.providerId}`}
                  className="font-semibold text-[#63351f] hover:underline"
                >
                  {provider?.name}
                </Link>
              </p>

              <p className="mt-3 text-sm text-[#63351f]">
                {service.reviewsCount > 0
                  ? `⭐ ${service.rating.toFixed(1)} (${service.reviewsCount} ${service.reviewsCount === 1 ? "review" : "reviews"})`
                  : "⭐ New"}
              </p>
            </div>

            {/* Reviews */}
            <div className="mt-8 border-t border-[#eadfd8] pt-6">
              <h2 className="font-bold text-[#2f211b]">Reviews</h2>

              {serviceReviews.length === 0 ? (
                <p className="mt-2 text-sm text-[#705d52]">No reviews yet.</p>
              ) : (
                <ul className="mt-3 space-y-4">
                  {serviceReviews.map((r) => (
                    <li key={r.id} className="text-sm">
                      <div className="flex flex-wrap items-center gap-2">
                        <Stars value={r.stars} size={14} />
                        <span className="font-semibold text-[#2f211b]">
                          {getUser(r.reviewerId)?.name}
                        </span>
                        <span className="text-xs text-[#927d70]">{r.date}</span>
                      </div>
                      {r.comment && (
                        <p className="mt-1 leading-6 text-[#705d52]">{r.comment}</p>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>

          <aside className="h-fit rounded-xl border border-[#5b4a42] bg-[#f8eee8] p-6">
            <h2 className="text-xl font-bold text-[#2f211b]">
              Service Details
            </h2>

            <div className="mt-5 space-y-4 text-sm text-[#705d52]">
              <div className="flex justify-between">
                <span>Duration</span>
                <span className="font-semibold text-[#2f211b]">
                  {service.durationHours} {service.durationHours === 1 ? "hour" : "hours"}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Cost</span>
                <span className="font-semibold text-[#63351f]">
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
                className="mt-7 w-full rounded-full bg-[#63351f] px-5 py-3 font-semibold text-white hover:bg-[#4e2818]"
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