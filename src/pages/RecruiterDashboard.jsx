import { useState, useEffect } from "react";
import { Briefcase, Users, Plus, MapPin, Trash2, AlertCircle, X, FileText } from "lucide-react";
import { getMyJobs, createJob, deleteJob, getJobApplicants, updateApplicationStatus } from "../lib/api";
import StatusThread from "../components/StatusThread";

export default function RecruiterDashboard() {
  const [tab, setTab] = useState("postings");
  const [postings, setPostings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: "", description: "", location: "", company: "" });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const [selectedJob, setSelectedJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [applicantsLoading, setApplicantsLoading] = useState(false);

  function loadJobs() {
    setLoading(true);
    getMyJobs()
      .then((data) => setPostings(data.getRecruiterJobs || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadJobs();
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    setFormError("");
    setSubmitting(true);
    try {
      await createJob(formData);
      setFormData({ title: "", description: "", location: "", company: "" });
      setShowForm(false);
      loadJobs();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this job posting?")) return;
    try {
      await deleteJob(id);
      loadJobs();
    } catch (err) {
      alert(err.message);
    }
  }

  function viewApplicants(job) {
    setSelectedJob(job);
    setTab("applicants");
    setApplicantsLoading(true);
    getJobApplicants(job.id)
      .then((data) => setApplicants(data.applicants || []))
      .catch((err) => alert(err.message))
      .finally(() => setApplicantsLoading(false));
  }

  async function handleStatusChange(applicationId, newStatus) {
    try {
      await updateApplicationStatus(applicationId, newStatus);
      setApplicants((prev) =>
        prev.map((a) => (a.id === applicationId ? { ...a, status: newStatus } : a))
      );
    } catch (err) {
      alert(err.message);
    }
  }

  const navItems = [
    { id: "postings", label: "My Postings", icon: Briefcase },
    { id: "applicants", label: "Applicants", icon: Users },
  ];

  const stageMap = { applied: 0, reviewed: 1, accepted: 2, rejected: "rejected" };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display font-semibold text-ink text-3xl mb-1">Recruiter Dashboard</h1>
          <p className="text-muted text-sm">Manage your job postings and applicants.</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-amber text-ink font-semibold text-sm px-5 py-2.5 rounded-lg hover:-translate-y-0.5 transition whitespace-nowrap"
        >
          <Plus size={16} /> Post a new job
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-ink/40 z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-xl p-6 w-full max-w-md relative">
            <button onClick={() => setShowForm(false)} className="absolute top-4 right-4 text-muted hover:text-ink">
              <X size={20} />
            </button>
            <h2 className="font-display font-semibold text-ink text-xl mb-5">Post a new job</h2>

            {formError && (
              <div className="flex items-center gap-2 bg-red-50 text-red-600 text-sm px-3 py-2.5 rounded-lg mb-4">
                <AlertCircle size={16} className="flex-shrink-0" />
                {formError}
              </div>
            )}

            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-ink mb-1.5 block">Job title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-paper border border-line rounded-lg px-3 py-2.5 text-sm outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-ink mb-1.5 block">Company</label>
                <input
                  type="text"
                  required
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full bg-paper border border-line rounded-lg px-3 py-2.5 text-sm outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-ink mb-1.5 block">Location</label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full bg-paper border border-line rounded-lg px-3 py-2.5 text-sm outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-ink mb-1.5 block">Description</label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-paper border border-line rounded-lg px-3 py-2.5 text-sm outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-amber text-ink font-semibold text-sm py-2.5 rounded-lg mt-2 disabled:opacity-60"
              >
                {submitting ? "Posting..." : "Post job"}
              </button>
            </form>
          </div>
        </div>
      )}

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
          {tab === "postings" && (
            <div>
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display font-semibold text-ink text-xl">My Postings</h2>
                <span className="text-xs text-muted">{postings.length} total</span>
              </div>

              {loading && <p className="text-muted text-sm">Loading...</p>}
              {error && <div className="bg-red-50 text-red-600 text-sm p-4 rounded-xl">{error}</div>}

              {!loading && !error && postings.length === 0 && (
                <div className="bg-white border border-line rounded-xl p-8 text-center text-muted text-sm">
                  You haven't posted any jobs yet.
                </div>
              )}

              <div className="space-y-4">
                {postings.map((job) => (
                  <div key={job.id} className="bg-white border border-line rounded-xl p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h3 className="font-display font-semibold text-ink text-[15px] mb-1">
                          {job.title}
                        </h3>
                        <div className="flex items-center gap-3 text-muted text-xs">
                          <span className="flex items-center gap-1">
                            <MapPin size={12} /> {job.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Briefcase size={12} /> {job.company}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => viewApplicants(job)}
                          className="flex items-center gap-1.5 text-xs font-semibold text-blue border border-blue/30 rounded-lg px-3 py-2 hover:bg-blue/5 transition"
                        >
                          <Users size={14} /> Applicants
                        </button>
                        <button
                          onClick={() => handleDelete(job.id)}
                          className="w-9 h-9 flex items-center justify-center rounded-lg border border-line text-muted hover:text-red-500 hover:border-red-300 transition flex-shrink-0"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "applicants" && (
            <div>
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display font-semibold text-ink text-xl">
                  Applicants{selectedJob ? ` — ${selectedJob.title}` : ""}
                </h2>
                {selectedJob && <span className="text-xs text-muted">{applicants.length} total</span>}
              </div>

              {!selectedJob && (
                <div className="bg-white border border-line rounded-xl p-8 text-center text-muted text-sm">
                  Select a job from "My Postings" and click "Applicants" to view who applied.
                </div>
              )}

              {selectedJob && applicantsLoading && <p className="text-muted text-sm">Loading...</p>}

              {selectedJob && !applicantsLoading && applicants.length === 0 && (
                <div className="bg-white border border-line rounded-xl p-8 text-center text-muted text-sm">
                  No applicants yet for this job.
                </div>
              )}

              {selectedJob && !applicantsLoading && applicants.length > 0 && (
                <div className="space-y-4">
                  {applicants.map((a) => (
                    <div key={a.id} className="bg-white border border-line rounded-xl p-5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-full bg-blue/10 flex items-center justify-center flex-shrink-0">
                            <span className="font-display text-blue font-semibold text-sm">
                              {a.first_name?.[0]}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-display font-semibold text-ink text-[15px]">
                              {a.first_name} {a.last_name}
                            </h3>
                            <p className="text-muted text-xs">{a.email}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 flex-wrap">
                          {a.resume_filename && (
                            <button
                              type="button"
                              onClick={() => window.open(`http://localhost:3000/storage/uploads/${a.resume_filename}`, "_blank")}
                              className="flex items-center gap-1.5 text-xs font-semibold text-blue hover:underline"
                            >
                              <FileText size={14} /> Resume
                            </button>
                          )}
                          <select
                            value={a.status}
                            onChange={(e) => handleStatusChange(a.id, e.target.value)}
                            className="text-xs font-medium border border-line rounded-lg px-2 py-1.5 outline-none bg-white"
                          >
                            <option value="applied">Applied</option>
                            <option value="reviewed">Reviewed</option>
                            <option value="accepted">Accepted</option>
                            <option value="rejected">Rejected</option>
                          </select>
                          <div className="w-48">
                            <StatusThread stage={stageMap[a.status] ?? 0} />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}