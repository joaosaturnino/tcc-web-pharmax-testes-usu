'use client';


import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import styles from './page.module.css';


// Componente da página de resultados
export default function Resultados() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [termoBusca, setTermoBusca] = useState(query);
 
  // Dados de exemplo - em uma aplicação real, viriam da busca
  const todosMedicamentos = [
    {
      id: 1,
      nome: "Paracetamol 750mg",
      laboratorio: "Medley",
      descricao: "Analgésico e antitérmico. Alivia dores e reduz a febre.",
      preco: 8.90,
      imagem: "/paracetamol.jpg",
      categoria: "Analgésicos",
      necessitaReceita: false,
      emEstoque: true
    },
    {
      id: 2,
      nome: "Ibuprofeno 400mg",
      laboratorio: "Eurofarma",
      descricao: "Anti-inflamatório não esteroidal. Alivia dores e inflamações.",
      preco: 12.50,
      imagem: "/omeprazol.jpg",
      categoria: "Anti-inflamatórios",
      necessitaReceita: false,
      emEstoque: true
    },
    {
      id: 3,
      nome: "Omeprazol 20mg",
      laboratorio: "EMS",
      descricao: "Inibidor de bomba de prótons. Tratamento de gastrite e refluxo.",
      preco: 15.50,
      imagem: "/omeprazol.jpg",
      categoria: "Gastrointestinais",
      necessitaReceita: false,
      emEstoque: true
    },
    {
      id: 4,
      nome: "Dipirona Monoidratada 500mg",
      laboratorio: "Sanofi",
      descricao: "Analgésico e antitérmico. Alivia dores de intensidade moderada.",
      preco: 6.50,
      imagem: "/dipirona.jpg",
      categoria: "Analgésicos",
      necessitaReceita: false,
      emEstoque: true
    },
    {
      id: 5,
      nome: "Amoxicilina 500mg",
      laboratorio: "Neo Química",
      descricao: "Antibiótico de amplo espectro. Tratamento de infecções bacterianas.",
      preco: 24.90,
      imagem: "/paracetamol.jpg", // Imagem temporária
      categoria: "Antibióticos",
      necessitaReceita: true,
      emEstoque: true
    },
    {
      id: 6,
      nome: "Loratadina 10mg",
      laboratorio: "Aché",
      descricao: "Antialérgico. Alivia sintomas de rinite alérgica e urticária.",
      preco: 9.75,
      imagem: "/dipirona.jpg", // Imagem temporária
      categoria: "Antialérgicos",
      necessitaReceita: false,
      emEstoque: false
    }
  ];


  // Filtrar medicamentos baseado no termo de busca
  const medicamentosFiltrados = termoBusca
    ? todosMedicamentos.filter(med =>
        med.nome.toLowerCase().includes(termoBusca.toLowerCase()) ||
        med.descricao.toLowerCase().includes(termoBusca.toLowerCase()) ||
        med.categoria.toLowerCase().includes(termoBusca.toLowerCase()) ||
        med.laboratorio.toLowerCase().includes(termoBusca.toLowerCase())
      )
    : todosMedicamentos;


  const handleNovaBusca = (e) => {
    e.preventDefault();
    const input = e.target.elements.busca;
    setTermoBusca(input.value);
  };


  return (
    <div className={styles.container}>
      {/* Cabeçalho da página de resultados */}
      <header className={styles.cabecalho}>
        <Link href="/" className={styles.logoLink}>
          <h1></h1>
        </Link>
       
        {/* Campo de busca na página de resultados */}
        <form className={styles.caixaBusca} onSubmit={handleNovaBusca}>
          <input
            type="text"
            name="busca"
            placeholder="Buscar medicamentos..."
            defaultValue={termoBusca}
          />
          <button type="submit">Buscar</button>
        </form>
       
        <Link href="/" className={styles.voltarLink}>
          ← Voltar
        </Link>
      </header>


      {/* Conteúdo principal */}
      <main className={styles.main}>
        <div className={styles.infoResultados}>
          <h2>Resultados da busca</h2>
          <p>
            {medicamentosFiltrados.length} medicamento(s) encontrado(s)
            {termoBusca && ` para "${termoBusca}"`}
          </p>
        </div>


        {/* Lista de resultados */}
        <div className={styles.listaResultados}>
          {medicamentosFiltrados.length > 0 ? (
            medicamentosFiltrados.map(medicamento => (
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
                    <div className={styles.esgotado}>Esgotado</div>
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
                    {!medicamento.emEstoque && (
                      <span className={styles.indisponivel}>Indisponível</span>
                    )}
                  </div>
                </div>
               
                <div className={styles.precoContainer}>
                  <span className={styles.preco}>R$ {medicamento.preco.toFixed(2)}</span>
                  {/* Botão de adicionar ao carrinho removido */}
                </div>
              </div>
            ))
          ) : (
            <div className={styles.semResultados}>
              <Image
                src="/file.svg"
                alt="Nenhum resultado encontrado"
                width={100}
                height={100}
              />
              <h3>Nenhum medicamento encontrado</h3>
              <p>Tente ajustar os termos da sua busca ou explore nossas categorias.</p>
              <Link href="/" className={styles.botaoVoltar}>
                Voltar para a página inicial
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}



