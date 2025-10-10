"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from 'react';
import styles from "./page.module.css";
import api from "../services/api";

const SkeletonCard = () => (
    <div className={`${styles.cardMedicamento} ${styles.skeleton}`}>
      <div className={styles.imagemContainer}><div className={styles.skeletonImage} /></div>
      <div className={styles.infoMedicamento}>
        <div className={styles.skeletonText} style={{ width: "70%" }} />
        <div className={styles.skeletonText} style={{ width: "40%" }} />
        <div className={styles.skeletonText} style={{ width: "90%", height: "40px" }} />
      </div>
      <div className={styles.precoContainer}><div className={styles.skeletonText} style={{ width: "80px", height: "30px" }} /></div>
    </div>
);

export default function Resultados() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("q") || "";

  const [termoBusca, setTermoBusca] = useState(query);
  const [medicamentos, setMedicamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMedicamentos = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get('/paginado', {
          params: {
            search: query 
          }
        });
        
        if (response.data.sucesso) {
          setMedicamentos(response.data.dados);
        } else {
          setError(response.data.mensagem);
        }
        
      } catch (err) {
        if (err.response) {
            if (err.response.status === 404) {
                 setError("Erro: A rota da API não foi encontrada. Verifique a URL.");
            } else {
                 setError(err.response.data.mensagem || "Erro ao buscar dados.");
            }
        } else {
            setError("Não foi possível conectar à API. Verifique sua rede e se o servidor back-end está rodando.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMedicamentos();
  }, [query]);

  const handleNovaBusca = (e) => {
    e.preventDefault();
    router.push(`/resultados?q=${termoBusca}`);
  };
  
  const renderContent = () => {
    if (loading) {
      return Array.from({ length: 5 }).map((_, index) => <SkeletonCard key={index} />);
    }

    if (error) {
      return (
        <div className={styles.semResultados}>
          <h3>Ocorreu um erro</h3>
          <p>{error}</p>
        </div>
      );
    }

    if (medicamentos.length === 0) {
      return (
        <div className={styles.semResultados}>
          <Image src="/file.svg" alt="Nenhum resultado" width={100} height={100} />
          <h3>Nenhum medicamento encontrado</h3>
          <p>Tente ajustar os termos da sua busca ou explorar nossas categorias.</p>
          <Link href="/" className={styles.botaoVoltar}>Voltar para a página inicial</Link>
        </div>
      );
    }
    
    return medicamentos.map((medicamento) => (
      <div key={medicamento.id} className={styles.cardMedicamento}>
        <div className={styles.imagemContainer}>
          <Image
            src={medicamento.imagem}
            alt={medicamento.nome}
            width={120}
            height={120}
            className={styles.imagemMedicamento}
          />
          {!medicamento.emEstoque && (
            <div className={styles.esgotado}>Indisponível</div>
          )}
        </div>
        <div className={styles.infoMedicamento}>
          <h3>{medicamento.nome}</h3>
          <p className={styles.laboratorio}>{medicamento.laboratorio}</p>
          <p className={styles.descricao}>{medicamento.descricao}</p>
          <div className={styles.tags}>
            <span className={styles.categoria}>{medicamento.categoria}</span>
            {medicamento.necessitaReceita && (
              <span className={styles.avisoReceita}>Receita Obrigatória</span>
            )}
          </div>
        </div>
        <div className={styles.precoContainer}>
          {medicamento.preco > 0 ? (
             <span className={styles.preco}>
                {medicamento.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </span>
          ) : (
            <span className={styles.precoIndisponivel}>Preço sob consulta</span>
          )}
          <button className={styles.botaoAdicionar} disabled={!medicamento.emEstoque}>
            Ver Ofertas
          </button>
        </div>
      </div>
    ));
  };

  return (
    <div className={styles.container}>
      <header className={styles.cabecalho}>
        <Link href="/" className={styles.logoLink}><h1>Pharma-Ex</h1></Link>
        <form className={styles.caixaBusca} onSubmit={handleNovaBusca}>
          <input
            type="text"
            name="busca"
            placeholder="Buscar por nome, laboratório ou categoria..."
            value={termoBusca}
            onChange={(e) => setTermoBusca(e.target.value)}
          />
          <button type="submit">Buscar</button>
        </form>
        <Link href="/" className={styles.voltarLink}>← Voltar à Home</Link>
      </header>
      <main className={styles.main}>
        <div className={styles.infoResultados}>
          <h2>Resultados da busca</h2>
          {!loading && (
            <p>
              {medicamentos.length} medicamento(s) encontrado(s)
              {query && ` para "${query}"`}
            </p>
          )}
        </div>
        <div className={styles.listaResultados}>
          {renderContent()}
        </div>
      </main>
    </div>
  );
}