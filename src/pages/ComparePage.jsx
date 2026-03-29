import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { GitCompare, Trash2, X, CheckCircle, Star } from "lucide-react";
import { Badge } from "../components/ui/Badge";
import { useCompare } from "../context/AppContext";
import { ARTISANS } from "../utils/constants";

export default function ComparePage() {
  const { liste, reset } = useCompare();
  const navigate = useNavigate();
  const artisans = liste.map(id => ARTISANS.find(a => a.id === id)).filter(Boolean);

  if (artisans.length < 2) return (
    <div className="pt-32 min-h-screen flex flex-col items-center justify-center text-center px-6">
      <GitCompare size={48} className="text-slate-200 dark:text-slate-700 mb-4" />
      <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-2">Aucun artisan à comparer</h2>
      <p className="text-slate-400 mb-6 text-sm">Ajoutez au moins 2 artisans depuis la recherche</p>
      <button onClick={() => navigate("/recherche")} className="bg-orange-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-600 transition-all shadow-md shadow-orange-200 dark:shadow-orange-900/30">
        Rechercher des artisans
      </button>
    </div>
  );

  const rows = [
    { label:"Métier", key:"metier", fmt: v => v },
    { label:"Ville", key:"ville", fmt: v => v },
    { label:"Note", key:"note", fmt: v => <span className="flex items-center gap-1 text-yellow-400 font-bold justify-center"><Star size={12} fill="currentColor" />{v}</span> },
    { label:"Avis", key:"avis", fmt: v => `${v} avis` },
    { label:"Expérience", key:"exp", fmt: v => `${v} ans` },
    { label:"Prix", key:"prix", fmt: v => <span className="text-orange-500 font-black">{v}€/h</span> },
    { label:"Disponibilité", key:"dispo", fmt: v => <span className="text-emerald-500 font-bold text-xs">{v}</span> },
    { label:"Certifié", key:"certifie", fmt: v => v ? <CheckCircle className="text-emerald-500 mx-auto" size={16} /> : <X className="text-red-400 mx-auto" size={16} /> },
    { label:"RGE", key:"rge", fmt: v => v ? <Badge color="green">Oui</Badge> : <Badge color="red">Non</Badge> },
    { label:"Assurance", key:"assurance", fmt: v => <span className="text-xs">{v}</span> },
  ];

  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} className="pt-28 min-h-screen px-6 max-w-5xl mx-auto pb-16">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-black text-slate-800 dark:text-white">Comparatif artisans</h1>
        <button onClick={reset} className="text-slate-400 hover:text-red-500 flex items-center gap-1 text-sm font-bold transition-colors">
          <Trash2 size={14} /> Vider
        </button>
      </div>
      <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-700">
                <th className="text-left text-slate-400 text-xs uppercase tracking-wider p-5 font-bold w-32">Critère</th>
                {artisans.map(a => (
                  <th key={a.id} className="p-4">
                    <div className="text-center">
                      <img src={a.img} alt={a.nom} className="w-14 h-14 rounded-2xl object-cover mx-auto mb-3 shadow-sm" />
                      <p className="text-slate-800 dark:text-white font-black text-sm">{a.nom}</p>
                      <p className="text-slate-400 text-xs">{a.metier}</p>
                      <button onClick={() => navigate(`/artisan/${a.id}`)}
                        className="mt-3 bg-orange-500 hover:bg-orange-600 text-white px-4 py-1.5 rounded-xl text-xs font-bold transition-all w-full">
                        Voir le profil
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={row.label} className={i % 2 === 0 ? "bg-slate-50 dark:bg-slate-900/30" : ""}>
                  <td className="text-slate-400 text-xs font-bold uppercase tracking-wider py-4 px-5">{row.label}</td>
                  {artisans.map(a => (
                    <td key={a.id} className="py-4 px-4 text-center">
                      <div className="text-slate-700 dark:text-slate-300 text-sm flex justify-center items-center">
                        {row.fmt(a[row.key])}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}