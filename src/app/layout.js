"use client";

import { usePathname } from "next/navigation";
import { Geist, Geist_Mono } from "next/font/google";
import "../styles/reset.css";
import "../styles/globals.css";

import Cabecalho from "./componentes/cabecalho";
import CabecalhoSecundario from "./componentes/cabecalhoSecundario";
import CabecalhoTerciario from "./componentes/cabecalhoTerciario"; // 1. Importe o terceiro cabeçalho
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

  // 2. Defina as rotas para cada cabeçalho
  const useSecondaryHeader = ["/home"].includes(pathname);
  const useThirdHeader = [
    "/index",
    "/farmacias/cadastro",
    "/farmacias/favoritos",
    "/farmacias/produtos/medicamentos",
    "/farmacias/laboratorio/lista",
    "/farmacias/laboratorio/cadastro",
    "/farmacias/laboratorio/cadastro/editar/1",
    "/farmacias/cadastro/funcionario",
    "/farmacias/cadastro/funcionario/lista",
    "/farmacias/cadastro/funcionario/editar/1",
    "/farmacias/produtos/medicamentos/cadastro",
    "/farmacias/perfil",
    "/sobre",
    "/farmacias/produtos/medicamentos/editar/1"
  ].includes(pathname); // ✅ Adicione as rotas do terceiro cabeçalho aqui

  // Função para renderizar o cabeçalho correto
  const renderHeader = () => {
    if (useThirdHeader) {
      return <CabecalhoTerciario />;
    }
    if (useSecondaryHeader) {
      return <CabecalhoSecundario />;
    }
    return <Cabecalho />; // Cabeçalho padrão
  };

  return (
    <html lang="pt-BR">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {renderHeader()} {/* 3. Lógica de renderização atualizada */}
        <main>{children}</main>
        <Rodape />
      </body>
    </html>
  );
}
