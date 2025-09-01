import Image from "next/image";
import Link from "next/link";
import style from "./page.module.css";
// import Slider from './componentes/slider'; // Importe o componente Slider
import Slider from "../componentes/slider";

export default function PaginaInicial() {
  // Array de imagens para o carrossel
  const imagens = ["/LogoEscrita.png", "/LogoEscrita.png", "/LogoEscrita.png"];

  return (
    <div className={style.container}>
      {/* Seção principal com mensagem e busca */}
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

      {/* Carrossel de imagens acima dos produtos em destaque */}
      <Slider imagens={imagens} />

      <section className={style.produtos}>
        <h3>Medicamentos em Destaque</h3>
        <div className={style.gradeProdutos}>
          <div className={style.cartaoProduto}>
            <div className={style.containerImagemProduto}>
              <Image
                src={"/paracetamol.jpg"}
                width={200}
                height={200}
                alt="paracetamol"
                className={style.imagemProduto}
              />
            </div>
            <h4>Paracetamol</h4>
            <p>Analgésico e antitérmico</p>
            <span className={style.preco}>R$ 12,90</span>
            <button>Adicionar ao Carrinho</button>
          </div>
          <div className={style.cartaoProduto}>
            <div className={style.containerImagemProduto}>
              <Image
                src={"/omeprazol.jpg"}
                width={200}
                height={200}
                alt="omeprazol"
                className={style.imagemProduto}
              />
            </div>
            <h4>Omeprazol</h4>
            <p>Protetor gástrico</p>
            <span className={style.preco}>R$ 15,50</span>
            <button>Adicionar ao Carrinho</button>
          </div>
          <div className={style.cartaoProduto}>
            <div className={style.containerImagemProduto}>
              <Image
                src={"/dipirona.jpg"}
                width={200}
                height={200}
                alt="dipirona"
                className={style.imagemProduto}
              />
            </div>
            <h4>Dipirona</h4>
            <p>Analgésico e antitérmico</p>
            <span className={style.preco}>R$ 8,90</span>
            <button>Adicionar ao Carrinho</button>
          </div>
          <div className={style.cartaoProduto}>
            <div className={style.containerImagemProduto}>
              <Image
                src={"/paracetamol.jpg"}
                width={200}
                height={200}
                alt="paracetamol"
                className={style.imagemProduto}
              />
            </div>
            <h4>Paracetamol</h4>
            <p>Analgésico e antitérmico</p>
            <span className={style.preco}>R$ 12,90</span>
            <button>Adicionar ao Carrinho</button>
          </div>
          <div className={style.cartaoProduto}>
            <div className={style.containerImagemProduto}>
              <Image
                src={"/omeprazol.jpg"}
                width={200}
                height={200}
                alt="omeprazol"
                className={style.imagemProduto}
              />
            </div>
            <h4>Omeprazol</h4>
            <p>Protetor gástrico</p>
            <span className={style.preco}>R$ 15,50</span>
            <button>Adicionar ao Carrinho</button>
          </div>
          <div className={style.cartaoProduto}>
            <div className={style.containerImagemProduto}>
              <Image
                src={"/dipirona.jpg"}
                width={200}
                height={200}
                alt="dipirona"
                className={style.imagemProduto}
              />
            </div>
            <h4>Dipirona</h4>
            <p>Analgésico e antitérmico</p>
            <span className={style.preco}>R$ 8,90</span>
            <button>Adicionar ao Carrinho</button>
          </div>
          <div className={style.cartaoProduto}>
            <div className={style.containerImagemProduto}>
              <Image
                src={"/omeprazol.jpg"}
                width={200}
                height={200}
                alt="omeprazol"
                className={style.imagemProduto}
              />
            </div>
            <h4>Omeprazol</h4>
            <p>Protetor gástrico</p>
            <span className={style.preco}>R$ 15,50</span>
            <button>Adicionar ao Carrinho</button>
          </div>
          <div className={style.cartaoProduto}>
            <div className={style.containerImagemProduto}>
              <Image
                src={"/dipirona.jpg"}
                width={200}
                height={200}
                alt="dipirona"
                className={style.imagemProduto}
              />
            </div>
            <h4>Dipirona</h4>
            <p>Analgésico e antitérmico</p>
            <span className={style.preco}>R$ 8,90</span>
            <button>Adicionar ao Carrinho</button>
          </div>
          <div className={style.cartaoProduto}>
            <div className={style.containerImagemProduto}>
              <Image
                src={"/omeprazol.jpg"}
                width={200}
                height={200}
                alt="omeprazol"
                className={style.imagemProduto}
              />
            </div>
            <h4>Omeprazol</h4>
            <p>Protetor gástrico</p>
            <span className={style.preco}>R$ 15,50</span>
            <button>Adicionar ao Carrinho</button>
          </div>
          <div className={style.cartaoProduto}>
            <div className={style.containerImagemProduto}>
              <Image
                src={"/dipirona.jpg"}
                width={200}
                height={200}
                alt="dipirona"
                className={style.imagemProduto}
              />
            </div>
            <h4>Dipirona</h4>
            <p>Analgésico e antitérmico</p>
            <span className={style.preco}>R$ 8,90</span>
            <button>Adicionar ao Carrinho</button>
          </div>
          <div className={style.cartaoProduto}>
            <div className={style.containerImagemProduto}>
              <Image
                src={"/omeprazol.jpg"}
                width={200}
                height={200}
                alt="omeprazol"
                className={style.imagemProduto}
              />
            </div>
            <h4>Omeprazol</h4>
            <p>Protetor gástrico</p>
            <span className={style.preco}>R$ 15,50</span>
            <button>Adicionar ao Carrinho</button>
          </div>
          <div className={style.cartaoProduto}>
            <div className={style.containerImagemProduto}>
              <Image
                src={"/dipirona.jpg"}
                width={200}
                height={200}
                alt="dipirona"
                className={style.imagemProduto}
              />
            </div>
            <h4>Dipirona</h4>
            <p>Analgésico e antitérmico</p>
            <span className={style.preco}>R$ 8,90</span>
            <button>Adicionar ao Carrinho</button>
          </div>
        </div>
      </section>
    </div>
  );
}
