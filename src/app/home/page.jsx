// É necessário marcar o componente como um Client Component para usar Hooks
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation'; // Hook para redirecionamento
import Image from "next/image";
import api from '../services/api';
import style from "./page.module.css";
import Slider from "../componentes/slider";
import CardProduto from "../componentes/CardProduto";

// --- IMAGEM PADRÃO ---
// Defina aqui um caminho para uma imagem padrão caso o medicamento não tenha uma
const imagemPadrao = "https://www.institutoaron.com.br/static/img/large/c28a030a59bae1283321c340cdc846df.webp"; // Altere se necessário

// --- FUNÇÃO AUXILIAR PARA GERAR A URL DA IMAGEM (VERSÃO CORRIGIDA) ---
const getImageUrl = (imagePath) => {
  // Se o caminho da imagem não existir, retorna a imagem padrão.
  if (!imagePath) {
    return imagemPadrao;
  }

  // Se o caminho JÁ FOR UMA URL COMPLETA, retorna ele diretamente.
  if (imagePath.startsWith('http')) {
    return imagePath;
  }

  // Se for um caminho relativo (do seu banco), monta a URL completa.
  const baseUrl = api.defaults.baseURL;
  return `${baseUrl}/${imagePath.replace(/\\/g, '/')}`;
};


// --- FUNÇÃO AUXILIAR PARA GERAR OS NÚMEROS DA PÁGINA ---
// (Colocada fora do componente para não ser recriada a cada renderização)
const gerarNumerosPaginacao = (paginaAtual, totalPaginas) => {
  // Quantos números mostrar ao lado da página atual
  const vizinhos = 1;
  const paginas = [];

  // Se não houver páginas suficientes, mostra todos os números
  if (totalPaginas <= 5) {
    for (let i = 1; i <= totalPaginas; i++) {
      paginas.push(i);
    }
    return paginas;
  }

  // Lógica para mostrar primeiro, último, atuais e "..."
  const primeiro = 1;
  const ultimo = totalPaginas;
  const inicioVisivel = Math.max(primeiro + 1, paginaAtual - vizinhos);
  const fimVisivel = Math.min(ultimo - 1, paginaAtual + vizinhos);

  paginas.push(primeiro);

  if (inicioVisivel > primeiro + 1) {
    paginas.push('...');
  }

  for (let i = inicioVisivel; i <= fimVisivel; i++) {
    paginas.push(i);
  }

  if (fimVisivel < ultimo - 1) {
    paginas.push('...');
  }

  paginas.push(ultimo);

  return paginas;
};


// Componente para o Skeleton Loader
const SkeletonCard = () => (
  <div className={`${style.cartaoProduto} ${style.skeleton}`}>
    <div className={style.containerImagemProduto}></div>
    <div>
      <div className={style.skeletonText}></div>
      <div className={style.skeletonText}></div>
    </div>
  </div>
);


export default function PaginaInicial() {
  const router = useRouter();
  const imagens = ["/LogoEscrita.png", "/LogoEscrita.png", "/LogoEscrita.png"];

  const [medicamentosDestaque, setMedicamentosDestaque] = useState([]);
  const [loading, setLoading] = useState(true);
  const [termoBusca, setTermoBusca] = useState('');

  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const ITENS_POR_PAGINA = 10;

  const fetchDestaques = useCallback(async (pagina) => {
    setLoading(true);
    const startTime = Date.now();
    const MIN_LOADING_TIME = 500;

    try {
      const response = await api.get(`/medicamentos/todos?page=${pagina}&limit=${ITENS_POR_PAGINA}`);
      if (response.data.sucesso) {
        
        // --- CORREÇÃO APLICADA AQUI ---
        // Mapeia os resultados da API para transformar o caminho da imagem em uma URL completa
        const medicamentosComUrlCompleta = response.data.dados.map(medicamento => ({
          ...medicamento, // Copia todas as propriedades originais do medicamento
          med_imagem: getImageUrl(medicamento.med_imagem) // Substitui o caminho relativo pela URL completa
        }));
        
        setMedicamentosDestaque(medicamentosComUrlCompleta);
        // --- FIM DA CORREÇÃO ---
        
        if (response.data.paginacao) {
          setTotalPaginas(response.data.paginacao.totalPaginas);
        }
      }
    } catch (error) {
      console.error("Falha ao buscar destaques:", error);
      setMedicamentosDestaque([]);
      setTotalPaginas(1);
    } finally {
      const elapsedTime = Date.now() - startTime;
      const remainingTime = MIN_LOADING_TIME - elapsedTime;
      if (remainingTime > 0) {
        setTimeout(() => setLoading(false), remainingTime);
      } else {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchDestaques(paginaAtual);
  }, [paginaAtual, fetchDestaques]);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    if (!termoBusca.trim()) return;
    router.push(`/busca?q=${encodeURIComponent(termoBusca)}`);
  };

  const handlePaginaAnterior = () => {
    setPaginaAtual(paginaAnterior => Math.max(paginaAnterior - 1, 1));
  };

  const handleProximaPagina = () => {
    setPaginaAtual(paginaAnterior => Math.min(paginaAnterior + 1, totalPaginas));
  };

  const handleMudarPagina = (numeroPagina) => {
    if (numeroPagina !== paginaAtual) {
      setPaginaAtual(numeroPagina);
    }
  };

  const paginasParaMostrar = gerarNumerosPaginacao(paginaAtual, totalPaginas);

  return (
    <div className={style.container}>
      {/* ... Seções principal e slider ... */}
       <section className={style.principal}>
        <h2>Sua saúde em primeiro lugar</h2>
        <p>
          Encontre os medicamentos que precisa com praticidade e confiança
        </p>
        <form className={style.caixaBusca} onSubmit={handleSearchSubmit}>
          <input
            type="text"
            placeholder="Buscar medicamentos..."
            value={termoBusca}
            onChange={(e) => setTermoBusca(e.target.value)}
            aria-label="Buscar medicamentos"
          />
          <button type="submit" aria-label="Buscar">Buscar</button>
        </form>
      </section>

      <Slider imagens={imagens} />

      <section className={style.produtos}>
        <h3>Destaques</h3>
        <div className={`${style.gradeProdutos} ${loading ? style.gradeProdutosCarregando : ''}`}>
          {loading ? (
            Array.from({ length: ITENS_POR_PAGINA }).map((_, index) => <SkeletonCard key={index} />)
          ) : (
            medicamentosDestaque.map((medicamento) => (
              <CardProduto
                key={medicamento.med_id}
                medicamento={medicamento} // Agora o 'medicamento.med_imagem' já é a URL completa
                onAddToCart={() => alert(`${medicamento.med_nome} adicionado!`)}
              />
            ))
          )}
        </div>

        {/* --- CONTROLES DE PAGINAÇÃO MELHORADOS --- */}
        {totalPaginas > 1 && (
          <div className={style.paginacao}>
            <button onClick={handlePaginaAnterior} disabled={loading || paginaAtual === 1}>
              Anterior
            </button>
            
            {paginasParaMostrar.map((numero, index) =>
              typeof numero === 'number' ? (
                <button
                  key={index}
                  onClick={() => handleMudarPagina(numero)}
                  disabled={loading}
                  className={numero === paginaAtual ? style.paginaAtiva : ''}
                >
                  {numero}
                </button>
              ) : (
                <span key={index} className={style.ellipsis}>
                  ...
                </span>
              )
            )}

            <button onClick={handleProximaPagina} disabled={loading || paginaAtual === totalPaginas}>
              Próximo
            </button>
          </div>
        )}
      </section>
    </div>
  );
}