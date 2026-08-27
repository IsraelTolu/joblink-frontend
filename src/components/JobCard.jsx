import { MapPin, Briefcase } from "lucide-react";
import { Link } from "react-router-dom";

export default function JobCard({ job }) {
  const title = job?.title || "Untitled role";
  const company = job?.company || "Unknown company";
  const location = job?.location || "Not specified";
  const id = job?.id;

  return (
    <Link
      to={id ? `/jobs/${id}` : "#"}
      className="block bg-white border border-line rounded-xl p-5 w-full transition hover:shadow-lg hover:-translate-y-0.5"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-ink flex items-center justify-center flex-shrink-0">
            <span className="font-display text-white font-semibold text-lg">
              {company[0]?.toUpperCase()}
            </span>
          </div>
          <div>
            <h3 className="font-display font-semibold text-ink text-[17px]">{title}</h3>
            <p className="text-muted text-sm">{company}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-4 text-muted text-[13px]">
        <span className="flex items-center gap-1"><MapPin size={14} /> {location}</span>
        <span className="flex items-center gap-1"><Briefcase size={14} /> Full-time</span>
      </div>

      <button className="w-full bg-amber text-ink font-semibold text-sm px-4 py-2.5 rounded-lg hover:-translate-y-0.5 transition">
        View job
      </button>
    </Link>
  );
}