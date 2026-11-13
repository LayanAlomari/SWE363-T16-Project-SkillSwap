export default function Footer() {
  return (
    <footer className="mt-auto w-full bg-black px-6 py-5 text-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-center text-xs sm:flex-row sm:text-left">
        <p>© 2026 Skill Swap</p>
        <div className="flex gap-6">
          <a href="#about" className="transition hover:text-[#d99b78]">About</a>
          <a href="#help" className="transition hover:text-[#d99b78]">Help</a>
          <a href="#terms" className="transition hover:text-[#d99b78]">Terms</a>
          <a href="#contact" className="transition hover:text-[#d99b78]">Contact</a>
        </div>
      </div>
    </footer>
  );
}
