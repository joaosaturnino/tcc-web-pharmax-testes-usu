"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./sobre.module.css";
import {
  FaRegLightbulb, FaCode, FaRocket, FaUsers,
  FaSearch, FaTags, FaMapMarkedAlt,
  FaGithub, FaLinkedin
} from "react-icons/fa";

// --- DADOS DOS DESENVOLVEDORES ---
const developers = [
    { name: "Emily Martins", role: "Desenvolvedora Full-Stack", avatar: "/avatars/emily.jpg", socials: [ { Icon: FaLinkedin, url: "https://www.linkedin.com/in/emilydmartins?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" }, { Icon: FaGithub, url: "https://github.com/emilymartins" } ] },
    { name: "Guilherme Oliveira", role: "Especialista em UI/UX", avatar: "/avatars/guilherme.jpg", socials: [ { Icon: FaLinkedin, url: "https://www.linkedin.com/in/guilhermeoliveirasousa-dev" }, { Icon: FaGithub, url: "https://github.com/GuiOliveiraSousa" } ] },
    { name: "João Henrique", role: "Arquiteto de Backend", avatar: "/avatars/joao-h.jpg", socials: [ { Icon: FaLinkedin, url: "https://www.linkedin.com/in/jo%C3%A3o-henrique-00288621a/" }, { Icon: FaGithub, url: "https://github.com/joaosaturnino" } ] },
    { name: "João Rafael", role: "Gerente de Projeto & Frontend", avatar: "/avatars/joao-r.jpg", socials: [ { Icon: FaLinkedin, url: "https://linkedin.com/in/joaorafael" }, { Icon: FaGithub, url: "https://github.com/JoaoRafaelSanches" } ] }
];

// --- DADOS DOS RECURSOS (FEATURES) ---
const features = [
  { Icon: FaSearch, title: "Busca Inteligente", description: "Encontre medicamentos por nome, princípio ativo ou sintoma." },
  { Icon: FaTags, title: "Comparação de Preços", description: "Compare valores entre diferentes farmácias de forma fácil." },
  { Icon: FaMapMarkedAlt, title: "Localização", description: "Encontre farmácias próximas com os melhores preços." },
];

// --- DADOS DA LINHA DO TEMPO ---
const timelineEvents = [
    { Icon: FaRegLightbulb, title: "A Ideia", description: "O conceito do PharmaX nasceu da necessidade de transparência nos preços de medicamentos." },
    { Icon: FaCode, title: "Desenvolvimento", description: "Nossa equipe dedicou meses para construir uma plataforma robusta, segura e intuitiva." },
    { Icon: FaRocket, title: "Lançamento", description: "Lançamos o PharmaX com a missão de empoderar o consumidor e facilitar o acesso à saúde." },
    { Icon: FaUsers, title: "Futuro", description: "Continuamos a inovar, planejando novos recursos para conectar ainda mais farmácias e usuários." }
];

// --- SUB-COMPONENTES ---
const DeveloperCard = ({ name, role, avatar, socials, idx }) => (
  <div className={styles.developerCard} style={{ '--delay': `${idx * 150}ms` }}>
    <div className={styles.cardContent}>
        <img src={avatar} alt={`Avatar de ${name}`} className={styles.devAvatar} onError={(e) => e.target.src = '/avatars/default.png'} />
        <h3 className={styles.devName}>{name}</h3>
        <p className={styles.devRole}>{role}</p>
        <div className={styles.devSocials}>
          {socials.map(({ Icon, url }) => ( <a key={url} href={url} target="_blank" rel="noopener noreferrer"> <Icon /> </a> ))}
        </div>
    </div>
  </div>
);

const FeaturesSection = () => (
  <section className={styles.features} aria-labelledby="features-title">
    <div className={styles.sectionHeader}> <h3 id="features-title" className={styles.sectionTitle}>Recursos Principais</h3> </div>
    <div className={styles.featuresGrid}>
      {features.map(({ Icon, title, description }, idx) => (
        <div key={title} className={styles.featureCard} style={{ '--delay': `${idx * 150}ms` }}>
            <div className={styles.cardContent}>
              <div className={styles.featureIcon}><Icon /></div>
              <h4>{title}</h4> <p>{description}</p>
            </div>
        </div>
      ))}
    </div>
  </section>
);

