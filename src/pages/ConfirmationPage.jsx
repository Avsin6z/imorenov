import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, ArrowRight, Home } from "lucide-react";
import { supabase } from "../utils/supabase";

export default function ConfirmationPage() {
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" || event === "USER_UPDATED") {
        setVerified(true);
        setLoading(false);
      } else {
        setLoading(false);
      }
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) { setVerified(true); }
      setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
      className="min-h-screen flex items-center justify-center px-6 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-md w-full text-center">

        <motion.div initial={{ scale:0 }} animate={{ scale:1 }} transition={{ type:"spring", delay:0.2 }}
          className="w-24 h-24 bg-emerald-50 dark:bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-8">
          <CheckCircle className="text-emerald-500" size={48} />
        </motion.div>

        <h1 className="text-3xl font-black text-slate-800 dark:text-white mb-3">
          {verified ? "Compte confirmé ! 🎉" : "Compte créé ! 🎉"}
        </h1>
        <p className="text-slate-500 mb-2">
          {verified ? "Votre email a bien été vérifié." : "Vérifiez votre email pour confirmer votre compte."}
        </p>
        <p className="text-slate-400 text-sm mb-10">
          {verified ? "Vous pouvez maintenant vous connecter." : "Un email de confirmation vous a été envoyé."}
        </p>

        <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-3xl p-8 shadow-sm mb-6">
          <div className="space-y-3 text-left mb-6">
            {[
              "500+ artisans certifiés disponibles",
              "Prise de RDV en ligne 24h/7j",
              "Devis gratuits sous 48h",
              "Simulateur d'aides MaPrimeRénov'",
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-5 h-5 bg-emerald-50 dark:bg-emerald-500/10 rounded-full flex items-center justify-center shrink-0">
                  <CheckCircle className="text-emerald-500" size={12} />
                </div>
                <span className="text-slate-600 dark:text-slate-300 text-sm">{item}</span>
              </div>
            ))}
          </div>

          <Link to="/connexion"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3.5 rounded-xl font-black transition-all shadow-md shadow-orange-200 dark:shadow-orange-900/30 flex items-center justify-center gap-2">
            Se connecter maintenant <ArrowRight size={18} />
          </Link>
        </div>

        <Link to="/"
          className="flex items-center justify-center gap-2 text-slate-400 hover:text-slate-600 text-sm font-semibold transition-colors">
          <Home size={14} /> Retour à l'accueil
        </Link>
      </div>
    </motion.div>
  );
}