// app/busca/page.jsx
'use client'

import { useState, useEffect, Suspense, useCallback } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import api from '../services/api';
import style from './busca.module.css';
import CardProduto from '../componentes/CardProduto';
import Paginacao from '../componentes/Paginacao';
import { useDebounce } from '../hooks/useDebounce';

// Componente Wrapper com Suspense para carregar os parâmetros da URL
export default function PaginaBuscaWrapper() {
  return (
    <Suspense fallback={<div>Carregando busca...</div>}>
      <PaginaBusca />
    </Suspense>
  );
}

const ITENS_POR_PAGINA = 12;

function PaginaBusca() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Estados dos resultados
  const [resultados, setResultados] = useState([]);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Lê os filtros da URL ou usa valores padrão
  const query = searchParams.get('q') || '';
  const pagina = Number(searchParams.get('pagina')) || 1;
  const categoria = searchParams.get('categoria') || 'todos';
  const ordenacao = searchParams.get('ordenacao') || 'relevancia';
  const precoMin = searchParams.get('precoMin') || '';
  const precoMax = searchParams.get('precoMax') || '';

  // Estados locais para os inputs, permitindo o debounce
  const [precoMinInput, setPrecoMinInput] = useState(precoMin);
  const [precoMaxInput, setPrecoMaxInput] = useState(precoMax);

  // Aplica o debounce nos valores dos inputs de preço
  const debouncedPrecoMin = useDebounce(precoMinInput, 500);
  const debouncedPrecoMax = useDebounce(precoMaxInput, 500);

  // Função para atualizar a URL com os novos filtros
  const atualizarURL = useCallback((novosParams) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(novosParams).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    router.push(`${pathname}?${params.toString()}`);
  }, [searchParams, pathname, router]);


  // Efeito que busca os dados *simulando* uma chamada de API otimizada
  useEffect(() => {
    const buscarResultados = async () => {
      setLoading(true);
      setError(null);

      // --- SIMULAÇÃO DE CHAMADA À API COM FILTROS ---
      // Em uma aplicação real, estes parâmetros seriam enviados para o backend
      const params = {
        q: query,
        pagina,
        limite: ITENS_POR_PAGINA,
        categoria,
        ordenacao,
        precoMin: debouncedPrecoMin,
        precoMax: debouncedPrecoMax
      };

      console.log("Simulando chamada à API com:", params);

      try {
        // Na prática, a API faria isso: const response = await api.get('/medicamentos', { params });
        // Como não temos backend, buscamos tudo e filtramos no cliente (aqui).
        const response = await api.get('/medicamentos');
        let dados = response.data.sucesso ? response.data.dados.map((med, index) => ({
          ...med,
          med_categoria: index % 3 === 0 ? 'Analgésico' : (index % 3 === 1 ? 'Vitamina' : 'Antibiótico')
        })) : [];

        // Lógica de filtro (que estaria no backend)
        if (query) dados = dados.filter(m => m.med_nome.toLowerCase().includes(query.toLowerCase()));
        if (categoria !== 'todos') dados = dados.filter(m => m.med_categoria === categoria);
        if (debouncedPrecoMin) dados = dados.filter(m => m.medp_preco >= parseFloat(debouncedPrecoMin));
        if (debouncedPrecoMax) dados = dados.filter(m => m.medp_preco <= parseFloat(debouncedPrecoMax));
        
        // Lógica de ordenação (que estaria no backend)
        switch (ordenacao) {
          case 'preco-asc': dados.sort((a, b) => a.medp_preco - b.medp_preco); break;
          case 'preco-desc': dados.sort((a, b) => b.medp_preco - a.medp_preco); break;
          case 'nome-asc': dados.sort((a, b) => a.med_nome.localeCompare(b.med_nome)); break;
        }

        const totalItens = dados.length;
        setTotalPaginas(Math.ceil(totalItens / ITENS_POR_PAGINA));

        // Lógica de paginação (que estaria no backend)
        const inicio = (pagina - 1) * ITENS_POR_PAGINA;
        const fim = inicio + ITENS_POR_PAGINA;
        setResultados(dados.slice(inicio, fim));

      } catch (err) {
        setError("Erro de conexão ao buscar dados.");
      } finally {
        setLoading(false);
      }
    };

    buscarResultados();
  }, [query, pagina, categoria, ordenacao, debouncedPrecoMin, debouncedPrecoMax]);

  // Efeito para sincronizar os inputs de preço com a URL via debounce
  useEffect(() => {
    const paramsParaAtualizar = {};
    if (debouncedPrecoMin !== precoMin) paramsParaAtualizar.precoMin = debouncedPrecoMin;
    if (debouncedPrecoMax !== precoMax) paramsParaAtualizar.precoMax = debouncedPrecoMax;
    
    if (Object.keys(paramsParaAtualizar).length > 0) {
      // Reseta a página para 1 ao aplicar um novo filtro de preço
      paramsParaAtualizar.pagina = '1';
      atualizarURL(paramsParaAtualizar);
    }
  }, [debouncedPrecoMin, debouncedPrecoMax, precoMin, precoMax, atualizarURL]);


  const handleFilterChange = (key, value) => {
    // Ao mudar um filtro, sempre volta para a primeira página
    atualizarURL({ [key]: value, pagina: '1' });
  };
  
  const handlePageChange = (novaPagina) => {
    atualizarURL({ pagina: novaPagina });
  };
  
  const categoriasUnicas = ['todos', 'Analgésico', 'Vitamina', 'Antibiótico']; // Exemplo

  return (
    <div className={style.paginaBusca}>
      <aside className={style.sidebarFiltros}>
        <h4>Filtros</h4>
        <div className={style.grupoFiltro}>
          <label htmlFor="categoria">Categoria</label>
          <select id="categoria" value={categoria} onChange={e => handleFilterChange('categoria', e.target.value)}>
            {categoriasUnicas.map(cat => <option key={cat} value={cat}>{cat === 'todos' ? 'Todas' : cat}</option>)}
          </select>
        </div>
        <div className={style.grupoFiltro}>
          <label>Faixa de Preço</label>
          <div className={style.faixaPreco}>
            <input type="number" placeholder="Mín" value={precoMinInput} onChange={e => setPrecoMinInput(e.target.value)} />
            <span>-</span>
            <input type="number" placeholder="Máx" value={precoMaxInput} onChange={e => setPrecoMaxInput(e.target.value)} />
          </div>
        </div>
      </aside>

      <main className={style.areaResultados}>
        <div className={style.cabecalhoResultados}>
          <h3>Resultados para: "{query}"</h3>
          <div className={style.grupoFiltro}>
            <label htmlFor="ordenacao">Ordenar por</label>
            <select id="ordenacao" value={ordenacao} onChange={e => handleFilterChange('ordenacao', e.target.value)}>
              <option value="relevancia">Relevância</option>
              <option value="preco-asc">Menor Preço</option>
              <option value="preco-desc">Maior Preço</option>
              <option value="nome-asc">Nome (A-Z)</option>
            </select>
          </div>
        </div>
        
        {loading && <div className={style.loadingOverlay}>Carregando...</div>}
        {!loading && !error && resultados.length > 0 && (
          <>
            <div className={style.gradeProdutos}>
              {resultados.map(medicamento => <CardProduto key={medicamento.med_id} medicamento={medicamento} />)}
            </div>
            <Paginacao paginaAtual={pagina} totalPaginas={totalPaginas} onPageChange={handlePageChange} />
          </>
        )}
        {!loading && !error && resultados.length === 0 && <p>Nenhum resultado encontrado.</p>}
        {error && <p className={style.mensagemErro}>{error}</p>}
      </main>
    </div>
  );
}