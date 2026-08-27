import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Search, MapPin } from "lucide-react";
import JobCard from "../components/JobCard";
import { getAvailableJobs, isLoggedIn } from "../lib/api";

export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [locationInput, setLocationInput] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn()) {
      setLoading(false);
      return;
    }
    getAvailableJobs()
      .then((data) => setJobs((data.availableJobs || []).slice(0, 3)))
      .catch(() => setJobs([]))
      .finally(() => setLoading(false));
  }, []);

  function handleSearch(e) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchInput) params.append("search", searchInput);
    if (locationInput) params.append("location", locationInput);
    navigate(`/jobs${params.toString() ? `?${params.toString()}` : ""}`);
  }

  return (
    <div>
      {/* Hero */}
      <section className="bg-white border-b border-line">
        <div className="max-w-5xl mx-auto px-6 py-20 text-center">
          <span className="bg-blue/10 text-blue text-xs font-semibold px-3 py-1 rounded-full">
            Find your next role
          </span>
          <h1 className="font-display font-semibold text-ink text-4xl md:text-5xl mt-5 mb-4 leading-tight">
            Find the work that fits.
          </h1>
          <p className="text-muted text-base max-w-lg mx-auto mb-8">
            JobLink connects job seekers with recruiters who are actively hiring —
            no noise, just real openings.
          </p>

          {/* Search bar */}
          <form
            onSubmit={handleSearch}
            className="bg-white border border-line rounded-xl p-2 flex flex-col sm:flex-row gap-2 max-w-2xl mx-auto shadow-sm"
          >
            <div className="flex items-center gap-2 flex-1 px-3">
              <Search size={18} className="text-muted" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Job title or keyword"
                className="w-full py-2.5 text-sm outline-none"
              />
            </div>
            <div className="hidden sm:block w-px bg-line" />
            <div className="flex items-center gap-2 flex-1 px-3">
              <MapPin size={18} className="text-muted" />
              <input
                type="text"
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                placeholder="Location"
                className="w-full py-2.5 text-sm outline-none"
              />
            </div>
            <button
              type="submit"
              className="bg-amber text-ink font-semibold text-sm px-6 py-2.5 rounded-lg hover:-translate-y-0.5 transition"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display font-semibold text-ink text-2xl">Featured jobs</h2>
          <Link to="/jobs" className="text-blue text-sm font-semibold hover:underline">
            View all jobs →
          </Link>
        </div>

        {!isLoggedIn() && (
          <div className="bg-white border border-line rounded-xl p-8 text-center text-muted text-sm">
            <Link to="/login" className="text-blue font-semibold hover:underline">Log in</Link> to see available jobs.
          </div>
        )}

        {isLoggedIn() && loading && (
          <p className="text-muted text-sm">Loading...</p>
        )}

        {isLoggedIn() && !loading && jobs.length === 0 && (
          <div className="bg-white border border-line rounded-xl p-8 text-center text-muted text-sm">
            No jobs posted yet — check back soon.
          </div>
        )}

        {isLoggedIn() && !loading && jobs.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}