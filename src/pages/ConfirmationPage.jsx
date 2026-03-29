import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, ArrowRight, Home } from "lucide-react";

export default function ConfirmationPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen flex items-center justify-center px-6 bg-slate-50 dark:bg-slate-950"
    >
      <div className="max-w-md w-full text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.2 }}
          className="w-24 h-24 bg-emerald-50 dark:bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-8"
        >
          <CheckCircle className="text-emerald-500" size={48} />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h1 className="text-3xl font-black text-slate-800 dark:text-white mb-3">
            Compte créé avec succès ! 🎉
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mb-2 leading-relaxed">
            Votre compte ImoRénov a bien été créé.
          </p>
          <p className="text-slate-400 dark:text-slate-500 text-sm mb-10">
            Vous pouvez maintenant vous connecter et accéder à votre dashboard.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-3xl p-8 shadow-sm mb-6"
        >
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100 dark:border-slate-700">
            <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
              <CheckCircle className="text-white" size={20} />
            </div>
            <div className="text-left">
              <p className="text-slate-800 dark:text-white font-bold">Compte vérifié</p>
              <p className="text-slate-400 text-sm">Prêt à utiliser ImoRénov</p>
            </div>
          </div>

          <div className="space-y-3 text-left mb-6">
            {[
              "Recherchez des artisans certifiés",
              "Prenez des RDV en ligne",
              "Demandez des devis gratuits",
              "Simulez vos aides MaPrimeRénov'",
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-5 h-5 bg-emerald-50 dark:bg-emerald-500/10 rounded-full flex items-center justify-center shrink-0">
                  <CheckCircle className="text-emerald-500" size={12} />
                </div>
                <span className="text-slate-600 dark:text-slate-300 text-sm">{item}</span>
              </div>
            ))}
          </div>

          <Link
            to="/connexion"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3.5 rounded-xl font-black transition-all shadow-md shadow-orange-200 dark:shadow-orange-900/30 flex items-center justify-center gap-2"
          >
            Se connecter maintenant <ArrowRight size={18} />
          </Link>
        </motion.div>

        <Link
          to="/"
          className="flex items-center justify-center gap-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 text-sm font-semibold transition-colors"
        >
          <Home size={14} /> Retour à l'accueil
        </Link>
      </div>
    </motion.div>
  );
}