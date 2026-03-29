import { DEPARTEMENTS, VILLES_LOCALES } from "./constants";

export const rechercherVilles = async (query) => {
  if (!query || query.length < 1) return [];
  const q = query.trim();

  // 1. Départements — SANS "Dép."
  const deptMatches = Object.entries(DEPARTEMENTS)
    .filter(([num, nom]) => num.startsWith(q) || nom.toLowerCase().includes(q.toLowerCase()))
    .map(([num, nom]) => `${nom} (${num})`)
    .slice(0, 3);

  // 2. Code postal via API
  let cpResults = [];
  if (/^\d{2,5}$/.test(q)) {
    try {
      const res = await fetch(`https://geo.api.gouv.fr/communes?codePostal=${q}&fields=nom,codesPostaux&limit=5`);
      if (res.ok) {
        const data = await res.json();
        cpResults = data.map(c => `${c.nom} (${c.codesPostaux?.[0] || q})`);
      }
    } catch {}
  }

  // 3. Nom de ville via API
  let villeResults = [];
  if (q.length >= 2 && !/^\d+$/.test(q)) {
    try {
      const res = await fetch(`https://geo.api.gouv.fr/communes?nom=${encodeURIComponent(q)}&fields=nom,codesPostaux&boost=population&limit=5`);
      if (res.ok) {
        const data = await res.json();
        villeResults = data.map(c => `${c.nom} (${c.codesPostaux?.[0] || ""})`);
      }
    } catch {
      villeResults = VILLES_LOCALES.filter(v => v.toLowerCase().includes(q.toLowerCase())).slice(0, 5);
    }
  }

  return [...new Set([...deptMatches, ...cpResults, ...villeResults])].slice(0, 8);
};