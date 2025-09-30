// componentes/Paginacao.jsx
import style from './Paginacao.module.css'; // Criaremos este CSS

export default function Paginacao({ paginaAtual, totalPaginas, onPageChange }) {
  const paginas = Array.from({ length: totalPaginas }, (_, i) => i + 1);

  if (totalPaginas <= 1) {
    return null; // Não mostra a paginação se só houver uma página
  }

  return (
    <nav className={style.paginacao}>
      <button
        onClick={() => onPageChange(paginaAtual - 1)}
        disabled={paginaAtual === 1}
      >
        Anterior
      </button>
      {paginas.map(numero => (
        <button
          key={numero}
          onClick={() => onPageChange(numero)}
          className={paginaAtual === numero ? style.active : ''}
        >
          {numero}
        </button>
      ))}
      <button
        onClick={() => onPageChange(paginaAtual + 1)}
        disabled={paginaAtual === totalPaginas}
      >
        Próximo
      </button>
    </nav>
  );
}