import { lazy, Suspense } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight, Shield, Calendar, Award } from "lucide-react";
import { BarreRecherche } from "../components/Search/BarreRecherche";
import { CarteArtisan } from "../components/Artisan/CarteArtisan";
import { ArtisanCardSkeleton } from "../components/ui/Skeleton";
import { ARTISANS } from "../utils/constants";

const METIERS_RAPIDES = ["Plombier","Électricien","Couvreur","Peintre","Architecte","Carreleur","Maçon","Paysagiste"];

export default function HomePage() {
  const navigate = useNavigate();
  const handleSearch = ({ metier, ville }) =>
    navigate(`/recherche?metier=${encodeURIComponent(metier)}&ville=${encodeURIComponent(ville)}`);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* HERO */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-b from-orange-50/60 via-white to-white dark:from-slate-900 dark:via-slate-950 dark:to-slate-950">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
            className="inline-flex items-center gap-2 bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 px-4 py-2 rounded-full text-xs font-bold mb-6 border border-orange-100 dark:border-orange-500/20">
            <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
            60+ MÉTIERS · TOUTE LA FRANCE · ARTISANS VÉRIFIÉS
          </motion.div>

          <motion.h1 initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1 }}
            className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white mb-5 leading-tight tracking-tight">
            Trouvez votre artisan<br />
            <span className="text-orange-500">en 3 clics.</span>
          </motion.h1>

          <motion.p initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.15 }}
            className="text-slate-500 dark:text-slate-400 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
            Plombier, électricien, architecte… Tous les pros du bâtiment, certifiés et disponibles près de chez vous.
          </motion.p>

          <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }}
            className="max-w-3xl mx-auto mb-6">
            <BarreRecherche onSearch={handleSearch} />
          </motion.div>

          {/* Recherches rapides */}
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.3 }}
            className="flex flex-wrap justify-center gap-2">
            {METIERS_RAPIDES.map(m => (
              <button key={m} onClick={() => handleSearch({ metier:m, ville:"" })}
                className="px-4 py-2 bg-white dark:bg-slate-800 hover:bg-orange-50 dark:hover:bg-orange-500/10 text-slate-500 dark:text-slate-400 hover:text-orange-600 dark:hover:text-orange-400 text-xs font-semibold rounded-full border border-slate-200 dark:border-slate-700 hover:border-orange-200 dark:hover:border-orange-500/30 transition-all shadow-sm">
                {m}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-12 px-6 border-y border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { v:"12 000+", l:"Projets réalisés" },
            { v:"500+", l:"Artisans certifiés" },
            { v:"4.8/5", l:"Note moyenne" },
            { v:"48h", l:"Délai de réponse" },
          ].map(s => (
            <div key={s.l} className="text-center">
              <p className="text-3xl font-black text-orange-500 mb-1">{s.v}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20 px-6 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-3">Pourquoi ImoRénov ?</h2>
            <p className="text-slate-500 dark:text-slate-400">Une plateforme pensée pour vous simplifier la vie</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon:Calendar, title:"RDV en ligne 24h/7j", desc:"Réservez directement sur l'agenda de l'artisan, sans appel.", color:"text-blue-500 bg-blue-50 dark:bg-blue-500/10" },
              { icon:Shield, title:"Paiement séquestre", desc:"Votre argent est versé uniquement quand vous validez les travaux.", color:"text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10" },
              { icon:Award, title:"Artisans certifiés", desc:"Diplômes, assurances et certifications RGE vérifiés manuellement.", color:"text-orange-500 bg-orange-50 dark:bg-orange-500/10" },
            ].map((f, i) => (
              <motion.div key={f.title} initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }}
                viewport={{ once:true }} transition={{ delay:i*0.1 }}
                className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
                <div className={`w-12 h-12 rounded-2xl ${f.color} flex items-center justify-center mb-5`}>
                  <f.icon size={22} />
                </div>
                <h3 className="font-bold text-slate-800 dark:text-white text-lg mb-2">{f.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ARTISANS VEDETTE */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white">Disponibles maintenant</h2>
              <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">Les mieux notés du moment</p>
            </div>
            <Link to="/recherche"
              className="text-orange-500 hover:text-orange-600 text-sm font-bold flex items-center gap-1 group">
              Voir tous <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ARTISANS.slice(0, 3).map((a, i) => (
              <motion.div key={a.id} initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }}
                viewport={{ once:true }} transition={{ delay:i*0.1 }}>
                <CarteArtisan artisan={a} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-20 px-6 bg-orange-500 dark:bg-orange-600">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-black text-white mb-3">Prêt à rénover ?</h2>
          <p className="text-orange-100 mb-8">Créez votre compte gratuitement et trouvez votre artisan en moins de 5 minutes.</p>
          <div className="flex gap-3 justify-center">
            <Link to="/inscription"
              className="bg-white text-orange-600 px-8 py-3.5 rounded-2xl font-black hover:bg-orange-50 transition-all shadow-lg">
              Démarrer gratuitement →
            </Link>
            <Link to="/devis"
              className="bg-orange-400/30 hover:bg-orange-400/50 text-white px-8 py-3.5 rounded-2xl font-bold transition-all border border-white/20">
              Demander un devis
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 px-6 bg-slate-900 text-center">
        <p className="text-slate-500 text-sm">© 2026 ImoRénov — Tous droits réservés</p>
      </footer>
    </div>
  );
}