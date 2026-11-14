import Navbar from "../../components/user/Navbar";
import Footer from "../../components/user/Footer";
import CategoryCard from "../../components/user/CategoryCard";
import ServiceCard from "../../components/user/ServiceCard";
import { mockCategories, mockServices } from "../../data/mockUserData";

function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-[#fffaf7]">
      <Navbar />

      <main className="mx-auto w-full max-w-7xl flex-1 px-5 py-8 sm:px-8">
        {/* Hero Section */}
        <section className="mx-auto max-w-5xl rounded-xl border border-[#5b4a42] bg-[#e8e0d2] px-6 py-12 text-center sm:px-12">
          <h1 className="text-4xl font-bold text-[#1f1713] sm:text-6xl">
            SKILL SWAP
          </h1>

          <h2 className="mt-3 text-xl font-bold text-[#63351f] sm:text-2xl">
            Share Your Skills. Learn From Others.
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-[#3f3028]">
            Exchange your time and skills with members of our community.
            No money needed.
          </p>

          <a
            href="/browse"
            className="mt-7 inline-block rounded-full bg-[#63351f] px-6 py-3 text-sm font-semibold text-white hover:bg-[#4e2818]"
          >
            Explore Skills
          </a>
        </section>

        {/* Platform Introduction */}
        <section className="mx-auto mt-12 max-w-3xl text-center">
          <h2 className="text-2xl font-bold text-[#2f211b]">
            Learn, Share, and Connect
          </h2>

          <p className="mt-3 text-sm leading-6 text-[#705d52]">
            Skill Swap is a community platform where users exchange skills and
            services using Time Credits instead of money.
          </p>
        </section>

        {/* Categories */}
        <section className="mt-12">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-[#2f211b]">
              Browse by Category
            </h2>

            <a
              href="/browse"
              className="text-xs font-semibold text-[#63351f] underline"
            >
              All Categories
            </a>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {mockCategories.map((category) => (
              <CategoryCard
                key={category}
                title={category}
                icon="✦"
                onClick={() => {
                  window.location.href = `/browse?category=${category}`;
                }}
              />
            ))}
          </div>
        </section>

        {/* Featured Services */}
        <section className="mt-12">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-[#2f211b]">
              Available Services
            </h2>

            <a
              href="/browse"
              className="text-xs font-semibold text-[#63351f] underline"
            >
              Explore More
            </a>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {mockServices.slice(0, 3).map((service) => (
              <ServiceCard key={service.id} {...service} />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Home;