"use client";

import type { MenuCategory } from "../types/menu";

type CategoryTabsProps = {
  categories: MenuCategory[];
  selectedCategory: string;
  onSelect: (categoryId: string) => void;
};

export function CategoryTabs({
  categories,
  selectedCategory,
  onSelect,
}: CategoryTabsProps) {
  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex min-w-max gap-2">
        {categories.map((category) => {
          const isSelected = selectedCategory === category.id;

          return (
            <button
              key={category.id}
              type="button"
              onClick={() => onSelect(category.id)}
              className={[
                "whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition",
                isSelected
                  ? "border-amber-500 bg-amber-500 text-white shadow-sm"
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50",
              ].join(" ")}
            >
              {category.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
