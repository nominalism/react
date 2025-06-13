import axios from 'axios';
import env from '../config/env';

const api = axios.create({
  baseURL: env.apiUrl,
  headers: env.headers,
  timeout: 30000
});

// Interceptor para requisições
api.interceptors.request.use(
  (config) => {
    console.log('Requisição sendo enviada:', config);
    return config;
  },
  (error) => {
    console.error('Erro na requisição:', error);
    return Promise.reject(error);
  }
);

// Interceptor para respostas
api.interceptors.response.use(
  (response) => {
    console.log('Resposta recebida:', response);
    return response;
  },
  (error) => {
    console.error('Erro na resposta:', error);
    if (error.response) {
      console.error('Detalhes do erro:', error.response.data);
    }
    return Promise.reject(error);
  }
);

// Serviços
export const ufService = {
  findAll: () => api.get('/ufs'),
  findById: (id) => api.get(`/ufs/${id}`),
  create: (data) => api.post('/ufs', data),
  update: (id, data) => api.put(`/ufs/${id}`, data),
  delete: (id) => api.delete(`/ufs/${id}`)
};

export const cidadeService = {
  findAll: () => api.get('/cidades'),
  findById: (id) => api.get(`/cidades/${id}`),
  findByUf: (ufId) => api.get(`/cidades/findByUf/${ufId}`),
  create: (data) => api.post('/cidades', data),
  update: (id, data) => api.put(`/cidades/${id}`, data),
  delete: (id) => api.delete(`/cidades/${id}`)
};

export const bairroService = {
  findAll: () => api.get('/bairros'),
  findById: (id) => api.get(`/bairros/${id}`),
  findByCidade: (cidadeId) => api.get(`/bairros/findByCidade/${cidadeId}`),
  create: (data) => api.post('/bairros', data),
  update: (id, data) => api.put(`/bairros/${id}`, data),
  delete: (id) => api.delete(`/bairros/${id}`)
};

export const empresaService = {
  findAll: () => api.get('/empresas'),
  findById: (id) => api.get(`/empresas/${id}`),
  create: (data) => api.post('/empresas', data),
  update: (id, data) => api.put(`/empresas/${id}`, data),
  delete: (id) => api.delete(`/empresas/${id}`)
};

export const candidatoService = {
  findAll: () => api.get('/candidatos'),
  findById: (id) => api.get(`/candidatos/${id}`),
  create: (data) => api.post('/candidatos', data),
  update: (id, data) => api.put(`/candidatos/${id}`, data),
  delete: (id) => api.delete(`/candidatos/${id}`)
};

export const areaService = {
  findAll: () => api.get('/areas'),
  findById: (id) => api.get(`/areas/${id}`),
  create: (data) => api.post('/areas', data),
  update: (id, data) => api.put(`/areas/${id}`, data),
  delete: (id) => api.delete(`/areas/${id}`),
  findContratacoesPorArea: () => api.get('/areas/relatorios/contratacoesPorArea'),
};

export const processoSeletivoService = {
  findAll: () => api.get('/processos'),
  findById: (id) => api.get(`/processos/${id}`),
  create: (data) => api.post('/processos', data),
  update: (id, data) => api.put(`/processos/${id}`, data),
  delete: (id) => api.delete(`/processos/${id}`),
  findProcessosPorEmpresa: () => api.get('/processos/relatorios/processosPorEmpresa'),
};

export const vagaService = {
  findAll: () => api.get('/vagas'),
  findById: (id) => api.get(`/vagas/${id}`),
  findByProcessoSeletivo: (processoId) => api.get(`/vagas/findByProcessoSeletivo/${processoId}`),
  findByArea: (areaId) => api.get(`/vagas/findByArea/${areaId}`),
  create: (data) => api.post('/vagas', data),
  update: (id, data) => api.put(`/vagas/${id}`, data),
  delete: (id) => api.delete(`/vagas/${id}`)
};

export const etapaService = {
  findAll: () => api.get('/etapas'),
  findById: (id) => api.get(`/etapas/${id}`),
  findByProcessoSeletivo: (processoId) => api.get(`/etapas/findByProcessoSeletivo/${processoId}`),
  create: (data) => api.post('/etapas', data),
  update: (id, data) => api.put(`/etapas/${id}`, data),
  delete: (id) => api.delete(`/etapas/${id}`)
};

export const interesseService = {
  findAll: () => api.get('/interesses'),
  findById: (id) => api.get(`/interesses/${id}`),
  findByCandidato: (candidatoId) => api.get(`/interesses/findByCandidato/${candidatoId}`),
  findByArea: (areaId) => api.get(`/interesses/findByArea/${areaId}`),
  create: (data) => api.post('/interesses', data),
  update: (id, data) => api.put(`/interesses/${id}`, data),
  delete: (id) => api.delete(`/interesses/${id}`)
};

export const candidaturaService = {
  findAll: () => api.get('/candidaturas'),
  findById: (id) => api.get(`/candidaturas/${id}`),
  create: (data) => api.post('/candidaturas', data),
  update: (id, data) => api.put(`/candidaturas/${id}`, data),
  delete: (id) => api.delete(`/candidaturas/${id}`),
  findBySelecionado: (selecionado) => api.get(`/candidaturas/findBySelecionado/${selecionado}`),
  findCandidaturasPorVaga: () => api.get('/candidaturas/relatorios/candidaturasPorVaga'),
  findContratacoesPorEmpresa: () => api.get('/candidaturas/relatorios/contratacoesPorEmpresa'),
}; 