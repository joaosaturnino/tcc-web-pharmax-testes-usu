"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from 'next/link';
import styles from "./edita.module.css";
import api from "../../../../../services/api";

export default function EditarMedicamento() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [medicamento, setMedicamento] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (id) {
      const fetchMedicamento = async () => {
        try {
          const userDataString = localStorage.getItem("userData");
          if (!userDataString) throw new Error("Usuário não autenticado. Faça o login.");
          
          const userData = JSON.parse(userDataString);
          // CORRIGIDO: A chave correta é 'id'. A inconsistência foi removida.
          const farmaciaId = userData.farm_id; 
          if (!farmaciaId) throw new Error("ID da farmácia não encontrado no seu login.");

          const response = await api.get(`/medicamentos/${id}?farmacia_id=${farmaciaId}`);
          
          if (response.data.sucesso) {
            setMedicamento(response.data.dados);
          } else {
            setError("Medicamento não encontrado ou não pertence a esta farmácia.");
          }
        } catch (err) {
          setError(err.response?.data?.mensagem || err.message || "Falha ao carregar os dados do medicamento.");
        } finally {
          setLoading(false);
        }
      };
      fetchMedicamento();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMedicamento(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
        const userDataString = localStorage.getItem("userData");
        if (!userDataString) throw new Error("Usuário não autenticado. Faça o login.");
        
        const userData = JSON.parse(userDataString);
        
        // Mantido o uso correto da chave 'id'.
        const farmaciaId = userData.id;
        if (!farmaciaId) throw new Error("ID da farmácia não encontrado para realizar a atualização.");
        
        const payload = {
            ...medicamento,
            farmacia_id: farmaciaId
        };
        
        const response = await api.put(`/medicamentos/${id}`, payload);
        if (response.data.sucesso) {
            setSuccess("Medicamento atualizado com sucesso!");
            setTimeout(() => router.push("/farmacias/produtos/medicamentos"), 1500);
        }
    } catch (err) {
      setError(err.response?.data?.mensagem || "Erro ao conectar com o servidor.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    router.push("/login");
  };

  if (loading) {
    return (
      <div className={styles.dashboard}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <span>Carregando dados do medicamento...</span>
        </div>
      </div>
    );
  }

  if (error && !medicamento) {
    return (
      <div className={styles.dashboard}>
        <div className={styles.loadingContainer}>
          <p style={{ color: 'red' }}>{error}</p>
          <button onClick={() => router.push("/farmacias/produtos/medicamentos")} className={styles.cancelButton}>Voltar</button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <button className={styles.menuToggle} onClick={() => setSidebarOpen(!sidebarOpen)}>
            ☰
          </button>
          <h1 className={styles.title}>Editar Medicamento</h1>
        </div>
      </header>
      <div className={styles.contentWrapper}>
        <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ""}`}>
          <div className={styles.sidebarHeader}>
            <div className={styles.logo}><span className={styles.logoText}>PharmaX</span></div>
            <button className={styles.sidebarClose} onClick={() => setSidebarOpen(false)}>×</button>
          </div>
          <nav className={styles.nav}>
            <div className={styles.navSection}><p className={styles.navLabel}>Principal</p><Link href="/farmacias/favoritos" className={styles.navLink}><span className={styles.navText}>Favoritos</span></Link><Link href="/farmacias/produtos/medicamentos" className={`${styles.navLink} ${styles.active}`}><span className={styles.navText}>Medicamentos</span></Link></div>
            <div className={styles.navSection}><p className={styles.navLabel}>Gestão</p><Link href="/farmacias/cadastro/funcionario/lista" className={styles.navLink}><span className={styles.navText}>Funcionários</span></Link><Link href="/farmacias/laboratorio/lista" className={styles.navLink}><span className={styles.navText}>Laboratórios</span></Link></div>
            <div className={styles.navSection}><p className={styles.navLabel}>Relatórios</p><Link href="/farmacias/relatorios/favoritos" className={styles.navLink}><span className={styles.navText}>Medicamentos Favoritos</span></Link><Link href="/farmacias/relatorios/funcionarios" className={styles.navLink}><span className={styles.navText}>Relatório de Funcionarios</span></Link><Link href="/farmacias/relatorios/laboratorios" className={styles.navLink}><span className={styles.navText}>Relatório de Laboratorios</span></Link></div>
            <div className={styles.navSection}><p className={styles.navLabel}>Conta</p><Link href="/farmacias/perfil" className={styles.navLink}><span className={styles.navText}>Meu Perfil</span></Link><button onClick={handleLogout} className={styles.navLink} style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}><span className={styles.navText}>Sair</span></button></div>
          </nav>
        </aside>
        {sidebarOpen && <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />}
        <main className={styles.mainContent}>
          <div className={styles.formContainer}>
            <div className={styles.formHeader}>
              <h2>Editar Medicamento</h2>
              <p>Atualize os dados do medicamento</p>
            </div>
            {medicamento && (
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGrid}>
                  <div className={styles.formSection}>
                    <h3 className={styles.sectionTitle}>Informações Básicas</h3>
                    <div className={styles.formGroup}>
                      <label className={styles.inputLabel}>Nome do Medicamento</label>
                      <input className={styles.modernInput} type="text" name="med_nome" value={medicamento.med_nome || ''} onChange={handleChange} required />
                    </div>
                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label className={styles.inputLabel}>Dosagem</label>
                        <input className={styles.modernInput} type="text" name="med_dosagem" value={medicamento.med_dosagem || ''} onChange={handleChange} required />
                      </div>
                      <div className={styles.formGroup}>
                        <label className={styles.inputLabel}>Quantidade</label>
                        <input className={styles.modernInput} type="number" name="med_quantidade" value={medicamento.med_quantidade || 0} onChange={handleChange} min="0" required />
                      </div>
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.inputLabel}>Preço (R$)</label>
                      <input className={styles.modernInput} type="number" name="medp_preco" value={medicamento.medp_preco || 0.00} onChange={handleChange} min="0" step="0.01" required />
                    </div>
                  </div>
                  <div className={styles.formSection}>
                    <h3 className={styles.sectionTitle}>Informações Técnicas</h3>
                    <div className={styles.formGroup}>
                      <label className={styles.inputLabel}>Tipo de Produto</label>
                      <select className={styles.modernInput} name="tipo_id" value={medicamento.tipo_id || ''} onChange={handleChange} required>
                        <option value="">Selecione o tipo</option><option value="1">Referência</option><option value="2">Genérico</option><option value="3">Similar</option>
                      </select>
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.inputLabel}>Forma Farmacêutica</label>
                      <select className={styles.modernInput} name="forma_id" value={medicamento.forma_id || ''} onChange={handleChange} required>
                        <option value="">Selecione a forma</option><option value="1">Comprimidos</option><option value="2">Cápsulas</option><option value="3">Líquido</option><option value="4">Pó para Suspensão</option><option value="5">Pomada</option><option value="6">Injetável</option>
                      </select>
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.inputLabel}>Laboratório</label>
                      <select className={styles.modernInput} name="lab_id" value={medicamento.lab_id || ''} onChange={handleChange} required>
                        <option value="">Selecione o laboratório</option><option value="1">Neo Química</option><option value="2">EMS</option>
                      </select>
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.inputLabel}>Imagem (URL)</label>
                      <input className={styles.modernInput} type="text" name="med_imagem" value={medicamento.med_imagem || ''} onChange={handleChange} />
                    </div>
                  </div>
                </div>
                <div className={styles.formSection}>
                  <h3 className={styles.sectionTitle}>Descrição</h3>
                  <div className={styles.formGroup}>
                    <label className={styles.inputLabel}>Descrição</label>
                    <textarea className={styles.modernTextarea} name="med_descricao" value={medicamento.med_descricao || ''} onChange={handleChange} rows="4" required></textarea>
                  </div>
                </div>
                <div className={styles.formActions}>
                  {error && <p style={{ color: 'red', marginRight: 'auto', fontWeight: 600 }}>{error}</p>}
                  {success && <p style={{ color: 'green', marginRight: 'auto', fontWeight: 600 }}>{success}</p>}
                  <button type="button" className={styles.cancelButton} onClick={() => router.push("/farmacias/produtos/medicamentos")}>Cancelar</button>
                  <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
                    {isSubmitting ? 'Atualizando...' : 'Atualizar Medicamento'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}