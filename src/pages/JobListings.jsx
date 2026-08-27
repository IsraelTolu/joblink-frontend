import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Search, MapPin, SlidersHorizontal, AlertCircle } from "lucide-react";
import JobCard from "../components/JobCard";
import { getAvailableJobs, isLoggedIn } from "../lib/api";

export default function JobListings() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(searchParams.get("search") || "");
  const [locationInput, setLocationInput] = useState(searchParams.get("location") || "");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const search = searchParams.get("search") || "";
  const location = searchParams.get("location") || "";

  useEffect(() => {
    if (!isLoggedIn()) {
      setError("LOGIN_REQUIRED");
      setLoading(false);
      return;
    }

    setLoading(true);
    getAvailableJobs({ search, location })
      .then((data) => setJobs(data.availableJobs || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [search, location]);

  function handleSearch(e) {
    e.preventDefault();
    const params = {};
    if (searchInput) params.search = searchInput;
    if (locationInput) params.location = locationInput;
    setSearchParams(params);
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="font-display font-semibold text-ink text-3xl mb-2">
          {search || location ? "Search results" : "All jobs"}
        </h1>
        <p className="text-muted text-sm">
          {loading ? "Loading..." : `Showing ${jobs.length} results`}
        </p>
      </div>

      {/* Search bar */}
      <form
        onSubmit={handleSearch}
        className="bg-white border border-line rounded-xl p-2 flex flex-col sm:flex-row gap-2 mb-8 shadow-sm"
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

      <div className="grid md:grid-cols-[220px_1fr] gap-8">
        {/* Filters sidebar */}
        <aside className="bg-white border border-line rounded-xl p-5 h-fit">
          <div className="flex items-center gap-2 mb-4">
            <SlidersHorizontal size={16} className="text-ink" />
            <h3 className="font-display font-semibold text-ink text-sm">Filters</h3>
          </div>
          <p className="text-xs text-muted">More filters coming soon.</p>
        </aside>

        {/* Results */}
        <div>
          {error === "LOGIN_REQUIRED" && (
            <div className="bg-white border border-line rounded-xl p-8 text-center">
              <AlertCircle className="mx-auto mb-3 text-amber" size={28} />
              <p className="font-display font-semibold text-ink text-lg mb-2">
                Log in to view jobs
              </p>
              <p className="text-muted text-sm mb-5">
                You need an account to browse available job postings.
              </p>
              <Link
                to="/login"
                className="inline-block bg-amber text-ink font-semibold text-sm px-6 py-2.5 rounded-lg"
              >
                Log in
              </Link>
            </div>
          )}

          {error && error !== "LOGIN_REQUIRED" && (
            <div className="bg-red-50 text-red-600 text-sm p-4 rounded-xl">{error}</div>
          )}

          {!error && !loading && jobs.length === 0 && (
            <div className="bg-white border border-line rounded-xl p-8 text-center text-muted text-sm">
              {search || location ? "No jobs match your search." : "No jobs posted yet — check back soon."}
            </div>
          )}

          {!error && jobs.length > 0 && (
            <div className="grid sm:grid-cols-2 gap-5">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}