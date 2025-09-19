import styles from './index.module.css';
import medicamentosMockup from '../mockup/medicamentosHome';
import Card from './index.module.css';

export default function MedicamentosHome() {
  // console.log(medicamentosMockup); // Para visualizar os dados no console

  return (
    <div className={styles.medicamentosContainer}>
      <h2 className={styles.titulo}>Medicamentos em Destaque</h2>
      <div className={styles.medicamentosGrid}>
        {medicamentosMockup.map(medicamento => (
          <Card key={medicamento.id} medicamento={medicamento} />
        ))}
      </div>
    </div>
  );
}