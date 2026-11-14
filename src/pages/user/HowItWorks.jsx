import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";

function HowItWorks() {
  const steps = [
    {
      number: "1",
      title: "Explore Skills",
      description: "Find a service or skill you need.",
    },
    {
      number: "2",
      title: "Request a Service",
      description: "Use your Time Credits to request a service.",
    },
    {
      number: "3",
      title: "Share Your Skills",
      description: "Help others and earn more Time Credits.",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-[#fffaf7]">
      <Navbar />

      <main className="mx-auto w-full max-w-7xl flex-1 px-5 py-10 sm:px-8">
        <section className="mx-auto max-w-5xl">
          <h1 className="text-3xl font-bold text-[#2f211b] sm:text-4xl">
            How Skill Swap Works
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#705d52]">
            Skill Swap helps people exchange knowledge and services using Time
            Credits instead of money.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {steps.map((step) => (
              <article
                key={step.number}
                className="border border-[#5b4a42] bg-[#fffaf7] p-6 text-center"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#63351f] text-xl font-bold text-white">
                  {step.number}
                </div>

                <h2 className="mt-5 text-lg font-bold text-[#2f211b]">
                  {step.title}
                </h2>

                <p className="mt-3 text-sm leading-6 text-[#705d52]">
                  {step.description}
                </p>
              </article>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default HowItWorks;