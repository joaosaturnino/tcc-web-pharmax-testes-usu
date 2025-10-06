"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from 'next/link';
import styles from "./edita.module.css";
import api from "../../../../../services/api";
import { MdUploadFile } from "react-icons/md";

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
  
  // ADICIONADO: Estado para armazenar os dados da farmácia
  const [farmaciaInfo, setFarmaciaInfo] = useState(null);

  const [laboratorios, setLaboratorios] = useState([]);
  const [tiposProduto, setTiposProduto] = useState([]);
  const [formasFarmaceuticas, setFormasFarmaceuticas] = useState([]);

  const [imagemFile, setImagemFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [existingImageUrl, setExistingImageUrl] = useState("");
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
          const userDataString = localStorage.getItem("userData");
          if (!userDataString) throw new Error("Usuário não autenticado. Faça o login.");
          
          const userData = JSON.parse(userDataString);
          // ADICIONADO: Salva os dados da farmácia no estado
          setFarmaciaInfo(userData);
          const farmaciaId = userData.farm_id; 
          if (!farmaciaId) throw new Error("ID da farmácia não encontrado no seu login.");

          const [
            medicamentoResponse, 
            laboratoriosResponse,
            tiposProdutoResponse,
            formasResponse
          ] = await Promise.all([
            api.get(`/medicamentos/${id}?farmacia_id=${farmaciaId}`),
            api.get('/laboratorios'),
            api.get('/tipoproduto'),
            api.get('/farmaceutica')
          ]);
          
          if (medicamentoResponse.data.sucesso) {
            const medData = medicamentoResponse.data.dados;
            setMedicamento(medData);
            if (medData.med_imagem) {
              setExistingImageUrl(medData.med_imagem);
            }
          } else {
            setError("Medicamento não encontrado ou não pertence a esta farmácia.");
          }

          if (laboratoriosResponse.data.sucesso) setLaboratorios(laboratoriosResponse.data.dados);
          if (tiposProdutoResponse.data.sucesso) setTiposProduto(tiposProdutoResponse.data.dados);
          if (formasResponse.data.sucesso) setFormasFarmaceuticas(formasResponse.data.dados);

        } catch (err) {
          setError(err.response?.data?.mensagem || err.message || "Falha ao carregar os dados da página.");
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
     return () => {
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [id, imagePreviewUrl]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "med_imagem" && files) {
      const file = files[0];
      setImagemFile(file);
      setFileName(file ? file.name : "Nenhum arquivo selecionado");
      
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
      if (file) {
        setImagePreviewUrl(URL.createObjectURL(file));
      } else {
        setImagePreviewUrl(null);
      }
    } else {
      setMedicamento(prevState => ({ ...prevState, [name]: value }));
    }
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
      const farmaciaId = userData.farm_id;
      if (!farmaciaId) throw new Error("ID da farmácia não encontrado para realizar a atualização.");
      
      const formData = new FormData();
      
      Object.keys(medicamento).forEach(key => {
        if (key !== 'med_imagem' && key !== 'farmacia_id' && medicamento[key] !== null) {
          formData.append(key, medicamento[key]);
        }
      });

      formData.append('farmacia_id', farmaciaId);

      if (imagemFile) {
        formData.append('med_imagem', imagemFile);
      }
      
      const response = await api.put(`/medicamentos/${id}`, formData);

      if (response.data.sucesso) {
          setSuccess("Medicamento atualizado com sucesso!");
          setTimeout(() => router.push("/farmacias/produtos/medicamentos"), 1500);
      } else {
        throw new Error(response.data.mensagem || "A API indicou uma falha.");
      }
    } catch (err) {
      setError(err.response?.data?.mensagem || err.message || "Erro ao conectar com o servidor.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleLogout = async () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    router.push("/home");
  };

  if (loading) {
    return (
      <div className={styles.dashboard}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <span>Carregando dados...</span>
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
        {/* INÍCIO DA MODIFICAÇÃO DO SIDEBAR */}
        <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ""}`}>
            <div className={styles.sidebarHeader}>
                <div className={styles.logo}>
                    {farmaciaInfo ? (
                        <div className={styles.logoContainer}>
                            {farmaciaInfo.farm_logo_url && (
                                <img src={farmaciaInfo.farm_logo_url} alt={`Logo de ${farmaciaInfo.farm_nome}`} className={styles.logoImage} />
                            )}
                            <span className={styles.logoText}>{farmaciaInfo.farm_nome}</span>
                        </div>
                    ) : (
                        <span className={styles.logoText}>PharmaX</span>
                    )}
                </div>
                <button className={styles.sidebarClose} onClick={() => setSidebarOpen(false)}>×</button>
            </div>
            {/* FIM DA MODIFICAÇÃO DO SIDEBAR HEADER */}
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
                        <input className={styles.modernInput} type="text" name="med_quantidade" value={medicamento.med_quantidade || 0} onChange={handleChange} min="0" required />
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
                        <option value="">Selecione o tipo</option>
                        {tiposProduto.map(tipo => (
                          <option key={tipo.tipo_id} value={tipo.tipo_id}>
                            {tipo.nome_tipo}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.inputLabel}>Forma Farmacêutica</label>
                      <select className={styles.modernInput} name="forma_id" value={medicamento.forma_id || ''} onChange={handleChange} required>
                        <option value="">Selecione a forma</option>
                        {formasFarmaceuticas.map(forma => (
                          <option key={forma.forma_id} value={forma.forma_id}>
                            {forma.forma_nome}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.inputLabel}>Laboratório</label>
                      <select className={styles.modernInput} name="lab_id" value={medicamento.lab_id || ''} onChange={handleChange} required>
                        <option value="">Selecione o laboratório</option>
                        {laboratorios.map(lab => (
                          <option key={lab.lab_id} value={lab.lab_id}>
                            {lab.lab_nome}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                <div className={styles.formSection}>
                  <h3 className={styles.sectionTitle}>Imagem e Descrição</h3>
                  <div className={styles.imageUploadSection}>
                    <div className={styles.imagePreviewContainer}>
                        <label className={styles.inputLabel}>Imagem</label>
                        {imagePreviewUrl ? (
                            <img src={imagePreviewUrl} alt="Preview da nova imagem" className={styles.currentImage} />
                        ) : existingImageUrl ? (
                            <img src={existingImageUrl} alt="Imagem atual do medicamento" className={styles.currentImage} />
                        ) : (
                            <p className={styles.noImageText}>Nenhuma imagem cadastrada.</p>
                        )}
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.inputLabel}>Trocar Imagem</label>
                      <input 
                        id="file-upload"
                        className={styles.fileInput}
                        type="file" 
                        name="med_imagem" 
                        onChange={handleChange} 
                        accept="image/png, image/jpeg, image/webp, image/gif"
                      />
                       <label htmlFor="file-upload" className={styles.fileInputLabel}>
                        <MdUploadFile />
                        <span>{fileName || "Escolher novo arquivo"}</span>
                      </label>
                    </div>
                  </div>

                  <div className={styles.formGroup} style={{marginTop: '2.4rem'}}>
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