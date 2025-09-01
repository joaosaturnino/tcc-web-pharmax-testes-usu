import Link from "next/link";
import styles from "./index.module.css";

export default function Rodape() {
  return (
    <footer className={styles.rodape}>
      <div className={styles.conteudoRodape}>
        {/* Identidade da marca */}
        <div className={styles.secaoRodape}>
          <h4>PharmaX</h4>
          <br />
          <p>Sua farmácia digital de confiança</p>
        </div>
        {/* Links rápidos */}
        <div className={styles.secaoRodape}>
          <h4>Links Rápidos</h4>
          <br />
          <Link href="/">Home</Link>
          <br />
          <Link href="/sobre">Sobre</Link>
          <br />
          <Link href="/contato">Contato</Link>
        </div>
        {/* Contato */}
        <div className={styles.secaoRodape}>
          <h4>Contato</h4>
          <br />
          <p>
            <a href="mailto:contato@pharmax.com">contato@pharmax.com</a>
          </p>
          <p>
            <a href="tel:+5511999999999">(11) 99999-9999</a>
          </p>
        </div>
      </div>
      <div className={styles.rodapeInferior}>
        <p>&copy; 2025 PharmaX - Todos os direitos reservados</p>
      </div>
    </footer>
  );
}
