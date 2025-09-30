// É necessário marcar o componente como um Client Component para usar Hooks
'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Hook para redirecionamento
import Image from "next/image";
import api from '../services/api';
import style from "./page.module.css";
import Slider from "../componentes/slider";
import CardProduto from "../componentes/CardProduto";

export default function PaginaInicial() {
  const router = useRouter(); // Instancia o hook de roteamento
  const imagens = ["/LogoEscrita.png", "/LogoEscrita.png", "/LogoEscrita.png"];

  const [medicamentosDestaque, setMedicamentosDestaque] = useState([]);
  const [loading, setLoading] = useState(true);
  const [termoBusca, setTermoBusca] = useState(''); // Estado para controlar o input de busca

  // Busca apenas alguns medicamentos para exibir como destaque
  async function fetchDestaques() {
    setLoading(true);
    try {
      const response = await api.get('/medicamentos');
      if (response.data.sucesso) {
        // Pega apenas os 4 primeiros como "destaques"
        setMedicamentosDestaque(response.data.dados.slice(0, 4));
      }
    } catch (error) {
      console.error("Falha ao buscar destaques:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDestaques();
  }, []);

  // Função para lidar com o envio da busca
  const handleSearchSubmit = (event) => {
    event.preventDefault(); // Previne o recarregamento da página
    if (!termoBusca.trim()) return; // Não faz nada se a busca estiver vazia

    // Redireciona para a página de busca com o termo como query param
    router.push(`/busca?q=${encodeURIComponent(termoBusca)}`);
  };

  return (
    <div className={style.container}>
      <section className={style.principal}>
        <div className={style.conteudoPrincipal}>
          <h2>Sua saúde em primeiro lugar</h2>
          <p>
            Encontre os medicamentos que precisa com praticidade e confiança
          </p>
          {/* Formulário de busca que agora redireciona */}
          <form className={style.caixaBusca} onSubmit={handleSearchSubmit}>
            <input
              type="text"
              placeholder="Buscar medicamentos..."
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
            />
            <button type="submit">Buscar</button>
          </form>
        </div>
      </section>

      <Slider imagens={imagens} />

      <section className={style.produtos}>
        <h3>Destaques</h3>
        <div className={style.gradeProdutos}>
          {loading ? (
            <p>Carregando...</p>
          ) : (
            medicamentosDestaque.map((medicamento) => (
              <CardProduto
                key={medicamento.med_id}
                medicamento={medicamento}
                onAddToCart={() => alert(`${medicamento.med_nome} adicionado!`)}
              />
            ))
          )}
        </div>
      </section>
    </div>
  );
}