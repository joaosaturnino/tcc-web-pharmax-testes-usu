import medParacetamol from '../../../../public/paracetamol.png';
const medicamentos = [
    {
			"med_id": 1,
			"med_nome": "Paracetamol",
			"med_dosagem": "500mg",
			"med_quantidade": "20 comprimidos",
			"forma_id": 1,
			"med_descricao": "Analgésico e antitérmico",
			"lab_id": 1,
			"med_imagem": medParacetamol,
			"tipo_id": 1,
			"med_data_cadastro": "2025-09-18T22:13:53.000Z",
			"med_data_atualizacao": "2025-09-18T22:13:53.000Z",
			"med_ativo": 1
		},
		{
			"med_id": 2,
			"med_nome": "Ibuprofeno",
			"med_dosagem": "400mg",
			"med_quantidade": "20 comprimidos",
			"forma_id": 1,
			"med_descricao": "Anti-inflamatório",
			"lab_id": 2,
			"med_imagem": "ibuprofeno.png",
			"tipo_id": 5,
			"med_data_cadastro": "2025-09-18T22:13:53.000Z",
			"med_data_atualizacao": "2025-09-18T22:13:53.000Z",
			"med_ativo": 1
		},
		{
			"med_id": 3,
			"med_nome": "Amoxicilina",
			"med_dosagem": "500mg",
			"med_quantidade": "10 cápsulas",
			"forma_id": 2,
			"med_descricao": "Antibiótico",
			"lab_id": 3,
			"med_imagem": "amoxicilina.png",
			"tipo_id": 3,
			"med_data_cadastro": "2025-09-18T22:13:53.000Z",
			"med_data_atualizacao": "2025-09-18T22:13:53.000Z",
			"med_ativo": 1
		},
		{
			"med_id": 4,
			"med_nome": "Loratadina",
			"med_dosagem": "10mg",
			"med_quantidade": "10 comprimidos",
			"forma_id": 1,
			"med_descricao": "Antialérgico",
			"lab_id": 4,
			"med_imagem": "loratadina.png",
			"tipo_id": 4,
			"med_data_cadastro": "2025-09-18T22:13:53.000Z",
			"med_data_atualizacao": "2025-09-18T22:13:53.000Z",
			"med_ativo": 1
		},
		{
			"med_id": 5,
			"med_nome": "Omeprazol",
			"med_dosagem": "20mg",
			"med_quantidade": "14 cápsulas",
			"forma_id": 2,
			"med_descricao": "Antiácido",
			"lab_id": 5,
			"med_imagem": "omeprazol.png",
			"tipo_id": 18,
			"med_data_cadastro": "2025-09-18T22:13:53.000Z",
			"med_data_atualizacao": "2025-09-18T22:13:53.000Z",
			"med_ativo": 1
		},
		{
			"med_id": 6,
			"med_nome": "Losartana",
			"med_dosagem": "50mg",
			"med_quantidade": "30 comprimidos",
			"forma_id": 1,
			"med_descricao": "Anti-hipertensivo",
			"lab_id": 6,
			"med_imagem": "losartana.png",
			"tipo_id": 27,
			"med_data_cadastro": "2025-09-18T22:13:53.000Z",
			"med_data_atualizacao": "2025-09-18T22:13:53.000Z",
			"med_ativo": 1
		},
		{
			"med_id": 7,
			"med_nome": "Metformina",
			"med_dosagem": "500mg",
			"med_quantidade": "30 comprimidos",
			"forma_id": 1,
			"med_descricao": "Diabetes tipo 2",
			"lab_id": 7,
			"med_imagem": "metformina.png",
			"tipo_id": 17,
			"med_data_cadastro": "2025-09-18T22:13:53.000Z",
			"med_data_atualizacao": "2025-09-18T22:13:53.000Z",
			"med_ativo": 1
		},
		{
			"med_id": 8,
			"med_nome": "Dipirona",
			"med_dosagem": "500mg",
			"med_quantidade": "10 comprimidos",
			"forma_id": 1,
			"med_descricao": "Analgesico e antitérmico",
			"lab_id": 8,
			"med_imagem": "dipirona.png",
			"tipo_id": 1,
			"med_data_cadastro": "2025-09-18T22:13:53.000Z",
			"med_data_atualizacao": "2025-09-18T22:13:53.000Z",
			"med_ativo": 1
		},
		{
			"med_id": 9,
			"med_nome": "Cetirizina",
			"med_dosagem": "10mg",
			"med_quantidade": "10 comprimidos",
			"forma_id": 1,
			"med_descricao": "Antialérgico",
			"lab_id": 9,
			"med_imagem": "cetirizina.png",
			"tipo_id": 4,
			"med_data_cadastro": "2025-09-18T22:13:53.000Z",
			"med_data_atualizacao": "2025-09-18T22:13:53.000Z",
			"med_ativo": 1
		},
		{
			"med_id": 10,
			"med_nome": "Ranitidina",
			"med_dosagem": "150mg",
			"med_quantidade": "14 comprimidos",
			"forma_id": 1,
			"med_descricao": "Antiácido",
			"lab_id": 10,
			"med_imagem": "ranitidina.png",
			"tipo_id": 18,
			"med_data_cadastro": "2025-09-18T22:13:53.000Z",
			"med_data_atualizacao": "2025-09-18T22:13:53.000Z",
			"med_ativo": 1
		},
		{
			"med_id": 11,
			"med_nome": "Amoxicilina + Clavulanato",
			"med_dosagem": "875mg",
			"med_quantidade": "10 comprimidos",
			"forma_id": 1,
			"med_descricao": "Antibiótico",
			"lab_id": 11,
			"med_imagem": "amoxclav.png",
			"tipo_id": 3,
			"med_data_cadastro": "2025-09-18T22:13:53.000Z",
			"med_data_atualizacao": "2025-09-18T22:13:53.000Z",
			"med_ativo": 1
		},
		{
			"med_id": 12,
			"med_nome": "Azitromicina",
			"med_dosagem": "500mg",
			"med_quantidade": "3 comprimidos",
			"forma_id": 1,
			"med_descricao": "Antibiótico",
			"lab_id": 12,
			"med_imagem": "azitromicina.png",
			"tipo_id": 3,
			"med_data_cadastro": "2025-09-18T22:13:53.000Z",
			"med_data_atualizacao": "2025-09-18T22:13:53.000Z",
			"med_ativo": 1
		},
		{
			"med_id": 13,
			"med_nome": "Clorfeniramina",
			"med_dosagem": "4mg",
			"med_quantidade": "10 comprimidos",
			"forma_id": 1,
			"med_descricao": "Antialérgico",
			"lab_id": 13,
			"med_imagem": "clorfeniramina.png",
			"tipo_id": 4,
			"med_data_cadastro": "2025-09-18T22:13:53.000Z",
			"med_data_atualizacao": "2025-09-18T22:13:53.000Z",
			"med_ativo": 1
		},
		{
			"med_id": 14,
			"med_nome": "Dipirona Gotas",
			"med_dosagem": "500mg/ml",
			"med_quantidade": "20ml",
			"forma_id": 7,
			"med_descricao": "Analgésico e antitérmico",
			"lab_id": 14,
			"med_imagem": "dipironagotas.png",
			"tipo_id": 1,
			"med_data_cadastro": "2025-09-18T22:13:53.000Z",
			"med_data_atualizacao": "2025-09-18T22:13:53.000Z",
			"med_ativo": 1
		},
		{
			"med_id": 15,
			"med_nome": "Ibuprofeno Xarope",
			"med_dosagem": "100mg/ml",
			"med_quantidade": "100ml",
			"forma_id": 3,
			"med_descricao": "Anti-inflamatório",
			"lab_id": 15,
			"med_imagem": "ibuprofenoxarope.png",
			"tipo_id": 5,
			"med_data_cadastro": "2025-09-18T22:13:53.000Z",
			"med_data_atualizacao": "2025-09-18T22:13:53.000Z",
			"med_ativo": 1
		},
		{
			"med_id": 16,
			"med_nome": "Vitamina C",
			"med_dosagem": "500mg",
			"med_quantidade": "30 comprimidos",
			"forma_id": 1,
			"med_descricao": "Suplemento vitamínico",
			"lab_id": 16,
			"med_imagem": "vitamina_c.png",
			"tipo_id": 6,
			"med_data_cadastro": "2025-09-18T22:13:53.000Z",
			"med_data_atualizacao": "2025-09-18T22:13:53.000Z",
			"med_ativo": 1
		},
		{
			"med_id": 17,
			"med_nome": "Complexo B",
			"med_dosagem": "50mg",
			"med_quantidade": "30 comprimidos",
			"forma_id": 1,
			"med_descricao": "Suplemento vitamínico",
			"lab_id": 17,
			"med_imagem": "complexo_b.png",
			"tipo_id": 6,
			"med_data_cadastro": "2025-09-18T22:13:53.000Z",
			"med_data_atualizacao": "2025-09-18T22:13:53.000Z",
			"med_ativo": 1
		},
		{
			"med_id": 18,
			"med_nome": "Fluconazol",
			"med_dosagem": "150mg",
			"med_quantidade": "1 comprimido",
			"forma_id": 1,
			"med_descricao": "Antifúngico",
			"lab_id": 18,
			"med_imagem": "fluconazol.png",
			"tipo_id": 15,
			"med_data_cadastro": "2025-09-18T22:13:53.000Z",
			"med_data_atualizacao": "2025-09-18T22:13:53.000Z",
			"med_ativo": 1
		},
		{
			"med_id": 19,
			"med_nome": "Prednisona",
			"med_dosagem": "20mg",
			"med_quantidade": "10 comprimidos",
			"forma_id": 1,
			"med_descricao": "Corticosteroide",
			"lab_id": 19,
			"med_imagem": "prednisona.png",
			"tipo_id": 25,
			"med_data_cadastro": "2025-09-18T22:13:53.000Z",
			"med_data_atualizacao": "2025-09-18T22:13:53.000Z",
			"med_ativo": 1
		},
		{
			"med_id": 20,
			"med_nome": "Clonazepam",
			"med_dosagem": "2mg",
			"med_quantidade": "20 comprimidos",
			"forma_id": 1,
			"med_descricao": "Sedativo",
			"lab_id": 20,
			"med_imagem": "clonazepam.png",
			"tipo_id": 29,
			"med_data_cadastro": "2025-09-18T22:13:53.000Z",
			"med_data_atualizacao": "2025-09-18T22:13:53.000Z",
			"med_ativo": 1
		},
		{
			"med_id": 21,
			"med_nome": "Enalapril",
			"med_dosagem": "10mg",
			"med_quantidade": "30 comprimidos",
			"forma_id": 1,
			"med_descricao": "Anti-hipertensivo",
			"lab_id": 21,
			"med_imagem": "enalapril.png",
			"tipo_id": 27,
			"med_data_cadastro": "2025-09-18T22:13:53.000Z",
			"med_data_atualizacao": "2025-09-18T22:13:53.000Z",
			"med_ativo": 1
		},
		{
			"med_id": 22,
			"med_nome": "Simvastatina",
			"med_dosagem": "20mg",
			"med_quantidade": "30 comprimidos",
			"forma_id": 1,
			"med_descricao": "Cardiológico",
			"lab_id": 22,
			"med_imagem": "simvastatina.png",
			"tipo_id": 16,
			"med_data_cadastro": "2025-09-18T22:13:53.000Z",
			"med_data_atualizacao": "2025-09-18T22:13:53.000Z",
			"med_ativo": 1
		},
		{
			"med_id": 23,
			"med_nome": "AAS",
			"med_dosagem": "100mg",
			"med_quantidade": "30 comprimidos",
			"forma_id": 1,
			"med_descricao": "Antitrombótico",
			"lab_id": 23,
			"med_imagem": "aas.png",
			"tipo_id": 24,
			"med_data_cadastro": "2025-09-18T22:13:53.000Z",
			"med_data_atualizacao": "2025-09-18T22:13:53.000Z",
			"med_ativo": 1
		},
		{
			"med_id": 24,
			"med_nome": "Naproxeno",
			"med_dosagem": "250mg",
			"med_quantidade": "20 comprimidos",
			"forma_id": 1,
			"med_descricao": "Anti-inflamatório",
			"lab_id": 24,
			"med_imagem": "naproxeno.png",
			"tipo_id": 5,
			"med_data_cadastro": "2025-09-18T22:13:53.000Z",
			"med_data_atualizacao": "2025-09-18T22:13:53.000Z",
			"med_ativo": 1
		},
		{
			"med_id": 25,
			"med_nome": "Clopidogrel",
			"med_dosagem": "75mg",
			"med_quantidade": "30 comprimidos",
			"forma_id": 1,
			"med_descricao": "Cardiológico",
			"lab_id": 25,
			"med_imagem": "clopidogrel.png",
			"tipo_id": 16,
			"med_data_cadastro": "2025-09-18T22:13:53.000Z",
			"med_data_atualizacao": "2025-09-18T22:13:53.000Z",
			"med_ativo": 1
		},
		{
			"med_id": 26,
			"med_nome": "Cetoconazol Creme",
			"med_dosagem": "2%",
			"med_quantidade": "30g",
			"forma_id": 4,
			"med_descricao": "Antifúngico dermatológico",
			"lab_id": 26,
			"med_imagem": "cetoconazol.png",
			"tipo_id": 15,
			"med_data_cadastro": "2025-09-18T22:13:53.000Z",
			"med_data_atualizacao": "2025-09-18T22:13:53.000Z",
			"med_ativo": 1
		},
		{
			"med_id": 27,
			"med_nome": "Rivotril",
			"med_dosagem": "2mg",
			"med_quantidade": "20 comprimidos",
			"forma_id": 1,
			"med_descricao": "Sedativo",
			"lab_id": 27,
			"med_imagem": "rivotril.png",
			"tipo_id": 29,
			"med_data_cadastro": "2025-09-18T22:13:53.000Z",
			"med_data_atualizacao": "2025-09-18T22:13:53.000Z",
			"med_ativo": 1
		},
		{
			"med_id": 28,
			"med_nome": "Sildenafila",
			"med_dosagem": "50mg",
			"med_quantidade": "10 comprimidos",
			"forma_id": 1,
			"med_descricao": "Vasodilatador",
			"lab_id": 28,
			"med_imagem": "sildenafila.png",
			"tipo_id": 16,
			"med_data_cadastro": "2025-09-18T22:13:53.000Z",
			"med_data_atualizacao": "2025-09-18T22:13:53.000Z",
			"med_ativo": 1
		},
		{
			"med_id": 29,
			"med_nome": "Omeprazol DR",
			"med_dosagem": "20mg",
			"med_quantidade": "14 cápsulas",
			"forma_id": 2,
			"med_descricao": "Antiácido",
			"lab_id": 29,
			"med_imagem": "omeprazoldr.png",
			"tipo_id": 18,
			"med_data_cadastro": "2025-09-18T22:13:53.000Z",
			"med_data_atualizacao": "2025-09-18T22:13:53.000Z",
			"med_ativo": 1
		},
		{
			"med_id": 30,
			"med_nome": "Azitromicina Xarope",
			"med_dosagem": "200mg/5ml",
			"med_quantidade": "60ml",
			"forma_id": 3,
			"med_descricao": "Antibiótico",
			"lab_id": 30,
			"med_imagem": "azitromicinaxarope.png",
			"tipo_id": 3,
			"med_data_cadastro": "2025-09-18T22:13:53.000Z",
			"med_data_atualizacao": "2025-09-18T22:13:53.000Z",
			"med_ativo": 1
		}
];

