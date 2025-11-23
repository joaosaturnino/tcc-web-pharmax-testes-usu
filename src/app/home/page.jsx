// app/page.jsx
"use client"; // Define que este componente roda no navegador (Client Component)

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import api from '../services/api';
import style from "./page.module.css";
import Slider from "../componentes/slider";
// Importa biblioteca de animação para transições suaves (modais, cards, listas)
import { motion, AnimatePresence } from 'framer-motion';

// --- ÍCONES SVG ---
// Componentes leves para evitar bibliotecas de ícones pesadas
const IconFilter = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
    <path d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342.474l-3 1.5A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5v-2z" />
  </svg>
);
const IconSort = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
    <path d="M3.5 2.5a.5.5 0 0 0-1 0v8.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L3.5 11.293V2.5zm3.5 1a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zM7 6.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0 3a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zm0 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5z" />
  </svg>
);
const IconSearchEmpty = () => (
  <svg className={style.emptyStateIcon} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
  </svg>
);
const IconGrid = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
    <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5v-3zm8 0A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5v-3zm-8 8A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5v-3zm8 0A1.5 1.5 0 0 1 10.5 9h3a.5.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3a1.5 1.5 0 0 1-1.5-1.5v-3z" />
  </svg>
);
const IconList = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
    <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z" />
  </svg>
);
const IconStore = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5A2.25 2.25 0 0011.25 11.25H10.5a2.25 2.25 0 00-2.25 2.25V21M3 10.5v10.5A2.25 2.25 0 005.25 23h13.5A2.25 2.25 0 0021 20.75V10.5M3 10.5V6.21a2.25 2.25 0 011.36-2.064l6-3.333a2.25 2.25 0 012.28 0l6 3.333A2.25 2.25 0 0121 6.21V10.5M3 10.5H21" />
  </svg>
);
const IconFlask = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.05 4.575a1.575 1.575 0 10-3.15 0v3m3.15-3v-1.5a1.575 1.575 0 013.15 0v1.5m-3.15 0l.075 5.925m3.075-5.925v3m3.15-3v-1.5a1.575 1.575 0 013.15 0v1.5m-3.15 0l.075 5.925m3.075-5.925v3m-6.3 3.375c.621.528 1.48.975 2.475 1.338a48.51 48.51 0 015.454 0c.996-.363 1.854-.81 2.475-1.338m-10.4 0a48.51 48.51 0 005.454 0c.996-.363 1.854-.81 2.475-1.338m-10.4 0a48.51 48.51 0 005.454 0" />
  </svg>
);
const IconTagAlt = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
  </svg>
);
const IconPill = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.321h5.318a.563.563 0 01.321 1.02l-4.286 3.117a.563.563 0 00-.172.53l1.634 5.033a.563.563 0 01-.84.62l-4.434-3.21a.563.563 0 00-.65 0l-4.434 3.21a.563.563 0 01-.84-.62l1.634-5.033a.563.563 0 00-.172-.53L2.633 9.95a.563.563 0 01.321-1.02h5.318a.563.563 0 00.475-.321L11.48 3.5z" />
  </svg>
);

// --- FUNÇÕES AUXILIARES ---

// Resolve URL da imagem: lida com caminhos locais, URLs completas ou fallback padrão
const getImageUrl = (imagePath) => {
  const imagemPadrao = "/caixa-medicamento-padrao5.png";

  if (!imagePath || (typeof imagePath === 'string' && imagePath.endsWith('sem-imagem.png'))) {
    return imagemPadrao;
  }

  if (imagePath.startsWith('http')) {
    return imagePath;
  }

  const baseUrl = api.defaults.baseURL.replace(/\/$/, '');
  return `${baseUrl}/${imagePath.replace(/\\/g, '/')}`;
};

// Formata número para Real Brasileiro (R$)
const formatarMoeda = (valor) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valor || 0);
};

// Formata data ISO para DD/MM/AAAA (usando UTC para evitar erros de timezone)
const formatarData = (dataString) => {
  if (!dataString) return '';
  try {
    const data = new Date(dataString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      timeZone: 'UTC'
    }).format(data);
  } catch (error) {
    console.error("Erro ao formatar data:", error);
    return dataString;
  }
};

