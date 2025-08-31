"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../../../app/medicamentos/cadastro/cadastro.module.css";
// import Cabecalho from "./componentes/cabecalho";

const imagemPadrao = "https://www.institutoaron.com.br/static/img/large/c28a030a59bae1283321c340cdc846df.webp";

// Util para formatar preço em BRL com fallback seguro
const currency =
  typeof Intl !== "undefined"
    ? new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" })
    : { format: (v) => `R$ ${Number(v).toFixed(2)}` };

    

const medicamentosIniciais = [
  {
    id: 1,
    nome: "Paracetamol",
    dosagem: "500mg",
    quantidade: 20,
    tipo: "Genérico",
    forma: "Comprimido",
    descricao: "Analgésico e antitérmico.",
    laboratorio: "EMS",
    preco: 12.5, // <-- ADICIONADO
    imagem: "",
  },
  {
    id: 2,
    nome: "Dipirona",
    dosagem: "1g",
    quantidade: 10,
    tipo: "Similar",
    forma: "Comprimido",
    descricao: "Analgésico e antitérmico.",
    laboratorio: "Neo Química",
    preco: 8.9, // <-- ADICIONADO
    imagem:
      "",
  },
];

function ListagemMedicamentos() {
  const [medicamentos, setMedicamentos] = useState(medicamentosIniciais);
  const router = useRouter();

  const handleExcluir = (id) => {
    if (window.confirm("Tem certeza que deseja excluir este medicamento?")) {
      setMedicamentos(medicamentos.filter((med) => med.id !== id));
    }
  };

  const handleEditar = (id) => {
    router.push(`/produtos/medicamentos/editar/${id}`);
  };

  return (

    
    <div className={styles.containermed}>
      
      <h1 className={styles.titulo}>Painel de Controle</h1>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <Link
          href="../../farmacias/cadastro/funcionario"
          className={styles.bottao}
          style={{ maxWidth: 200, textAlign: "center" }}
        >
          + Novo Funcionario
        </Link>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <Link
          href="/medicamentos/cadastro"
          className={styles.bottao}
          style={{ maxWidth: 200, textAlign: "center" }}
        >
          + Novo Medicamento
        </Link>
        
      </div>
      {medicamentos.length === 0 ? (
        <p style={{ textAlign: "center" }}>Nenhum medicamento cadastrado.</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table className={styles.tabela}>
            <thead>
              <tr>
                <th>Imagem</th>
                <th>Nome</th>
                <th>Dosagem</th>
                <th>Quantidade</th>
                <th>Preço</th>
                <th>Tipo</th>
                <th>Forma</th>
                <th>Laboratório</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {medicamentos.map((med) => (
                <tr key={med.id}>
                  <td>
                    <img
                      src={med.imagem || imagemPadrao}
                      alt={med.nome}
                      style={{
                        width: 60,
                        height: 60,
                        objectFit: "cover",
                        borderRadius: 8,
                        border: "1px solid #eee",
                      }}
                    />
                  </td>
                  <td>{med.nome}</td>
                  <td>{med.dosagem}</td>
                  <td>{med.quantidade}</td>
                  <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                    {currency.format(Number(med.preco ?? 0))}
                  </td>
                  <td>{med.tipo}</td>
                  <td>{med.forma}</td>
                  <td>{med.laboratorio}</td>

                  <td>
                    <button
                      className={styles.botao}
                      style={{ marginRight: 8, background: "#CDCD00" }}
                      title="Editar"
                      onClick={() => handleEditar(med.id)}
                    >
                      Editar
                    </button>
                    <button
                      className={styles.botao}
                      style={{ background: "#e53935" }}
                      title="Excluir"
                      onClick={() => handleExcluir(med.id)}
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ListagemMedicamentos;
