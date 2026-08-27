import { useState, useEffect } from "react";
import { Users, Briefcase, FileText, Trash2, UserCog, TrendingUp } from "lucide-react";
import { getAdminStats, getAdminUsers, deleteAdminUser, getAdminJobs, deleteAdminJob } from "../lib/api";

export default function AdminDashboard() {
  const [tab, setTab] = useState("overview");
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminStats()
      .then((data) => setStats(data.stats))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function loadUsers() {
    getAdminUsers().then((data) => setUsers(data.users || []));
  }

  function loadJobs() {
    getAdminJobs().then((data) => setJobs(data.jobs || []));
  }

  useEffect(() => {
    if (tab === "users") loadUsers();
    if (tab === "jobs") loadJobs();
  }, [tab]);

  async function handleDeleteUser(id, name) {
    if (!confirm(`Delete user "${name}"? This cannot be undone.`)) return;
    try {
      await deleteAdminUser(id);
      loadUsers();
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleDeleteJob(id, title) {
    if (!confirm(`Delete job "${title}"? This cannot be undone.`)) return;
    try {
      await deleteAdminJob(id);
      loadJobs();
    } catch (err) {
      alert(err.message);
    }
  }

  const navItems = [
    { id: "overview", label: "Overview", icon: TrendingUp },
    { id: "users", label: "Users", icon: Users },
    { id: "jobs", label: "Jobs", icon: Briefcase },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="font-display font-semibold text-ink text-3xl mb-1">Admin Dashboard</h1>
        <p className="text-muted text-sm">Platform-wide overview and management.</p>
      </div>

      <div className="grid md:grid-cols-[220px_1fr] gap-8">
        <aside className="bg-white border border-line rounded-xl p-4 h-fit">
          <nav className="space-y-1">
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

        <div>
          {tab === "overview" && (
            <div>
              {loading && <p className="text-muted text-sm">Loading...</p>}
              {!loading && stats && (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <StatCard icon={Users} label="Total Users" value={stats.totalUsers} />
                  <StatCard icon={UserCog} label="Job Seekers" value={stats.totalSeekers} />
                  <StatCard icon={Briefcase} label="Recruiters" value={stats.totalRecruiters} />
                  <StatCard icon={Briefcase} label="Total Jobs" value={stats.totalJobs} />
                  <StatCard icon={FileText} label="Applications" value={stats.totalApplications} />
                </div>
              )}
            </div>
          )}

          {tab === "users" && (
            <div>
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display font-semibold text-ink text-xl">All Users</h2>
                <span className="text-xs text-muted">{users.length} total</span>
              </div>
              <div className="space-y-3">
                {users.map((u) => (
                  <div key={u.id} className="bg-white border border-line rounded-xl p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-ink flex items-center justify-center flex-shrink-0">
                        <span className="font-display text-white font-semibold text-sm">
                          {u.first_name?.[0]}
                        </span>
                      </div>
                      <div>
                        <p className="font-display font-semibold text-ink text-sm">
                          {u.first_name} {u.last_name}
                        </p>
                        <p className="text-muted text-xs">{u.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        u.role === "admin" ? "bg-amber/20 text-amber-800" :
                        u.role === "recruiter" ? "bg-blue/10 text-blue" : "bg-green/10 text-green"
                      }`}>
                        {u.role}
                      </span>
                      {u.role !== "admin" && (
                        <button
                          onClick={() => handleDeleteUser(u.id, `${u.first_name} ${u.last_name}`)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg border border-line text-muted hover:text-red-500 hover:border-red-300 transition"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "jobs" && (
            <div>
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display font-semibold text-ink text-xl">All Jobs</h2>
                <span className="text-xs text-muted">{jobs.length} total</span>
              </div>
              <div className="space-y-3">
                {jobs.map((job) => (
                  <div key={job.id} className="bg-white border border-line rounded-xl p-4 flex items-center justify-between gap-4">
                    <div>
                      <p className="font-display font-semibold text-ink text-sm">{job.title}</p>
                      <p className="text-muted text-xs">
                        {job.company} · {job.location} · Posted by {job.recruiter_first_name} {job.recruiter_last_name}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteJob(job.id, job.title)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg border border-line text-muted hover:text-red-500 hover:border-red-300 transition flex-shrink-0"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="bg-white border border-line rounded-xl p-5">
      <div className="w-10 h-10 rounded-lg bg-blue/10 flex items-center justify-center mb-3">
        <Icon size={18} className="text-blue" />
      </div>
      <p className="font-display font-semibold text-ink text-2xl mb-1">{value}</p>
      <p className="text-muted text-xs">{label}</p>
    </div>
  );
}