// Arquivo: src/components/Slider/index.jsx
"use client"; // Indica que este é um componente client-side (necessário para hooks e bibliotecas interativas)
import Image from "next/image"; // Componente otimizado do Next.js
import { Carousel } from "react-responsive-carousel"; // Biblioteca externa do carrossel
import style from "./index.module.css"; // Estilos modulares
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Importa os estilos base do carrossel

/**
 * Componente Slider para exibir uma galeria de imagens promocionais.
 * @param {Array<string>} imagens Array de URLs das imagens.
 */
export default function Slider({ imagens }) {
  return (
    <Carousel
      showThumbs={false}   // Esconde as miniaturas de navegação
      infiniteLoop          // Permite que o carrossel reinicie após o último slide
      autoPlay              // Inicia a transição automática
      interval={5000}       // Intervalo de troca de slide (5 segundos)
      showStatus={false}    // Esconde o contador (ex: 1 de 5)
    >
      {imagens.map((src, idx) => (
        // O container do slide precisa de position: relative e height definido (veja o CSS)
        <div key={idx} className={style.slideContainer}>
          <Image
            src={src}
            alt={`Promoção ${idx + 1}`}
            fill // Propriedade 'fill' faz a imagem preencher todo o container pai
            style={{ objectFit: "cover" }} // Garante que a imagem cubra o espaço sem distorcer
            priority={idx === 0} // Carrega a primeira imagem com alta prioridade (melhora LCP)
            sizes="(max-width: 1200px) 100vw, 800px" // Informa ao navegador os tamanhos possíveis
          />
        </div>
      ))}
    </Carousel>
  );
}