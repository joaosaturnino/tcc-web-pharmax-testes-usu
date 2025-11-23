"use client"; // Indica que este componente é renderizado no navegador (client-side)

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation"; // Hooks de navegação do Next.js
import Link from 'next/link';
import styles from "./edita.module.css";
import api from "../../../../../services/api"; // Instância do Axios configurada
import { MdUploadFile } from "react-icons/md";
import toast, { Toaster } from "react-hot-toast"; // Biblioteca para notificações visuais (pop-ups)

export default function EditarMedicamento() {
  // === Hooks de Navegação ===
  const router = useRouter(); // Para redirecionar o usuário após salvar
  const params = useParams(); // Para pegar o ID do medicamento na URL
  const { id } = params;

  // === Estados de Controle de Interface ===
  const [sidebarOpen, setSidebarOpen] = useState(false); // Menu lateral mobile
  const [loading, setLoading] = useState(true); // Carregamento inicial da página
  const [isSubmitting, setIsSubmitting] = useState(false); // Bloqueio do botão durante envio
  const [error, setError] = useState(""); // Erros de carregamento da página (ex: não encontrado)

  // === Estados de Dados ===
  const [medicamento, setMedicamento] = useState(null); // Objeto principal do medicamento sendo editado
  const [farmaciaInfo, setFarmaciaInfo] = useState(null); // Dados da farmácia logada (para o header/sidebar)
  
  // === Estados para Listas de Seleção (Dropdowns) ===
  const [laboratorios, setLaboratorios] = useState([]);
  const [tiposProduto, setTiposProduto] = useState([]);
  const [formasFarmaceuticas, setFormasFarmaceuticas] = useState([]);

  // === Estados para Manipulação de Imagem ===
  const [imagemFile, setImagemFile] = useState(null); // O arquivo 'File' real selecionado
  const [fileName, setFileName] = useState(""); // Nome do arquivo para exibição
  const [existingImageUrl, setExistingImageUrl] = useState(""); // URL da imagem salva no banco (se houver)
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null); // Preview local da nova imagem selecionada

  // === Efeito de Carregamento Inicial ===
  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
          // 1. Validação de Autenticação Local
          const userDataString = localStorage.getItem("userData");
          if (!userDataString) throw new Error("Usuário não autenticado. Faça o login.");

          const userData = JSON.parse(userDataString);
          setFarmaciaInfo(userData);
          const farmaciaId = userData.farm_id;
          if (!farmaciaId) throw new Error("ID da farmácia não encontrado no seu login.");

          // 2. Busca Paralela (Promise.all) para otimizar performance
          // Carrega os dados do medicamento E as listas auxiliares simultaneamente
          const [
            medicamentoResponse,
            laboratoriosResponse,
            tiposProdutoResponse,
            formasResponse
          ] = await Promise.all([
            api.get(`/medicamentos/${id}?farmacia_id=${farmaciaId}`),
            api.get('/todoslab'),
            api.get('/tipoproduto'),
            api.get('/farmaceutica')
          ]);

          // 3. Preenchimento dos Estados
          if (medicamentoResponse.data.sucesso) {
            const medData = medicamentoResponse.data.dados;
            setMedicamento(medData);
            // Salva a imagem atual separadamente para exibir caso o usuário não suba uma nova
            if (medData.med_imagem) {
              setExistingImageUrl(medData.med_imagem);
            }
          } else {
            setError("Medicamento não encontrado ou não pertence a esta farmácia.");
          }

          // Preenche os selects
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

    // Função de limpeza: Remove URLs de objeto criadas para evitar vazamento de memória
    return () => {
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [id, router]); 

  // === Manipulador de Mudanças nos Inputs ===
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    // Lógica específica para Upload de Imagem
    if (name === "med_imagem" && files) {
      const file = files[0];
      setImagemFile(file); // Guarda o arquivo para envio
      setFileName(file ? file.name : "Nenhum arquivo selecionado");

      // Limpa preview anterior e cria um novo
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
      if (file) {
        setImagePreviewUrl(URL.createObjectURL(file)); // Cria URL temporária para exibir a imagem
      } else {
        setImagePreviewUrl(null);
      }
    } else {
      // Lógica padrão para inputs de texto/número/select
      setMedicamento(prevState => ({ ...prevState, [name]: value }));
    }
  };

  // === Manipulador de Envio do Formulário (Update) ===
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(""); 

    try {
      // Revalidação básica de sessão
      const userDataString = localStorage.getItem("userData");
      if (!userDataString) throw new Error("Usuário não autenticado. Faça o login.");

      const userData = JSON.parse(userDataString);
      const farmaciaId = userData.farm_id;

      // === Construção do FormData ===
      // Necessário usar FormData em vez de JSON puro porque estamos enviando arquivos (imagem)
      const formData = new FormData();

      Object.keys(medicamento).forEach(key => {
        // Ignora imagem (tratada separadamente), ID da farmácia (adicionado manualmente) e nulos
        if (key !== 'med_imagem' && key !== 'farmacia_id' && medicamento[key] !== null) {
          formData.append(key, medicamento[key]);
        }
      });

      formData.append('farmacia_id', farmaciaId);

      // Só anexa a imagem se o usuário tiver selecionado um arquivo novo
      if (imagemFile) {
        formData.append('med_imagem', imagemFile);
      }

      // Chamada PUT para atualização
      const response = await api.put(`/medicamentos/${id}`, formData);

      if (response.data.sucesso) {
        toast.success("Medicamento atualizado com sucesso!");
        // Aguarda 1.5s para o usuário ler a mensagem antes de redirecionar
        setTimeout(() => router.push("/farmacias/produtos/medicamentos"), 1500);
      } else {
        throw new Error(response.data.mensagem || "A API indicou uma falha.");
      }
    } catch (err) {
      toast.error(err.response?.data?.mensagem || err.message || "Erro ao conectar com o servidor.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Logout simples
  const handleLogout = async () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    router.push("/home");
  };

  // Renderização Condicional: Carregando
  if (loading) {
    return (<div className={styles.loadingContainer}><div className={styles.spinner}></div><span>Carregando dados...</span></div>);
  }

  // Renderização Condicional: Erro Crítico (impede visualização do formulário)
  if (error && !medicamento) {
    return (<div className={styles.loadingContainer}><p style={{ color: 'red' }}>{error}</p><button onClick={() => router.push("/farmacias/produtos/medicamentos")} className={styles.cancelButton}>Voltar</button></div>);
  }

  return (
    <div className={styles.dashboard}>
      {/* Configuração Global das Notificações Toast */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: { background: '#333', color: '#fff', fontSize: '1.5rem', padding: '1.6rem' },
          success: { style: { background: '#458B00' } },
          error: { style: { background: '#dc2626' } },
        }}
      />

      <header className={styles.header}>
        {/* ... Cabeçalho ... */}
        <div className={styles.headerLeft}>
          <button className={styles.menuToggle} onClick={() => setSidebarOpen(!sidebarOpen)} aria-label="Abrir menu">☰</button>
          <h1 className={styles.title}>Editar Medicamento</h1>
        </div>
      </header>
      
      <div className={styles.contentWrapper}>
        {/* Sidebar Lateral */}
        <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ""}`}>
           {/* ... Conteúdo da Sidebar (Navegação) ... */}
           <div className={styles.sidebarHeader}>
             {/* Lógica para exibir logo da farmácia se existir */}
             <div className={styles.logoContainer}>
              {farmaciaInfo?.farm_logo_url && (<img src={farmaciaInfo.farm_logo_url} alt={`Logo de ${farmaciaInfo.farm_nome}`} className={styles.logoImage} />)}
              <span className={styles.logoText}>{farmaciaInfo?.farm_nome || "PharmaX"}</span>
            </div>
            <button className={styles.sidebarClose} onClick={() => setSidebarOpen(false)}>×</button>
          </div>
          <nav className={styles.nav}>
            {/* Links de Navegação */}
            <div className={styles.navSection}><p className={styles.navLabel}>Principal</p><Link href="/farmacias/favoritos" className={styles.navLink}><span className={styles.navText}>Favoritos</span></Link><Link href="/farmacias/produtos/medicamentos" className={`${styles.navLink} ${styles.active}`}><span className={styles.navText}>Medicamentos</span></Link></div>
            <div className={styles.navSection}><p className={styles.navLabel}>Gestão</p><Link href="/farmacias/cadastro/funcionario/lista" className={styles.navLink}><span className={styles.navText}>Funcionários</span></Link><Link href="/farmacias/laboratorio/lista" className={styles.navLink}><span className={styles.navText}>Laboratórios</span></Link></div>
            <div className={styles.navSection}><p className={styles.navLabel}>Relatórios</p><Link href="/farmacias/relatorios/favoritos" className={styles.navLink}><span className={styles.navText}>Medicamentos Favoritos</span></Link><Link href="/farmacias/relatorios/funcionarios" className={styles.navLink}><span className={styles.navText}>Relatório de Funcionarios</span></Link><Link href="/farmacias/relatorios/laboratorios" className={styles.navLink}><span className={styles.navText}>Relatório de Laboratorios</span></Link></div>
            <div className={styles.navSection}><p className={styles.navLabel}>Conta</p><Link href="/farmacias/perfil" className={styles.navLink}><span className={styles.navText}>Meu Perfil</span></Link><button onClick={handleLogout} className={styles.navLink} style={{ all: 'unset', cursor: 'pointer', width: '100%' }}><span className={styles.navText}>Sair</span></button></div>
          </nav>
        </aside>

        {/* Overlay Escuro para Mobile quando Sidebar está aberta */}
        {sidebarOpen && <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />}
        
        <main className={styles.mainContent}>
          <div className={styles.formContainer}>
            {/* Renderiza formulário apenas se o medicamento foi carregado */}
            {medicamento && (
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGrid}>
                  {/* Seção 1: Dados Básicos */}
                  <div className={styles.formSection}>
                    <h3 className={styles.sectionTitle}>Informações Básicas</h3>
                    <div className={styles.formGroup}><label className={styles.inputLabel}>Nome do Medicamento</label><input className={styles.modernInput} type="text" name="med_nome" value={medicamento.med_nome || ''} onChange={handleChange} required /></div>
                    <div className={styles.formRow}><div className={styles.formGroup}><label className={styles.inputLabel}>Dosagem</label><input className={styles.modernInput} type="text" name="med_dosagem" value={medicamento.med_dosagem || ''} onChange={handleChange} required /></div><div className={styles.formGroup}><label className={styles.inputLabel}>Quantidade</label><input className={styles.modernInput} type="text" name="med_quantidade" value={medicamento.med_quantidade || 0} onChange={handleChange} required /></div></div>
                    <div className={styles.formGroup}><label className={styles.inputLabel}>Preço (R$)</label><input className={styles.modernInput} type="number" name="medp_preco" value={medicamento.medp_preco || 0.00} onChange={handleChange} min="0" step="0.01" required /></div>
                  </div>
                  
                  {/* Seção 2: Dados Técnicos (Selects populados pela API) */}
                  <div className={styles.formSection}>
                    <h3 className={styles.sectionTitle}>Informações Técnicas</h3>
                    <div className={styles.formGroup}><label className={styles.inputLabel}>Tipo de Produto</label><select className={styles.modernSelect} name="tipo_id" value={medicamento.tipo_id || ''} onChange={handleChange} required><option value="">Selecione o tipo</option>{tiposProduto.map(tipo => (<option key={tipo.tipo_id} value={tipo.tipo_id}>{tipo.nome_tipo}</option>))}</select></div>
                    <div className={styles.formGroup}><label className={styles.inputLabel}>Forma Farmacêutica</label><select className={styles.modernSelect} name="forma_id" value={medicamento.forma_id || ''} onChange={handleChange} required><option value="">Selecione a forma</option>{formasFarmaceuticas.map(forma => (<option key={forma.forma_id} value={forma.forma_id}>{forma.forma_nome}</option>))}</select></div>
                    <div className={styles.formGroup}><label className={styles.inputLabel}>Laboratório</label><select className={styles.modernSelect} name="lab_id" value={medicamento.lab_id || ''} onChange={handleChange} required><option value="">Selecione o laboratório</option>{laboratorios.map(lab => (<option key={lab.lab_id} value={lab.lab_id}>{lab.lab_nome}</option>))}</select></div>
                  </div>
                </div>

                {/* Seção 3: Upload e Descrição */}
                <div className={styles.formSection}>
                  <h3 className={styles.sectionTitle}>Imagem e Descrição</h3>
                  <div className={styles.imageUploadSection}>
                    {/* Preview da Imagem: Mostra a nova (preview) OU a antiga (existente) OU placeholder */}
                    <div className={styles.imagePreviewContainer}>
                      <label className={styles.inputLabel}>Imagem</label>
                      {imagePreviewUrl ? (<img src={imagePreviewUrl} alt="Preview da nova imagem" className={styles.currentImage} />) : existingImageUrl ? (<img src={existingImageUrl} alt="Imagem atual do medicamento" className={styles.currentImage} />) : (<div className={styles.noImageText}>Nenhuma imagem</div>)}
                    </div>
                    {/* Input de Arquivo Escondido + Label Estilizada */}
                    <div className={styles.formGroup}>
                      <label className={styles.inputLabel}>Trocar Imagem</label>
                      <input id="file-upload" className={styles.fileInput} type="file" name="med_imagem" onChange={handleChange} accept="image/png, image/jpeg, image/webp, image/gif" />
                      <label htmlFor="file-upload" className={styles.fileInputLabel}><MdUploadFile /><span>{fileName || "Escolher novo arquivo"}</span></label>
                    </div>
                  </div>
                  <div className={styles.formGroup} style={{ marginTop: '2.4rem' }}><label className={styles.inputLabel}>Descrição</label><textarea className={styles.modernTextarea} name="med_descricao" value={medicamento.med_descricao || ''} onChange={handleChange} rows="4" required></textarea></div>
                </div>

                <div className={styles.formActions}>
                  <button type="button" className={styles.cancelButton} onClick={() => router.push("/farmacias/produtos/medicamentos")}>Cancelar</button>
                  {/* Desabilita botão durante o envio para evitar cliques duplos */}
                  <button type="submit" className={styles.submitButton} disabled={isSubmitting}>{isSubmitting ? 'Atualizando...' : 'Atualizar Medicamento'}</button>
                </div>
              </form>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}