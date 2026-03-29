import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../utils/supabase";

const AuthContext = createContext(null);
const FavorisContext = createContext(null);
const CompareContext = createContext(null);
const ThemeContext = createContext(null);

export const useAuth = () => useContext(AuthContext);
export const useFavoris = () => useContext(FavorisContext);
export const useCompare = () => useContext(CompareContext);
export const useTheme = () => useContext(ThemeContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérifie si l'utilisateur est déjà connecté
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Écoute les changements de connexion
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId) => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    setUser(data);
    setLoading(false);
  };

  const login = async ({ email, password }) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  };

  const register = async ({ prenom, nom, email, password, tel, role }) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    // Crée le profil
    await supabase.from("profiles").insert({
      id: data.user.id,
      prenom, nom, tel, role
    });
    return data;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function FavorisProvider({ children }) {
  const [favoris, setFavoris] = useState(() => {
    try { return JSON.parse(localStorage.getItem("imor_favoris")) || []; } catch { return []; }
  });
  const toggle = id => setFavoris(prev => {
    const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
    localStorage.setItem("imor_favoris", JSON.stringify(next));
    return next;
  });
  return <FavorisContext.Provider value={{ favoris, toggle }}>{children}</FavorisContext.Provider>;
}

export function CompareProvider({ children }) {
  const [liste, setListe] = useState([]);
  const toggle = id => setListe(prev => prev.includes(id) ? prev.filter(x => x !== id) : prev.length < 3 ? [...prev, id] : prev);
  const reset = () => setListe([]);
  return <CompareContext.Provider value={{ liste, toggle, reset }}>{children}</CompareContext.Provider>;
}

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(() => localStorage.getItem("imor_theme") === "dark");
  const toggle = () => setDark(d => {
    localStorage.setItem("imor_theme", !d ? "dark" : "light");
    return !d;
  });
  return <ThemeContext.Provider value={{ dark, toggle }}>{children}</ThemeContext.Provider>;
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