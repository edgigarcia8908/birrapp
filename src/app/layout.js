import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Birrapp 🍺 – Realidad Aumentada para tu Cerveza",
  description: "Escanea la etiqueta de tu cerveza y descubre efectos de Realidad Aumentada. Powered by CEO Core AR.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body style={{ margin: 0, padding: 0, overflow: 'hidden', background: '#0a0a0a' }}>{children}</body>
    </html>
  );
}
