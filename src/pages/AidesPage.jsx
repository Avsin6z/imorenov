import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Euro, Wrench } from "lucide-react";

export default function AidesPage() {
  const [revenus, setRevenus] = useState("intermediaire");
  const [travaux, setTravaux] = useState([]);
  const [calcule, setCalcule] = useState(false);
  const toggle = t => setTravaux(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);

  const aides = {
    isolation: { nom:"Isolation combles/murs", maprime:{modeste:5000,intermediaire:2500,superieur:0}, cee:800 },
    chaudiere: { nom:"Chaudière à granulés", maprime:{modeste:10000,intermediaire:5000,superieur:2000}, cee:1500 },
    fenetres: { nom:"Fenêtres double vitrage", maprime:{modeste:1200,intermediaire:600,superieur:0}, cee:200 },
    pompe: { nom:"Pompe à chaleur", maprime:{modeste:8000,intermediaire:4000,superieur:1500}, cee:1200 },
    solaire: { nom:"Panneaux solaires", maprime:{modeste:3000,intermediaire:1500,superieur:500}, cee:600 },
    vmc: { nom:"VMC double flux", maprime:{modeste:2500,intermediaire:1200,superieur:0}, cee:400 },
  };
  const totalMP = travaux.reduce((s, t) => s + (aides[t]?.maprime[revenus] || 0), 0);
  const totalCEE = travaux.reduce((s, t) => s + (aides[t]?.cee || 0), 0);

  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} className="pt-28 min-h-screen px-6 max-w-3xl mx-auto pb-16">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-black text-slate-800 dark:text-white mb-2">Simulateur d'aides</h1>
        <p className="text-slate-400">Estimez vos droits à MaPrimeRénov' et aux CEE</p>
      </div>
      <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-3xl p-8 shadow-sm space-y-8">
        <div>
          <h2 className="text-slate-800 dark:text-white font-black mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
            <Euro size={16} className="text-orange-500" /> Revenus fiscaux annuels
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {[{v:"modeste",l:"Modestes",sub:"< 21 805€"},{v:"intermediaire",l:"Intermédiaires",sub:"21 805 - 30 548€"},{v:"superieur",l:"Supérieurs",sub:"> 30 548€"}].map(r => (
              <button key={r.v} onClick={() => setRevenus(r.v)}
                className={`py-3 px-3 rounded-xl text-xs font-bold border text-center transition-all ${revenus === r.v ? "bg-orange-500 border-orange-500 text-white shadow-md shadow-orange-200 dark:shadow-orange-900/30" : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-500 hover:border-orange-200"}`}>
                <div className="font-black text-sm mb-1">{r.l}</div>
                <div className="opacity-70">{r.sub}</div>
              </button>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-slate-800 dark:text-white font-black mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
            <Wrench size={16} className="text-orange-500" /> Travaux envisagés
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(aides).map(([k, a]) => (
              <button key={k} onClick={() => toggle(k)}
                className={`py-3 px-4 rounded-xl text-sm font-bold border text-left transition-all ${travaux.includes(k) ? "bg-orange-500 border-orange-500 text-white" : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-500 hover:border-orange-200"}`}>
                {travaux.includes(k) ? "✓ " : ""}{a.nom}
              </button>
            ))}
          </div>
        </div>
        <button onClick={() => setCalcule(true)} disabled={travaux.length === 0}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3.5 rounded-xl font-black disabled:opacity-50 transition-all shadow-md shadow-orange-200 dark:shadow-orange-900/30">
          Calculer mes aides →
        </button>
        <AnimatePresence>
          {calcule && travaux.length > 0 && (
            <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} className="border-t border-slate-100 dark:border-slate-700 pt-6 space-y-3">
              <h3 className="text-slate-800 dark:text-white font-black text-lg mb-4">Vos aides estimées</h3>
              <div className="flex justify-between bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                <span className="text-slate-500 text-sm">MaPrimeRénov'</span>
                <span className="text-orange-500 font-black">{totalMP.toLocaleString()} €</span>
              </div>
              <div className="flex justify-between bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                <span className="text-slate-500 text-sm">Certificats CEE</span>
                <span className="text-blue-500 font-black">{totalCEE.toLocaleString()} €</span>
              </div>
              <div className="flex justify-between bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 p-4 rounded-xl">
                <span className="text-emerald-600 dark:text-emerald-400 font-black">Total estimé</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-black text-xl">{(totalMP + totalCEE).toLocaleString()} €</span>
              </div>
              <p className="text-slate-400 text-xs text-center">* Estimation indicative, sous réserve d'éligibilité.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}