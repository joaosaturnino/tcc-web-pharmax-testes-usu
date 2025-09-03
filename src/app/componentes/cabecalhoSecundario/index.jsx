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
        {/* <div className={styles.menuMobile}>
          <MdMenu onClick={ativaMenu} className={styles.icon} id="logo" />
        </div> */}
      </div>

      {/* <div
        className={
          mobile === false
            ? styles.menuMobileExpandidon
            : styles.menuMobileExpandidos
        }
        id="mostraOpMobile"
      >
        <Link
          href="/"
          onClick={ativaMenu}
          className={rota === "./contato" ? styles.active : ""}
        >
          Home
        </Link>
        <Link
          href="/produtos/medicamentos"
          onClick={ativaMenu}
          className={rota === "/produtos/medicamentos" ? styles.active : ""}
        >
          Controle
        </Link>
        <Link
          href="/sobre"
          onClick={ativaMenu}
          className={rota === "/sobre" ? styles.active : ""}
        >
          Sobre
        </Link>
        <Link
          href="/usuario/perfil"
          onClick={ativaMenu}
          className={rota === "/usuario/perfil" ? styles.active : ""}
        >
          Perfil
        </Link>
      </div> */}
    </header>
  );
}

export default Cabecalho;
