import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import CategoryCard from "../../components/user/CategoryCard";
import ServiceCard from "../../components/common/ServiceCard";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";

function Home() {
  const { services, categories } = useApp();
  const navigate = useNavigate();
  const featured = services.filter((s) => s.status === "Active").slice(0, 3);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />

      <main className="mx-auto w-full max-w-7xl flex-1 px-5 py-8 sm:px-8">
        {/* Hero Section */}
        <section className="mx-auto max-w-5xl rounded-xl border border-brand-light bg-brand-light px-6 py-12 text-center sm:px-12">
          <h1 className="text-4xl font-bold text-stone-900 sm:text-6xl">
            SKILL SWAP
          </h1>

          <h2 className="mt-3 text-xl font-bold text-brand sm:text-2xl">
            Share Your Skills. Learn From Others.
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-stone-700">
            Exchange your time and skills with members of our community.
            No money needed.
          </p>

          <a
            href="/browse"
            className="mt-7 inline-block rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-dark"
          >
            Explore Skills
          </a>
        </section>

        {/* Platform Introduction */}
        <section className="mx-auto mt-12 max-w-3xl text-center">
          <h2 className="text-2xl font-bold text-stone-900">
            Learn, Share, and Connect
          </h2>

          <p className="mt-3 text-sm leading-6 text-stone-600">
            Skill Swap is a community platform where users exchange skills and
            services using Time Credits instead of money.
          </p>
        </section>

        {/* Categories */}
        <section className="mt-12">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-stone-900">
              Browse by Category
            </h2>

            <a
              href="/browse"
              className="text-xs font-semibold text-brand underline"
            >
              All Categories
            </a>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                title={category.name}
                icon="✦"
                onClick={() => navigate(`/browse?category=${encodeURIComponent(category.name)}`)}
              />
            ))}
          </div>
        </section>

        {/* Featured Services */}
        <section className="mt-12">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-stone-900">
              Available Services
            </h2>

            <a
              href="/browse"
              className="text-xs font-semibold text-brand underline"
            >
              Explore More
            </a>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
              />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Home;