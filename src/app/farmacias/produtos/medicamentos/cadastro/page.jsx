'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './cadastro.module.css';

function CadastroMedicamento() {
  const [nome, setNome] = useState('');
  const [dosagem, setDosagem] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [tipo, setTipo] = useState('');
  const [forma, setForma] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [laboratorio, setLaboratorio] = useState('');
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aqui você pode adicionar a lógica para enviar os dados para o backend
    console.log({ nome, dosagem, preco, descricao, quantidade, tipo, forma, laboratorio });
    
    // Redireciona para a página de listagem de medicamentos após o cadastro
    router.push('/produtos/medicamentos');
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.titulo}>Cadastro de Medicamentos</h1>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="nome">Nome do Medicamento:</label>
          <input
            className={styles.input}
            type="text"
            id="nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="dosagem">Dosagem:</label>
          <input
            className={styles.input}
            type="text"
            id="dosagem"
            value={dosagem}
            onChange={(e) => setDosagem(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="quantidade">Quantidade:</label>
          <input
            className={styles.input}
            id="quantidade"
            value={quantidade}
            onChange={(e) => setQuantidade(e.target.value)}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="preco">Preço (R$):</label>
          <input
            className={styles.input}
            type="number"
            id="preco"
            name="preco"
            value={preco}
            onChange={(e) => setPreco(e.target.value)}
            min="0"
            step="0.01"
            required
          />
        </div>
        <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="tipo">Tipo de Produto</label>
            <select
              id="tipo"
              name="tipo"
              required
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
            >
              <option value="">Selecione o tipo</option>
              <option value="1">Alopático</option>
              <option value="2">Fitoterápico</option>
              <option value="3">Genérico</option>
              <option value="4">Homeopático</option>
              <option value="5">Manipulado</option>
              <option value="6">Referência</option>
              <option value="7">Similar</option>
            </select>
        </div>

        <div className={styles.formGroup}>
         <label className={styles.label} htmlFor="forma">Forma Farmaceutica</label>
         <select
              id="forma"
              name="forma"
              required
              value={forma}
              onChange={(e) => setForma(e.target.value)}
            >
              <option value="">Selecione a forma</option>
              <option value="1">Comprimido</option>
              <option value="2">Cápsula</option>
              <option value="3">Pastilhas</option>
              <option value="4">Drágeas</option>
              <option value="5">Pós para Reconstituição</option>
              <option value="6">Gotas</option>
              <option value="7">Xarope</option>
              <option value="8">Solução Oral</option>
              <option value="9">Suspensão</option>
              <option value="10">Comprimidos Sublinguais</option>
              <option value="11">Soluções</option>
              <option value="12">Suspensões Injetáveis</option>
              <option value="13">Soluções Tópicas</option>
              <option value="14">Pomadas</option>
              <option value="15">Cremes</option>
              <option value="16">Loção</option>
              <option value="17">Gel</option>
              <option value="18">Adesivos</option>
              <option value="19">Spray</option>
              <option value="20">Gotas Nasais</option>
              <option value="21">Colírios</option>
              <option value="22">Pomadas Oftálmicas</option>
              <option value="23">Gotas Auriculares ou Otológicas</option>
              <option value="24">Pomadas Auriculares</option>
              <option value="25">Aerosol</option>
              <option value="26">Comprimidos Vaginais</option>
              <option value="27">Óvulos</option>
              <option value="28">Supositórios</option>
              <option value="29">Enemas</option>
            </select>
        </div>
        
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor ="laboratorio">Laboratório:</label>
          <select 
            id="laboratorio" 
            name="laboratorio" 
            required
            value={laboratorio}
            onChange={(e) => setLaboratorio(e.target.value)}
          >
              <option value="">Selecione o laboratório</option>
              <option value="1">Neo Química</option>
              <option value="2">EMS</option> 
              <option value="3">Eurofarma</option>
              <option value="4">Aché</option>
              <option value="5">União Química</option>
              <option value="6">Medley</option>
              <option value="7">Sanofi</option>
              <option value="8">Geolab</option>
              <option value="9">Merck</option>
              <option value="10">Legrand</option> 
              <option value="11">Natulab</option>
              <option value="12">Germed</option>
              <option value="13">Prati Donaduzzi</option>
              <option value="14">Biolab</option>
              <option value="15">Hipera CH</option>
              <option value="16">Sandoz</option>
              <option value="17">Med Química</option>
              <option value="18">Mantecorp Farmasa</option> 
          </select>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="descricao">Descrição:</label>
          <textarea
            className={styles.textarea}
            id="descricao"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            required
          ></textarea>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="imagem">Imagem:</label>
          <input type="file" id="imagem" name="imagem" accept="image/*" />
        </div>
        
        <button type="submit" className={styles.bottao}>Cadastrar</button>

        <button type="button" className={styles.bottao1} onClick={() => router.back()}>
          Cancelar
        </button>
      </form>
    </div>
  );
}

export default CadastroMedicamento;