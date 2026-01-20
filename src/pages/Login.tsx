import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [accessCode, setAccessCode] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const correctCode = import.meta.env.VITE_ADMIN_ACCESS_CODE;

    if (accessCode === correctCode) {
      sessionStorage.setItem("isAdminAuthenticated", "true");
      navigate("/admin");
    } else {
      setError("Kode akses salah");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-navy-900 text-slate-100">
      <div className="w-full max-w-md p-8 bg-navy-800 rounded-xl shadow-lg border border-navy-700">
        <h1 className="text-2xl font-bold text-center text-teal-400 mb-6 font-display">
          Admin Access
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="code"
              className="block text-sm font-medium text-slate-400 mb-1"
            >
              Kode Akses
            </label>
            <input
              type="password"
              id="code"
              value={accessCode}
              onChange={(e) => {
                setAccessCode(e.target.value);
                setError("");
              }}
              className="w-full px-4 py-2 bg-navy-900 border border-navy-700 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-teal-500 outline-none transition-all"
              placeholder="Masukkan kode..."
              autoFocus
            />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            type="submit"
            className="mt-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-bold rounded-lg hover:from-teal-600 hover:to-emerald-600 transition-all shadow-lg shadow-teal-900/20"
          >
            Masuk
          </button>
        </form>
      </div>
    </div>
  );
}