// Calcula o preço final subtraindo a porcentagem de desconto
const calcularPrecoComDesconto = (preco, desconto) => {
  const precoNum = parseFloat(preco || 0);
  const descontoNum = parseFloat(desconto || 0);
  if (descontoNum > 0) {
    return precoNum * (1 - (descontoNum / 100));
  }
  return precoNum;
};

// Lógica de paginação com "ellipsis" (...) se houver muitas páginas
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

const ORDENACAO_MAP = {
  'preco_asc': 'Menor Preço',
  'preco_desc': 'Maior Preço'
};

// --- VARIANTES DE ANIMAÇÃO (Framer Motion) ---
const listContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.07 // Efeito cascata
    }
  }
};

const listItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};


// --- SUB-COMPONENTES ---

// Wrapper animado para o card
const MotionCardProduto = ({ medicamento, onVerDetalhes, animationDelay }) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom) => ({
      opacity: 1, y: 0,
      transition: { delay: custom * 0.05 }
    }),
    exit: { opacity: 0, transition: { duration: 0.15 } }
  };
  return (
    <motion.div layout variants={cardVariants} initial="hidden" animate="visible" exit="exit" custom={animationDelay}>
      <CardProduto medicamento={medicamento} onVerDetalhes={onVerDetalhes} />
    </motion.div>
  );
};

// Componente visual do Card
const CardProduto = ({ medicamento, onVerDetalhes }) => {
  const precoOriginal = medicamento.medp_preco;
  const desconto = medicamento.promo_desconto;
  const temDesconto = desconto > 0;
  const precoFinal = calcularPrecoComDesconto(precoOriginal, desconto);
  const cardClasses = `${style.cartaoProduto} ${temDesconto ? style.promoted : ''}`;

  return (
    <div className={cardClasses}>
      <div className={style.containerImagemProduto}>
        {temDesconto && (<span className={style.tagPromocao}>{desconto}% OFF</span>)}
        <img src={getImageUrl(medicamento.med_imagem)} alt={medicamento.med_nome} className={style.imagemProduto} />
      </div>
      <div className={style.infoProduto}>
        <h4>{medicamento.med_nome}</h4>
        <p>{medicamento.med_dosagem}</p>
        <span className={style.preco}>
          {temDesconto ? (
            <><span className={style.precoAntigo}>{formatarMoeda(precoOriginal)}</span>{' '}<span className={style.precoFinal}>{formatarMoeda(precoFinal)}</span></>
          ) : (<span className={style.precoFinal}>{formatarMoeda(precoFinal)}</span>)}
        </span>

      </div>
      <button onClick={onVerDetalhes}>Ver Detalhes</button>
    </div>
  );
};

// Skeletons para Loading
const SkeletonCard = () => (
  <div className={`${style.cartaoProduto} ${style.skeleton}`}>
    <div className={style.containerImagemProduto}></div>
    <div className={style.infoProduto}>
      <div className={style.skeletonText}></div>
      <div className={style.skeletonText} style={{ width: '60%' }}></div>
    </div>
  </div>
);

const SkeletonCardList = () => (
  <div className={`${style.cartaoProduto} ${style.skeleton} ${style.skeletonList}`}>
    <div className={`${style.containerImagemProduto} ${style.skeletonListImage}`}></div>
    <div className={`${style.infoProduto} ${style.skeletonListInfo}`}>
      <div className={style.skeletonText} style={{ height: '24px', width: '60%' }}></div>
      <div className={style.skeletonText} style={{ height: '28px', width: '30%' }}></div>
    </div>
  </div>
);

// Estado Vazio do Modal
const ModalEmptyState = () => (
  <div className={style.modalEmptyStateContainer}>
    <div className={style.modalEmptyStateIcon}><IconStore /></div>
    <h5 className={style.modalEmptyStateTitle}>Nenhuma farmácia encontrada</h5>
    <p className={style.modalEmptyStateMessage}>Não encontramos este produto em farmácias parceiras no momento.</p>
  </div>
);

