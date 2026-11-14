import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X, Clock, ChevronDown, LogOut } from "lucide-react";
import { useApp } from "../../context/AppContext";
import logo from "../../assets/logo.png";

// Links shown before and after logging in
const guestLinks = [
  ["Home", "/"],
  ["Browse", "/browse"],
  ["How it works", "/how-it-works"],
];
// For logged-in users, "Home" is their dashboard
const userLinks = [
  ["Home", "/dashboard"],
  ["Browse", "/browse"],
  ["My Services", "/my-services"],
  ["Requests", "/requests"],
  ["Messages", "/messages"],
];
// Links inside the avatar menu
const accountLinks = [
  ["My profile", "/profile"], // "Edit profile" is a button on this page
  ["Wallet & credit history", "/wallet"],
];

export default function Navbar() {
  const { currentUser, logout } = useApp();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false); // mobile menu
  const [accountOpen, setAccountOpen] = useState(false); // avatar menu (desktop)
  const accountRef = useRef(null);
  const links = currentUser ? userLinks : guestLinks;

  // Close the avatar menu when clicking outside it or pressing Escape
  useEffect(() => {
    if (!accountOpen) return;
    const onClick = (e) => {
      if (accountRef.current && !accountRef.current.contains(e.target)) setAccountOpen(false);
    };
    const onKey = (e) => e.key === "Escape" && setAccountOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [accountOpen]);

  function closeMenus() {
    setMenuOpen(false);
    setAccountOpen(false);
  }

  function handleLogout() {
    closeMenus();
    logout();
    navigate("/login");
  }

  const linkStyle = ({ isActive }) =>
    `rounded-lg px-3 py-2 text-sm transition ${
      isActive ? "bg-brand-light font-bold text-brand" : "text-stone-800 hover:text-brand"
    }`;

  const initial = currentUser?.name.charAt(0).toUpperCase();

  const creditsLink = currentUser && (
    <Link
      to="/wallet"
      onClick={closeMenus}
      aria-label={`Time Credit balance: ${currentUser.credits} credits`}
      className="flex items-center justify-center gap-2 rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark"
    >
      <Clock size={16} /> {currentUser.credits} Credits
    </Link>
  );

  const loginButton = (
    <Link
      to="/login"
      onClick={closeMenus}
      className="rounded-full bg-brand px-5 py-2 text-center text-sm font-semibold text-white hover:bg-brand-dark"
    >
      Log in / Sign up
    </Link>
  );

  return (
    <header className="sticky top-0 z-40 w-full border-b border-brand-light bg-cream">
      <div className="mx-auto flex min-h-[72px] max-w-7xl items-center gap-4 px-5 py-3 sm:px-8">
        <Link to={currentUser ? "/dashboard" : "/"} onClick={closeMenus} className="shrink-0">
          <img src={logo} alt="Skill Swap" className="h-11 w-auto" />
        </Link>

        {/* Desktop links */}
        <nav aria-label="Main" className="hidden flex-1 items-center gap-1 md:flex">
          {links.map(([label, path]) => (
            <NavLink key={path} to={path} end={path === "/"} className={linkStyle}>
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Desktop right side */}
        <div className="ml-auto hidden items-center gap-3 md:flex">
          {!currentUser && loginButton}
          {currentUser && (
            <>
              {creditsLink}

              {/* Avatar menu */}
              <div className="relative" ref={accountRef}>
                <button
                  type="button"
                  onClick={() => setAccountOpen((o) => !o)}
                  aria-label="Account menu"
                  aria-haspopup="menu"
                  aria-expanded={accountOpen}
                  className="flex items-center gap-1 rounded-full p-1 text-brand hover:bg-brand-light"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-light font-bold">{initial}</span>
                  <ChevronDown size={16} className={`transition ${accountOpen ? "rotate-180" : ""}`} />
                </button>

                {accountOpen && (
                  <div role="menu" className="absolute right-0 top-12 w-64 rounded-xl border border-brand-light bg-white p-2 shadow-lg">
                    <div className="border-b border-brand-light px-3 pb-3 pt-2">
                      <p className="font-bold text-stone-900">{currentUser.name}</p>
                      <p className="truncate text-sm text-stone-500">{currentUser.email}</p>
                    </div>
                    <div className="py-1">
                      {accountLinks.map(([label, path]) => (
                        <Link
                          key={path}
                          to={path}
                          role="menuitem"
                          onClick={closeMenus}
                          className="block rounded-lg px-3 py-2 text-sm text-stone-800 hover:bg-cream hover:text-brand"
                        >
                          {label}
                        </Link>
                      ))}
                    </div>
                    <div className="border-t border-brand-light pt-1">
                      <button
                        type="button"
                        role="menuitem"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-semibold text-red-700 hover:bg-red-50"
                      >
                        <LogOut size={16} /> Log out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          className="ml-auto rounded-lg p-2 text-brand md:hidden"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav aria-label="Main" className="flex flex-col gap-1 border-t border-brand-light px-5 py-3 md:hidden">
          {links.map(([label, path]) => (
            <NavLink key={path} to={path} end={path === "/"} className={linkStyle} onClick={closeMenus}>
              {label}
            </NavLink>
          ))}

          <div className="mt-2 border-t border-brand-light pt-3">
            {!currentUser && loginButton}
            {currentUser && (
              <>
                <div className="mb-3 flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-light font-bold text-brand">{initial}</span>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-stone-900">{currentUser.name}</p>
                    <p className="truncate text-sm text-stone-500">{currentUser.email}</p>
                  </div>
                  {creditsLink}
                </div>
                {accountLinks.map(([label, path]) => (
                  <NavLink key={path} to={path} className={(state) => linkStyle(state) + " block"} onClick={closeMenus}>
                    {label}
                  </NavLink>
                ))}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-semibold text-red-700 hover:bg-red-50"
                >
                  <LogOut size={16} /> Log out
                </button>
              </>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
