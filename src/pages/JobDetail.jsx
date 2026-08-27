import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { MapPin, Briefcase, Building2, AlertCircle, X, CheckCircle2, Upload, Bookmark, BookmarkCheck } from "lucide-react";
import { getJob, isLoggedIn, getCurrentUser, applyToJob, saveJob, unsaveJob } from "../lib/api";

export default function JobDetail() {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [applied, setApplied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [savingLoading, setSavingLoading] = useState(false);

  
  async function toggleSave() {
    setSavingLoading(true);
    try {
      if (saved) {
        await unsaveJob(jobId);
        setSaved(false);
      } else {
        await saveJob(jobId);
        setSaved(true);
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setSavingLoading(false);
    }
  }

  const user = getCurrentUser();
  const isSeeker = user?.role === "seeker";

  useEffect(() => {
    if (!isLoggedIn()) {
      setError("LOGIN_REQUIRED");
      setLoading(false);
      return;
    }
    getJob(jobId)
      .then((data) => setJob(data.job))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [jobId]);

  if (loading) {
    return <div className="max-w-5xl mx-auto px-6 py-10 text-muted text-sm">Loading...</div>;
  }

  if (error === "LOGIN_REQUIRED") {
    return (
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="bg-white border border-line rounded-xl p-8 text-center max-w-md mx-auto">
          <AlertCircle className="mx-auto mb-3 text-amber" size={28} />
          <p className="font-display font-semibold text-ink text-lg mb-2">Log in to view this job</p>
          <Link to="/login" className="inline-block bg-amber text-ink font-semibold text-sm px-6 py-2.5 rounded-lg mt-3">
            Log in
          </Link>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="max-w-5xl mx-auto px-6 py-10 text-red-600 text-sm">{error}</div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="bg-white border border-line rounded-xl p-6 md:p-8 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-xl bg-ink flex items-center justify-center flex-shrink-0">
              <span className="font-display text-white font-semibold text-2xl">
                {job.company?.[0]?.toUpperCase()}
              </span>
            </div>
            <div>
              <h1 className="font-display font-semibold text-ink text-2xl md:text-3xl mb-1">
                {job.title}
              </h1>
              <p className="text-muted text-sm mb-3">{job.company}</p>
              <div className="flex flex-wrap gap-3 text-muted text-[13px]">
                <span className="flex items-center gap-1"><MapPin size={14} /> {job.location}</span>
                <span className="flex items-center gap-1"><Briefcase size={14} /> Full-time</span>
              </div>
            </div>
          </div>

                    {isSeeker && (
            <div className="flex items-center gap-2">
              <button
                onClick={toggleSave}
                disabled={savingLoading}
                className="w-11 h-11 flex items-center justify-center rounded-lg border border-line hover:border-blue transition flex-shrink-0"
              >
                {saved ? (
                  <BookmarkCheck size={18} className="text-blue" />
                ) : (
                  <Bookmark size={18} className="text-muted" />
                )}
              </button>
              <button
                onClick={() => setShowApplyForm(true)}
                disabled={applied}
                className={`px-6 py-3 rounded-lg font-semibold text-sm whitespace-nowrap transition ${
                  applied
                    ? "bg-green/10 text-green cursor-default"
                    : "bg-amber text-ink hover:-translate-y-0.5"
                }`}
              >
                {applied ? (
                  <span className="flex items-center gap-2">
                    <CheckCircle2 size={16} /> Applied
                  </span>
                ) : (
                  "Apply now"
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-[1fr_280px] gap-6">
        {/* Main content */}
        <div className="bg-white border border-line rounded-xl p-6 md:p-8">
          <h2 className="font-display font-semibold text-ink text-lg mb-3">About the role</h2>
          <p className="text-muted text-sm leading-relaxed">{job.description}</p>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="bg-white border border-line rounded-xl p-5">
            <h3 className="font-display font-semibold text-ink text-sm mb-4">Job overview</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted">Location</span>
                <span className="text-ink font-medium">{job.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Company</span>
                <span className="text-ink font-medium">{job.company}</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-line rounded-xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <Building2 size={16} className="text-ink" />
              <h3 className="font-display font-semibold text-ink text-sm">Posted by</h3>
            </div>
            <p className="text-muted text-sm">{job.company}</p>
          </div>
        </div>
      </div>

      {showApplyForm && (
        <ApplyModal
          jobId={jobId}
          jobTitle={job.title}
          onClose={() => setShowApplyForm(false)}
          onSuccess={() => {
            setApplied(true);
            setShowApplyForm(false);
          }}
        />
      )}
    </div>
  );
}

function ApplyModal({ jobId, jobTitle, onClose, onSuccess }) {
  const [coverLetter, setCoverLetter] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [phone, setPhone] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await applyToJob(jobId, { coverLetter, linkedinUrl, phone, resumeFile });
      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-ink/40 z-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-xl p-6 w-full max-w-md relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-muted hover:text-ink">
          <X size={20} />
        </button>
        <h2 className="font-display font-semibold text-ink text-xl mb-1">Apply for role</h2>
        <p className="text-muted text-sm mb-5">{jobTitle}</p>

        {error && (
          <div className="flex items-center gap-2 bg-red-50 text-red-600 text-sm px-3 py-2.5 rounded-lg mb-4">
            <AlertCircle size={16} className="flex-shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-ink mb-1.5 block">Phone number</label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+234..."
              className="w-full bg-paper border border-line rounded-lg px-3 py-2.5 text-sm outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-ink mb-1.5 block">LinkedIn profile</label>
            <input
              type="url"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              placeholder="https://linkedin.com/in/..."
              className="w-full bg-paper border border-line rounded-lg px-3 py-2.5 text-sm outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-ink mb-1.5 block">Cover letter</label>
            <textarea
              rows={4}
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Tell them why you're a great fit..."
              className="w-full bg-paper border border-line rounded-lg px-3 py-2.5 text-sm outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-ink mb-1.5 block">Resume (PDF)</label>
            <label className="flex items-center gap-2 border border-dashed border-line rounded-lg p-3 cursor-pointer hover:bg-paper transition">
              <Upload size={16} className="text-muted" />
              <span className="text-xs text-muted truncate">
                {resumeFile ? resumeFile.name : "Click to upload PDF"}
              </span>
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setResumeFile(e.target.files[0])}
                className="hidden"
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-amber text-ink font-semibold text-sm py-2.5 rounded-lg mt-2 disabled:opacity-60"
          >
            {submitting ? "Submitting..." : "Submit application"}
          </button>
        </form>
      </div>
    </div>
  );
}