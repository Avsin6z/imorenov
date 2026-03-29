import { useState, useRef } from "react";

export function useAutocomplete(fetchFn, delay = 300) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const timer = useRef(null);

  const handleChange = v => {
    setQuery(v);
    clearTimeout(timer.current);
    if (v.length < 2) { setSuggestions([]); return; }
    setLoading(true);
    timer.current = setTimeout(async () => {
      const res = await fetchFn(v);
      setSuggestions(res);
      setLoading(false);
    }, delay);
  };

  // Nettoie la sélection : enlève les parenthèses et tout ce qui suit
  const select = v => {
    const propre = v.split("(")[0].trim();
    setQuery(propre);
    setSuggestions([]);
  };

  const clear = () => { setQuery(""); setSuggestions([]); };

  return { query, suggestions, loading, handleChange, select, clear };
}