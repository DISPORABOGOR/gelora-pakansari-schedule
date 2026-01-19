import { Link } from "react-router-dom";
import { ExternalLink, LayoutDashboard } from "lucide-react";

export default function AdminHeader() {
  return (
    <header className="bg-navy-900 border-b border-navy-700 sticky top-0 z-30 shadow-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-teal-900/20">
            <LayoutDashboard size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white leading-tight tracking-wide">
              ADMIN PANEL
            </h1>
            <p className="text-xs text-slate-400">
              Kelola Jadwal Stadion Pakansari
            </p>
          </div>
        </div>

        <div>
          <Link
            to="/"
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-teal-400 bg-navy-800 border border-navy-700 rounded-lg hover:bg-navy-700 transition-colors hover:text-white"
            target="_blank"
          >
            <ExternalLink size={16} />
            Lihat Display
          </Link>
        </div>
      </div>
    </header>
  );
}
