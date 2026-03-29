import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppProviders, useTheme } from "./context/AppContext";
import { Navbar } from "./components/layout/Navbar";
import { Skeleton } from "./components/ui/Skeleton";

// Lazy loading de toutes les pages
const HomePage       = lazy(() => import("./pages/HomePage"));
const SearchPage     = lazy(() => import("./pages/SearchPage"));
const ArtisanPage    = lazy(() => import("./pages/ArtisanPage"));
const InscriptionPage= lazy(() => import("./pages/InscriptionPage"));
const ConnexionPage  = lazy(() => import("./pages/ConnexionPage"));
const DashboardPage  = lazy(() => import("./pages/DashboardPage"));
const AidesPage      = lazy(() => import("./pages/AidesPage"));
const FavorisPage    = lazy(() => import("./pages/FavorisPage"));
const ComparePage    = lazy(() => import("./pages/ComparePage"));
const DevisPage      = lazy(() => import("./pages/DevisPage"));

const PageLoader = () => (
  <div className="pt-28 px-6 max-w-5xl mx-auto">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[1,2,3].map(i => (
        <div key={i} className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-100 dark:border-slate-700">
          <div className="flex gap-3 mb-4">
            <Skeleton className="w-14 h-14 rounded-2xl" />
            <div className="flex-1 space-y-2 pt-1">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
          <Skeleton className="h-3 w-full mb-2" />
          <Skeleton className="h-3 w-4/5" />
        </div>
      ))}
    </div>
  </div>
);

function AppContent() {
  const { dark } = useTheme();

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors">
      <Navbar />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/recherche" element={<SearchPage />} />
          <Route path="/artisan/:id" element={<ArtisanPage />} />
          <Route path="/inscription" element={<InscriptionPage />} />
          <Route path="/connexion" element={<ConnexionPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/aides" element={<AidesPage />} />
          <Route path="/favoris" element={<FavorisPage />} />
          <Route path="/comparer" element={<ComparePage />} />
          <Route path="/devis" element={<DevisPage />} />
          <Route path="/confirmation" element={<ConfirmationPage />} />
          <Route path="*" element={
            <div className="pt-40 text-center">
              <h2 className="text-5xl font-black text-slate-200 dark:text-slate-700 mb-4">404</h2>
              <p className="text-slate-400 mb-6">Page introuvable</p>
              <a href="/" className="bg-orange-500 text-white px-6 py-3 rounded-xl font-bold">Retour accueil</a>
            </div>
          } />
        </Routes>
      </Suspense>
    </div>
  );
}

export default function App() {
  return (
    <AppProviders>
      <Router>
        <AppContent />
      </Router>
    </AppProviders>
  );
}