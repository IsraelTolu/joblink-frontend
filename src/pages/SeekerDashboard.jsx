import { useState, useEffect } from "react";
import { FileText, Bookmark, User, AlertCircle, CheckCircle2 } from "lucide-react";
import StatusThread from "../components/StatusThread";
import JobCard from "../components/JobCard";
import { getMyApplications, getCurrentUser, getSavedJobs, updateProfile } from "../lib/api";

export default function SeekerDashboard() {
  const [tab, setTab] = useState("applications");
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [savedJobs, setSavedJobs] = useState([]);
  const [savedLoading, setSavedLoading] = useState(true);
  const [savedError, setSavedError] = useState("");

  const currentUser = getCurrentUser();
  const [profileFirstName, setProfileFirstName] = useState(currentUser?.firstName || "");
  const [profileLastName, setProfileLastName] = useState(currentUser?.lastName || "");
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [profileSuccess, setProfileSuccess] = useState(false);
  const user = currentUser;

  
  async function handleProfileSave(e) {
    e.preventDefault();
    setProfileError("");
    setProfileSuccess(false);
    setProfileSaving(true);
    try {
      await updateProfile({ firstName: profileFirstName, lastName: profileLastName });
      setProfileSuccess(true);
    } catch (err) {
      setProfileError(err.message);
    } finally {
      setProfileSaving(false);
    }
  }

  useEffect(() => {
    getMyApplications()
      .then((data) => setApplications(data.applications || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));

    getSavedJobs()
      .then((data) => setSavedJobs(data.savedJobs || []))
      .catch((err) => setSavedError(err.message))
      .finally(() => setSavedLoading(false));
  }, []);

  const navItems = [
    { id: "applications", label: "My Applications", icon: FileText },
    { id: "saved", label: "Saved Jobs", icon: Bookmark },
    { id: "profile", label: "Profile", icon: User },
  ];

  const stageMap = { applied: 0, reviewed: 1, accepted: 2, rejected: "rejected" };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="font-display font-semibold text-ink text-3xl mb-1">
          Welcome back{user?.firstName ? `, ${user.firstName}` : ""}
        </h1>
        <p className="text-muted text-sm">Here's what's happening with your job search.</p>
      </div>

      <div className="grid md:grid-cols-[220px_1fr] gap-8">
        {/* Sidebar nav */}
        <aside className="bg-white border border-line rounded-xl p-4 h-fit">
          <div className="flex items-center gap-3 px-2 py-3 mb-2 border-b border-line">
            <div className="w-10 h-10 rounded-full bg-ink flex items-center justify-center">
              <span className="font-display text-white font-semibold text-sm">
                {user?.firstName?.[0] || "U"}
              </span>
            </div>
            <div>
              <p className="text-sm font-semibold text-ink">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-muted">Job Seeker</p>
            </div>
          </div>

          <nav className="space-y-1 mt-2">
            {navItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                  tab === id ? "bg-blue/10 text-blue" : "text-muted hover:bg-paper"
                }`}
              >
                <Icon size={16} />
                {label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <div>
          {tab === "applications" && (
            <div>
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display font-semibold text-ink text-xl">My Applications</h2>
                <span className="text-xs text-muted">{applications.length} total</span>
              </div>

              {loading && <p className="text-muted text-sm">Loading...</p>}
              {error && <p className="text-red-600 text-sm">{error}</p>}

              {!loading && !error && applications.length === 0 && (
                <div className="bg-white border border-line rounded-xl p-8 text-center text-muted text-sm">
                  You haven't applied to any jobs yet.
                </div>
              )}

              <div className="space-y-4">
                {applications.map((app) => (
                  <div key={app.id} className="bg-white border border-line rounded-xl p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-lg bg-ink flex items-center justify-center flex-shrink-0">
                          <span className="font-display text-white font-semibold text-sm">
                            {app.company?.[0]?.toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-display font-semibold text-ink text-[15px]">
                            {app.title}
                          </h3>
                          <p className="text-muted text-xs">
                            {app.company} · Applied {new Date(app.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="w-full sm:w-56">
                        <StatusThread stage={stageMap[app.status] ?? 0} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "saved" && (
            <div>
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display font-semibold text-ink text-xl">Saved Jobs</h2>
                <span className="text-xs text-muted">{savedJobs.length} total</span>
              </div>

              {savedLoading && <p className="text-muted text-sm">Loading...</p>}
              {savedError && <p className="text-red-600 text-sm">{savedError}</p>}

              {!savedLoading && !savedError && savedJobs.length === 0 && (
                <div className="bg-white border border-line rounded-xl p-8 text-center text-muted text-sm">
                  You haven't saved any jobs yet.
                </div>
              )}

              {!savedLoading && savedJobs.length > 0 && (
                <div className="grid sm:grid-cols-2 gap-5">
                  {savedJobs.map((job) => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </div>
              )}
            </div>
          )}

                    {tab === "profile" && (
            <div className="bg-white border border-line rounded-xl p-6 max-w-lg">
              <h2 className="font-display font-semibold text-ink text-xl mb-5">Profile</h2>

              {profileError && (
                <div className="flex items-center gap-2 bg-red-50 text-red-600 text-sm px-3 py-2.5 rounded-lg mb-4">
                  <AlertCircle size={16} className="flex-shrink-0" />
                  {profileError}
                </div>
              )}

              {profileSuccess && (
                <div className="flex items-center gap-2 bg-green/10 text-green text-sm px-3 py-2.5 rounded-lg mb-4">
                  <CheckCircle2 size={16} className="flex-shrink-0" />
                  Profile updated. Changes will fully apply next time you log in.
                </div>
              )}

              <form onSubmit={handleProfileSave} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-ink mb-1.5 block">First name</label>
                    <input
                      type="text"
                      required
                      minLength={2}
                      value={profileFirstName}
                      onChange={(e) => setProfileFirstName(e.target.value)}
                      className="w-full bg-paper border border-line rounded-lg px-3 py-2.5 text-sm outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-ink mb-1.5 block">Last name</label>
                    <input
                      type="text"
                      required
                      minLength={2}
                      value={profileLastName}
                      onChange={(e) => setProfileLastName(e.target.value)}
                      className="w-full bg-paper border border-line rounded-lg px-3 py-2.5 text-sm outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-ink mb-1.5 block">Email</label>
                  <input
                    type="email"
                    disabled
                    value={user?.email || ""}
                    className="w-full bg-paper border border-line rounded-lg px-3 py-2.5 text-sm outline-none text-muted"
                  />
                  <p className="text-xs text-muted mt-1">Email cannot be changed.</p>
                </div>
                <button
                  type="submit"
                  disabled={profileSaving}
                  className="bg-amber text-ink font-semibold text-sm px-5 py-2.5 rounded-lg hover:-translate-y-0.5 transition disabled:opacity-60"
                >
                  {profileSaving ? "Saving..." : "Save changes"}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}