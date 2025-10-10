// app/busca/page.jsx

'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link'; // Importado
import api from '../services/api';
import style from "./page.module.css";

// --- FUNÇÕES AUXILIARES ---
const getImageUrl = (imagePath) => { 
    const imagemPadrao = "https://www.institutoaron.com.br/static/img/large/c28a030a59bae1283321c340cdc846df.webp";
    if (!imagePath) return imagemPadrao;
    if (imagePath.startsWith('http')) return imagePath;
    const baseUrl = api.defaults.baseURL.replace(/\/$/, '');
    return `${baseUrl}/${imagePath.replace(/\\/g, '/')}`;
};
const formatarMoeda = (valor) => { 
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor || 0);
};
const gerarNumerosPaginacao = (paginaAtual, totalPaginas) => {
    const vizinhos = 1;
    const paginas = [];
    if (totalPaginas <= 5) { for (let i = 1; i <= totalPaginas; i++) paginas.push(i); return paginas; }
    const primeiro = 1;
    const ultimo = totalPaginas;
    const inicioVisivel = Math.max(primeiro + 1, paginaAtual - vizinhos);
    const fimVisivel = Math.min(ultimo - 1, paginaAtual + vizinhos);
    paginas.push(primeiro);
    if (inicioVisivel > primeiro + 1) paginas.push('...');
    for (let i = inicioVisivel; i <= fimVisivel; i++) paginas.push(i);
    if (fimVisivel < ultimo - 1) paginas.push('...');
    paginas.push(ultimo);
    return paginas;
};

// --- COMPONENTES INTERNOS ---
const CardProduto = ({ medicamento, onVerDetalhes }) => {
    return (
      <div className={style.cartaoProduto}>
        <div className={style.containerImagemProduto}>
          <img src={getImageUrl(medicamento.med_imagem)} alt={medicamento.med_nome} className={style.imagemProduto} />
        </div>
        <div className={style.infoProduto}>
          <h4>{medicamento.med_nome}</h4>
          <p>{medicamento.med_dosagem}</p>
          <p className={style.farmaciaNome}>{medicamento.farm_nome}</p> 
          <span className={style.preco}>{formatarMoeda(medicamento.medp_preco)}</span>
        </div>
        <button onClick={onVerDetalhes}>Ver Detalhes</button>
      </div>
    );
};
const SkeletonCard = () => {
    return (
        <div className={`${style.cartaoProduto} ${style.skeleton}`}>
          <div className={style.containerImagemProduto}></div>
          <div className={style.infoProduto}>
            <div className={style.skeletonText}></div>
            <div className={style.skeletonText} style={{ width: '60%' }}></div>
          </div>
        </div>
    );
};

function SearchPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  const [termoBuscaInput, setTermoBuscaInput] = useState(query);
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const ITENS_POR_PAGINA = 12;

  const fetchResultados = useCallback(async () => {
    if (!query) {
      setResultados([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: paginaAtual.toString(),
        limit: ITENS_POR_PAGINA.toString(),
        search: query,
        sort: 'preco_asc',
      });
      const response = await api.get(`/medicamentos/todos?${params.toString()}`);
      if (response.data.sucesso) {
        setResultados(response.data.dados);
        setTotalPaginas(response.data.paginacao?.totalPaginas || 1);
      } else {
        setResultados([]);
      }
    } catch (error) {
      console.error("Falha ao buscar resultados:", error);
      setResultados([]);
    } finally {
      setLoading(false);
    }
  }, [paginaAtual, query]);

  useEffect(() => {
    fetchResultados();
  }, [fetchResultados]);
  
  useEffect(() => {
    setTermoBuscaInput(query);
  }, [query]);
  
  useEffect(() => {
    if (paginaAtual !== 1) {
      setPaginaAtual(1);
    }
  }, [query]);

  const handleNovaBuscaSubmit = (event) => {
    event.preventDefault();
    if (termoBuscaInput.trim() && termoBuscaInput.trim() !== query) {
      router.push(`/busca?q=${encodeURIComponent(termoBuscaInput)}`);
    }
  };

  const handlePaginaAnterior = () => setPaginaAtual(p => Math.max(p - 1, 1));
  const handleProximaPagina = () => setPaginaAtual(p => Math.min(p + 1, totalPaginas));
  const handleMudarPagina = (numeroPagina) => setPaginaAtual(numeroPagina);
  const paginasParaMostrar = gerarNumerosPaginacao(paginaAtual, totalPaginas);
  
  return (
    <div className={style.container}>
      <section className={style.principal}>
        <h2>Sua saúde em primeiro lugar</h2>
        <p>Faça uma nova busca</p>
        <form className={style.caixaBusca} onSubmit={handleNovaBuscaSubmit}>
          <input 
            type="text" 
            placeholder="Buscar medicamentos..." 
            value={termoBuscaInput} 
            onChange={(e) => setTermoBuscaInput(e.target.value)} 
            aria-label="Buscar medicamentos"
          />
          <button type="submit" aria-label="Buscar">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
            </svg>
          </button>
        </form>
      </section>

      <section className={style.produtos}>
        <Link href="/" className={style.botaoVoltar}>
          &larr; Voltar à pesquisa inicial
        </Link>
        
        {loading ? (
          <h3>Buscando...</h3>
        ) : (
          <h3>Resultados para "{query}"</h3>
        )}

        <div className={`${style.gradeProdutos} ${loading ? style.gradeProdutosCarregando : ''}`}>
          {loading ? (
            Array.from({ length: ITENS_POR_PAGINA }).map((_, index) => <SkeletonCard key={index} />)
          ) : resultados.length > 0 ? (
            resultados.map((medicamento) => (
              <CardProduto
                key={medicamento.medp_id}
                medicamento={medicamento}
                onVerDetalhes={() => alert(`Detalhes para ${medicamento.med_nome}`)}
              />
            ))
          ) : (
            <p className={style.mensagemAviso}>Nenhum resultado encontrado para sua busca.</p>
          )}
        </div>

        {totalPaginas > 1 && !loading && (
          <div className={style.paginacao}>
            <button onClick={handlePaginaAnterior} disabled={paginaAtual === 1}>Anterior</button>
            {paginasParaMostrar.map((numero, index) =>
              typeof numero === 'number' ? (
                <button key={index} onClick={() => handleMudarPagina(numero)} className={numero === paginaAtual ? style.paginaAtiva : ''}>
                  {numero}
                </button>
              ) : ( <span key={index} className={style.ellipsis}>...</span> )
            )}
            <button onClick={handleProximaPagina} disabled={paginaAtual === totalPaginas}>Próximo</button>
          </div>
        )}
      </section>
    </div>
  );
}

export default function BuscaPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <SearchPageContent />
    </Suspense>
  );
}