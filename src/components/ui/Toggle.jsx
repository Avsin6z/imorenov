import { useTheme } from "../../context/AppContext";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { dark, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      className="p-2 rounded-xl transition-all bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
      title={dark ? "Mode clair" : "Mode sombre"}
    >
      {dark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}