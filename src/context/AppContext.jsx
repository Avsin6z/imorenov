import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);
const FavorisContext = createContext(null);
const CompareContext = createContext(null);
const ThemeContext = createContext(null);

export const useAuth = () => useContext(AuthContext);
export const useFavoris = () => useContext(FavorisContext);
export const useCompare = () => useContext(CompareContext);
export const useTheme = () => useContext(ThemeContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("imor_user")); } catch { return null; }
  });
  const login = d => { const u={...d,id:Date.now()}; localStorage.setItem("imor_user",JSON.stringify(u)); setUser(u); };
  const logout = () => { localStorage.removeItem("imor_user"); setUser(null); };
  return <AuthContext.Provider value={{user,login,logout}}>{children}</AuthContext.Provider>;
}

export function FavorisProvider({ children }) {
  const [favoris, setFavoris] = useState(() => {
    try { return JSON.parse(localStorage.getItem("imor_favoris"))||[]; } catch { return []; }
  });
  const toggle = id => setFavoris(prev => {
    const next = prev.includes(id) ? prev.filter(x=>x!==id) : [...prev,id];
    localStorage.setItem("imor_favoris", JSON.stringify(next));
    return next;
  });
  return <FavorisContext.Provider value={{favoris,toggle}}>{children}</FavorisContext.Provider>;
}

export function CompareProvider({ children }) {
  const [liste, setListe] = useState([]);
  const toggle = id => setListe(prev => prev.includes(id) ? prev.filter(x=>x!==id) : prev.length<3 ? [...prev,id] : prev);
  const reset = () => setListe([]);
  return <CompareContext.Provider value={{liste,toggle,reset}}>{children}</CompareContext.Provider>;
}

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(() => localStorage.getItem("imor_theme") === "dark");
  const toggle = () => setDark(d => {
    localStorage.setItem("imor_theme", !d ? "dark" : "light");
    return !d;
  });
  return <ThemeContext.Provider value={{dark,toggle}}>{children}</ThemeContext.Provider>;
}

export function AppProviders({ children }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <FavorisProvider>
          <CompareProvider>
            {children}
          </CompareProvider>
        </FavorisProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}