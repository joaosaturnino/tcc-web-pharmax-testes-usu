// app/page.jsx

'use client';

import { useState, useEffect, useCallback, useRef } from 'react'; // Adicionado useRef
import { useRouter } from 'next/navigation';
import api from '../services/api';
import style from "./page.module.css";
import Slider from "../componentes/slider";

// --- FUNÇÕES AUXILIARES (sem alterações) ---
const getImageUrl = (imagePath) => {
  const imagemPadrao = "https://www.institutoaron.com.br/static/img/large/c28a030a59bae1283321c340cdc846df.webp";
  if (!imagePath) return imagemPadrao;
  if (imagePath.startsWith('http')) return imagePath;
  const baseUrl = api.defaults.baseURL.replace(/\/$/, '');
  return `${baseUrl}/${imagePath.replace(/\\/g, '/')}`;
};

const formatarMoeda = (valor) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valor || 0);
};

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

// --- COMPONENTES INTERNOS (sem alterações) ---
const CardProduto = ({ medicamento, onVerDetalhes }) => {
  return (
    <div className={style.cartaoProduto}>
      <div className={style.containerImagemProduto}>
        <img src={getImageUrl(medicamento.med_imagem)} alt={medicamento.med_nome} className={style.imagemProduto} />
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
  
  const [medicamentos, setMedicamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [termoBusca, setTermoBusca] = useState('');
  const [laboratorioFiltro, setLaboratorioFiltro] = useState('');
  const [ordenacao, setOrdenacao] = useState('');
  const [laboratorios, setLaboratorios] = useState([]);

  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const ITENS_POR_PAGINA = 12;

  const [modalAberto, setModalAberto] = useState(false);
  const [medicamentoSelecionado, setMedicamentoSelecionado] = useState(null);
  const [farmacias, setFarmacias] = useState([]);
  const [loadingModal, setLoadingModal] = useState(false);

  // MELHORIA: Referência para controlar o primeiro render e evitar resets desnecessários.
  const isInitialMount = useRef(true);

  const fetchMedicamentos = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: paginaAtual.toString(),
        limit: ITENS_POR_PAGINA.toString(),
      });
      // CORREÇÃO: Inclui o termo de busca na requisição da API.
      if (termoBusca) params.append('search', termoBusca);
      if (laboratorioFiltro) params.append('lab', laboratorioFiltro);
      if (ordenacao) params.append('sort', ordenacao);

      const response = await api.get(`/medicamentos/todos?${params.toString()}`);
      
      if (response.data.sucesso) {
        setMedicamentos(response.data.dados);
        setTotalPaginas(response.data.paginacao?.totalPaginas || 1);
      }
    } catch (error) {
      console.error("Falha ao buscar medicamentos:", error);
    } finally {
      setLoading(false);
    }
    // CORREÇÃO: Adiciona 'termoBusca' às dependências para que a busca seja refeita ao digitar.
  }, [paginaAtual, laboratorioFiltro, ordenacao, termoBusca]);

  useEffect(() => {
    fetchMedicamentos();
  }, [fetchMedicamentos]);

  useEffect(() => {
    const fetchLaboratorios = async () => {
        try {
            const response = await api.get('/laboratorios'); 
            if (response.data.sucesso) {
                setLaboratorios(response.data.dados);
            }
        } catch (error) {
            console.error("Falha ao buscar laboratórios:", error);
        }
    };
    fetchLaboratorios();
  }, []);

  // MELHORIA: Efeito para resetar a página para 1 quando filtros mudam.
  useEffect(() => {
    // Evita que rode na primeira renderização do componente
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    setPaginaAtual(1);
  }, [laboratorioFiltro, ordenacao, termoBusca]);

  const handleBuscaSubmit = (event) => {
    event.preventDefault();
    // A busca agora é feita nesta mesma página, acionando o useEffect.
    // A navegação para /busca pode ser mantida se for um comportamento desejado para buscas explícitas.
    // Para uma experiência de "Single Page Application", a busca já acontece ao digitar.
    // Se a intenção é ter uma página de busca separada, o onSumbit pode ser mantido como estava:
    // router.push(`/busca?q=${encodeURIComponent(termoBusca)}`);
    fetchMedicamentos(); // Aciona a busca ao pressionar enter.
  };

  const handleLimparFiltros = () => {
    setTermoBusca('');
    setLaboratorioFiltro('');
    setOrdenacao('');
    // CORREÇÃO: Reseta para a página 1 ao limpar os filtros.
    setPaginaAtual(1);
  };

  const handleAbrirDetalhes = async (medicamento) => {
    setMedicamentoSelecionado(medicamento);
    setModalAberto(true);
    setLoadingModal(true);
    setFarmacias([]);
    try {
      const response = await api.get(`/medicamentos/${medicamento.med_id}/farmacias`);
      let farmaciasEncontradas = response.data.sucesso ? response.data.dados : [];
      setFarmacias(farmaciasEncontradas.sort((a, b) => a.preco - b.preco));
    } catch (error) {
      console.error("Erro ao buscar farmácias:", error);
    } finally {
      setLoadingModal(false);
    }
  };

  const handleFecharModal = () => {
    setModalAberto(false);
    setTimeout(() => setMedicamentoSelecionado(null), 300);
  };

  const handlePaginaAnterior = () => setPaginaAtual(p => Math.max(p - 1, 1));
  const handleProximaPagina = () => setPaginaAtual(p => Math.min(p + 1, totalPaginas));
  const handleMudarPagina = (numeroPagina) => setPaginaAtual(numeroPagina);
  const paginasParaMostrar = gerarNumerosPaginacao(paginaAtual, totalPaginas);

  const filtrosAtivos = laboratorioFiltro || ordenacao || termoBusca;

  return (
    <div className={style.container}>
      <section className={style.principal}>
        <h2>Sua saúde em primeiro lugar</h2>
        <p>Encontre os medicamentos que precisa com praticidade e confiança</p>
        <form className={style.caixaBusca} onSubmit={handleBuscaSubmit}>
          <input 
            type="text" 
            placeholder="Buscar por nome, laboratório..." 
            value={termoBusca} 
            onChange={(e) => setTermoBusca(e.target.value)} 
            aria-label="Buscar medicamentos"
          />
          <button type="submit" aria-label="Buscar">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
            </svg>
          </button>
        </form>
      </section>

      <Slider imagens={imagens} />

      <section className={style.produtos}>
        <h3>Destaques</h3>
        <div className={style.filtrosContainer}>
          <select value={laboratorioFiltro} onChange={(e) => setLaboratorioFiltro(e.target.value)} aria-label="Filtrar por laboratório">
            <option value="">Todos os Laboratórios</option>
            {laboratorios.map(lab => (
                <option key={lab.lab_id} value={lab.lab_id}>{lab.lab_nome}</option>
            ))}
          </select>
          <select value={ordenacao} onChange={(e) => setOrdenacao(e.target.value)} aria-label="Ordenar por">
            <option value="">Ordenar por...</option>
            <option value="preco_asc">Menor Preço</option>
            <option value="preco_desc">Maior Preço</option>
          </select>
          {filtrosAtivos && (
            <button onClick={handleLimparFiltros} className={style.botaoLimpar}>
              Limpar Filtros
            </button>
          )}
        </div>
        <div className={`${style.gradeProdutos} ${loading ? style.gradeProdutosCarregando : ''}`}>
          {loading ? (
            Array.from({ length: ITENS_POR_PAGINA }).map((_, index) => <SkeletonCard key={index} />)
          ) : medicamentos.length > 0 ? (
            medicamentos.map((medicamento) => (
            <CardProduto
              // CORREÇÃO CRÍTICA: Usa 'medp_id' como chave única para evitar erros de renderização.
              key={medicamento.medp_id} 
              medicamento={medicamento}
              onVerDetalhes={() => handleAbrirDetalhes(medicamento)}
            />
          ))
          ) : (
            <p className={style.mensagemAviso}>Nenhum medicamento encontrado com os filtros selecionados.</p>
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
                  <img src={getImageUrl(medicamentoSelecionado.med_imagem)} alt={medicamentoSelecionado.med_nome} className={style.imagemModal} />
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