import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, Clock, CheckCircle, Heart, GitCompare } from "lucide-react";
import { Badge } from "../ui/Badge";
import { useFavoris, useCompare } from "../../context/AppContext";

function BtnFavori({ id }) {
  const { favoris, toggle } = useFavoris();
  const actif = favoris.includes(id);
  return (
    <button
      onClick={e => { e.stopPropagation(); toggle(id); }}
      className={`p-2 rounded-xl transition-all ${actif ? "bg-red-50 dark:bg-red-500/15 text-red-500" : "bg-slate-50 dark:bg-slate-700 text-slate-400 hover:text-red-400"}`}
    >
      <Heart size={15} fill={actif ? "currentColor" : "none"} />
    </button>
  );
}

function BtnComparer({ id }) {
  const { liste, toggle } = useCompare();
  const actif = liste.includes(id);
  return (
    <button
      onClick={e => { e.stopPropagation(); toggle(id); }}
      className={`p-2 rounded-xl transition-all ${actif ? "bg-purple-50 dark:bg-purple-500/15 text-purple-500" : "bg-slate-50 dark:bg-slate-700 text-slate-400 hover:text-purple-400"}`}
    >
      <GitCompare size={15} />
    </button>
  );
}

export function CarteArtisan({ artisan }) {
  const navigate = useNavigate();
  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: "0 12px 40px rgba(0,0,0,0.08)" }}
      onClick={() => navigate(`/artisan/${artisan.id}`)}
      className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-700 shadow-sm cursor-pointer group transition-all"
    >
      {/* Bannière + Avatar */}
      <div className="h-24 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-slate-700 dark:to-slate-700 relative">
        <img
          src={artisan.img}
          alt={artisan.nom}
          loading="lazy"
          className="w-16 h-16 rounded-2xl object-cover absolute -bottom-5 left-5 border-4 border-white dark:border-slate-800 shadow"
        />
        <div className="absolute top-3 right-3 flex gap-1.5">
          <BtnFavori id={artisan.id} />
          <BtnComparer id={artisan.id} />
        </div>
      </div>

      <div className="pt-8 px-5 pb-5">
        <div className="flex items-start justify-between gap-2 mb-1">
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="text-slate-800 dark:text-white font-bold text-base">{artisan.nom}</h4>
              {artisan.certifie && <CheckCircle size={14} className="text-blue-500 shrink-0" />}
            </div>
            <p className="text-orange-500 text-xs font-semibold mt-0.5">{artisan.metier} · {artisan.ville}</p>
          </div>
          <div className="flex items-center gap-1 text-yellow-400 shrink-0">
            <Star size={13} fill="currentColor" />
            <span className="text-slate-700 dark:text-slate-300 font-bold text-sm">{artisan.note}</span>
          </div>
        </div>

        <div className="flex gap-1.5 flex-wrap my-3">
          {artisan.tags.slice(0, 2).map(t => <Badge key={t} color="slate">{t}</Badge>)}
          {artisan.rge && <Badge color="green">RGE</Badge>}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-slate-50 dark:border-slate-700">
          <div className="flex items-center gap-1 text-slate-400 text-xs">
            <Clock size={12} /> {artisan.dispo}
          </div>
          <span className="font-bold text-slate-800 dark:text-white">
            {artisan.prix}€<span className="text-slate-400 text-xs font-normal">/h</span>
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export { BtnFavori, BtnComparer };