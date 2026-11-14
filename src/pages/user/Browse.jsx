import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import SearchBar from "../../components/user/SearchBar";
import FilterBar from "../../components/user/FilterBar";
import ServiceCard from "../../components/common/ServiceCard";
import { useApp } from "../../context/AppContext";

function Browse() {
  const { services, getUser } = useApp();
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  // A category link from the Home page opens Browse already filtered
  const [selectedCategory, setSelectedCategory] =
    useState(searchParams.get("category") || "All Categories");

  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const search = searchTerm.trim().toLowerCase();
      const providerName = getUser(service.providerId)?.name ?? "";

      const matchesSearch =
        service.title.toLowerCase().includes(search) ||
        service.description.toLowerCase().includes(search) ||
        service.category.toLowerCase().includes(search) ||
        providerName.toLowerCase().includes(search);

      const matchesCategory =
        selectedCategory === "All Categories" ||
        service.category === selectedCategory;

      return service.status === "Active" && matchesSearch && matchesCategory;
    });
  }, [services, getUser, searchTerm, selectedCategory]);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All Categories");
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#fffaf7]">
      <Navbar />

      <main className="mx-auto w-full max-w-7xl flex-1 px-5 py-8 sm:px-8">
        <h1 className="text-3xl font-bold text-[#2f211b]">
          Explore Skills
        </h1>

        <p className="mt-2 text-sm text-[#705d52]">
          Discover services offered by our community and find the skills you
          need.
        </p>

        <div className="mt-6">
          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        </div>

        <section className="mt-8">
          <h2 className="mb-4 text-xl font-bold text-[#2f211b]">
            Browse by Category
          </h2>

          <FilterBar
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
        </section>

        <section className="mt-10">
          {filteredServices.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredServices.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-[#5b4a42] bg-[#fffaf7] px-6 py-12 text-center">
              <div className="text-5xl">⌕</div>

              <h2 className="mt-4 text-2xl font-bold text-[#2f211b]">
                No Services Found
              </h2>

              <p className="mt-2 text-sm text-[#705d52]">
                We couldn't find any services matching your search.
                Try another keyword or category.
              </p>

              <button
                type="button"
                onClick={clearFilters}
                className="mt-6 rounded-full bg-[#63351f] px-6 py-3 text-sm font-semibold text-white hover:bg-[#4e2818]"
              >
                Clear Filters
              </button>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Browse;