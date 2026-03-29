export function Badge({ children, color = "slate" }) {
  const styles = {
    orange: "bg-orange-50 text-orange-600 border border-orange-100",
    blue:   "bg-blue-50 text-blue-600 border border-blue-100",
    green:  "bg-emerald-50 text-emerald-600 border border-emerald-100",
    red:    "bg-red-50 text-red-500 border border-red-100",
    slate:  "bg-slate-100 text-slate-500 border border-slate-200",
    // dark mode
    "orange-dark": "bg-orange-500/15 text-orange-400 border border-orange-500/20",
    "green-dark":  "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20",
    "blue-dark":   "bg-blue-500/15 text-blue-400 border border-blue-500/20",
    "slate-dark":  "bg-slate-700 text-slate-300 border border-slate-600",
  };
  return (
    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${styles[color]}`}>
      {children}
    </span>
  );
}