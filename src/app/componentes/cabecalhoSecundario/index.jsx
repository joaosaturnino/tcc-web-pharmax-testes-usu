"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MdMenu } from "react-icons/md";

import styles from "./index.module.css";

function Cabecalho() {
  const [mobile, setMobile] = useState(false);

  const rota = usePathname();

  // function ativaMenu() {
  //   setMobile(!mobile);
  // }

  return (
    <header className={styles.containerNav}>
      <div className={styles.menu}>
        <div>
          {/* Substitua o caminho abaixo pela sua imagem de logo */}
          <img
            src="/temp/LogoEscrita.png"
            alt="Logo PharmaX"
            className={styles.logoImg}
          />
        </div>
        <nav className={styles.menuGrande}>
          <Link
            href="/index"
            className={rota === "/index" ? styles.active : ""}
          >
            Empresa
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Cabecalho;
