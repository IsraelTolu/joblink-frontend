import { useState, useEffect } from "react";
import { Briefcase, Menu, X, Search, Users, LogIn, UserPlus, LogOut, LayoutDashboard } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { isLoggedIn, logout, getCurrentUser } from "../lib/api";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(isLoggedIn());
  const [user, setUser] = useState(getCurrentUser());
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setLoggedIn(isLoggedIn());
    setUser(getCurrentUser());
  }, [location]);

  const close = () => setOpen(false);

  function handleLogout() {
    logout();
    close();
    navigate("/");
    setLoggedIn(false);
  }

  const dashboardPath = user?.role === "recruiter" ? "/recruiter" : user?.role === "admin" ? "/admin" : "/dashboard";
  const recruiterLinkPath = loggedIn && user?.role === "recruiter" ? "/recruiter" : "/register";

  return (
    <header className="bg-white border-b border-line sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2" onClick={close}>
          <div className="w-8 h-8 rounded-lg bg-ink flex items-center justify-center">
            <Briefcase size={16} className="text-amber" />
          </div>
          <span className="font-display font-semibold text-ink text-lg">JobLink</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted">
          <Link to="/jobs" className="hover:text-ink transition">Find Jobs</Link>
          <Link to={recruiterLinkPath} className="hover:text-ink transition">For Recruiters</Link>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {loggedIn ? (
            <>
              <Link
                to={dashboardPath}
                className="flex items-center gap-1.5 text-sm font-semibold text-ink px-4 py-2 hover:text-blue transition"
              >
                <LayoutDashboard size={16} /> Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 bg-ink text-white text-sm font-semibold px-4 py-2 rounded-lg hover:-translate-y-0.5 transition"
              >
                <LogOut size={15} /> Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-semibold text-ink px-4 py-2 hover:text-blue transition">
                Log in
              </Link>
              <Link
                to="/register"
                className="bg-amber text-ink text-sm font-semibold px-4 py-2 rounded-lg hover:-translate-y-0.5 transition"
              >
                Sign up
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden w-9 h-9 flex items-center justify-center text-ink z-50"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Backdrop overlay */}
      <div
        onClick={close}
        className={`md:hidden fixed inset-0 bg-ink/40 transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Slide-in mobile panel */}
      <div
        className={`md:hidden fixed top-0 right-0 h-full w-72 bg-white shadow-2xl transition-transform duration-300 ease-out flex flex-col ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-16 flex items-center px-6 border-b border-line">
          <span className="font-display font-semibold text-ink text-lg">Menu</span>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          <Link
            to="/jobs"
            onClick={close}
            className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-ink hover:bg-paper transition"
          >
            <Search size={17} className="text-muted" /> Find Jobs
          </Link>
          <Link
            to={recruiterLinkPath}
            onClick={close}
            className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-ink hover:bg-paper transition w-full text-left"
          >
            <Users size={17} className="text-muted" /> For Recruiters
          </Link>
          {loggedIn && (
            <Link
              to={dashboardPath}
              onClick={close}
              className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-ink hover:bg-paper transition"
            >
              <LayoutDashboard size={17} className="text-muted" /> Dashboard
            </Link>
          )}
        </nav>

        <div className="p-4 border-t border-line space-y-2">
          {loggedIn ? (
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 bg-ink text-white text-sm font-semibold rounded-lg py-2.5 w-full"
            >
              <LogOut size={16} /> Log out
            </button>
          ) : (
            <>
              <Link
                to="/login"
                onClick={close}
                className="flex items-center justify-center gap-2 text-sm font-semibold text-ink border border-line rounded-lg py-2.5"
              >
                <LogIn size={16} /> Log in
              </Link>
              <Link
                to="/register"
                onClick={close}
                className="flex items-center justify-center gap-2 bg-amber text-ink text-sm font-semibold rounded-lg py-2.5"
              >
                <UserPlus size={16} /> Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}