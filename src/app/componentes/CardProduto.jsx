import Image from 'next/image';
import style from '../home/page.module.css'; // Reutilizando o mesmo CSS module

export default function CardProduto({ medicamento, onAddToCart }) {
  // Formata o preço para o padrão brasileiro (BRL)
  const precoFormatado = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(medicamento.medp_preco);

  return (
    <div className={style.cartaoProduto}>
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
      <div className={style.infoProduto}>
        <h4>{medicamento.med_nome}</h4>
        <p>{medicamento.med_descricao || 'Descrição não disponível'}</p>
        <span className={style.preco}>
          {precoFormatado}
        </span>
      </div>
      <button onClick={onAddToCart}>
        Adicionar ao Carrinho
      </button>
    </div>
  );
}