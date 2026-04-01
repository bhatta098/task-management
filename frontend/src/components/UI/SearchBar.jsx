import { useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import useStore from '../../store/useStore';

export default function SearchBar() {
  const searchTerm = useStore((state) => state.searchTerm);
  const setSearch = useStore((state) => state.setSearch);
  const timerRef = useRef(null);
  const inputRef = useRef(null);

  const handleChange = (e) => {
    const val = e.target.value;
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setSearch(val), 300);
  };

  useEffect(() => {
    if (inputRef.current) inputRef.current.value = searchTerm;
  }, []);

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Search className="w-4 h-4 text-orange-500/70" />
      </div>
      <input
        ref={inputRef}
        type="text"
        placeholder="Search profiles by name, email, phone or address…"
        onChange={handleChange}
        className="w-full rounded-2xl border border-zinc-200 bg-white py-3 pl-11 pr-4 text-sm text-zinc-900 placeholder:text-zinc-400 shadow-[0_10px_22px_rgba(0,0,0,0.06)] outline-none transition-all focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
      />
    </div>
  );
}
