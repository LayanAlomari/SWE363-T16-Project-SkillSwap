import { Link, NavLink } from "react-router-dom";

function Navbar() {
  const navLinkStyle = ({ isActive }) =>
    `text-sm transition ${
      isActive
        ? "font-bold text-[#63351f]"
        : "text-[#2f211b] hover:text-[#63351f]"
    }`;

  return (
    <header className="w-full border-b border-[#eadfd8] bg-[#fffaf7]">
      <div className="mx-auto flex min-h-[72px] max-w-7xl items-center justify-between px-5 py-3 sm:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#63351f] text-center text-[9px] font-bold leading-3 text-[#63351f]">
            SKILL
            <br />
            SWAP
          </div>

          <span className="hidden text-sm font-bold text-[#63351f] sm:block">
            Skill Swap
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          <NavLink to="/" className={navLinkStyle}>
            Home
          </NavLink>

          <NavLink to="/browse" className={navLinkStyle}>
            Browse
          </NavLink>

          <NavLink to="/how-it-works" className={navLinkStyle}>
            How it works
          </NavLink>
        </nav>

        {/* Authentication Button */}
        <Link
          to="/login"
          className="rounded-full bg-[#63351f] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#4e2818] sm:px-5 sm:text-sm"
        >
          Log in / Sign up
        </Link>
      </div>
    </header>
  );
}



export default Navbar;