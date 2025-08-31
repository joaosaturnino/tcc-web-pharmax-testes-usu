
import styles from './index.module.css';

export default function Botao({label, acao}) {
    return (
        <div 
            className={styles.containerBotao}
            onClick={() => acao()}
        >
            <label className={styles.txtBotao}>
                {label}
            </label>
        </div>
    );
}