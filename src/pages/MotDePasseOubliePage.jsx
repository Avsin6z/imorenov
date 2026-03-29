import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { supabase } from "../utils/supabase";

export default function MotDePasseOubliePage() {
  const [email, setEmail] = useState("");
  const [envoye, setEnvoye] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async e => {
    e.preventDefault();
    if (!email) { setError("Entrez votre email."); return; }
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + "/reset-password",
      });
      if (error) throw error;
      setEnvoye(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}
      className="min-h-screen flex items-center justify-center px-6 bg-slate-50 dark:bg-slate-950">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-slate-800 dark:text-white mb-2">
            Mot de passe oublié
          </h1>
          <p className="text-slate-500">On vous envoie un lien de réinitialisation</p>
        </div>

        {!envoye ? (
          <form onSubmit={handleSubmit}
            className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-3xl p-8 shadow-sm space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email</label>
              <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus-within:border-orange-400 rounded-xl px-4 py-3 transition-colors">
                <Mail size={16} className="text-slate-400 shrink-0" />
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="jean@email.com"
                  className="bg-transparent flex-1 outline-none text-slate-800 dark:text-white text-sm placeholder:text-slate-300" />
              </div>
            </div>
            {error && <p className="text-red-500 text-sm bg-red-50 dark:bg-red-500/10 px-4 py-2.5 rounded-xl">{error}</p>}
            <button type="submit" disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3.5 rounded-xl font-black transition-all disabled:opacity-60 shadow-md shadow-orange-200 dark:shadow-orange-900/30">
              {loading ? "Envoi..." : "Envoyer le lien →"}
            </button>
          </form>
        ) : (
          <motion.div initial={{ scale:0.9 }} animate={{ scale:1 }}
            className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-3xl p-8 shadow-sm text-center">
            <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="text-emerald-500" size={32} />
            </div>
            <h2 className="text-xl font-black text-slate-800 dark:text-white mb-2">Email envoyé !</h2>
            <p className="text-slate-500 text-sm mb-6">
              Vérifiez votre boîte mail et cliquez sur le lien pour réinitialiser votre mot de passe.
            </p>
            <p className="text-slate-400 text-xs">Pensez à vérifier vos spams.</p>
          </motion.div>
        )}

        <Link to="/connexion"
          className="flex items-center justify-center gap-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 text-sm font-semibold mt-5 transition-colors">
          <ArrowLeft size={14} /> Retour à la connexion
        </Link>
      </div>
    </motion.div>
  );
}