// Simula uma API com métodos assíncronos
const apiMedicamentos = {
  // Buscar todos os medicamentos
  buscarTodos: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: "Lista de medicamentos",
          total: medicamentos.length,
          data: medicamentos,
        });
      }, 500); // Simula delay de rede
    });
  },

  // Buscar por código de barras
  buscarPorCodigoBarras: (codigo) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const medicamento = medicamentos.find((med) => med.codigoBarras === codigo);
        resolve({
          success: !!medicamento,
          message: medicamento ? "Medicamento encontrado" : "Medicamento não encontrado",
          data: medicamento || null,
        });
      }, 300);
    });
  },

  // Adicionar novo medicamento
  adicionar: (novoMedicamento) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const id = Math.max(...medicamentos.map(m => m.id)) + 1;
        const medicamentoComId = { ...novoMedicamento, id };
        medicamentos.push(medicamentoComId);
        resolve({
          success: true,
          message: "Medicamento adicionado com sucesso",
          data: medicamentoComId,
        });
      }, 500);
    });
  },

  // Atualizar medicamento
  atualizar: (id, dadosAtualizados) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = medicamentos.findIndex(med => med.id === id);
        if (index !== -1) {
          medicamentos[index] = { ...medicamentos[index], ...dadosAtualizados };
          resolve({
            success: true,
            message: "Medicamento atualizado com sucesso",
            data: medicamentos[index],
          });
        } else {
          resolve({
            success: false,
            message: "Medicamento não encontrado",
            data: null,
          });
        }
      }, 500);
    });
  },

  // Excluir medicamento
  excluir: (id) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = medicamentos.findIndex(med => med.id === id);
        if (index !== -1) {
          const medicamentoExcluido = medicamentos.splice(index, 1)[0];
          resolve({
            success: true,
            message: "Medicamento excluído com sucesso",
            data: medicamentoExcluido,
          });
        } else {
          resolve({
            success: false,
            message: "Medicamento não encontrado",
            data: null,
          });
        }
      }, 500);
    });
  },
};

export default apiMedicamentos;