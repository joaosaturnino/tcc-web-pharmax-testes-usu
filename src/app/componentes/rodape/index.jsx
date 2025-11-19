import Link from "next/link";
import styles from "./index.module.css";
import { useState } from "react"; // Importar o useState

export default function Rodape() {
  // Estado para controlar o modal (null, 'privacy' ou 'terms')
  const [modalContent, setModalContent] = useState(null);

  // Conteúdo para os modais
  const modalData = {
    privacy: {
      title: "Política de Privacidade",
      content: (
        // CONTEÚDO DA POLÍTICA DE PRIVACIDADE
        <>
          <p>
            A sua privacidade é importante para nós. É política do Pharmax -
            Sistema de Busca e Comparação de Preços de Medicamentos respeitar a
            sua privacidade em relação a qualquer informação sua que possamos
            coletar no site Pharmax - Sistema de Busca e Comparação de Preços de
            Medicamentos, e outros sites que possuímos e operamos.
          </p>
          <p>
            Solicitamos informações pessoais apenas quando realmente precisamos
            delas para lhe fornecer um serviço. Fazemo-lo por meios justos e
            legais, com o seu conhecimento e consentimento. Também informamos
            por que estamos coletando e como será usado.
          </p>
          <p>
            Apenas retemos as informações coletadas pelo tempo necessário para
            fornecer o serviço solicitado. Quando armazenamos dados, protegemos
            dentro de meios comercialmente aceitáveis ​​para evitar perdas e
            roubos, bem como acesso, divulgação, cópia, uso ou modificação não
            autorizados.
          </p>
          <p>
            Não compartilhamos informações de identificação pessoal publicamente
            ou com terceiros, exceto quando exigido por lei.
          </p>
          <p>
            O nosso site pode ter links para sites externos que não são operados
            por nós. Esteja ciente de que não temos controle sobre o conteúdo e
            práticas desses sites e não podemos aceitar responsabilidade por
            suas respectivas políticas de privacidade.
          </p>
          <p>
            Você é livre para recusar a nossa solicitação de informações
            pessoais, entendendo que talvez não possamos fornecer alguns dos
            serviços desejados.
          </p>
          <p>
            O uso continuado de nosso site será considerado como aceitação de
            nossas práticas em torno de privacidade e informações pessoais. Se
            você tiver alguma dúvida sobre como lidamos com dados do usuário e
            informações pessoais, entre em contacto connosco.
          </p>

          <h4>Google AdSense</h4>
          <p>
            O serviço Google AdSense que usamos para veicular publicidade usa um
            cookie DoubleClick para veicular anúncios mais relevantes em toda a
            Web e limitar o número de vezes que um determinado anúncio é exibido
            para você.
          </p>
          <p>
            Para mais informações sobre o Google AdSense, consulte as FAQs
            oficiais sobre privacidade do Google AdSense.
          </p>
          <p>
            Utilizamos anúncios para compensar os custos de funcionamento deste
            site e fornecer financiamento para futuros desenvolvimentos. Os
            cookies de publicidade comportamental usados ​​por este site foram
            projetados para garantir que você forneça os anúncios mais relevantes
            sempre que possível, rastreando anonimamente seus interesses e
            apresentando coisas semelhantes que possam ser do seu interesse.
          </p>
          <p>
            Vários parceiros anunciam em nosso nome e os cookies de rastreamento
            de afiliados simplesmente nos permitem ver se nossos clientes
            acessaram o site através de um dos sites de nossos parceiros, para
            que possamos creditá-los adequadamente e, quando aplicável, permitir
            que nossos parceiros afiliados ofereçam qualquer promoção que pode
            fornecê-lo para fazer uma compra.
          </p>

          <h4>Compromisso do Usuário</h4>
          <p>
            O usuário se compromete a fazer uso adequado dos conteúdos e da
            informação que o Pharmax - Sistema de Busca e Comparação de Preços de
            Medicamentos oferece no site e com caráter enunciativo, mas não
            limitativo:
          </p>
          <ul style={{ listStylePosition: 'inside', paddingLeft: '1rem' }}>
            <li>
              A) Não se envolver em atividades que sejam ilegais ou contrárias à
              boa fé a à ordem pública;
            </li>
            <li>
              B) Não difundir propaganda ou conteúdo de natureza racista,
              xenofóbica, jogos de sorte ou azar, qualquer tipo de pornografia
              ilegal, de apologia ao terrorismo ou contra os direitos humanos;
            </li>
            <li>
              C) Não causar danos aos sistemas físicos (hardwares) e lógicos
              (softwares) do Pharmax - Sistema de Busca e Comparação de Preços de
              Medicamentos, de seus fornecedores ou terceiros, para introduzir ou
              disseminar vírus informáticos ou quaisquer outros sistemas de
              hardware ou software que sejam capazes de causar danos
              anteriormente mencionados.
            </li>
          </ul>

          <h4>Mais informações</h4>
          <p>
            Esperemos que esteja esclarecido e, como mencionado anteriormente, se
            houver algo que você não tem certeza se precisa ou não, geralmente é
            mais seguro deixar os cookies ativados, caso interaja com um dos
            recursos que você usa em nosso site.
          </p>
          <p>
            <strong>Esta política é efetiva a partir de Outubro de 2025.</strong>
          </p>
        </>
      ),
    },
    terms: {
      title: "Termos de Uso",
      content: (
        // CONTEÚDO DOS TERMOS DE USO ATUALIZADO
        <>
          <h4>1. Termos</h4>
          <p>
            Ao acessar ao site Pharmax - Sistema de Busca e Comparação de Preços
            de Medicamentos, concorda em cumprir estes termos de serviço, todas
            as leis e regulamentos aplicáveis ​​e concorda que é responsável pelo
            cumprimento de todas as leis locais aplicáveis. Se você não
            concordar com algum desses termos, está proibido de usar ou acessar
            este site. Os materiais contidos neste site são protegidos pelas
            leis de direitos autorais e marcas comerciais aplicáveis.
          </p>

          <h4>2. Uso de Licença</h4>
          <p>
            É concedida permissão para baixar temporariamente uma cópia dos
            materiais (informações ou software) no site Pharmax - Sistema de
            Busca e Comparação de Preços de Medicamentos , apenas para
            visualização transitória pessoal e não comercial. Esta é a concessão
            de uma licença, não uma transferência de título e, sob esta licença,
            você não pode:
          </p>
          <ul style={{ listStylePosition: 'inside', paddingLeft: '1rem' }}>
            <li>modificar ou copiar os materiais;</li>
            <li>
              usar os materiais para qualquer finalidade comercial ou para
              exibição pública (comercial ou não comercial);
            </li>
            <li>
              tentar descompilar ou fazer engenharia reversa de qualquer software
              contido no site Pharmax - Sistema de Busca e Comparação de Preços
              de Medicamentos;
            </li>
            <li>
              remover quaisquer direitos autorais ou outras notações de
              propriedade dos materiais; ou
            </li>
            <li>
              transferir os materiais para outra pessoa ou 'espelhe' os
              materiais em qualquer outro servidor.
            </li>
          </ul>
          <p>
            Esta licença será automaticamente rescindida se você violar alguma
            dessas restrições e poderá ser rescindida por Pharmax - Sistema de
            Busca e Comparação de Preços de Medicamentos a qualquer momento. Ao
            encerrar a visualização desses materiais ou após o término desta
            licença, você deve apagar todos os materiais baixados em sua posse,
            seja em formato eletrónico ou impresso.
          </p>

          <h4>3. Isenção de responsabilidade</h4>
          <p>
            Os materiais no site da Pharmax - Sistema de Busca e Comparação de
            Preços de Medicamentos são fornecidos 'como estão'. Pharmax - Sistema
            de Busca e Comparação de Preços de Medicamentos não oferece
            garantias, expressas ou implícitas, e, por este meio, isenta e nega
            todas as outras garantias, incluindo, sem limitação, garantias
            implícitas ou condições de comercialização, adequação a um fim
            específico ou não violação de propriedade intelectual ou outra
            violação de direitos.
          </p>
          <p>
            Além disso, o Pharmax - Sistema de Busca e Comparação de Preços de
            Medicamentos não garante ou faz qualquer representação relativa à
            precisão, aos resultados prováveis ​​ou à confiabilidade do uso dos
            materiais em seu site ou de outra forma relacionado a esses
            materiais ou em sites vinculados a este site.
          </p>

          <h4>4. Limitações</h4>
          <p>
            Em nenhum caso o Pharmax - Sistema de Busca e Comparação de Preços de
            Medicamentos ou seus fornecedores serão responsáveis ​​por quaisquer
            danos (incluindo, sem limitação, danos por perda de dados ou lucro
            ou devido a interrupção dos negócios) decorrentes do uso ou da
            incapacidade de usar os materiais em Pharmax - Sistema de Busca e
            Comparação de Preços de Medicamentos, mesmo que Pharmax - Sistema de
            Busca e Comparação de Preços de Medicamentos ou um representante
            autorizado da Pharmax - Sistema de Busca e Comparação de Preços de
            Medicamentos tenha sido notificado oralmente ou por escrito da
            possibilidade de tais danos. Como algumas jurisdições não permitem
            limitações em garantias implícitas, ou limitações de responsabilidade
            por danos conseqüentes ou incidentais, essas limitações podem não se
            aplicar a você.
          </p>

          <h4>5. Precisão dos materiais</h4>
          <p>
            Os materiais exibidos no site da Pharmax - Sistema de Busca e
            Comparação de Preços de Medicamentos podem incluir erros técnicos,
            tipográficos ou fotográficos. Pharmax - Sistema de Busca e Comparação
            de Preços de Medicamentos não garante que qualquer material em seu
            site seja preciso, completo ou atual. Pharmax - Sistema de Busca e
            Comparação de Preços de Medicamentos pode fazer alterações nos
            materiais contidos em seu site a qualquer momento, sem aviso prévio.
            No entanto, Pharmax - Sistema de Busca e Comparação de Preços de
            Medicamentos não se compromete a atualizar os materiais.
          </p>

          <h4>6. Links</h4>
          <p>
            O Pharmax - Sistema de Busca e Comparação de Preços de Medicamentos
            não analisou todos os sites vinculados ao seu site e não é
            responsável pelo conteúdo de nenhum site vinculado. A inclusão de
            qualquer link não implica endosso por Pharmax - Sistema de Busca e
            Comparação de Preços de Medicamentos do site. O uso de qualquer site
            vinculado é por conta e risco do usuário.
          </p>

          <h4>Modificações</h4>
          <p>
            O Pharmax - Sistema de Busca e Comparação de Preços de Medicamentos
            pode revisar estes termos de serviço do site a qualquer momento, sem
            aviso prévio. Ao usar este site, você concorda em ficar vinculado à
            versão atual desses termos de serviço.
          </p>

          <h4>Lei aplicável</h4>
          <p>
            Estes termos e condições são regidos e interpretados de acordo com as
            leis do Pharmax - Sistema de Busca e Comparação de Preços de
            Medicamentos e você se submete irrevogavelmente à jurisdição
            exclusiva dos tribunais naquele estado ou localidade.
          </p>
        </>
      ),
    },
  };

  // Funções para abrir e fechar o modal
  const openModal = (contentKey) => {
    // Impede o scroll da página ao fundo
    document.body.style.overflow = 'hidden';
    setModalContent(contentKey);
  };

  const closeModal = () => {
    // Libera o scroll da página
    document.body.style.overflow = 'auto';
    setModalContent(null);
  };

  return (
    <>
      <footer className={styles.rodape}>
        <div className={styles.conteudoRodape}>
          {/* Identidade da marca */}
          <div className={styles.secaoRodape}>
            <div className={styles.logo}>
              <h3>PharmaX</h3>
              <div className={styles.logoSubtitle}>
                Busca e comparação de preços de medicamentos
              </div>
            </div>
            <p className={styles.descricao}>
              Encontre os melhores preços de medicamentos.
            </p>
          </div>

          {/* Links rápidos */}
          <div className={styles.secaoRodape}>
            <h4>Links</h4>
            <div className={styles.links}>
              <Link href="/sobre" className={styles.link}>
                <span>Sobre</span>
              </Link>
              <Link href="/contact" className={styles.link}>
                <span>Fale Conosco</span>
              </Link>
            </div>
          </div>

          {/* Contato */}
          <div className={styles.secaoRodape}>
            <h4>Contato</h4>
            <div className={styles.contatoInfo}>
              <div className={styles.contatoItem}>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8l8 5 8-5v10zm-8-7L4 6h16l-8 5z" />
                </svg>
                <a
                  href="mailto:pharmax.l2024@gmail.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  pharmax.l2024@gmail.com
                </a>
              </div>
              <div className={styles.contatoItem}>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                </svg>
                <a
                  href="https://wa.me/+5514991751894"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  (11) 99999-9999
                </a>
              </div>
            </div>
          </div>

          {/* Redes Sociais */}
          <div className={styles.secaoRodape}>
            <h4>Redes Sociais</h4>
            <div className={styles.redesSociais}>
              <a
                href="https://www.facebook.com/pharmax.947853"
                aria-label="Facebook"
                className={styles.socialLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/pharma.x_?igsh=MTI3MG04eng5dG9vZQ=="
                aria-label="Instagram"
                className={styles.socialLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className={styles.rodapeInferior}>
          <div className={styles.rodapeInferiorConteudo}>
            <p>&copy; 2025 PharmaX - Todos os direitos reservados</p>
            <div className={styles.legalLinks}>
              {/* Links atualizados para abrir o modal */}
              <a
                onClick={(e) => {
                  e.preventDefault();
                  openModal("privacy");
                }}
              >
                Política de Privacidade
              </a>
              <span className={styles.separador}>|</span>
              <a
                onClick={(e) => {
                  e.preventDefault();
                  openModal("terms");
                }}
              >
                Termos de Uso
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* JSX do Modal */}
      {modalContent && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()} // Impede de fechar ao clicar no conteúdo
          >
            <button className={styles.modalCloseButton} onClick={closeModal}>
              &times;
            </button>
            <h2 className={styles.modalTitle}>
              {modalData[modalContent].title}
            </h2>
            <div className={styles.modalBody}>
              {modalData[modalContent].content}
            </div>
          </div>
        </div>
      )}
    </>
  );
}