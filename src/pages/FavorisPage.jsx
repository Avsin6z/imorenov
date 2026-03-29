import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { CarteArtisan } from "../components/Artisan/CarteArtisan";
import { useFavoris } from "../context/AppContext";
import { ARTISANS } from "../utils/constants";

export default function FavorisPage() {
  const { favoris } = useFavoris();
  const navigate = useNavigate();
  const artisans = ARTISANS.filter(a => favoris.includes(a.id));

  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} className="pt-28 min-h-screen px-6 max-w-5xl mx-auto pb-16">
      <h1 className="text-2xl font-black text-slate-800 dark:text-white mb-1">Mes favoris</h1>
      <p className="text-slate-400 mb-8 text-sm">{artisans.length} artisan{artisans.length > 1 ? "s" : ""} sauvegardé{artisans.length > 1 ? "s" : ""}</p>
      {artisans.length === 0 ? (
        <div className="text-center py-20">
          <Heart size={40} className="text-slate-200 dark:text-slate-700 mx-auto mb-4" />
          <p className="text-slate-800 dark:text-white font-bold text-lg">Aucun favori pour l'instant</p>
          <p className="text-slate-400 text-sm mt-2">Cliquez sur ❤ sur les profils artisans</p>
          <button onClick={() => navigate("/recherche")} className="mt-6 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md shadow-orange-200 dark:shadow-orange-900/30">
            Rechercher des artisans
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {artisans.map(a => <CarteArtisan key={a.id} artisan={a} />)}
        </div>
      )}
    </motion.div>
  );
}