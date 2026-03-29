import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Mail, Lock, Phone, Eye, EyeOff, FileText, Award, Zap, CheckCircle } from "lucide-react";
import { useAuth } from "../context/AppContext";
import { TOUS_METIERS, DEPARTEMENTS } from "../utils/constants";

export function InputField({ label, type = "text", value, onChange, placeholder, icon: Icon, error }) {
  const [show, setShow] = useState(false);
  const isP = type === "password";
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</label>}
      <div className={`flex items-center gap-2 bg-slate-50 dark:bg-slate-900 border rounded-xl px-4 py-3 ${error ? "border-red-400" : "border-slate-200 dark:border-slate-700 focus-within:border-orange-400"} transition-colors`}>
        {Icon && <Icon size={16} className="text-slate-400 shrink-0" />}
        <input type={isP ? (show ? "text" : "password") : type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
          className="bg-transparent flex-1 outline-none text-slate-800 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600 text-sm" />
        {isP && <button type="button" onClick={() => setShow(s => !s)} className="text-slate-400 hover:text-slate-600">{show ? <EyeOff size={14} /> : <Eye size={14} />}</button>}
      </div>
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
}

export default function InscriptionPage() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState("client");
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    prenom:"", nom:"", email:"", password:"", confirm:"", tel:"",
    raisonSociale:"", siret:"", formeJuridique:"", secteur:"",
    metiersEntreprise:[], zonesIntervention:[], siteWeb:"",
    kbis:false, assuranceRC:false, assuranceDecennale:false, certifRGE:false, certifQualibat:false,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const update = k => v => setForm(f => ({ ...f, [k]: v }));
  const toggleMetier = m => setForm(f => ({ ...f, metiersEntreprise: f.metiersEntreprise.includes(m) ? f.metiersEntreprise.filter(x => x !== m) : [...f.metiersEntreprise, m] }));
  const toggleZone = z => setForm(f => ({ ...f, zonesIntervention: f.zonesIntervention.includes(z) ? f.zonesIntervention.filter(x => x !== z) : [...f.zonesIntervention, z] }));

  const validate = () => {
    const e = {};
    if (!form.prenom.trim()) e.prenom = "Requis";
    if (!form.nom.trim()) e.nom = "Requis";
    if (!form.email.includes("@")) e.email = "Email invalide";
    if (form.password.length < 8) e.password = "Min. 8 caractères";
    if (form.password !== form.confirm) e.confirm = "Ne correspond pas";
    if (role === "entreprise" && form.siret.replace(/\s/g,"").length !== 14) e.siret = "14 chiffres requis";
    return e;
  };

  const handleSubmit = async (e) => {
  if (e?.preventDefault) e.preventDefault();
  const e2 = validate();
  if (Object.keys(e2).length > 0) { setErrors(e2); return; }
  setLoading(true);
  try {
    await register({
      prenom: form.prenom,
      nom: form.nom,
      email: form.email,
      password: form.password,
      tel: form.tel,
      role,
    });
    navigate("/confirmation")
  } catch (err) {
    setErrors({ email: err.message });
  } finally {
    setLoading(false);
  }
};

  const FORMES = ["SARL","SAS","SASU","EURL","EI","Auto-entrepreneur","SNC","SA"];
  const SECTEURS = ["Gros œuvre & Structure","Second œuvre","Électricité & Énergie","Plomberie & Chauffage","Menuiserie & Agencement","Revêtements & Finitions","Énergie renouvelable","Diagnostic & Bureau d'études","Aménagement extérieur","Nettoyage & Maintenance"];
  const ZONES_DEPTS = ["75","77","78","91","92","93","94","95","01","02","03","04","05","06","07","08","09","10","11","12","13","14","15","16","17","18","19","21","22","23","24","25","26","27","28","29","30","31","32","33","34","35","36","37","38","39","40","41","42","43","44","45","46","47","48","49","50","51","52","53","54","55","56","57","58","59","60","61","62","63","64","65","66","67","68","69","70","71","72","73","74","76","79","80","81","82","83","84","85","86","87","88","89","90"];
  const stepsEntreprise = ["Compte","Entreprise","Métiers","Documents"];

  const btnClass = (active) => `py-3 px-3 rounded-xl font-bold text-xs border transition-all text-center ${active ? "bg-orange-500 border-orange-500 text-white shadow-md shadow-orange-200 dark:shadow-orange-900/30" : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 hover:border-slate-300"}`;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-28 min-h-screen flex items-start justify-center px-4 pb-16 bg-slate-50 dark:bg-slate-950">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-slate-800 dark:text-white mb-2">Créer mon compte</h1>
          <p className="text-slate-500">Rejoignez +12 000 utilisateurs ImoRénov</p>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { v:"client", emoji:"👤", label:"Particulier", sub:"Je cherche un artisan" },
            { v:"pro", emoji:"🔧", label:"Artisan", sub:"Je suis indépendant" },
            { v:"entreprise", emoji:"🏢", label:"Entreprise", sub:"Société du bâtiment" },
          ].map(r => (
            <button key={r.v} onClick={() => { setRole(r.v); setStep(1); }} className={btnClass(role === r.v)}>
              <div className="text-xl mb-1">{r.emoji}</div>
              <div className="font-black text-xs">{r.label}</div>
              <div className="opacity-60 text-[10px] mt-0.5">{r.sub}</div>
            </button>
          ))}
        </div>

        {role === "entreprise" && (
          <div className="flex items-center justify-between mb-8 relative">
            <div className="absolute top-3.5 left-0 right-0 h-0.5 bg-slate-200 dark:bg-slate-700" />
            <div className="absolute top-3.5 left-0 h-0.5 bg-orange-500 transition-all" style={{ width: `${((step - 1) / 3) * 100}%` }} />
            {stepsEntreprise.map((s, i) => (
              <div key={s} className="flex flex-col items-center gap-1.5 z-10">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all ${step > i + 1 ? "bg-emerald-500 text-white" : step === i + 1 ? "bg-orange-500 text-white" : "bg-slate-200 dark:bg-slate-700 text-slate-400"}`}>
                  {step > i + 1 ? "✓" : i + 1}
                </div>
                <span className={`text-xs font-bold ${step >= i + 1 ? "text-slate-700 dark:text-white" : "text-slate-400"}`}>{s}</span>
              </div>
            ))}
          </div>
        )}

        <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-3xl p-8 shadow-sm">
          {role !== "entreprise" && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <InputField label="Prénom" value={form.prenom} onChange={update("prenom")} placeholder="Jean" icon={User} error={errors.prenom} />
                <InputField label="Nom" value={form.nom} onChange={update("nom")} placeholder="Dupont" icon={User} error={errors.nom} />
              </div>
              <InputField label="Email" type="email" value={form.email} onChange={update("email")} placeholder="jean@email.com" icon={Mail} error={errors.email} />
              <InputField label="Téléphone" type="tel" value={form.tel} onChange={update("tel")} placeholder="06 00 00 00 00" icon={Phone} />
              <InputField label="Mot de passe" type="password" value={form.password} onChange={update("password")} placeholder="Min. 8 caractères" icon={Lock} error={errors.password} />
              <InputField label="Confirmer" type="password" value={form.confirm} onChange={update("confirm")} placeholder="Répétez" icon={Lock} error={errors.confirm} />
              <button type="submit" disabled={loading}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3.5 rounded-xl font-black transition-all disabled:opacity-60 shadow-md shadow-orange-200 dark:shadow-orange-900/30">
                {loading ? "Création..." : "Créer mon compte →"}
              </button>
            </form>
          )}

          {role === "entreprise" && step === 1 && (
            <div className="space-y-4">
              <h2 className="text-slate-800 dark:text-white font-black mb-4">Votre compte administrateur</h2>
              <div className="grid grid-cols-2 gap-3">
                <InputField label="Prénom" value={form.prenom} onChange={update("prenom")} placeholder="Jean" icon={User} error={errors.prenom} />
                <InputField label="Nom" value={form.nom} onChange={update("nom")} placeholder="Dupont" icon={User} error={errors.nom} />
              </div>
              <InputField label="Email professionnel" type="email" value={form.email} onChange={update("email")} placeholder="contact@entreprise.fr" icon={Mail} error={errors.email} />
              <InputField label="Téléphone" type="tel" value={form.tel} onChange={update("tel")} placeholder="01 00 00 00 00" icon={Phone} />
              <InputField label="Mot de passe" type="password" value={form.password} onChange={update("password")} placeholder="Min. 8 caractères" icon={Lock} error={errors.password} />
              <InputField label="Confirmer" type="password" value={form.confirm} onChange={update("confirm")} placeholder="Répétez" icon={Lock} error={errors.confirm} />
              <button onClick={() => { const e2 = validate(); if (Object.keys(e2).length > 0) { setErrors(e2); return; } setStep(2); }}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3.5 rounded-xl font-black transition-all shadow-md shadow-orange-200 dark:shadow-orange-900/30">
                Continuer →
              </button>
            </div>
          )}

          {role === "entreprise" && step === 2 && (
            <div className="space-y-4">
              <h2 className="text-slate-800 dark:text-white font-black mb-4">Votre entreprise</h2>
              <InputField label="Raison sociale" value={form.raisonSociale} onChange={update("raisonSociale")} placeholder="SARL Dubois BTP" icon={FileText} />
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Numéro SIRET</label>
                <div className={`flex items-center gap-2 bg-slate-50 dark:bg-slate-900 border rounded-xl px-4 py-3 ${errors.siret ? "border-red-400" : "border-slate-200 dark:border-slate-700 focus-within:border-orange-400"} transition-colors`}>
                  <Award size={16} className="text-slate-400" />
                  <input value={form.siret}
                    onChange={e => update("siret")(e.target.value.replace(/\D/g, "").replace(/(.{3})/g, "$1 ").trim().slice(0, 17))}
                    placeholder="000 000 000 00000" maxLength={17}
                    className="bg-transparent flex-1 outline-none text-slate-800 dark:text-white text-sm placeholder:text-slate-300 font-mono" />
                </div>
                {errors.siret && <p className="text-red-500 text-xs mt-1">{errors.siret}</p>}
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Forme juridique</label>
                <div className="grid grid-cols-4 gap-2">
                  {FORMES.map(f => (
                    <button key={f} onClick={() => update("formeJuridique")(f)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all ${form.formeJuridique === f ? "bg-orange-500 border-orange-500 text-white" : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-500 hover:border-orange-300"}`}>
                      {f}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Secteur principal</label>
                <select value={form.secteur} onChange={e => update("secteur")(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-700 dark:text-white text-sm outline-none">
                  <option value="">Sélectionner</option>
                  {SECTEURS.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <InputField label="Site web (optionnel)" value={form.siteWeb} onChange={update("siteWeb")} placeholder="https://www.mon-entreprise.fr" icon={Zap} />
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="flex-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-white py-3 rounded-xl font-bold">← Retour</button>
                <button onClick={() => setStep(3)} disabled={!form.raisonSociale || !form.siret}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-black disabled:opacity-50 transition-all">
                  Continuer →
                </button>
              </div>
            </div>
          )}

          {role === "entreprise" && step === 3 && (
            <div className="space-y-6">
              <h2 className="text-slate-800 dark:text-white font-black mb-2">Métiers & Zones</h2>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 block">Métiers ({form.metiersEntreprise.length} sélectionnés)</label>
                <div className="max-h-48 overflow-y-auto space-y-1 pr-1">
                  {TOUS_METIERS.slice(0, 30).map(m => (
                    <button key={m} onClick={() => toggleMetier(m)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium border transition-all ${form.metiersEntreprise.includes(m) ? "bg-orange-50 dark:bg-orange-500/10 border-orange-200 dark:border-orange-500/30 text-orange-600 dark:text-orange-400" : "bg-slate-50 dark:bg-slate-900 border-transparent text-slate-500 hover:border-slate-200"}`}>
                      {form.metiersEntreprise.includes(m) ? "✓ " : ""}{m}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 block">Départements ({form.zonesIntervention.length} sélectionnés)</label>
                <div className="grid grid-cols-6 gap-1.5 max-h-40 overflow-y-auto pr-1">
                  {ZONES_DEPTS.map(d => (
                    <button key={d} onClick={() => toggleZone(d)}
                      className={`py-1.5 rounded-lg text-xs font-black border transition-all ${form.zonesIntervention.includes(d) ? "bg-orange-500 border-orange-500 text-white" : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-500 hover:border-orange-300"}`}>
                      {d}
                    </button>
                  ))}
                </div>
                <p className="text-slate-400 text-xs mt-2">{form.zonesIntervention.map(d => DEPARTEMENTS[d] || d).join(", ") || "Aucun"}</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="flex-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-white py-3 rounded-xl font-bold">← Retour</button>
                <button onClick={() => setStep(4)} disabled={form.metiersEntreprise.length === 0}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-black disabled:opacity-50">Continuer →</button>
              </div>
            </div>
          )}

          {role === "entreprise" && step === 4 && (
            <div className="space-y-4">
              <h2 className="text-slate-800 dark:text-white font-black mb-2">Documents & Certifications</h2>
              <p className="text-slate-400 text-sm">Cochez les documents disponibles. Vérification sous 48h.</p>
              <div className="space-y-3">
                {[
                  { k:"kbis", l:"Extrait Kbis", sub:"Moins de 3 mois", required:true },
                  { k:"assuranceRC", l:"Assurance RC Pro", sub:"Responsabilité civile", required:true },
                  { k:"assuranceDecennale", l:"Assurance Décennale", sub:"Travaux de construction", required:false },
                  { k:"certifRGE", l:"Certification RGE", sub:"Reconnu Garant Environnement", required:false },
                  { k:"certifQualibat", l:"Certification Qualibat", sub:"Qualification professionnelle", required:false },
                ].map(doc => (
                  <label key={doc.k} className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${form[doc.k] ? "bg-orange-50 dark:bg-orange-500/10 border-orange-200 dark:border-orange-500/30" : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:border-slate-300"}`}>
                    <input type="checkbox" checked={form[doc.k]} onChange={e => update(doc.k)(e.target.checked)} className="accent-orange-500 w-4 h-4" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-bold ${form[doc.k] ? "text-orange-600 dark:text-orange-400" : "text-slate-700 dark:text-white"}`}>{doc.l}</span>
                        {doc.required && <span className="text-[10px] bg-red-50 dark:bg-red-500/10 text-red-500 px-2 py-0.5 rounded-full font-bold">Obligatoire</span>}
                      </div>
                      <span className="text-slate-400 text-xs">{doc.sub}</span>
                    </div>
                    {form[doc.k] && <CheckCircle className="text-orange-500 shrink-0" size={16} />}
                  </label>
                ))}
              </div>
              {(!form.kbis || !form.assuranceRC) && <p className="text-red-500 text-xs text-center">Kbis et RC Pro obligatoires</p>}
              <div className="flex gap-3">
                <button onClick={() => setStep(3)} className="flex-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-white py-3 rounded-xl font-bold">← Retour</button>
                <button onClick={handleSubmit} disabled={loading || !form.kbis || !form.assuranceRC}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-black disabled:opacity-50 transition-all">
                  {loading ? "Création..." : "Créer mon compte →"}
                </button>
              </div>
            </div>
          )}
        </div>
        <p className="text-center mt-5 text-slate-500 text-sm">
          Déjà un compte ? <Link to="/connexion" className="text-orange-500 font-bold hover:text-orange-600">Se connecter</Link>
        </p>
      </div>
    </motion.div>
  );
}