import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import Footer from "../common/Footer";

// Shared layout for the Login, Register, Forgot and Reset Password pages:
// the same cream header as the app's navbar (logo only), the page content and the shared footer.
export default function AuthLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="w-full border-b border-brand-light bg-cream">
        <div className="mx-auto flex min-h-[72px] max-w-7xl items-center px-5 py-3 sm:px-8">
          <Link to="/">
            <img src={logo} alt="Skill Swap" className="h-11 w-auto" />
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 px-5 py-10 sm:px-8 sm:py-12">{children}</main>

      <Footer />
    </div>
  );
}
