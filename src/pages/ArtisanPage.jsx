import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Phone, Star, CheckCircle, Calendar } from "lucide-react";
import { Badge } from "../components/ui/Badge";
import { BtnFavori, BtnComparer } from "../components/Artisan/CarteArtisan";
import { useAuth } from "../context/AppContext";
import { ARTISANS } from "../utils/constants";

function CalendrierRDV({ artisan, user, navigate }) {
  const aujourd = new Date();
  const [mois, setMois] = useState(aujourd.getMonth());
  const [annee, setAnnee] = useState(aujourd.getFullYear());
  const [dateChoisie, setDateChoisie] = useState(null);
  const [heureChoisie, setHeureChoisie] = useState(null);
  const [confirme, setConfirme] = useState(false);

  const nomsMois = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];
  const creneaux = ["08:00","09:00","10:00","11:00","14:00","15:00","16:00","17:00"];
  const nbJours = new Date(annee, mois + 1, 0).getDate();
  const premierJour = new Date(annee, mois, 1).getDay();
  const decalage = premierJour === 0 ? 6 : premierJour - 1;

  const estPasse = j => new Date(annee, mois, j) < new Date(aujourd.getFullYear(), aujourd.getMonth(), aujourd.getDate());
  const estWeekend = j => { const d = new Date(annee, mois, j).getDay(); return d === 0 || d === 6; };

  const moisPrec = () => { if (mois === 0) { setMois(11); setAnnee(a => a - 1); } else setMois(m => m - 1); setDateChoisie(null); setHeureChoisie(null); };
  const moisSuiv = () => { if (mois === 11) { setMois(0); setAnnee(a => a + 1); } else setMois(m => m + 1); setDateChoisie(null); setHeureChoisie(null); };

  if (confirme) return (
    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-8">
      <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
        <CheckCircle className="text-emerald-500" size={32} />
      </div>
      <p className="text-slate-800 dark:text-white font-black text-lg mb-1">RDV confirmé !</p>
      <p className="text-slate-500 text-sm">Le {dateChoisie} à {heureChoisie} avec {artisan.nom}</p>
      <p className="text-slate-400 text-xs mt-2">Confirmation envoyée par email.</p>
    </motion.div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <button onClick={moisPrec} className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-white transition-colors text-lg">‹</button>
        <span className="text-slate-800 dark:text-white font-black text-sm">{nomsMois[mois]} {annee}</span>
        <button onClick={moisSuiv} className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-white transition-colors text-lg">›</button>
      </div>
      <div className="grid grid-cols-7 mb-2">
        {["L","M","M","J","V","S","D"].map((j, i) => (
          <div key={i} className="text-center text-slate-400 text-xs font-bold py-1">{j}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1 mb-5">
        {Array(decalage).fill(null).map((_, i) => <div key={`v${i}`} />)}
        {Array(nbJours).fill(null).map((_, i) => {
          const jour = i + 1;
          const passe = estPasse(jour);
          const weekend = estWeekend(jour);
          const dateStr = `${jour} ${nomsMois[mois]} ${annee}`;
          const sel = dateChoisie === dateStr;
          return (
            <button key={jour}
              onClick={() => { if (!passe && !weekend) { setDateChoisie(dateStr); setHeureChoisie(null); } }}
              disabled={passe || weekend}
              className={`aspect-square rounded-lg text-xs font-bold transition-all flex items-center justify-center
                ${sel ? "bg-orange-500 text-white" : ""}
                ${!passe && !weekend && !sel ? "hover:bg-orange-50 dark:hover:bg-orange-500/10 text-slate-700 dark:text-slate-300 hover:text-orange-500" : ""}
                ${passe || weekend ? "text-slate-200 dark:text-slate-700 cursor-not-allowed" : ""}
              `}>
              {jour}
            </button>
          );
        })}
      </div>
      {dateChoisie && (
        <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-3">Créneaux — {dateChoisie}</p>
          <div className="grid grid-cols-4 gap-2 mb-4">
            {creneaux.map(h => (
              <button key={h} onClick={() => setHeureChoisie(h)}
                className={`py-2 rounded-lg text-xs font-bold border transition-all ${heureChoisie === h ? "bg-orange-500 border-orange-500 text-white" : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-500 hover:border-orange-300"}`}>
                {h}
              </button>
            ))}
          </div>
        </motion.div>
      )}
      <button
        onClick={() => { if (!user) { navigate("/connexion"); return; } if (dateChoisie && heureChoisie) setConfirme(true); }}
        disabled={!dateChoisie || !heureChoisie}
        className={`w-full py-3 rounded-xl font-black text-sm transition-all ${dateChoisie && heureChoisie ? "bg-orange-500 hover:bg-orange-600 text-white shadow-md shadow-orange-200 dark:shadow-orange-900/30" : "bg-slate-100 dark:bg-slate-700 text-slate-400 cursor-not-allowed"}`}>
        {user ? (dateChoisie && heureChoisie ? `Confirmer — ${dateChoisie} à ${heureChoisie}` : "Choisissez une date et un créneau") : "Se connecter pour réserver"}
      </button>
    </div>
  );
}

export default function ArtisanPage() {
  const id = parseInt(window.location.pathname.split("/").pop());
  const artisan = ARTISANS.find(a => a.id === id);
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!artisan) return (
    <div className="pt-40 text-center">
      <p className="text-slate-400 text-xl mb-4">Artisan introuvable</p>
      <button onClick={() => navigate("/recherche")} className="bg-orange-500 text-white px-6 py-3 rounded-xl font-bold">Retour à la recherche</button>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-28 min-h-screen px-6 max-w-5xl mx-auto pb-16">
      <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-3xl p-8 mb-6 shadow-sm">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <img src={artisan.img} alt={artisan.nom} className="w-28 h-28 rounded-2xl object-cover shadow-md" />
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <h1 className="text-2xl font-black text-slate-800 dark:text-white">{artisan.nom}</h1>
              {artisan.certifie && <Badge color="blue">✓ Certifié</Badge>}
              {artisan.rge && <Badge color="green">RGE</Badge>}
            </div>
            <p className="text-slate-400 text-sm mb-3">{artisan.metier} · {artisan.ville} ({artisan.cp}) · {artisan.exp} ans d'exp.</p>
            <div className="flex items-center gap-5 mb-4 flex-wrap">
              <span className="flex items-center gap-1 text-yellow-400 font-bold"><Star size={14} fill="currentColor" />{artisan.note}</span>
              <span className="text-slate-400 text-sm">{artisan.avis} avis</span>
              <span className="text-orange-500 font-black text-xl">{artisan.prix}€/h</span>
            </div>
            <div className="flex flex-wrap gap-2 mb-3">{artisan.tags.map(t => <Badge key={t} color="orange">{t}</Badge>)}</div>
            <div className="flex flex-wrap gap-4 text-xs text-slate-400">
              <span>🛡️ {artisan.assurance}</span>
              <span>🌍 {artisan.langues.join(", ")}</span>
            </div>
          </div>
          <div className="flex flex-col gap-2 shrink-0">
            <BtnFavori id={artisan.id} />
            <BtnComparer id={artisan.id} />
            <a href={`tel:${artisan.tel}`}
              className="flex items-center gap-2 bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-700 dark:text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-all border border-slate-200 dark:border-slate-600">
              <Phone size={14} />{artisan.tel}
            </a>
          </div>
        </div>
        <p className="text-slate-500 mt-5 leading-relaxed border-t border-slate-100 dark:border-slate-700 pt-5 text-sm">{artisan.desc}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-3xl p-6 shadow-sm">
          <h2 className="text-slate-800 dark:text-white font-black text-lg mb-5 flex items-center gap-2">
            <Calendar size={18} className="text-orange-500" /> Prendre rendez-vous
          </h2>
          <CalendrierRDV artisan={artisan} user={user} navigate={navigate} />
        </div>
        <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-3xl p-6 shadow-sm">
          <h2 className="text-slate-800 dark:text-white font-black text-lg mb-5 flex items-center gap-2">
            <Star size={18} className="text-orange-500" /> Avis clients
          </h2>
          <div className="space-y-4">
            {[
              { n:"Marie L.", note:5, t:"Travail impeccable, très professionnel.", d:"Il y a 2 semaines" },
              { n:"Pierre D.", note:5, t:"Chantier propre et dans les délais.", d:"Il y a 1 mois" },
              { n:"Anne M.", note:4, t:"Bon travail, légèrement en retard.", d:"Il y a 2 mois" },
            ].map((av, i) => (
              <div key={i} className="border-b border-slate-100 dark:border-slate-700 pb-3 last:border-0">
                <div className="flex justify-between mb-1">
                  <span className="text-slate-800 dark:text-white font-bold text-sm">{av.n}</span>
                  <span className="text-slate-400 text-xs">{av.d}</span>
                </div>
                <span className="text-yellow-400 text-xs">{"★".repeat(av.note)}</span>
                <p className="text-slate-500 text-sm mt-1">{av.t}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}