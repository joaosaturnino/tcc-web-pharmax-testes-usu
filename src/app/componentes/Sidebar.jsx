"use client";

import Link from 'next/link';
import styles from './sidebar.module.css';

export default function Sidebar({ farmaciaInfo, active = '', onClose }) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <div className={styles.logoContainer}>
          {farmaciaInfo?.farm_logo_url && (<img src={farmaciaInfo.farm_logo_url} alt={`Logo de ${farmaciaInfo.farm_nome}`} className={styles.sidebarAvatar} />)}
          <span className={styles.logoText}>{farmaciaInfo?.farm_nome || "PharmaX"}</span>
        </div>
        <button className={styles.sidebarClose} onClick={onClose} aria-label="Fechar menu">×</button>
      </div>
      <nav className={styles.nav}>
        <div className={styles.navSection}>
          <p className={styles.navLabel}>Principal</p>
          <Link href="/farmacias/favoritos" className={`${styles.navLink} ${active === 'favoritos' ? styles.active : ''}`}><span className={styles.navText}>Favoritos</span></Link>
          <Link href="/farmacias/produtos/medicamentos" className={`${styles.navLink} ${active === 'medicamentos' ? styles.active : ''}`}><span className={styles.navText}>Medicamentos</span></Link>
        </div>
        <div className={styles.navSection}>
          <p className={styles.navLabel}>Gestão</p>
          <Link href="/farmacias/cadastro/funcionario/lista" className={styles.navLink}><span className={styles.navText}>Funcionários</span></Link>
          <Link href="/farmacias/laboratorio/lista" className={styles.navLink}><span className={styles.navText}>Laboratórios</span></Link>
        </div>
        <div className={styles.navSection}>
          <p className={styles.navLabel}>Relatórios</p>
          <Link href="/farmacias/relatorios/favoritos" className={styles.navLink}><span className={styles.navText}>Medicamentos Favoritos</span></Link>
          <Link href="/farmacias/relatorios/funcionarios" className={styles.navLink}><span className={styles.navText}>Relatório de Funcionarios</span></Link>
          <Link href="/farmacias/relatorios/laboratorios" className={`${styles.navLink} ${active === 'relatorios-laboratorios' ? styles.active : ''}`}><span className={styles.navText}>Relatório de Laboratorios</span></Link>
        </div>
        <div className={styles.navSection}>
          <p className={styles.navLabel}>Conta</p>
          <Link href="/farmacias/perfil" className={styles.navLink}><span className={styles.navText}>Meu Perfil</span></Link>
        </div>
      </nav>
    </aside>
  );
}
