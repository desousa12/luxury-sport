"use client";

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export function SearchBar({
  value,
  onChange,
  placeholder = "Buscar plato o bebida...",
}: SearchBarProps) {
  return (
    <div className="sticky top-0 z-10 bg-slate-50/90 pb-2 backdrop-blur-sm">
      <label className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm ring-0 transition focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-200">
        <span className="text-lg text-slate-500">🔎</span>
        <input
          aria-label="Buscar productos"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="w-full border-0 bg-transparent text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
        />
      </label>
    </div>
  );
}
