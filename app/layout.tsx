import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PISA 62 · Pizza, Helados y Café",
  description: "Descubre el menú de PISA 62 y arma tu pedido por WhatsApp.",
  icons: {
    icon: "/favicon_io/favicon.ico",
    apple: "/favicon_io/apple-touch-icon.png",
  },
  manifest: "/favicon_io/site.webmanifest",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