const AnimatedTitle = ({ text, className }) => {
    return (
        <h1 className={className}>
            {text.split('').map((char, i) => (
                <span key={i} className={styles.char} style={{'--char-index': i}}>{char === ' ' ? '\u00A0' : char}</span>
            ))}
        </h1>
    );
};

const JourneySection = () => {
    const timelineRef = useRef(null);
    return (
        <section className={styles.journeySection} aria-labelledby="journey-title">
            <div className={styles.sectionHeader}>
                <h2 id="journey-title" className={styles.sectionTitle}>Nossa Jornada</h2>
            </div>
            <div className={styles.timelineContainer}>
                <div className={styles.timelineProgress}></div>
                <div ref={timelineRef} className={styles.timeline}>
                    {timelineEvents.map((event, idx) => (
                        <div key={idx} className={styles.timelineEvent}>
                            <div className={styles.timelineIcon}><event.Icon /></div>
                            <h3 className={styles.timelineTitle}>{event.title}</h3>
                            <p className={styles.timelineDescription}>{event.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// --- COMPONENTE PRINCIPAL ---
export default function SobrePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [farmaciaInfo, setFarmaciaInfo] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();
  const mainContentRef = useRef(null);

  useEffect(() => {
    const mainContent = mainContentRef.current;
    if (!mainContent) return;

    // --- LÓGICA DE EFEITOS AVANÇADOS ---
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Animação de entrada
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add(styles.visible); });
    }, { threshold: 0.1 });
    const elementsToAnimate = document.querySelectorAll(`.${styles.sectionHeader}, .${styles.developerCard}, .${styles.featureCard}, .${styles.timelineEvent}`);
    elementsToAnimate.forEach(el => observer.observe(el));

    // Efeito Spotlight na equipe
    const teamGrid = document.querySelector(`.${styles.teamGrid}`);
    const handleTeamMouseMove = (e) => {
        const rect = teamGrid.getBoundingClientRect();
        const x = e.clientX - rect.left; const y = e.clientY - rect.top;
        teamGrid.style.setProperty('--spotlight-x', `${x}px`);
        teamGrid.style.setProperty('--spotlight-y', `${y}px`);
    };
    if (teamGrid) teamGrid.addEventListener('mousemove', handleTeamMouseMove);

    // Efeito de fundo com grid
    const handleGridMouseMove = (e) => {
        const { clientX, clientY } = e;
        mainContent.style.setProperty('--mouse-x', `${clientX}px`);
        mainContent.style.setProperty('--mouse-y', `${clientY}px`);
    };
    mainContent.addEventListener('mousemove', handleGridMouseMove);

    // Animação da linha do tempo
    const timeline = document.querySelector(`.${styles.timeline}`);
    const timelineProgress = document.querySelector(`.${styles.timelineProgress}`);
    const handleTimelineScroll = () => {
        const { top, height } = timeline.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        let progress = (windowHeight - top) / (height + windowHeight);
        progress = Math.max(0, Math.min(1, progress));
        timelineProgress.style.setProperty('--progress', progress);
    };
    window.addEventListener('scroll', handleTimelineScroll);

    // Cleanup
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (teamGrid) teamGrid.removeEventListener('mousemove', handleTeamMouseMove);
      mainContent.removeEventListener('mousemove', handleGridMouseMove);
      window.removeEventListener('scroll', handleTimelineScroll);
      elementsToAnimate.forEach(el => observer.unobserve(el));
    };
  }, []);

  useEffect(() => {
    try {
      const userDataString = localStorage.getItem("userData");
      if (userDataString) setFarmaciaInfo(JSON.parse(userDataString));
    } catch (error) { console.error("Falha ao buscar dados:", error); }
  }, []);

  const handleLogout = async () => {
    try {
      localStorage.clear(); sessionStorage.clear();
      document.cookie = "userData=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    } catch (error) { console.error("Erro ao fazer logout:", error);
    } finally { router.push("/"); }
  };

  return (
    <div className={styles.dashboard}>
      <header className={`${styles.header} ${isScrolled ? styles.headerScrolled : ""}`}>
        <div className={styles.headerLeft}>
          <button className={styles.menuToggle} onClick={() => setSidebarOpen(true)} aria-label="Abrir menu" aria-expanded={sidebarOpen}>☰</button>
          <h1 className={styles.title}>Sobre o PharmaX</h1>
        </div>
      </header>
      <div className={styles.contentWrapper}>
        <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ""}`}>
          <div className={styles.sidebarHeader}>
            <div className={styles.logoContainer}>
              {farmaciaInfo?.farm_logo_url && <img src={farmaciaInfo.farm_logo_url} alt={`Logo de ${farmaciaInfo.farm_nome}`} className={styles.logoImage} />}
              <span className={styles.logoText}>{farmaciaInfo?.farm_nome || "PharmaX"}</span>
            </div>
            <button className={styles.sidebarClose} onClick={() => setSidebarOpen(false)} aria-label="Fechar menu">×</button>
          </div>
          <nav className={styles.nav}>
             <div className={styles.navSection}><p className={styles.navLabel}>Principal</p><Link href="/farmacias/favoritos" className={styles.navLink}><span className={styles.navText}>Favoritos</span></Link><Link href="/farmacias/produtos/medicamentos" className={styles.navLink}><span className={styles.navText}>Medicamentos</span></Link></div>
             <div className={styles.navSection}><p className={styles.navLabel}>Gestão</p><Link href="/farmacias/cadastro/funcionario/lista" className={styles.navLink}><span className={styles.navText}>Funcionários</span></Link><Link href="/farmacias/laboratorio/lista" className={styles.navLink}><span className={styles.navText}>Laboratórios</span></Link></div>
             <div className={styles.navSection}><p className={styles.navLabel}>Relatórios</p><Link href="/farmacias/relatorios/favoritos" className={styles.navLink}><span className={styles.navText}>Medicamentos Favoritos</span></Link><Link href="/farmacias/relatorios/funcionarios" className={styles.navLink}><span className={styles.navText}>Relatório de Funcionarios</span></Link><Link href="/farmacias/relatorios/laboratorios" className={styles.navLink}><span className={styles.navText}>Relatório de Laboratorios</span></Link></div>
             <div className={styles.navSection}><p className={styles.navLabel}>Conta</p><Link href="/farmacias/perfil" className={styles.navLink}><span className={styles.navText}>Meu Perfil</span></Link><button onClick={handleLogout} className={styles.navLink} style={{background:'none', border:'none', width:'100%', textAlign:'left', cursor:'pointer'}}><span className={styles.navText}>Sair</span></button></div>
          </nav>
        </aside>
        {sidebarOpen && <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />}
        <main ref={mainContentRef} className={styles.mainContent}>
          <div className={styles.container}>
            <div className={styles.pageHeader}>
              <AnimatedTitle text="Nossa Jornada com o PharmaX" className={styles.pageTitle} />
              <p className={styles.pageSubtitle}>Inovação e transparência para o acesso à saúde.</p>
            </div>
            <JourneySection />
            <section className={styles.teamSection} aria-labelledby="team-title">
                <div className={styles.sectionHeader}>
                    <h2 id="team-title" className={styles.sectionTitle}>Nossa Equipe</h2>
                    <p className={styles.sectionSubtitle}>Os arquitetos por trás da inovação no PharmaX.</p>
                </div>
                <div className={styles.teamGrid}>
                    {developers.map((dev, idx) => <DeveloperCard key={dev.name} {...dev} idx={idx} />)}
                </div>
            </section>
            <FeaturesSection />
          </div>
        </main>
      </div>
    </div>
  );
}