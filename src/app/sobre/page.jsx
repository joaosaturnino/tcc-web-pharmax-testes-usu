"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./sobre.module.css";
import { FaGithub, FaLinkedin } from "react-icons/fa"; // Usando ícones para redes sociais
import Link from "next/link";

export default function SobrePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      localStorage.removeItem("usuario");
      localStorage.removeItem("rememberedCredentials");
      localStorage.removeItem("authToken");
      sessionStorage.removeItem("userData");
      document.cookie = "userData=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      router.push("/");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      router.push("/");
    }
  };

  const developers = [
    {
      name: "Emily Martins",
      role: "Desenvolvedora Full-Stack",
      avatar: "/avatars/emily.jpg", // Sugestão de caminho para imagem
      bio: "Apaixonada por criar soluções completas, desde o banco de dados até a interface final do usuário.",
      linkedin: "https://linkedin.com/in/emilymartins",
      github: "https://github.com/emilymartins",
    },
    {
      name: "Guilherme Oliveira",
      role: "Especialista em UI/UX",
      avatar: "/avatars/guilherme.jpg",
      bio: "Focado em projetar experiências intuitivas e agradáveis, garantindo que o PharmaX seja fácil e eficiente de usar.",
      linkedin: "https://www.linkedin.com/in/guilhermeoliveirasousa-dev?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
      github: "https://www.linkedin.com/in/guilhermeoliveirasousa-dev",
    },
    {
      name: "João Henrique",
      role: "Arquiteto de Backend",
      avatar: "/avatars/joao-h.jpg",
      bio: "Responsável pela performance, segurança e escalabilidade do sistema, garantindo que tudo funcione perfeitamente.",
      linkedin: "https://linkedin.com/in/joaohenrique",
      github: "https://github.com/joaohenrique",
    },
    {
      name: "João Rafael",
      role: "Gerente de Projeto & Frontend",
      avatar: "/avatars/joao-r.jpg",
      bio: "Liderando a equipe e transformando ideias em interfaces funcionais e responsivas para a plataforma.",
      linkedin: "https://linkedin.com/in/joaorafael",
      github: "https://github.com/joaorafael",
    }
  ];

  return (
    <div className={styles.dashboard}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <button className={styles.menuToggle} onClick={() => setSidebarOpen(!sidebarOpen)}>
            ☰
          </button>
          <h1 className={styles.title}>Sobre o PharmaX</h1>
        </div>
      </header>

      <div className={styles.contentWrapper}>
        {/* Sidebar */}
        <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ""}`}>
            <div className={styles.sidebarHeader}>
              <div className={styles.logo}>
                <span className={styles.logoText}>PharmaX</span>
              </div>
              <button className={styles.sidebarClose} onClick={() => setSidebarOpen(false)}>
                ×
              </button>
            </div>
            <nav className={styles.nav}>
              <div className={styles.navSection}>
                <p className={styles.navLabel}>Principal</p>
                <Link href="/farmacias/favoritos" className={styles.navLink}>
                  <span className={styles.navText}>Favoritos</span>
                </Link>
                <Link href="/farmacias/produtos/medicamentos" className={styles.navLink}>
                  <span className={styles.navText}>Medicamentos</span>
                </Link>
              </div>
              <div className={styles.navSection}>
                <p className={styles.navLabel}>Gestão</p>
                <Link href="/farmacias/cadastro/funcionario/lista" className={styles.navLink}>
                  <span className={styles.navText}>Funcionários</span>
                </Link>
                <Link href="/farmacias/laboratorio/lista" className={styles.navLink}>
                  <span className={styles.navText}>Laboratórios</span>
                </Link>
              </div>
              <div className={styles.navSection}>
                <p className={styles.navLabel}>Relatórios</p>
                <Link href="/farmacias/relatorios/favoritos" className={styles.navLink}>
                  <span className={styles.navText}>Medicamentos Favoritos</span>
                </Link>
                <Link href="/farmacias/relatorios/funcionarios" className={styles.navLink}>
                  <span className={styles.navText}>Relatório de Funcionarios</span>
                </Link>
                <Link href="/farmacias/relatorios/laboratorios" className={styles.navLink}>
                  <span className={styles.navText}>Relatório de Laboratorios</span>
                </Link>
              </div>
              <div className={styles.navSection}>
                <p className={styles.navLabel}>Conta</p>
                <Link href="/farmacias/perfil" className={styles.navLink}>
                  <span className={styles.navText}>Meu Perfil</span>
                </Link>
                <button onClick={handleLogout} className={styles.navLink} style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}>
                  <span className={styles.navText}>Sair</span>
                </button>
              </div>
            </nav>
          </aside>

        {/* Overlay para mobile */}
        {sidebarOpen && <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />}

        {/* Conteúdo Principal */}
        <main className={styles.mainContent}>
          <div className={styles.container}>
            <div className={styles.pageHeader}>
              <h1 className={styles.pageTitle}>Nossa Jornada com o PharmaX</h1>
              <p className={styles.pageSubtitle}>Inovação e transparência para o acesso à saúde.</p>
            </div>
            
            {/* Seção Missão */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.icon}>🎯</div>
                <h2>Nossa Missão</h2>
              </div>
              <p className={styles.missionText}>
                O PharmaX nasceu da necessidade de trazer mais transparência e poder de escolha para os consumidores de medicamentos. Nossa missão é simplificar o acesso à saúde, permitindo que você encontre os melhores preços de forma rápida e segura. Acreditamos que, com a tecnologia, podemos criar uma ponte inteligente entre farmácias e usuários, promovendo economia e bem-estar para todos.
              </p>
            </div>

            {/* Seção da Equipe */}
            <div className={styles.teamSection}>
              <h2 className={styles.sectionTitle}>Conheça Nossa Equipe</h2>
              <div className={styles.teamGrid}>
                {developers.map((dev) => (
                  <div key={dev.name} className={styles.developerCard}>
                    <img src={dev.avatar} alt={`Avatar de ${dev.name}`} className={styles.devAvatar} onError={(e) => e.target.src = '/avatars/default.png'} />
                    <h3 className={styles.devName}>{dev.name}</h3>
                    <p className={styles.devRole}>{dev.role}</p>
                    <p className={styles.devBio}>{dev.bio}</p>
                    <div className={styles.devSocials}>
                      <a href={dev.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><FaLinkedin /></a>
                      <a href={dev.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub"><FaGithub /></a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Seção de Recursos */}
            <div className={styles.features}>
              <h3 className={styles.featuresTitle}>Recursos Principais</h3>
              <div className={styles.featuresGrid}>
                <div className={styles.featureCard}>
                  <div className={styles.featureIcon}>💊</div>
                  <h4>Busca Inteligente</h4>
                  <p>Encontre medicamentos com busca por nome, princípio ativo ou sintoma.</p>
                </div>
                <div className={styles.featureCard}>
                  <div className={styles.featureIcon}>📊</div>
                  <h4>Comparação de Preços</h4>
                  <p>Compare valores entre diferentes farmácias de forma fácil.</p>
                </div>
                <div className={styles.featureCard}>
                  <div className={styles.featureIcon}>📍</div>
                  <h4>Localização</h4>
                  <p>Encontre farmácias próximas a você com os melhores preços.</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}