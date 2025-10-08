// app/page.jsx

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '../services/api';
import style from "./page.module.css";
import Slider from "../componentes/slider";

// --- IMAGEM PADRÃO ---
const imagemPadrao = "https://www.institutoaron.com.br/static/img/large/c28a030a59bae1283321c340cdc846df.webp";

// --- FUNÇÃO AUXILIAR PARA GERAR A URL DA IMAGEM ---
const getImageUrl = (imagePath) => {
  if (!imagePath) return imagemPadrao;
  if (imagePath.startsWith('http')) return imagePath;
  const baseUrl = api.defaults.baseURL.replace(/\/$/, '');
  return `${baseUrl}/${imagePath.replace(/\\/g, '/')}`;
};

// --- FUNÇÃO AUXILIAR PARA FORMATAR MOEDA ---
const formatarMoeda = (valor) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valor || 0);
};

// --- FUNÇÃO AUXILIAR PARA GERAR OS NÚMEROS DA PÁGINA ---
const gerarNumerosPaginacao = (paginaAtual, totalPaginas) => {
  const vizinhos = 1;
  const paginas = [];
  if (totalPaginas <= 5) {
    for (let i = 1; i <= totalPaginas; i++) paginas.push(i);
    return paginas;
  }
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

// --- COMPONENTE DO CARD DO PRODUTO (INTEGRADO) ---
const CardProduto = ({ medicamento, onVerDetalhes }) => {
  return (
    <div className={style.cartaoProduto}>
      <div className={style.containerImagemProduto}>
        <img src={medicamento.med_imagem} alt={medicamento.med_nome} className={style.imagemProduto} />
      </div>
      <div className={style.infoProduto}>
        <h4>{medicamento.med_nome}</h4>
        <p>{medicamento.med_dosagem}</p>
        <span className={style.preco}>{formatarMoeda(medicamento.medp_preco)}</span>
      </div>
      <button onClick={onVerDetalhes}>Ver Detalhes</button>
    </div>
  );
};

// --- COMPONENTE PARA O SKELETON LOADER ---
const SkeletonCard = () => (
  <div className={`${style.cartaoProduto} ${style.skeleton}`}>
    <div className={style.containerImagemProduto}></div>
    <div className={style.infoProduto}>
      <div className={style.skeletonText}></div>
      <div className={style.skeletonText} style={{ width: '60%' }}></div>
    </div>
  </div>
);

// --- COMPONENTE PRINCIPAL DA PÁGINA ---
export default function PaginaInicial() {
  const router = useRouter();
  const imagens = ["/LogoEscrita.png", "/LogoEscrita.png", "/LogoEscrita.png"];
  const [medicamentosDestaque, setMedicamentosDestaque] = useState([]);
  const [loading, setLoading] = useState(true);
  const [termoBusca, setTermoBusca] = useState('');
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const ITENS_POR_PAGINA = 12;

  // Estados para o Modal de Detalhes
  const [modalAberto, setModalAberto] = useState(false);
  const [medicamentoSelecionado, setMedicamentoSelecionado] = useState(null);
  const [farmacias, setFarmacias] = useState([]);
  const [loadingModal, setLoadingModal] = useState(false);

  const fetchDestaques = useCallback(async (pagina) => {
    setLoading(true);
    try {
      const response = await api.get(`/medicamentos/todos?page=${pagina}&limit=${ITENS_POR_PAGINA}`);
      if (response.data.sucesso) {
        setMedicamentosDestaque(response.data.dados);
        if (response.data.paginacao) {
          setTotalPaginas(response.data.paginacao.totalPaginas);
        }
      }
    } catch (error) {
      console.error("Falha ao buscar destaques:", error);
      setMedicamentosDestaque([]);
      setTotalPaginas(1);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDestaques(paginaAtual);
  }, [paginaAtual, fetchDestaques]);

  const handleAbrirDetalhes = async (medicamento) => {
    setMedicamentoSelecionado(medicamento);
    setModalAberto(true);
    setLoadingModal(true);
    setFarmacias([]);

    try {
      const response = await api.get(`/medicamentos/${medicamento.med_id}/farmacias`);
      
      let farmaciasEncontradas = [];
      if (response.data.sucesso) {
        farmaciasEncontradas = response.data.dados;
      }
      
      if (farmaciasEncontradas.length < 5) {
        const mockFarmacias = [
          { farm_id: 101, farm_nome: 'Drogaria Exemplo SP', farm_endereco: 'Av. Paulista, 1000', preco: (medicamento.medp_preco || 20) * 1.05 },
          { farm_id: 102, farm_nome: 'Pague Menos Exemplo', farm_endereco: 'Rua Augusta, 500', preco: (medicamento.medp_preco || 20) * 1.10 },
          { farm_id: 103, farm_nome: 'Farmácia Popular Mock', farm_endereco: 'Av. Brasil, 200', preco: (medicamento.medp_preco || 20) * 1.12 },
          { farm_id: 104, farm_nome: 'Droga Raia (Exemplo)', farm_endereco: 'Rua Oscar Freire, 300', preco: (medicamento.medp_preco || 20) * 1.15 },
          { farm_id: 105, farm_nome: 'Farma Conde (Mock)', farm_endereco: 'Praça da Sé, 10', preco: (medicamento.medp_preco || 20) * 1.20 },
        ];
        mockFarmacias.forEach(mock => {
          if (!farmaciasEncontradas.some(real => real.farm_id === mock.farm_id)) {
            farmaciasEncontradas.push(mock);
          }
        });
      }

      const farmaciasOrdenadas = farmaciasEncontradas.sort((a, b) => a.preco - b.preco);
      setFarmacias(farmaciasOrdenadas);

    } catch (error) {
      console.error("Erro ao buscar farmácias:", error);
      const mockFarmacias = [
          { farm_id: 101, farm_nome: 'Drogaria Exemplo SP', farm_endereco: 'Av. Paulista, 1000', preco: (medicamento.medp_preco || 20) * 1.05 },
          { farm_id: 102, farm_nome: 'Pague Menos Exemplo', farm_endereco: 'Rua Augusta, 500', preco: (medicamento.medp_preco || 20) * 1.10 },
          { farm_id: 103, farm_nome: 'Farmácia Popular Mock', farm_endereco: 'Av. Brasil, 200', preco: (medicamento.medp_preco || 20) * 1.12 },
          { farm_id: 104, farm_nome: 'Droga Raia (Exemplo)', farm_endereco: 'Rua Oscar Freire, 300', preco: (medicamento.medp_preco || 20) * 1.15 },
          { farm_id: 105, farm_nome: 'Farma Conde (Mock)', farm_endereco: 'Praça da Sé, 10', preco: (medicamento.medp_preco || 20) * 1.20 },
      ].sort((a, b) => a.preco - b.preco);
      setFarmacias(mockFarmacias);
    } finally {
      setLoadingModal(false);
    }
  };

  const handleFecharModal = () => {
    setModalAberto(false);
    setTimeout(() => {
      setMedicamentoSelecionado(null);
      setFarmacias([]);
    }, 300);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    if (!termoBusca.trim()) return;
    router.push(`/busca?q=${encodeURIComponent(termoBusca)}`);
  };

  const handlePaginaAnterior = () => setPaginaAtual(p => Math.max(p - 1, 1));
  const handleProximaPagina = () => setPaginaAtual(p => Math.min(p + 1, totalPaginas));
  const handleMudarPagina = (numeroPagina) => { if (numeroPagina !== paginaAtual) setPaginaAtual(numeroPagina); };
  const paginasParaMostrar = gerarNumerosPaginacao(paginaAtual, totalPaginas);

  return (
    <div className={style.container}>
      <header className={style.header}>
        <div className={style.logo}><h1>Pharma-X</h1></div>
        <nav className={style.nav}>
          <Link href="/" className={style.active}>Início</Link>
          <Link href="/sobre">Sobre</Link>
          <Link href="/contato">Contato</Link>
          <Link href="/login" className={style.userBtn}>Login</Link>
        </nav>
      </header>
      
      <section className={style.principal}>
        <h2>Sua saúde em primeiro lugar</h2>
        <p>Encontre os medicamentos que precisa com praticidade e confiança</p>
        <form className={style.caixaBusca} onSubmit={handleSearchSubmit}>
          <input type="text" placeholder="Buscar medicamentos..." value={termoBusca} onChange={(e) => setTermoBusca(e.target.value)} aria-label="Buscar medicamentos"/>
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
                medicamento={medicamento}
                onVerDetalhes={() => handleAbrirDetalhes(medicamento)}
              />
            ))
          )}
        </div>

        {totalPaginas > 1 && (
          <div className={style.paginacao}>
            <button onClick={handlePaginaAnterior} disabled={loading || paginaAtual === 1}>Anterior</button>
            {paginasParaMostrar.map((numero, index) =>
              typeof numero === 'number' ? (
                <button key={index} onClick={() => handleMudarPagina(numero)} disabled={loading} className={numero === paginaAtual ? style.paginaAtiva : ''}>
                  {numero}
                </button>
              ) : ( <span key={index} className={style.ellipsis}>...</span> )
            )}
            <button onClick={handleProximaPagina} disabled={loading || paginaAtual === totalPaginas}>Próximo</button>
          </div>
        )}
      </section>

      {modalAberto && medicamentoSelecionado && (
        <div className={style.modalOverlay} onClick={handleFecharModal}>
          <div className={style.modal} onClick={(e) => e.stopPropagation()}>
            <div className={style.modalHeader}>
              <h2>{medicamentoSelecionado.med_nome}</h2>
              <button onClick={handleFecharModal} className={style.modalClose} aria-label="Fechar">✕</button>
            </div>
            <div className={style.modalContent}>
              <div className={style.detalhesContainer}>
                <div className={style.infoMedicamento}>
                  <img src={medicamentoSelecionado.med_imagem} alt={medicamentoSelecionado.med_nome} className={style.imagemModal} />
                  
                  <h4>Laboratório</h4>
                  <p>{medicamentoSelecionado.lab_nome || "Não informado"}</p>

                  <h4>Descrição</h4>
                  <p>{medicamentoSelecionado.med_descricao || "Nenhuma descrição disponível."}</p>
                </div>
                <div className={style.listaFarmacias}>
                  <h4>Encontre pelo melhor preço:</h4>
                  {loadingModal ? (
                    <div className={style.modalLoader}><div className={style.spinner}></div><span>Buscando farmácias...</span></div>
                  ) : farmacias.length > 0 ? (
                    farmacias.map(farmacia => (
                      <div key={farmacia.farm_id} className={style.farmaciaItem}>
                        <div className={style.farmaciaInfo}>
                          <h5>{farmacia.farm_nome}</h5>
                          <p>{farmacia.farm_endereco}</p>
                        </div>
                        <div className={style.farmaciaPreco}>{formatarMoeda(farmacia.preco)}</div>
                      </div>
                    ))
                  ) : (
                    <p className={style.mensagemAviso}>Nenhuma farmácia encontrada com este produto.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}