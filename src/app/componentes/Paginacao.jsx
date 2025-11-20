// componentes/Paginacao.jsx
import style from './Paginacao.module.css'; // Importa o CSS modular

/**
 * Componente Paginacao: Gera botões para navegação em listas.
 * * @param {number} paginaAtual - A página que está sendo exibida no momento.
 * @param {number} totalPaginas - O número total de páginas disponíveis.
 * @param {function} onPageChange - Função de callback que é chamada ao clicar em um botão de página.
 */
export default function Paginacao({ paginaAtual, totalPaginas, onPageChange }) {
  
  // Cria um array [1, 2, 3, ..., totalPaginas] para iterar e renderizar os botões numéricos
  const paginas = Array.from({ length: totalPaginas }, (_, i) => i + 1);

  // Não renderiza nada se houver 1 página ou menos
  if (totalPaginas <= 1) {
    return null;
  }

  return (
    <nav className={style.paginacao} aria-label="Navegação de página">
      
      {/* Botão ANTERIOR */}
      <button
        onClick={() => onPageChange(paginaAtual - 1)}
        disabled={paginaAtual === 1} // Desabilita se estiver na primeira página
        aria-label="Página Anterior"
      >
        Anterior
      </button>
      
      {/* Botões NUMÉRICOS */}
      {paginas.map(numero => (
        <button
          key={numero} // Chave única é obrigatória para listas no React
          onClick={() => onPageChange(numero)}
          // Aplica a classe 'active' se o número for a página atual
          className={paginaAtual === numero ? style.active : ''} 
          aria-current={paginaAtual === numero ? 'page' : undefined} // Para acessibilidade
        >
          {numero}
        </button>
      ))}
      
      {/* Botão PRÓXIMO */}
      <button
        onClick={() => onPageChange(paginaAtual + 1)}
        disabled={paginaAtual === totalPaginas} // Desabilita se estiver na última página
        aria-label="Próxima Página"
      >
        Próximo
      </button>
    </nav>
  );
}