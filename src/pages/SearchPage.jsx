import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, SlidersHorizontal, X, CheckCircle, Star } from "lucide-react";
import { BarreRecherche } from "../components/Search/BarreRecherche";
import { BtnFavori, BtnComparer } from "../components/Artisan/CarteArtisan";
import { Badge } from "../components/ui/Badge";
import { ARTISANS } from "../utils/constants";

export default function SearchPage() {
  const [params] = useState(() => new URLSearchParams(window.location.search));
  const [metier, setMetier] = useState(params.get("metier") || "");
  const [ville, setVille] = useState(params.get("ville") || "");
  const [filtrePrix, setFiltrePrix] = useState([0, 100]);
  const [filtreNote, setFiltreNote] = useState(0);
  const [filtreRGE, setFiltreRGE] = useState(false);
  const [filtreCertifie, setFiltreCertifie] = useState(false);
  const [tri, setTri] = useState("note");
  const [showFiltres, setShowFiltres] = useState(false);
  const navigate = useNavigate();

  const resultats = ARTISANS.filter(a => {
    const okMetier = !metier || a.metier.toLowerCase().includes(metier.toLowerCase()) || a.nom.toLowerCase().includes(metier.toLowerCase()) || a.tags.some(t => t.toLowerCase().includes(metier.toLowerCase()));
    const okVille = !ville || a.ville.toLowerCase().includes(ville.toLowerCase()) || a.cp.includes(ville);
    const okPrix = a.prix >= filtrePrix[0] && a.prix <= filtrePrix[1];
    const okNote = a.note >= filtreNote;
    const okRGE = !filtreRGE || a.rge;
    const okCertifie = !filtreCertifie || a.certifie;
    return okMetier && okVille && okPrix && okNote && okRGE && okCertifie;
  }).sort((a, b) => tri === "note" ? b.note - a.note : tri === "prix_asc" ? a.prix - b.prix : tri === "prix_desc" ? b.prix - a.prix : b.exp - a.exp);

  const handleSearch = ({ metier: m, ville: v }) => { setMetier(m); setVille(v); };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-24 min-h-screen px-4 max-w-6xl mx-auto pb-16">
      <div className="mb-6">
        <BarreRecherche onSearch={handleSearch} />
      </div>

      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          <span className="text-slate-800 dark:text-white font-bold">{resultats.length}</span> artisan{resultats.length > 1 ? "s" : ""} trouvé{resultats.length > 1 ? "s" : ""}
          {metier && <span className="text-orange-500 font-bold"> · {metier}</span>}
          {ville && <span className="text-orange-500 font-bold"> · {ville}</span>}
        </p>
        <div className="flex items-center gap-3">
          <select value={tri} onChange={e => setTri(e.target.value)}
            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-white text-sm rounded-xl px-3 py-2 outline-none">
            <option value="note">Mieux notés</option>
            <option value="prix_asc">Prix croissant</option>
            <option value="prix_desc">Prix décroissant</option>
            <option value="exp">Plus expérimentés</option>
          </select>
          <button onClick={() => setShowFiltres(s => !s)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold border transition-all ${showFiltres ? "bg-orange-500 border-orange-500 text-white" : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400"}`}>
            <SlidersHorizontal size={14} /> Filtres
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showFiltres && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 mb-5 overflow-hidden shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 block">Prix max : {filtrePrix[1]}€/h</label>
                <input type="range" min="0" max="100" step="5" value={filtrePrix[1]}
                  onChange={e => setFiltrePrix([0, parseInt(e.target.value)])} className="w-full accent-orange-500" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 block">Note min : {filtreNote > 0 ? filtreNote : "Toutes"}</label>
                <input type="range" min="0" max="5" step="0.5" value={filtreNote}
                  onChange={e => setFiltreNote(parseFloat(e.target.value))} className="w-full accent-orange-500" />
              </div>
              <div className="flex flex-col gap-3">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Certifications</label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={filtreRGE} onChange={e => setFiltreRGE(e.target.checked)} className="accent-orange-500" />
                  <span className="text-slate-700 dark:text-slate-300 text-sm font-semibold">Certifié RGE</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={filtreCertifie} onChange={e => setFiltreCertifie(e.target.checked)} className="accent-orange-500" />
                  <span className="text-slate-700 dark:text-slate-300 text-sm font-semibold">Profil vérifié</span>
                </label>
              </div>
              <div className="flex items-end">
                <button onClick={() => { setFiltrePrix([0, 100]); setFiltreNote(0); setFiltreRGE(false); setFiltreCertifie(false); }}
                  className="text-slate-400 hover:text-slate-700 dark:hover:text-white text-sm font-bold flex items-center gap-1">
                  <X size={14} /> Réinitialiser
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-3">
        {resultats.length === 0 ? (
          <div className="text-center py-20">
            <Search size={40} className="mx-auto mb-4 text-slate-200 dark:text-slate-700" />
            <p className="font-bold text-lg text-slate-800 dark:text-white">Aucun artisan trouvé</p>
            <p className="text-sm mt-2 text-slate-400">Essayez d'élargir vos filtres</p>
          </div>
        ) : resultats.map(a => (
          <motion.div key={a.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            onClick={() => navigate(`/artisan/${a.id}`)}
            className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl p-5 flex flex-col md:flex-row gap-5 hover:border-orange-200 dark:hover:border-orange-500/30 cursor-pointer transition-all shadow-sm hover:shadow-md">
            <img src={a.img} alt={a.nom} loading="lazy" className="w-20 h-20 rounded-2xl object-cover shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h3 className="text-slate-800 dark:text-white font-black">{a.nom}</h3>
                {a.certifie && <CheckCircle className="text-blue-500 shrink-0" size={15} />}
                {a.rge && <Badge color="green">RGE</Badge>}
                <Badge color="slate">{a.metier}</Badge>
              </div>
              <div className="flex items-center gap-4 mb-2 flex-wrap text-slate-400 text-xs">
                <span className="flex items-center gap-1 text-yellow-400 font-bold"><Star size={12} fill="currentColor" />{a.note}</span>
                <span>{a.avis} avis</span>
                <span>{a.exp} ans exp.</span>
                <span className="flex items-center gap-1"><MapPin size={11} />{a.ville}</span>
              </div>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {a.tags.map(t => <Badge key={t} color="slate">{t}</Badge>)}
              </div>
              <p className="text-slate-400 text-sm truncate">{a.desc}</p>
            </div>
            <div className="flex flex-col items-end justify-between shrink-0 gap-2">
              <span className="text-orange-500 font-black text-xl">{a.prix}€/h</span>
              <span className="text-emerald-500 text-xs font-bold bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1 rounded-full">{a.dispo}</span>
              <div className="flex gap-2">
                <BtnFavori id={a.id} />
                <BtnComparer id={a.id} />
                <button onClick={e => { e.stopPropagation(); navigate(`/artisan/${a.id}`); }}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-xl font-bold text-sm transition-all">
                  Voir →
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}