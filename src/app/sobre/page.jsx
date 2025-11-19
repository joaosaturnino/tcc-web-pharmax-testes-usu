"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./sobre.module.css";
import {
  FaRegLightbulb, FaCode, FaRocket, FaUsers,
  FaSearch, FaTags, FaMapMarkedAlt,
  FaGithub, FaLinkedin
} from "react-icons/fa";

// --- DADOS DOS DESENVOLVEDORES ---
const developers = [
  { 
    name: "Emily Duran", 
    role: "Analista de Dados", 
    avatar: "/avatars/emily.jpg", 
    socials: [
      { Icon: FaLinkedin, url: "https://www.linkedin.com/in/emilydmartins?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" }, 
      { Icon: FaGithub, url: "https://github.com/emilymartins" }
    ] 
  },
  { 
    name: "Guilherme Oliveira", 
    role: "Desenvolvedor Full-Stack Mobile", 
    avatar: "/avatars/guilherme.jpg", 
    socials: [
      { Icon: FaLinkedin, url: "https://www.linkedin.com/in/guilhermeoliveirasousa-dev" }, 
      { Icon: FaGithub, url: "https://github.com/GuiOliveiraSousa" }
    ] 
  },
  { 
    name: "João Henrique", 
    role: "Database Manager / Desenvolvedor Full-Stack Web", 
    avatar: "/avatars/joao-h.jpg", 
    socials: [
      { Icon: FaLinkedin, url: "https://www.linkedin.com/in/jo%C3%A3o-henrique-00288621a/" }, 
      { Icon: FaGithub, url: "https://github.com/joaosaturnino" }
    ] 
  },
  { 
    name: "João Rafael", 
    role: "Desenvolvedor Full-Stack Mobile", 
    avatar: "/avatars/joao-r.jpg", 
    socials: [
      { Icon: FaLinkedin, url: "https://linkedin.com/in/joaorafael" }, 
      { Icon: FaGithub, url: "https://github.com/JoaoRafaelSanches" }
    ] 
  }
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

// --- SUB-COMPONENTS ---

const DeveloperCard = ({ name, role, avatar, socials, idx }) => (
  <div className={styles.developerCard} style={{ '--delay': `${idx * 150}ms` }}>
    <div className={styles.cardContent}>
      <img
        src={avatar}
        alt={`Avatar de ${name}`}
        className={styles.devAvatar}
        onError={(e) => e.target.src = '/avatars/default.png'}
      />
      <h3 className={styles.devName}>{name}</h3>
      <p className={styles.devRole}>{role}</p>
      <div className={styles.devSocials}>
        {socials.map(({ Icon, url }) => (<a key={url} href={url} target="_blank" rel="noopener noreferrer"> <Icon /> </a>))}
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
        <span key={i} className={styles.char} style={{ '--char-index': i }}>{char === ' ' ? '\u00A0' : char}</span>
      ))}
    </h1>
  );
};

// --- COMPONENTE DA LINHA DO TEMPO SIMPLIFICADO ---
const JourneySection = () => {
  return (
    <section className={styles.journeySection} aria-labelledby="journey-title">
      <div className={styles.sectionHeader}>
        <h2 id="journey-title" className={styles.sectionTitle}>Nossa Jornada</h2>
      </div>
      <div className={styles.timelineContainer}>
        <div className={styles.timeline}>
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

const TeamSection = () => {
  return (
    <section className={styles.teamSection} aria-labelledby="team-title">
      <div className={styles.sectionHeader}>
        <h2 id="team-title" className={styles.sectionTitle}>Nossa Equipe</h2>
        <p className={styles.sectionSubtitle}>Os arquitetos por trás da inovação do PharmaX.</p>
      </div>
      <div className={styles.teamGrid}>
        {developers.map((dev, idx) => <DeveloperCard key={dev.name} {...dev} idx={idx} />)}
      </div>
    </section>
  );
};


// --- COMPONENTE PRINCIPAL ---
export default function SobrePage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();

  // Efeito 1: Scroll do Header
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Efeito 2: Animação de Entrada (IntersectionObserver)
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add(styles.visible); });
    }, { threshold: 0.1 });

    const elementsToAnimate = document.querySelectorAll(`.${styles.sectionHeader}, .${styles.developerCard}, .${styles.featureCard}, .${styles.timelineEvent}`);
    elementsToAnimate.forEach(el => observer.observe(el));

    return () => elementsToAnimate.forEach(el => observer.unobserve(el));
  }, []);

  // --- FUNÇÃO DE VOLTAR ---
  const handleBack = () => {
    router.back(); // Navega para a página anterior
  };

  return (
    <div className={styles.dashboard}>
      <header className={`${styles.header} ${isScrolled ? styles.headerScrolled : ""}`}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>Sobre o PharmaX</h1>
        </div>
        <div className={styles.headerActions}>
          <button onClick={handleBack} className={styles.headerButton} aria-label="Voltar">Voltar</button>
        </div>
      </header>
      <div className={styles.contentWrapper}>
        <main className={styles.mainContent}>
          <div className={styles.container}>
            <div className={styles.pageHeader}>
              <AnimatedTitle text="Nossa Jornada com o PharmaX" className={styles.pageTitle} />
              
            </div>

            <JourneySection />
            <TeamSection />
            <FeaturesSection />

          </div>
        </main>
      </div>
    </div>
  );
}