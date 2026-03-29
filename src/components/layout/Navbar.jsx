import { Link, useNavigate } from "react-router-dom";
import { Home, Heart, LogOut, User } from "lucide-react";
import { useAuth, useFavoris } from "../../context/AppContext";
import { ThemeToggle } from "../ui/Toggle";

export function Navbar() {
  const { user, logout } = useAuth();
  const { favoris } = useFavoris();
  const navigate = useNavigate();

  return (
    <nav className="fixed w-full z-50 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border-b border-slate-100 dark:border-white/5 py-3 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">

        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 bg-orange-500 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform">
            <Home size={16} className="text-white" />
          </div>
          <span className="text-lg font-black tracking-tight text-slate-800 dark:text-white">
            Imo<span className="text-orange-500">Rénov</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {[
            { to: "/recherche", label: "Artisans" },
            { to: "/aides", label: "Simulateur aides" },
            { to: "/devis", label: "Devis gratuit" },
          ].map(l => (
            <Link key={l.to} to={l.to}
              className="px-4 py-2 text-slate-500 dark:text-slate-400 hover:text-orange-500 dark:hover:text-orange-400 text-sm font-semibold rounded-xl hover:bg-orange-50 dark:hover:bg-orange-500/10 transition-all">
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {user ? (
            <>
              <Link to="/favoris" className="relative p-2 text-slate-400 hover:text-red-400 transition-colors rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10">
                <Heart size={18} />
                {favoris.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-white text-[10px] flex items-center justify-center font-black">
                    {favoris.length}
                  </span>
                )}
              </Link>
              <Link to="/dashboard"
                className="flex items-center gap-2 bg-orange-50 dark:bg-orange-500/10 hover:bg-orange-100 dark:hover:bg-orange-500/20 px-3 py-2 rounded-xl transition-all border border-orange-100 dark:border-orange-500/20">
                <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-[11px] font-black text-white">
                  {user.prenom?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
                </div>
                <span className="text-orange-600 dark:text-orange-400 text-sm font-bold hidden md:block">
                  {user.prenom || user.email?.split("@")[0]}
                </span>
              </Link>
              <button
                onClick={() => { logout(); navigate("/"); }}
                className="p-2 text-slate-400 hover:text-red-400 transition-colors rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10">
                <LogOut size={16} />
              </button>
            </>
          ) : (
            <>
              <Link to="/connexion"
                className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:text-orange-500 text-sm font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                Connexion
              </Link>
              <Link to="/inscription"
                className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold rounded-xl transition-all shadow-md shadow-orange-200 dark:shadow-orange-900/30">
                S'inscrire
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}