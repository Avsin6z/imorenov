import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, CheckCircle } from "lucide-react";
import { supabase } from "../utils/supabase";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    if (password.length < 8) { setError("Minimum 8 caractères."); return; }
    if (password !== confirm) { setError("Les mots de passe ne correspondent pas."); return; }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setDone(true);
      setTimeout(() => navigate("/connexion"), 2000);
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
          <h1 className="text-3xl font-black text-slate-800 dark:text-white mb-2">Nouveau mot de passe</h1>
          <p className="text-slate-500">Choisissez un mot de passe sécurisé</p>
        </div>

        {!done ? (
          <form onSubmit={handleSubmit}
            className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-3xl p-8 shadow-sm space-y-4">
            {[
              { label:"Nouveau mot de passe", value:password, set:setPassword },
              { label:"Confirmer", value:confirm, set:setConfirm },
            ].map(f => (
              <div key={f.label} className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">{f.label}</label>
                <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus-within:border-orange-400 rounded-xl px-4 py-3 transition-colors">
                  <Lock size={16} className="text-slate-400 shrink-0" />
                  <input type="password" value={f.value} onChange={e => f.set(e.target.value)}
                    placeholder="••••••••"
                    className="bg-transparent flex-1 outline-none text-slate-800 dark:text-white text-sm placeholder:text-slate-300" />
                </div>
              </div>
            ))}
            {error && <p className="text-red-500 text-sm bg-red-50 px-4 py-2.5 rounded-xl">{error}</p>}
            <button type="submit" disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3.5 rounded-xl font-black disabled:opacity-60 shadow-md shadow-orange-200 dark:shadow-orange-900/30">
              {loading ? "Mise à jour..." : "Mettre à jour →"}
            </button>
          </form>
        ) : (
          <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-3xl p-8 shadow-sm text-center">
            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="text-emerald-500" size={32} />
            </div>
            <h2 className="text-xl font-black text-slate-800 dark:text-white mb-2">Mot de passe mis à jour !</h2>
            <p className="text-slate-500 text-sm">Redirection vers la connexion…</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}