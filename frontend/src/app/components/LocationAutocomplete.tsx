import { useState, useEffect, useRef } from "react";
import { MapPin, Loader2 } from "lucide-react";

export const LocationAutocomplete = ({ 
  value, 
  onChange, 
  placeholder, 
  className 
}: { 
  value: string; 
  onChange: (val: string) => void; 
  placeholder?: string;
  className?: string;
}) => {
  const [query, setQuery] = useState(value);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const debounceRef = useRef<number>();

  useEffect(() => {
    setQuery(value);
  }, [value]);

  const fetchSuggestions = async (search: string) => {
    if (!search || search.length < 2) {
      setSuggestions([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(search)}&count=5&language=en&format=json`);
      const data = await res.json();
      if (data.results) {
        setSuggestions(data.results);
      } else {
        setSuggestions([]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    onChange(val); // keep parent synced
    setShowDropdown(true);

    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => {
      fetchSuggestions(val);
    }, 300);
  };

  const handleSelect = (s: any) => {
    const formatName = `${s.name}, ${s.country}`;
    setQuery(formatName);
    onChange(formatName);
    setShowDropdown(false);
  };

  return (
    <div className="relative w-full">
      <MapPin className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
      <input
        value={query}
        onChange={handleInputChange}
        onFocus={() => { if (query.length > 1) setShowDropdown(true); }}
        onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
        placeholder={placeholder || "Search location..."}
        className={className}
        autoComplete="off"
      />
      {showDropdown && (query.length > 1) && (
        <div className="absolute top-full mt-2 w-full z-50 rounded-xl border border-slate-200 bg-white shadow-xl dark:border-white/10 dark:bg-slate-900 overflow-hidden">
          {loading ? (
            <div className="p-4 flex items-center justify-center text-slate-500">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          ) : suggestions.length > 0 ? (
            <ul>
              {suggestions.map((s, i) => (
                <li 
                  key={i} 
                  onClick={() => handleSelect(s)}
                  className="px-4 py-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-white/5 border-b last:border-0 border-slate-100 dark:border-white/5 flex items-center gap-3"
                >
                  <MapPin className="h-4 w-4 text-slate-400" />
                  <div>
                    <div className="text-sm font-bold text-slate-800 dark:text-white">{s.name}</div>
                    <div className="text-xs font-semibold text-slate-500">{s.admin1 ? `${s.admin1}, ` : ''}{s.country}</div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-sm text-slate-500 text-center">No suggestions found.</div>
          )}
        </div>
      )}
    </div>
  );
};
