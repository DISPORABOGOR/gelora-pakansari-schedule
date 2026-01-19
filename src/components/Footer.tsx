export default function Footer() {
  return (
    <footer className="bg-navy-900 border-t border-navy-700 text-slate-400 py-4 px-6 text-sm flex justify-between items-center mt-auto">
      <div>
        &copy; {new Date().getFullYear()} UPT Sarana Prasarana Gelora Pakansari
        - Kabupaten Bogor
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 px-3 py-1 bg-navy-800 rounded-full border border-navy-700">
          <div className="w-2.5 h-2.5 bg-teal-500 rounded-full animate-pulse shadow-[0_0_8px_#14b8a6]"></div>
          <span className="text-teal-500 font-semibold text-xs tracking-wide uppercase">
            Live Display
          </span>
        </div>

        {/* Helper for admin login (hidden/subtle) */}
        {/* <Link to="/admin" className="opacity-0 hover:opacity-50 transition-opacity">
            <MonitorPlay size={16} />
        </Link> */}
      </div>
    </footer>
  );
}
