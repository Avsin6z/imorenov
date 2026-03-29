import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, User, Mail, Phone, MapPin, Wrench } from "lucide-react";
import { InputField } from "./InscriptionPage";
import { useAutocomplete } from "../hooks/useAutocomplete";
import { useAuth } from "../context/AppContext";
import { TOUS_METIERS } from "../utils/constants";

export default function DevisPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    typeProjet:"", metier:"", description:"", superficie:"", budget:"", delai:"",
    adresse:"", ville:"", cp:"",
    prenom: user?.prenom || "", nom: user?.nom || "", email: user?.email || "", tel: user?.tel || "",
  });
  const [envoye, setEnvoye] = useState(false);
  const update = k => v => setForm(f => ({ ...f, [k]: v }));
  const metierAC = useAutocomplete(async q => TOUS_METIERS.filter(m => m.toLowerCase().includes(q.toLowerCase())).slice(0, 6));
  const steps = [{n:1,l:"Projet"},{n:2,l:"Détails"},{n:3,l:"Contact"},{n:4,l:"Confirmation"}];

  const handleSubmit = async () => {
    await new Promise(r => setTimeout(r, 800));
    setEnvoye(true);
  };

  const chipClass = (active) => `py-3 px-4 rounded-xl text-sm font-bold border text-left transition-all ${active ? "bg-orange-500 border-orange-500 text-white" : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-500 hover:border-orange-200"}`;

  if (envoye) return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} className="pt-40 min-h-screen flex flex-col items-center justify-center text-center px-6">
      <motion.div initial={{ scale:0 }} animate={{ scale:1 }} transition={{ type:"spring" }}
        className="w-24 h-24 bg-emerald-50 dark:bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="text-emerald-500" size={48} />
      </motion.div>
      <h2 className="text-3xl font-black text-slate-800 dark:text-white mb-3">Demande envoyée !</h2>
      <p className="text-slate-400 max-w-md mb-8">Votre demande a été transmise à 3 artisans qualifiés. Réponses sous 48h.</p>
      <div className="flex gap-3">
        <button onClick={() => navigate("/dashboard")} className="bg-orange-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-600 transition-all shadow-md shadow-orange-200 dark:shadow-orange-900/30">Mon dashboard</button>
        <button onClick={() => { setEnvoye(false); setStep(1); }} className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">Nouvelle demande</button>
      </div>
    </motion.div>
  );

  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} className="pt-28 min-h-screen px-6 max-w-2xl mx-auto pb-16 bg-slate-50 dark:bg-slate-950">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-black text-slate-800 dark:text-white mb-2">Demande de devis gratuite</h1>
        <p className="text-slate-400 text-sm">Recevez jusqu'à 3 devis d'artisans qualifiés sous 48h</p>
      </div>

      {/* STEPPER */}
      <div className="flex items-center justify-between mb-10 relative">
        <div className="absolute top-4 left-0 right-0 h-0.5 bg-slate-200 dark:bg-slate-700" />
        <div className="absolute top-4 left-0 h-0.5 bg-orange-500 transition-all" style={{ width: `${((step - 1) / 3) * 100}%` }} />
        {steps.map(s => (
          <div key={s.n} className="flex flex-col items-center gap-2 z-10">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm transition-all ${step >= s.n ? "bg-orange-500 text-white" : "bg-slate-200 dark:bg-slate-700 text-slate-400"}`}>
              {step > s.n ? <CheckCircle size={16} /> : s.n}
            </div>
            <span className={`text-xs font-bold ${step >= s.n ? "text-slate-700 dark:text-white" : "text-slate-400"}`}>{s.l}</span>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-3xl p-8 shadow-sm">
        {step === 1 && (
          <div className="space-y-5">
            <h2 className="text-slate-800 dark:text-white font-black text-lg mb-5">Votre projet</h2>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 block">Type de projet</label>
              <div className="grid grid-cols-2 gap-3">
                {["Rénovation","Construction neuve","Dépannage urgent","Entretien/Maintenance","Diagnostic","Aménagement extérieur"].map(t => (
                  <button key={t} onClick={() => update("typeProjet")(t)} className={chipClass(form.typeProjet === t)}>{t}</button>
                ))}
              </div>
            </div>
            <div className="relative">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Métier recherché</label>
              <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus-within:border-orange-400 rounded-xl px-4 py-3 transition-colors">
                <Wrench size={16} className="text-slate-400" />
                <input value={metierAC.query}
                  onChange={e => { metierAC.handleChange(e.target.value); update("metier")(e.target.value); }}
                  placeholder="Ex: Plombier, Électricien..."
                  className="bg-transparent flex-1 outline-none text-slate-800 dark:text-white text-sm placeholder:text-slate-300 dark:placeholder:text-slate-600" />
              </div>
              {metierAC.suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl mt-1 overflow-hidden z-50 shadow-lg">
                  {metierAC.suggestions.map(s => (
                    <button key={s} onClick={() => { metierAC.select(s); update("metier")(s); }}
                      className="w-full text-left px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm border-b border-slate-100 dark:border-slate-700 last:border-0 transition-colors">
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button onClick={() => setStep(2)} disabled={!form.typeProjet || !form.metier}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-black disabled:opacity-50 transition-all shadow-md shadow-orange-200 dark:shadow-orange-900/30">
              Continuer →
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <h2 className="text-slate-800 dark:text-white font-black text-lg mb-5">Détails du projet</h2>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Description des travaux</label>
              <textarea value={form.description} onChange={e => update("description")(e.target.value)}
                placeholder="Décrivez précisément vos travaux…" rows={4}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-orange-400 rounded-xl px-4 py-3 text-slate-800 dark:text-white text-sm outline-none resize-none placeholder:text-slate-300 dark:placeholder:text-slate-600 transition-colors" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Superficie (m²)</label>
                <input value={form.superficie} onChange={e => update("superficie")(e.target.value)} type="number" placeholder="Ex: 25"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-orange-400 rounded-xl px-4 py-3 text-slate-800 dark:text-white text-sm outline-none transition-colors" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Budget estimé</label>
                <select value={form.budget} onChange={e => update("budget")(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-700 dark:text-white text-sm outline-none">
                  <option value="">Sélectionner</option>
                  <option>Moins de 1 000€</option><option>1 000 - 5 000€</option>
                  <option>5 000 - 15 000€</option><option>15 000 - 50 000€</option><option>Plus de 50 000€</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Délai souhaité</label>
              <div className="grid grid-cols-3 gap-2">
                {["Urgent (< 1 sem.)","1 à 4 semaines","1 à 3 mois","3 à 6 mois","Plus de 6 mois","Flexible"].map(d => (
                  <button key={d} onClick={() => update("delai")(d)} className={chipClass(form.delai === d)}>{d}</button>
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="flex-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-white py-3 rounded-xl font-bold">← Retour</button>
              <button onClick={() => setStep(3)} disabled={!form.description || !form.delai}
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-black disabled:opacity-50 transition-all shadow-md shadow-orange-200 dark:shadow-orange-900/30">
                Continuer →
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-slate-800 dark:text-white font-black text-lg mb-5">Vos coordonnées</h2>
            <div className="grid grid-cols-2 gap-3">
              <InputField label="Prénom" value={form.prenom} onChange={update("prenom")} placeholder="Jean" icon={User} />
              <InputField label="Nom" value={form.nom} onChange={update("nom")} placeholder="Dupont" icon={User} />
            </div>
            <InputField label="Email" type="email" value={form.email} onChange={update("email")} placeholder="jean@email.com" icon={Mail} />
            <InputField label="Téléphone" type="tel" value={form.tel} onChange={update("tel")} placeholder="06 00 00 00 00" icon={Phone} />
            <InputField label="Adresse des travaux" value={form.adresse} onChange={update("adresse")} placeholder="10 rue de la Paix" icon={MapPin} />
            <div className="grid grid-cols-2 gap-3">
              <InputField label="Ville" value={form.ville} onChange={update("ville")} placeholder="Paris" />
              <InputField label="Code postal" value={form.cp} onChange={update("cp")} placeholder="75001" />
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setStep(2)} className="flex-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-white py-3 rounded-xl font-bold">← Retour</button>
              <button onClick={() => setStep(4)} className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-black transition-all shadow-md shadow-orange-200 dark:shadow-orange-900/30">Continuer →</button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-5">
            <h2 className="text-slate-800 dark:text-white font-black text-lg mb-5">Récapitulatif</h2>
            {[
              { l:"Type de projet", v:form.typeProjet }, { l:"Métier", v:form.metier },
              { l:"Description", v:form.description }, { l:"Budget", v:form.budget },
              { l:"Délai", v:form.delai }, { l:"Contact", v:`${form.prenom} ${form.nom} · ${form.email}` },
              { l:"Lieu", v:`${form.adresse}, ${form.cp} ${form.ville}` },
            ].map(r => (
              <div key={r.l} className="flex gap-3 border-b border-slate-100 dark:border-slate-700 pb-3 last:border-0">
                <span className="text-slate-400 text-sm w-32 shrink-0 font-semibold">{r.l}</span>
                <span className="text-slate-800 dark:text-white text-sm">{r.v || "—"}</span>
              </div>
            ))}
            <div className="flex gap-3 pt-2">
              <button onClick={() => setStep(3)} className="flex-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-white py-3 rounded-xl font-bold">← Modifier</button>
              <button onClick={handleSubmit} className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-black transition-all shadow-md shadow-orange-200 dark:shadow-orange-900/30">
                Envoyer ma demande 🚀
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}