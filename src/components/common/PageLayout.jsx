import Navbar from "./Navbar";
import Footer from "./Footer";

// Page frame for user pages: Navbar on top, page content in the middle, Footer at the bottom.
export default function PageLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl flex-1 px-5 py-8 sm:px-8">{children}</main>
      <Footer />
    </div>
  );
}
