import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Briefcase, Mail, Lock, User, Search, Building2, CheckCircle2, AlertCircle } from "lucide-react";
import { signup } from "../lib/api";

export default function Register() {
  const [role, setRole] = useState("seeker");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signup({
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        role,
      });
      navigate("/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-64px)] grid md:grid-cols-2">
      {/* Left decorative panel */}
      <div className="hidden md:flex bg-ink relative overflow-hidden flex-col justify-between p-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
            <Briefcase size={16} className="text-amber" />
          </div>
          <span className="font-display font-semibold text-white text-lg">JobLink</span>
        </div>

        <div>
          <p className="font-display text-white text-2xl leading-snug mb-6">
            Join thousands of job seekers and recruiters already using JobLink.
          </p>
          <div className="space-y-3">
            {["2,400+ active job postings", "850+ verified recruiters", "Free to get started"].map(
              (item) => (
                <div key={item} className="flex items-center gap-2 text-white/70 text-sm">
                  <CheckCircle2 size={16} className="text-amber flex-shrink-0" />
                  {item}
                </div>
              )
            )}
          </div>
        </div>

        <div
          className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(246,162,30,0.15), transparent 70%)" }}
        />
      </div>

      {/* Right form panel */}
      <div className="flex items-center justify-center p-6 md:p-10 bg-paper">
        <div className="w-full max-w-sm">
          <h1 className="font-display font-semibold text-ink text-3xl mb-2">Create your account</h1>
          <p className="text-muted text-sm mb-6">Get started in less than a minute.</p>

          {/* Role selector */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              type="button"
              onClick={() => setRole("seeker")}
              className={`flex flex-col items-center gap-2 border rounded-xl py-4 transition ${
                role === "seeker" ? "border-blue bg-blue/5" : "border-line bg-white"
              }`}
            >
              <Search size={20} className={role === "seeker" ? "text-blue" : "text-muted"} />
              <span
                className={`text-sm font-semibold ${role === "seeker" ? "text-blue" : "text-muted"}`}
              >
                Job Seeker
              </span>
            </button>

            <button
              type="button"
              onClick={() => setRole("recruiter")}
              className={`flex flex-col items-center gap-2 border rounded-xl py-4 transition ${
                role === "recruiter" ? "border-blue bg-blue/5" : "border-line bg-white"
              }`}
            >
              <Building2 size={20} className={role === "recruiter" ? "text-blue" : "text-muted"} />
              <span
                className={`text-sm font-semibold ${role === "recruiter" ? "text-blue" : "text-muted"}`}
              >
                Recruiter
              </span>
            </button>
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 text-red-600 text-sm px-3 py-2.5 rounded-lg mb-4">
              <AlertCircle size={16} className="flex-shrink-0" />
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-ink mb-1.5 block">First name</label>
                <div className="flex items-center gap-2 bg-white border border-line rounded-lg px-3">
                  <User size={16} className="text-muted" />
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Jane"
                    required
                    className="w-full py-2.5 text-sm outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-ink mb-1.5 block">Last name</label>
                <div className="flex items-center gap-2 bg-white border border-line rounded-lg px-3">
                  <User size={16} className="text-muted" />
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Doe"
                    required
                    className="w-full py-2.5 text-sm outline-none"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-ink mb-1.5 block">Email</label>
              <div className="flex items-center gap-2 bg-white border border-line rounded-lg px-3">
                <Mail size={16} className="text-muted" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full py-2.5 text-sm outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-ink mb-1.5 block">Password</label>
              <div className="flex items-center gap-2 bg-white border border-line rounded-lg px-3">
                <Lock size={16} className="text-muted" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full py-2.5 text-sm outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-ink mb-1.5 block">Confirm password</label>
              <div className="flex items-center gap-2 bg-white border border-line rounded-lg px-3">
                <Lock size={16} className="text-muted" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full py-2.5 text-sm outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber text-ink font-semibold text-sm py-3 rounded-lg hover:-translate-y-0.5 transition disabled:opacity-60"
            >
              {loading ? "Creating account..." : `Create account as ${role === "seeker" ? "Job Seeker" : "Recruiter"}`}
            </button>
          </form>

          <p className="text-center text-sm text-muted mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-blue font-semibold hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}