"use client";

type HeaderProps = {
  totalItems: number;
  categoryName?: string;
  onBack?: () => void;
  onOpenCart: () => void;
};

export function Header({
  totalItems,
  categoryName,
  onBack,
  onOpenCart,
}: HeaderProps) {
  const isCategoryView = Boolean(categoryName);

  return (
    <header
      className={[
        "menu-header",
        isCategoryView ? "menu-header--category" : "menu-header--home",
      ].join(" ")}
    >
      {isCategoryView ? (
        <button
          type="button"
          onClick={onBack}
          aria-label="Volver al inicio"
          className="header-back"
        >
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="m15 18-6-6 6-6M9 12h11"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      ) : null}

      <div className="header-brand">
        <img
          src="/images/logo.jpg"
          alt="PISA 62 · Pizza, helados y café"
          className="header-brand__logo"
        />
        <h1 className="sr-only">PISA 62</h1>
      </div>

      <button
        type="button"
        onClick={onOpenCart}
        aria-label={`Abrir carrito: ${totalItems} ${totalItems === 1 ? "ítem" : "ítems"}`}
        className="header-cart"
      >
        <img src="/images/cart%20logo.svg" alt="" aria-hidden="true" />
        <span className="header-cart__count">{totalItems}</span>
      </button>
    </header>
  );
}
