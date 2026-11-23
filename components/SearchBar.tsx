"use client";

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export function SearchBar({
  value,
  onChange,
  placeholder = "Buscar equipo o camiseta...",
}: SearchBarProps) {
  return (
    <div className="sticky top-0 z-10 bg-slate-50/90 pb-2 backdrop-blur-sm">
      <label className="search-bar__field">
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
