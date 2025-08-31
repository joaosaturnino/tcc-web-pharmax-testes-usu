import Image from 'next/image';
import styles from './index.module.css';

export default function ProdutosHome() {
    return (
        <div className={styles.produtos}>

            <div className={styles.card}>
                <div className={styles.imagemContainer}>
                    <Image
                        src='/temp/hamburger-bacon.jpg'
                        alt='Hamburguer Bacon'
                        width={200}
                        height={200}
                        className={styles.imagemProduto}
                    />
                </div>
                <span className={styles.produtoNome}>Hamburguer de Bacon</span>
                <span className={styles.produtoValor}>R$ 29,99</span>
            </div>

            <div className={styles.card}>
                <div className={styles.imagemContainer}>
                    <Image
                        src='/temp/hamburger-batata.jpg'
                        alt='Hamburguer com Batata'
                        width={200}
                        height={200}
                        className={styles.imagemProduto}
                    />
                </div>
                <span className={styles.produtoNome}>Hamburguer com Batata</span>
                <span className={styles.produtoValor}>R$ 49,99</span>
            </div>

            <div className={styles.card}>
                <div className={styles.imagemContainer}>
                    <Image
                        src='/temp/suco-laranja.jpg'
                        alt='Suco de Laranja'
                        width={200}
                        height={200}
                        className={styles.imagemProduto}
                    />
                </div>
                <span className={styles.produtoNome}>Suco de Laranja</span>
                <span className={styles.produtoValor}>R$ 14,00</span>
            </div>

            <div className={styles.card}>
                <div className={styles.imagemContainer}>
                    <Image
                        src='/temp/sorvete.jpg'
                        alt='Sorvete de Morango'
                        width={200}
                        height={200}
                        className={styles.imagemProduto}
                    />
                </div>
                <span className={styles.produtoNome}>Sorvete de Morango</span>
                <span className={styles.produtoValor}>R$ 17,50</span>
            </div>

        </div>
    );
}

