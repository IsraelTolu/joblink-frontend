import { Briefcase } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-ink text-white mt-20">
      <div className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
              <Briefcase size={16} className="text-amber" />
            </div>
            <span className="font-display font-semibold text-lg">JobLink</span>
          </div>
          <p className="text-white/60 text-sm leading-relaxed">
            Connecting job seekers with recruiters who are actually hiring.
          </p>
        </div>

        <div>
          <h4 className="font-display font-semibold mb-3 text-sm">For Job Seekers</h4>
          <ul className="space-y-2 text-white/60 text-sm">
            <li><a href="#" className="hover:text-amber transition">Browse Jobs</a></li>
            <li><a href="#" className="hover:text-amber transition">Saved Jobs</a></li>
            <li><a href="#" className="hover:text-amber transition">My Applications</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display font-semibold mb-3 text-sm">For Recruiters</h4>
          <ul className="space-y-2 text-white/60 text-sm">
            <li><a href="#" className="hover:text-amber transition">Post a Job</a></li>
            <li><a href="#" className="hover:text-amber transition">Manage Postings</a></li>
            <li><a href="#" className="hover:text-amber transition">View Applicants</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display font-semibold mb-3 text-sm">Company</h4>
          <ul className="space-y-2 text-white/60 text-sm">
            <li><a href="#" className="hover:text-amber transition">About</a></li>
            <li><a href="#" className="hover:text-amber transition">Contact</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-5">
        <p className="text-center text-white/40 text-xs">
          © 2026 JobLink. All rights reserved.
        </p>
      </div>
    </footer>
  );
}