// Item da lista de farmácias dentro do Modal
const FarmaciaItem = ({ farmacia, index }) => {
  const precoOriginal = farmacia.preco;
  const desconto = farmacia.promo_desconto;
  const temDesconto = desconto > 0;
  const precoFinal = farmacia.precoFinal;
  const isMelhorPreco = index === 0; // A lista vem ordenada, o primeiro é o melhor preço

  const farmSite = farmacia.farm_site || null;
  const farmTelefone = farmacia.farm_telefone || null;

  const dataInicio = farmacia.promo_inicio;
  const dataFim = farmacia.promo_fim;
  const temPeriodoPromocao = temDesconto && dataInicio && dataFim;

  return (
    <motion.div variants={listItemVariants}>
      <div className={`${style.farmaciaItem} ${isMelhorPreco ? style.melhorPrecoItem : ''}`}>
        <div className={style.farmaciaInfo}>
          <h5>{farmacia.farm_nome}</h5>
          <p className={style.farmaciaEndereco}>{farmacia.farm_endereco}</p>
          <div className={style.farmaciaContato}>
            {farmTelefone && (<span>{farmTelefone}</span>)}
            <a
              href={`http://googleusercontent.com/maps/google.com/0{encodeURIComponent(farmacia.farm_endereco)}`}
              target="_blank"
              rel="noopener noreferrer"
              className={style.mapLink}
              title="Ver no mapa"
            >
              Ver no mapa
            </a>
          </div>
        </div>
        <div className={style.farmaciaAcoes}>
          <div className={style.farmaciaPrecoContainer}>
            <div className={style.precoTags}>
              {isMelhorPreco && (
                <span className={`${style.tag} ${style.tagMelhorPreco}`}>Melhor Preço</span>
              )}
              {temDesconto && (
                <span className={`${style.tag} ${style.tagDescontoModal}`}>{desconto}% OFF</span>
              )}
            </div>
            <div className={style.farmaciaPreco}>
              {temDesconto ? (
                <><span className={style.precoAntigo}>{formatarMoeda(precoOriginal)}</span><span className={style.precoFinal}>{formatarMoeda(precoFinal)}</span></>
              ) : (
                <span className={style.precoFinal}>{formatarMoeda(precoOriginal)}</span>
              )}
            </div>

            {temPeriodoPromocao && (
              <div className={style.periodoPromocaoModal}>
                <span>Válido de: {formatarData(dataInicio)}</span>
                <span>Até: {formatarData(dataFim)}</span>
              </div>
            )}

          </div>
          {farmSite ? (
            <a
              href={farmSite}
              target="_blank"
              rel="noopener noreferrer"
              className={`${style.modalCtaButton} ${isMelhorPreco ? style.modalCtaButtonPrimary : style.modalCtaButtonSecondary}`}
            >
              Ir ao site
            </a>
          ) : (
            <span className={style.semSiteAviso}>Visita presencial</span>
          )}
        </div>
      </div>
    </motion.div>
  );
};


