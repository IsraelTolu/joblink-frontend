import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Briefcase, Mail, Lock, Star, AlertCircle } from "lucide-react";
import { login } from "../lib/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login({ email, password });
      navigate("/");
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
          <div className="flex gap-1 mb-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} size={16} className="text-amber fill-amber" />
            ))}
          </div>
          <p className="font-display text-white text-2xl leading-snug mb-4">
            "JobLink helped me find a role that actually matched what I wanted —
            in under two weeks."
          </p>
          <p className="text-white/60 text-sm">Amara O. — Product Designer</p>
        </div>

        <div
          className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(246,162,30,0.15), transparent 70%)" }}
        />
      </div>

      {/* Right form panel */}
      <div className="flex items-center justify-center p-6 md:p-10 bg-paper">
        <div className="w-full max-w-sm">
          <h1 className="font-display font-semibold text-ink text-3xl mb-2">Welcome back</h1>
          <p className="text-muted text-sm mb-8">Log in to continue to your dashboard.</p>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 text-red-600 text-sm px-3 py-2.5 rounded-lg mb-4">
              <AlertCircle size={16} className="flex-shrink-0" />
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
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
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-ink block">Password</label>
                <a href="#" className="text-xs text-blue font-medium hover:underline">
                  Forgot password?
                </a>
              </div>
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

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber text-ink font-semibold text-sm py-3 rounded-lg hover:-translate-y-0.5 transition disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Log in"}
            </button>
          </form>

          <p className="text-center text-sm text-muted mt-6">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue font-semibold hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}