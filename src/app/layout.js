"use client";

import { usePathname } from "next/navigation";
import { Geist, Geist_Mono } from "next/font/google";
import "../styles/reset.css";
import "../styles/globals.css";

import CabecalhoSecundario from "./componentes/cabecalhoSecundario";
import CabecalhoTerciario from "./componentes/cabecalhoTerciario";
import Rodape from "./componentes/rodape";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  const pathname = usePathname();

  // Defina as rotas específicas para o cabeçalho secundário
  const useSecondaryHeader = [
    "/home", 
    // "/pesquisa",
    // "/usuario/login"
  ].includes(pathname);

  // Função para renderizar o cabeçalho correto
  const renderHeader = () => {
    if (useSecondaryHeader) {
      return <CabecalhoSecundario />;
    }
    return <CabecalhoTerciario />; // Cabeçalho terciário como padrão
  };

  return (
    <html lang="pt-BR">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {renderHeader()}
        <main>{children}</main>
        <Rodape />
      </body>
    </html>
  );
}