"use client";

import type { TeamCategory } from "../types/menu";

type CategoryTabsProps = {
  categories: TeamCategory[];
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
                  ? "category-tab category-tab--active"
                  : "category-tab",
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
