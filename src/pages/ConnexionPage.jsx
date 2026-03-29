import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock } from "lucide-react";
import { useAuth } from "../context/AppContext";
import { InputField } from "./InscriptionPage";
import { supabase } from "../utils/supabase";

export default function ConnexionPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const update = k => v => setForm(f => ({ ...f, [k]: v }));

  const handleGoogle = async () => {
  await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: window.location.origin + "/dashboard"
    }
  });
};

  const handleSubmit = async e => {
  e.preventDefault();
  if (!form.email || !form.password) { setError("Remplissez tous les champs."); return; }
  setLoading(true);
  try {
    await login({ email: form.email, password: form.password });
    navigate("/dashboard");
  } catch (err) {
    setError("Email ou mot de passe incorrect.");
  } finally {
    setLoading(false);
  }
};

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-28 min-h-screen flex items-center justify-center px-4 bg-slate-50 dark:bg-slate-950">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-slate-800 dark:text-white mb-2">Connexion</h1>
          <p className="text-slate-500">Bon retour sur ImoRénov 👋</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-3xl p-8 shadow-sm space-y-4">
          <InputField label="Email" type="email" value={form.email} onChange={update("email")} placeholder="jean@email.com" icon={Mail} />
          <InputField label="Mot de passe" type="password" value={form.password} onChange={update("password")} placeholder="••••••••" icon={Lock} />
          <div className="text-right">
            <button type="button" className="text-orange-500 hover:text-orange-600 text-xs font-bold">Mot de passe oublié ?</button>
          </div>
          {error && <p className="text-red-500 text-sm bg-red-50 dark:bg-red-500/10 px-4 py-2.5 rounded-xl">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3.5 rounded-xl font-black transition-all disabled:opacity-60 shadow-md shadow-orange-200 dark:shadow-orange-900/30">
            {loading ? "Connexion..." : "Se connecter →"}
          </button>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-100 dark:bg-slate-700" />
            <span className="text-slate-400 text-xs">ou</span>
            <div className="flex-1 h-px bg-slate-100 dark:bg-slate-700" />
          </div>
          <button
  type="button"
  onClick={handleGoogle}
  className="w-full bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-700 dark:text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-3 border border-slate-200 dark:border-slate-600 transition-all"
>
  <img src="https://www.google.com/favicon.ico" className="w-4 h-4" />
  Continuer avec Google
</button>
        </form>
        <p className="text-center mt-5 text-slate-500 text-sm">
          Pas de compte ? <Link to="/inscription" className="text-orange-500 font-bold hover:text-orange-600">S'inscrire gratuitement</Link>
        </p>
      </div>
    </motion.div>
  );
}