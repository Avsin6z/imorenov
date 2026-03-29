import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LogOut, Calendar, FileText, Plus, Mail, Phone, User } from "lucide-react";
import { useAuth } from "../context/AppContext";

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("accueil");

  if (!user) { navigate("/connexion"); return null; }

  const projets = [
    { titre:"Rénovation cuisine", artisan:"Jean-Marc Rousseau", statut:"En cours", progress:65, budget:"8 500 €", icon:"🍳" },
    { titre:"Isolation combles", artisan:"3 artisans", statut:"Devis reçus", progress:20, budget:"3 200 €", icon:"🏠" },
    { titre:"Salle de bain", artisan:"Sophie Lefèvre", statut:"Terminé", progress:100, budget:"6 800 €", icon:"🚿" },
  ];
  const rdvs = [
    { artisan:"Jean-Marc Rousseau", metier:"Plombier", date:"Lun 31 mars 9h", statut:"Confirmé" },
    { artisan:"Claire Dubois", metier:"Maçon", date:"Mer 2 avril 14h", statut:"En attente" },
  ];
  const sc = {
    "En cours": "text-blue-500 bg-blue-50 dark:bg-blue-500/10",
    "Devis reçus": "text-orange-500 bg-orange-50 dark:bg-orange-500/10",
    "Terminé": "text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10"
  };
  const tabs = [
    { id:"accueil", l:"🏠 Accueil" }, { id:"projets", l:"📋 Projets" },
    { id:"rdv", l:"📅 RDV" }, { id:"devis", l:"📝 Devis" },
    { id:"messages", l:"💬 Messages" }, { id:"profil", l:"👤 Profil" },
  ];

  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} className="pt-16 min-h-screen flex bg-slate-50 dark:bg-slate-950">
      {/* SIDEBAR */}
      <aside className="w-56 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 fixed left-0 top-16 bottom-0 flex-col p-4 hidden md:flex">
        <div className="flex items-center gap-3 p-3 mb-5 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
          <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center font-black text-white text-sm">
            {user.prenom?.[0]?.toUpperCase()}
          </div>
          <div>
            <p className="text-slate-800 dark:text-white font-bold text-sm">{user.prenom}</p>
            <p className="text-slate-400 text-xs">{user.role === "pro" ? "Artisan" : "Client"}</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${tab === t.id ? "bg-orange-500 text-white shadow-sm" : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-white"}`}>
              {t.l}
            </button>
          ))}
        </nav>
        <button onClick={() => { logout(); navigate("/"); }}
          className="flex items-center gap-2 text-slate-400 hover:text-red-500 text-sm px-4 py-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10 transition-all">
          <LogOut size={14} /> Déconnexion
        </button>
      </aside>

      {/* CONTENU */}
      <main className="flex-1 md:ml-56 p-6 pb-16">
        {tab === "accueil" && <>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white mb-1">Bonjour {user.prenom} 👋</h1>
          <p className="text-slate-400 mb-6 text-sm">Voici vos projets en cours</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[{l:"Projets actifs",v:"2",c:"text-blue-500"},{l:"Devis reçus",v:"3",c:"text-orange-500"},{l:"Économies",v:"2 400€",c:"text-emerald-500"},{l:"Terminés",v:"1",c:"text-purple-500"}].map(k => (
              <div key={k.l} className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl p-5 shadow-sm">
                <p className={`text-2xl font-black ${k.c}`}>{k.v}</p>
                <p className="text-slate-400 text-xs mt-1">{k.l}</p>
              </div>
            ))}
          </div>
          <h3 className="font-black text-slate-800 dark:text-white mb-4">Projets récents</h3>
          <div className="space-y-3">
            {projets.map(p => (
              <div key={p.titre} className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
                <span className="text-3xl">{p.icon}</span>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-slate-800 dark:text-white font-bold">{p.titre}</span>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${sc[p.statut]}`}>{p.statut}</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-1.5">
                    <div className="bg-orange-500 h-1.5 rounded-full transition-all" style={{ width: `${p.progress}%` }} />
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-slate-400 text-xs">{p.artisan}</span>
                    <span className="text-slate-400 text-xs">{p.progress}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>}

        {tab === "projets" && <>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-black text-slate-800 dark:text-white">Mes projets</h1>
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-md shadow-orange-200 dark:shadow-orange-900/30">+ Nouveau</button>
          </div>
          <div className="space-y-4">
            {projets.map(p => (
              <div key={p.titre} className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl p-6 flex gap-4 items-start shadow-sm">
                <span className="text-4xl">{p.icon}</span>
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <h3 className="text-slate-800 dark:text-white font-black">{p.titre}</h3>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${sc[p.statut]}`}>{p.statut}</span>
                  </div>
                  <p className="text-slate-400 text-sm mb-3">{p.artisan} · {p.budget}</p>
                  <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2">
                    <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${p.progress}%` }} />
                  </div>
                  <p className="text-slate-400 text-xs mt-1">{p.progress}% complété</p>
                </div>
              </div>
            ))}
          </div>
        </>}

        {tab === "rdv" && <>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white mb-6">Mes rendez-vous</h1>
          <div className="space-y-4">
            {rdvs.map((r, i) => (
              <div key={i} className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl p-5 flex justify-between items-center shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-50 dark:bg-orange-500/10 rounded-xl flex items-center justify-center">
                    <Calendar className="text-orange-500" size={20} />
                  </div>
                  <div>
                    <p className="text-slate-800 dark:text-white font-bold">{r.artisan}</p>
                    <p className="text-slate-400 text-sm">{r.metier} · {r.date}</p>
                  </div>
                </div>
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${r.statut === "Confirmé" ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500" : "bg-yellow-50 dark:bg-yellow-500/10 text-yellow-500"}`}>{r.statut}</span>
              </div>
            ))}
          </div>
        </>}

        {tab === "devis" && <>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-black text-slate-800 dark:text-white">Mes demandes de devis</h1>
            <button onClick={() => navigate("/devis")} className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 shadow-md shadow-orange-200 dark:shadow-orange-900/30">
              <Plus size={14} /> Nouveau devis
            </button>
          </div>
          <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl p-10 text-center shadow-sm">
            <FileText size={36} className="text-slate-200 dark:text-slate-600 mx-auto mb-4" />
            <p className="text-slate-800 dark:text-white font-bold mb-1">Aucune demande en cours</p>
            <p className="text-slate-400 text-sm">Recevez jusqu'à 3 devis sous 48h</p>
            <button onClick={() => navigate("/devis")} className="mt-5 bg-orange-500 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-orange-600 transition-all">Faire une demande</button>
          </div>
        </>}

        {tab === "messages" && <>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white mb-6">Messages</h1>
          <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm">
            {[
              { from:"Jean-Marc Rousseau", msg:"Bonjour, j'ai terminé la pose des placards.", time:"10:32", unread:true },
              { from:"Sophie Lefèvre", msg:"La facture finale vous a été envoyée.", time:"Hier", unread:false },
              { from:"IsoExpert Pro", msg:"Voici les 2 options de devis.", time:"Lundi", unread:false },
            ].map((c, i) => (
              <div key={i} className={`flex items-center gap-4 p-5 border-b border-slate-100 dark:border-slate-700 last:border-0 cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/30 ${c.unread ? "bg-orange-50/50 dark:bg-orange-500/5" : ""}`}>
                <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white font-black text-sm shrink-0">{c.from[0]}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between">
                    <span className={`text-sm ${c.unread ? "text-slate-800 dark:text-white font-bold" : "text-slate-600 dark:text-slate-300 font-medium"}`}>{c.from}</span>
                    <span className="text-slate-400 text-xs shrink-0">{c.time}</span>
                  </div>
                  <p className="text-slate-400 text-sm mt-0.5 truncate">{c.msg}</p>
                </div>
                {c.unread && <div className="w-2.5 h-2.5 bg-orange-500 rounded-full shrink-0" />}
              </div>
            ))}
          </div>
        </>}

        {tab === "profil" && <>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white mb-6">Mon profil</h1>
          <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-3xl p-8 max-w-md shadow-sm">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-20 h-20 bg-orange-500 rounded-2xl flex items-center justify-center text-3xl font-black text-white">
                {user.prenom?.[0]?.toUpperCase()}
              </div>
              <div>
                <h2 className="text-slate-800 dark:text-white font-black text-xl">{user.prenom} {user.nom}</h2>
                <p className="text-slate-400 text-sm">{user.email}</p>
                <span className="text-xs font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1 rounded-full mt-1 inline-block">✓ Vérifié</span>
              </div>
            </div>
            <div className="space-y-3">
              {[
                { l:"Email", v:user.email, i:Mail },
                { l:"Téléphone", v:user.tel || "Non renseigné", i:Phone },
                { l:"Type", v:user.role === "pro" ? "Artisan" : "Client", i:User },
              ].map(f => (
                <div key={f.l} className="flex items-center gap-3 bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                  <f.i size={15} className="text-orange-500 shrink-0" />
                  <div>
                    <p className="text-slate-400 text-xs">{f.l}</p>
                    <p className="text-slate-800 dark:text-white text-sm font-medium">{f.v}</p>
                  </div>
                </div>
              ))}
              <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-black transition-all mt-2 shadow-md shadow-orange-200 dark:shadow-orange-900/30">
                Modifier mon profil
              </button>
            </div>
          </div>
        </>}
      </main>
    </motion.div>
  );
}