// --- COMPONENTE PRINCIPAL DA PÁGINA ---
export default function PaginaInicial() {
  const router = useRouter();
  const imagens = ["/LogoEscrita.png", "/LogoEscrita.png", "/LogoEscrita.png"];

  // --- ESTADOS ---
  const [medicamentos, setMedicamentos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Busca com Debounce (delay para não chamar API a cada tecla)
  const [termoBusca, setTermoBusca] = useState('');
  const [debouncedBusca, setDebouncedBusca] = useState(termoBusca);

  // Filtros
  const [laboratorioFiltro, setLaboratorioFiltro] = useState('');
  const [ordenacao, setOrdenacao] = useState('');
  const [laboratorios, setLaboratorios] = useState([]);

  // Paginação
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const ITENS_POR_PAGINA = 12;

  // Modal
  const [modalAberto, setModalAberto] = useState(false);
  const [medicamentoSelecionado, setMedicamentoSelecionado] = useState(null);
  const [farmacias, setFarmacias] = useState([]);
  const [loadingModal, setLoadingModal] = useState(false);

  // UI Mobile e Visualização
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [isDescricaoExpanded, setIsDescricaoExpanded] = useState(false);

  // Refs para controle
  const isInitialMount = useRef(true);
  const modalRef = useRef(null);
  const filterModalRef = useRef(null);
  const openerRef = useRef(null); // Guarda foco para acessibilidade
  const produtosRef = useRef(null); // Scroll automático

  // --- EFEITOS (UseEffect) ---

  // 1. Implementa o Debounce da busca (500ms)
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedBusca(termoBusca);
    }, 500);
    return () => { clearTimeout(timerId); };
  }, [termoBusca]);

  // 2. Busca principal de Medicamentos
  const fetchMedicamentos = useCallback(async () => {
    setLoading(true);
    try {
      // Constrói query string
      const params = new URLSearchParams({ page: paginaAtual.toString(), limit: ITENS_POR_PAGINA.toString() });
      if (debouncedBusca) params.append('search', debouncedBusca);
      if (laboratorioFiltro) params.append('lab', laboratorioFiltro);
      if (ordenacao) params.append('sort', ordenacao);
      
      const response = await api.get(`/medicamentos/todos?${params.toString()}`);
      if (response.data.sucesso) {
        setMedicamentos(response.data.dados);
        setTotalPaginas(response.data.paginacao?.totalPaginas || 1);
      }
    } catch (error) {
      console.error("Falha ao buscar medicamentos:", error);
      setMedicamentos([]);
    } finally {
      setLoading(false);
      if (isInitialMount.current) { isInitialMount.current = false; }
    }
  }, [paginaAtual, laboratorioFiltro, ordenacao, debouncedBusca]);

  useEffect(() => { fetchMedicamentos(); }, [fetchMedicamentos]);

  // 3. Busca lista de laboratórios para o filtro
  useEffect(() => {
    const fetchLaboratorios = async () => {
      try {
        const response = await api.get('/todoslab');
        if (response.data.sucesso) { setLaboratorios(response.data.dados); }
      } catch (error) { console.error("Falha ao buscar laboratórios:", error); }
    };
    fetchLaboratorios();
  }, []);

  // 4. Scroll para o topo ao mudar de página
  useEffect(() => {
    if (isInitialMount.current) { return; }
    produtosRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [paginaAtual]);

  // 5. Reseta paginação se aplicar filtros
  useEffect(() => {
    if (isInitialMount.current) { return; }
    setPaginaAtual(1);
  }, [laboratorioFiltro, ordenacao, debouncedBusca]);

  // 6. Trap de foco para acessibilidade em Modais
  const setupModalTrap = (isOpen, modalRefToFocus, openerRefToFocus) => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && isOpen) {
        if (modalAberto) handleFecharModal();
        if (mobileFiltersOpen) setMobileFiltersOpen(false);
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      setTimeout(() => modalRefToFocus.current?.focus(), 100);
    } else {
      window.removeEventListener('keydown', handleKeyDown);
      openerRefToFocus.current?.focus();
    }
    return () => { window.removeEventListener('keydown', handleKeyDown); };
  };
  useEffect(() => setupModalTrap(modalAberto, modalRef, openerRef), [modalAberto]);
  useEffect(() => setupModalTrap(mobileFiltersOpen, filterModalRef, openerRef), [mobileFiltersOpen]);

  // --- HANDLERS ---

  const handleBuscaSubmit = (event) => { event.preventDefault(); setDebouncedBusca(termoBusca); };
  
  // Abre detalhes e busca farmácias que vendem o produto
  const handleAbrirDetalhes = async (medicamento) => {
    openerRef.current = document.activeElement;
    setMedicamentoSelecionado(medicamento);
    setModalAberto(true);
    setLoadingModal(true);
    setFarmacias([]);
    setIsDescricaoExpanded(false);
    try {
      const response = await api.get(`/medicamentos/${medicamento.med_id}/farmacias`);
      let farmaciasEncontradas = response.data.sucesso ? response.data.dados : [];
      
      // Calcula preço final e ordena
      farmaciasEncontradas = farmaciasEncontradas.map(f => ({
        ...f,
        precoFinal: calcularPrecoComDesconto(f.preco, f.promo_desconto)
      })).sort((a, b) => a.precoFinal - b.precoFinal);
      
      setFarmacias(farmaciasEncontradas);
    } catch (error) {
      console.error("Erro ao buscar farmácias:", error);
    } finally {
      setLoadingModal(false);
    }
  };

  const handleFecharModal = () => { setModalAberto(false); setTimeout(() => setMedicamentoSelecionado(null), 300); };
  const handleRemoveBusca = () => { setTermoBusca(''); setDebouncedBusca(''); };
  const handleRemoveLab = () => setLaboratorioFiltro('');
  const handleRemoveSort = () => setOrdenacao('');
  const handleLimparFiltros = () => { handleRemoveBusca(); handleRemoveLab(); handleRemoveSort(); setPaginaAtual(1); };
  const handlePaginaAnterior = () => setPaginaAtual(p => Math.max(p - 1, 1));
  const handleProximaPagina = () => setPaginaAtual(p => Math.min(p + 1, totalPaginas));
  const handleMudarPagina = (numeroPagina) => setPaginaAtual(numeroPagina);
  const paginasParaMostrar = gerarNumerosPaginacao(paginaAtual, totalPaginas);

  const filtrosAtivos = Boolean(laboratorioFiltro || ordenacao || debouncedBusca);
  const selectedLabName = laboratorios.find(lab => lab.lab_id.toString() === laboratorioFiltro)?.lab_nome;
  const selectedSortName = ORDENACAO_MAP[ordenacao];

  // Componente de Estado Vazio
  const EmptyState = () => (
    <div className={style.emptyStateContainer}>
      <IconSearchEmpty />
      <h4 className={style.emptyStateTitle}>Nenhum medicamento encontrado</h4>
      <p className={style.emptyStateMessage}>{filtrosAtivos ? "Tente ajustar ou limpar os filtros para ver mais resultados." : "Tente usar a barra de busca para encontrar o que precisa."}</p>
    </div>
  );

  // Componente de Controles de Filtro
  const FilterControls = () => (
    <>
      <div className={style.filterGroup}>
        <span className={style.filterLabel}><IconFilter />Filtrar por:</span>
        <select value={laboratorioFiltro} onChange={(e) => setLaboratorioFiltro(e.target.value)} aria-label="Filtrar por laboratório" disabled={loading}>
          <option value="">Todos os Laboratórios</option>
          {laboratorios.map(lab => (<option key={lab.lab_id} value={lab.lab_id}>{lab.lab_nome}</option>))}
        </select>
      </div>
      <div className={style.filterGroup}>
        <span className={style.filterLabel}><IconSort />Ordenar por:</span>
        <select value={ordenacao} onChange={(e) => setOrdenacao(e.target.value)} aria-label="Ordenar por" disabled={loading}>
          <option value="">Ordenar por...</option>
          <option value="preco_asc">Menor Preço</option>
          <option value="preco_desc">Maior Preço</option>
        </select>
      </div>
    </>
  );

  const animationKey = `page-${paginaAtual}-lab-${laboratorioFiltro}-sort-${ordenacao}-search-${debouncedBusca}`;

  // Lógica de truncar descrição longa no modal
  const DESCRICAO_CURTA_LIMITE = 200;
  let descricao = "";
  let temDescricao = false;
  let descricaoLonga = false;
  let textoDescricao = "";

  if (medicamentoSelecionado) {
    descricao = medicamentoSelecionado.med_descricao;
    temDescricao = descricao && descricao.length > 0;
    descricaoLonga = temDescricao && descricao.length > DESCRICAO_CURTA_LIMITE;
    textoDescricao = isDescricaoExpanded ? descricao : (descricaoLonga ? `${descricao.substring(0, DESCRICAO_CURTA_LIMITE)}...` : descricao);
  }

  // --- RENDERIZAÇÃO ---
  return (
    <div className={style.container}>
      {/* Hero Section */}
      <section className={style.principal}>
        <h2>Sua saúde em primeiro lugar</h2>
        <p>Encontre os medicamentos que precisa com praticidade e confiança</p>
        <form className={style.caixaBusca} onSubmit={handleBuscaSubmit}>
          <input type="text" placeholder="Buscar por nome, laboratório..." value={termoBusca} onChange={(e) => setTermoBusca(e.target.value)} aria-label="Buscar medicamentos" disabled={loading} />
          <button type="submit" aria-label="Buscar" disabled={loading}><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" /></svg></button>
        </form>
      </section>

      <Slider imagens={imagens} />

      {/* Lista de Produtos */}
      <section className={style.produtos} ref={produtosRef}>

        {/* Barra de Ferramentas: Filtros, View Toggle */}
        <div className={style.filtrosContainer}><FilterControls /></div>
        <div className={style.mobileFilterButtonContainer}>
          <button className={style.mobileFilterButton} onClick={() => { openerRef.current = document.activeElement; setMobileFiltersOpen(true); }} disabled={loading}>
            <IconFilter /> Filtrar e Ordenar
            {filtrosAtivos && <span className={style.mobileFilterDot}></span>}
          </button>
        </div>
        <div className={style.viewToggleContainer}>
          <button className={`${style.viewToggleButton} ${viewMode === 'grid' ? style.viewToggleActive : ''}`} onClick={() => setViewMode('grid')} aria-label="Visualizar em grade" disabled={loading}><IconGrid /></button>
          <button className={`${style.viewToggleButton} ${viewMode === 'list' ? style.viewToggleActive : ''}`} onClick={() => setViewMode('list')} aria-label="Visualizar em lista" disabled={loading}><IconList /></button>
        </div>
        
        {/* Chips de filtros ativos */}
        {filtrosAtivos && (
          <div className={style.activeFiltersContainer}>
            {debouncedBusca && (<span className={style.filterChip}>Busca: "{debouncedBusca}"<button onClick={handleRemoveBusca} aria-label="Remover filtro de busca">✕</button></span>)}
            {selectedLabName && (<span className={style.filterChip}>Lab: {selectedLabName}<button onClick={handleRemoveLab} aria-label={`Remover filtro de laboratório: ${selectedLabName}`}>✕</button></span>)}
            {selectedSortName && (<span className={style.filterChip}>Ordem: {selectedSortName}<button onClick={handleRemoveSort} aria-label={`Remover ordenação: ${selectedSortName}`}>✕</button></span>)}
            <button className={style.botaoLimparChips} onClick={handleLimparFiltros}>Limpar Tudo</button>
          </div>
        )}
        <div role="status" aria-live="polite" className={style.visuallyHidden}>{loading ? 'Carregando medicamentos...' : 'Medicamentos carregados.'}</div>

        {/* Renderização Condicional: Loading / Lista / Vazio */}
        <AnimatePresence mode="wait">
          {(loading && isInitialMount.current) || (loading && medicamentos.length === 0) ? (
            <motion.div key="skeleton" className={`${style.gradeProdutos} ${viewMode === 'list' ? style.gradeProdutosLista : ''}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {Array.from({ length: ITENS_POR_PAGINA }).map((_, index) => viewMode === 'grid' ? (<SkeletonCard key={index} />) : (<SkeletonCardList key={index} />))}
            </motion.div>
          ) : medicamentos.length > 0 ? (
            <motion.div key={animationKey} className={`${style.gradeProdutos} ${viewMode === 'list' ? style.gradeProdutosLista : ''}`} initial="hidden" animate="visible" exit="exit">
              {medicamentos.map((medicamento, index) => (<MotionCardProduto key={medicamento.medp_id} medicamento={medicamento} onVerDetalhes={() => handleAbrirDetalhes(medicamento)} animationDelay={index} />))}
            </motion.div>
          ) : (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><EmptyState /></motion.div>
          )}
        </AnimatePresence>

        {/* Paginação */}
        {totalPaginas > 1 && !loading && (
          <div className={style.paginacao}>
            <button onClick={handlePaginaAnterior} disabled={paginaAtual === 1} aria-label="Página anterior">Anterior</button>
            {paginasParaMostrar.map((numero, index) =>
              typeof numero === 'number' ? (
                <button key={index} onClick={() => handleMudarPagina(numero)} className={numero === paginaAtual ? style.paginaAtiva : ''} aria-label={`Ir para página ${numero}`}>{numero}</button>
              ) : (<span key={index} className={style.ellipsis}>...</span>)
            )}
            <button onClick={handleProximaPagina} disabled={paginaAtual === totalPaginas} aria-label="Próxima página">Próximo</button>
          </div>
        )}
      </section>

      {/* MODAL DE FILTROS (MOBILE) */}
      {mobileFiltersOpen && (
        <div className={style.modalOverlay} onClick={() => setMobileFiltersOpen(false)}>
          <div className={`${style.modal} ${style.filterModal}`} onClick={(e) => e.stopPropagation()} ref={filterModalRef} tabIndex={-1} aria-modal="true" role="dialog" aria-labelledby="filter-modal-titulo">
            <div className={style.modalHeader}>
              <h2 id="filter-modal-titulo" className={style.filterModalTitle}>Filtrar e Ordenar</h2>
              <button onClick={() => setMobileFiltersOpen(false)} className={style.modalClose} aria-label="Fechar">✕</button>
            </div>
            <div className={style.modalContent}>
              <div className={style.filterModalBody}><FilterControls /></div>
              <button className={style.filterModalApplyButton} onClick={() => setMobileFiltersOpen(false)}>Aplicar</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE DETALHES DO MEDICAMENTO */}
      {modalAberto && medicamentoSelecionado && (
        <div className={style.modalOverlay} onClick={handleFecharModal}>
          <div className={style.modal} onClick={(e) => e.stopPropagation()} ref={modalRef} tabIndex={-1} aria-modal="true" role="dialog" aria-labelledby="modal-titulo">
            <div className={style.modalHeader}>
              <div className={style.modalTitulo} id="modal-titulo">
                <h2>{medicamentoSelecionado.med_nome}</h2>
                <span className={style.modalDosagem}>{medicamentoSelecionado.med_dosagem}</span>
              </div>
              <button onClick={handleFecharModal} className={style.modalClose} aria-label="Fechar">✕</button>
            </div>
            <div className={style.modalContent}>
              <div className={style.detalhesContainer}>

                {/* Info Esquerda: Imagem e Atributos */}
                <div className={style.infoMedicamento}>
                  <img src={getImageUrl(medicamentoSelecionado.med_imagem)} alt={medicamentoSelecionado.med_nome} className={style.imagemModal} />

                  <div className={style.detalhesAtributos}>
                    <div className={style.atributoItem}>
                      <div className={style.atributoChave}>
                        <span className={style.atributoIcon}><IconFlask /></span>
                        <span className={style.atributoLabel}>Laboratório</span>
                      </div>
                      <span className={style.atributoValor}>{medicamentoSelecionado.lab_nome || "Não informado"}</span>
                    </div>
                    {/* Renderiza atributos opcionais (Tipo, Forma) se existirem */}
                    {medicamentoSelecionado.tipo_nome && medicamentoSelecionado.tipo_nome !== 'N/A' && (
                      <div className={style.atributoItem}>
                        <div className={style.atributoChave}>
                          <span className={style.atributoIcon}><IconTagAlt /></span>
                          <span className={style.atributoLabel}>Tipo</span>
                        </div>
                        <span className={style.atributoValor}>{medicamentoSelecionado.tipo_nome}</span>
                      </div>
                    )}
                    {medicamentoSelecionado.forma_nome && medicamentoSelecionado.forma_nome !== 'N/A' && (
                      <div className={style.atributoItem}>
                        <div className={style.atributoChave}>
                          <span className={style.atributoIcon}><IconPill /></span>
                          <span className={style.atributoLabel}>Forma</span>
                        </div>
                        <span className={style.atributoValor}>{medicamentoSelecionado.forma_nome}</span>
                      </div>
                    )}
                  </div>

                  <div className={style.infoDescricao}>
                    <h4>Descrição</h4>
                    {temDescricao ? (
                      <p>{textoDescricao}</p>
                    ) : (
                      <p className={style.descricaoVazia}>Nenhuma descrição disponível.</p>
                    )}
                    {descricaoLonga && (
                      <button onClick={() => setIsDescricaoExpanded(!isDescricaoExpanded)} className={style.lerMaisButton}>
                        {isDescricaoExpanded ? 'Ler menos' : 'Ler mais'}
                      </button>
                    )}
                  </div>
                </div>

                {/* Info Direita: Lista de Farmácias (Comparador) */}
                <div className={style.listaFarmacias}>
                  <h4>Encontre pelo melhor preço:</h4>

                  <AnimatePresence mode="wait">
                    {loadingModal ? (
                      <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <div className={style.modalLoader}><div className={style.spinner}></div><span>Buscando farmácias...</span></div>
                      </motion.div>
                    ) : farmacias.length > 0 ? (
                      <motion.div
                        key="farmacias-list"
                        variants={listContainerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        className={style.farmaciaListContainer}
                      >
                        {farmacias.map((farmacia, index) => (
                          <FarmaciaItem
                            key={farmacia.farm_id}
                            farmacia={farmacia}
                            index={index}
                          />
                        ))}
                      </motion.div>
                    ) : (
                      <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <ModalEmptyState />
                      </motion.div>
                    )}
                  </AnimatePresence>

                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}