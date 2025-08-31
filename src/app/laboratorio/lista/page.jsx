"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "../laboratorio.module.css";

export default function ListaLaboratorios() {
  const [laboratorios, setLaboratorios] = useState([]);

  useEffect(() => {
    // Mock de dados (substituir por chamada API depois)
    const mockLabs = [
      { id: 1, nome: "LabVida", endereco: "Rua A, 123", telefone: "11 9999-9999" },
      { id: 2, nome: "BioPharma", endereco: "Av. B, 456", telefone: "21 9888-8888" },
      { id: 3, nome: "PharmaTech", endereco: "Rua C, 789", telefone: "31 9777-7777" }
    ];
    setLaboratorios(mockLabs);
  }, []);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.titulo}>📋 Laboratórios</h1>
        <Link href="/laboratorio/cadastro" className={styles.botaoPrincipal}>
          ➕ Novo Laboratório
        </Link>
      </header>

      <div className={styles.grid}>
        {laboratorios.map((lab) => (
          <div key={lab.id} className={styles.card}>
            <h2>{lab.nome}</h2>
            <p><span>📍 Endereço:</span> {lab.endereco}</p>
            <p><span>📞 Telefone:</span> {lab.telefone}</p>

            <div className={styles.acoes}>
              <Link
                href={`/laboratorio/cadastro/editar/${lab.id}`}
                className={styles.botaoSecundario}
              >
                ✏️ Editar
              </Link>
              <button
                className={styles.botaoExcluir}
                onClick={() => alert(`Excluir laboratório ${lab.nome}`)}
              >
                🗑️ Excluir
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
