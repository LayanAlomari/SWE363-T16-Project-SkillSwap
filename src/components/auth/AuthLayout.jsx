import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";

// Shared layout for the authentication pages: cream header with the logo + white page.
export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-white">
      <header className="bg-[#fbf6f3]">
        <div className="mx-auto flex max-w-6xl items-center px-5 py-3 sm:px-12">
          <Link to="/">
            <img src={logo} alt="Skill Swap" className="h-14 w-auto" />
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-10 sm:px-12">{children}</main>
    </div>
  );
}
