// É necessário marcar o componente como um Client Component para usar Hooks como useState e useEffect
'use client' 

// Passo 1: Importar o que será usado
import Image from "next/image";
import { useState, useEffect } from 'react'; // [cite: 122]
import api from '../services/api'; // Importando a instância do Axios [cite: 129]
import style from "./page.module.css";
import Slider from "../componentes/slider";

export default function PaginaInicial() {
  const imagens = ["/LogoEscrita.png", "/LogoEscrita.png", "/LogoEscrita.png"];

  // Passo 2: Criar o estado para armazenar os medicamentos
  const [medicamentos, setMedicamentos] = useState([]); 

  // Passo 3: Criar a função para buscar os dados da API
  async function fetchMedicamentos() { 
    try {
      // Faz a requisição GET para a rota definida no back-end (medicamentos.js)
      const response = await api.get('/medicamentos'); 
      
      // Verifica se a requisição foi bem-sucedida e atualiza o estado
      if (response.data.sucesso) { 
        setMedicamentos(response.data.dados); // 'dados' é o array de medicamentos na sua API [cite: 139]
      } else {
        console.error("Erro ao buscar medicamentos:", response.data.mensagem);
      }
    } catch (error) { 
      // Trata possíveis erros de rede ou da API
      if (error.response) { 
        alert(error.response.data.mensagem + '\n' + error.response.data.dados); 
      } else {
        alert('Erro na conexão com o servidor.' + '\n' + error); 
      }
    }
  };

  // Passo 4: Chamar a função de busca quando o componente carregar
  useEffect(() => { 
    fetchMedicamentos(); 
  }, []); // O array vazio garante que isso execute apenas uma vez [cite: 185]

  return (
    <div className={style.container}>
      <section className={style.principal}>
        <div className={style.conteudoPrincipal}>
          <h2>Sua saúde em primeiro lugar</h2>
          <p>
            Encontre os medicamentos que precisa com praticidade e confiança
          </p>
          <div className={style.caixaBusca}>
            <input type="text" placeholder="Buscar medicamentos..." />
            <button>Buscar</button>
          </div>
        </div>
      </section>

      <Slider imagens={imagens} />

      <section className={style.produtos}>
        <h3>Destaques</h3>
        <div className={style.gradeProdutos}>
          {/* Passo 5: Mapear o estado 'medicamentos' para renderizar os produtos dinamicamente */}
          {medicamentos.length > 0 ? (
            medicamentos.map((medicamento) => (
              <div className={style.cartaoProduto} key={medicamento.med_id}>
                <div className={style.containerImagemProduto}>
                  <Image
                    // Assumindo que 'med_imagem' contém o caminho da imagem
                    src={medicamento.med_imagem || "/paracetamol.jpg"} // Usa uma imagem padrão se não houver
                    width={200}
                    height={200}
                    alt={medicamento.med_nome}
                    className={style.imagemProduto}
                  />
                </div>
                <h4>{medicamento.med_nome}</h4>
                <p>{medicamento.med_descricao || 'Descrição não disponível'}</p>
                {/* Formatando o preço para o padrão brasileiro */}
                <span className={style.preco}>
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(medicamento.medp_preco)}
                </span>
                <button>Adicionar ao Carrinho</button>
              </div>
            ))
          ) : (
            // Mensagem exibida enquanto os dados não são carregados ou se não houver produtos [cite: 190]
            <p>Carregando medicamentos...</p>
          )}
        </div>
      </section>
    </div>
  );
}