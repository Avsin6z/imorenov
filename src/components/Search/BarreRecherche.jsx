import { Search, Wrench, MapPin, X } from "lucide-react";
import { useAutocomplete } from "../../hooks/useAutocomplete";
import { rechercherVilles } from "../../utils/api";
import { TOUS_METIERS } from "../../utils/constants";

function Dropdown({ items, onSelect, loading }) {
  if (loading) return (
    <div className="absolute top-full left-0 right-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl mt-2 p-3 z-50 shadow-xl">
      <p className="text-xs text-slate-400 text-center">Recherche en cours…</p>
    </div>
  );
  if (!items?.length) return null;
  return (
    <div className="absolute top-full left-0 right-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl mt-2 overflow-hidden z-50">
      {items.map((s, i) => (
        <button key={i} onClick={() => onSelect(s)}
          className="w-full text-left px-4 py-3 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 border-b border-slate-100 dark:border-slate-800 last:border-0 transition-colors">
          {s}
        </button>
      ))}
    </div>
  );
}

export function BarreRecherche({ onSearch, initialMetier = "", initialVille = "" }) {
  const metierAC = useAutocomplete(async q =>
    TOUS_METIERS.filter(m => m.toLowerCase().includes(q.toLowerCase())).slice(0, 8)
  );
  const villeAC = useAutocomplete(rechercherVilles);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-visible">
      <div className="flex flex-col md:flex-row">

        {/* Métier */}
        <div className="flex-1 relative group">
          <div className="flex items-center gap-3 px-6 py-5">
            <div className="w-9 h-9 bg-orange-50 dark:bg-orange-500/10 rounded-xl flex items-center justify-center shrink-0">
              <Wrench size={16} className="text-orange-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Métier</p>
              <input
                value={metierAC.query}
                onChange={e => metierAC.handleChange(e.target.value)}
                onKeyDown={e => e.key === "Enter" && onSearch({ metier: metierAC.query, ville: villeAC.query })}
                placeholder="Plombier, Électricien…"
                className="w-full bg-transparent outline-none text-slate-800 dark:text-white text-sm font-medium placeholder:text-slate-300 dark:placeholder:text-slate-600"
              />
            </div>
            {metierAC.query && (
              <button onClick={metierAC.clear} className="text-slate-300 hover:text-slate-500 shrink-0">
                <X size={14} />
              </button>
            )}
          </div>
          <Dropdown items={metierAC.suggestions} onSelect={metierAC.select} loading={metierAC.loading} />
        </div>

        <div className="hidden md:block w-px bg-slate-100 dark:bg-slate-700 my-4" />

        {/* Ville */}
        <div className="flex-1 relative group">
          <div className="flex items-center gap-3 px-6 py-5">
            <div className="w-9 h-9 bg-orange-50 dark:bg-orange-500/10 rounded-xl flex items-center justify-center shrink-0">
              <MapPin size={16} className="text-orange-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Localisation</p>
              <input
                value={villeAC.query}
                onChange={e => villeAC.handleChange(e.target.value)}
                onKeyDown={e => e.key === "Enter" && onSearch({ metier: metierAC.query, ville: villeAC.query })}
                placeholder="Paris, 75001, Oise…"
                className="w-full bg-transparent outline-none text-slate-800 dark:text-white text-sm font-medium placeholder:text-slate-300 dark:placeholder:text-slate-600"
              />
            </div>
            {villeAC.query && (
              <button onClick={villeAC.clear} className="text-slate-300 hover:text-slate-500 shrink-0">
                <X size={14} />
              </button>
            )}
          </div>
          <Dropdown items={villeAC.suggestions} onSelect={villeAC.select} loading={villeAC.loading} />
        </div>

        {/* Bouton */}
        <div className="p-3">
          <button
            onClick={() => onSearch({ metier: metierAC.query, ville: villeAC.query })}
            className="w-full md:w-auto h-full bg-orange-500 hover:bg-orange-600 active:scale-95 text-white px-8 py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 shadow-md shadow-orange-200 dark:shadow-orange-900/30"
          >
            <Search size={18} />
            <span>Rechercher</span>
          </button>
        </div>
      </div>
    </div>
  );
}