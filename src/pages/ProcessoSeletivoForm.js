import React, { useState, useEffect, useCallback } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { processoSeletivoService, empresaService } from '../services/api';

function ProcessoSeletivoForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    data_inicio: '',
    data_final: '',
    empresaId: '',
    status: 'NAO_INICIADO'
  });
  const [empresas, setEmpresas] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const carregarDados = useCallback(async () => {
    try {
      const empresasResponse = await empresaService.findAll();
      setEmpresas(empresasResponse.data);

      if (id) {
        const processoResponse = await processoSeletivoService.findById(id);
        const processo = processoResponse.data;
        setFormData({
          nome: processo.nome,
          descricao: processo.descricao,
          data_inicio: processo.data_inicio.split('T')[0],
          data_final: processo.data_final.split('T')[0],
          empresaId: processo.empresaId,
          status: processo.status || 'NAO_INICIADO'
        });
      }
    } catch (error) {
      setError('Erro ao carregar dados. Por favor, tente novamente.');
    }
  }, [id, setEmpresas, setFormData, setError]); // Added dependencies to useCallback

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (id) {
        await processoSeletivoService.update(id, formData);
        setSuccess('Processo seletivo atualizado com sucesso!');
      } else {
        await processoSeletivoService.create(formData);
        setSuccess('Processo seletivo criado com sucesso!');
      }
      setTimeout(() => navigate('/processos-seletivos'), 2000);
    } catch (error) {
      setError(error.response?.data?.message || 'Erro ao salvar processo seletivo. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid p-0">
      <div className="page-header d-flex justify-content-between align-items-center mb-4">
        <h1>{id ? 'Editar Processo Seletivo' : 'Novo Processo Seletivo'}</h1>
      </div>

      {error && (
        <Alert variant="danger" onClose={() => setError(null)} dismissible>
          {error}
        </Alert>
      )}

      {success && (
        <Alert variant="success" onClose={() => setSuccess(null)} dismissible>
          {success}
        </Alert>
      )}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Nome (ID/Número)</Form.Label>
          <Form.Control
            type="number"
            value={formData.nome}
            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
            required
            disabled={loading}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Descrição</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={formData.descricao}
            onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
            required
            disabled={loading}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Data Início</Form.Label>
          <Form.Control
            type="date"
            value={formData.data_inicio}
            onChange={(e) => setFormData({ ...formData, data_inicio: e.target.value })}
            required
            disabled={loading}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Data Fim</Form.Label>
          <Form.Control
            type="date"
            value={formData.data_final}
            onChange={(e) => setFormData({ ...formData, data_final: e.target.value })}
            required
            disabled={loading}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Empresa</Form.Label>
          <Form.Select
            value={formData.empresaId}
            onChange={(e) => setFormData({ ...formData, empresaId: e.target.value })}
            required
            disabled={loading}
          >
            <option value="">Selecione uma empresa</option>
            {empresas.map((empresa) => (
              <option key={empresa.id} value={empresa.id}>
                {empresa.nome}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Status</Form.Label>
          <Form.Select
            value={formData.status}
            onChange={e => setFormData({ ...formData, status: e.target.value })}
            required
            disabled={loading}
          >
            <option value="NAO_INICIADO">Não iniciado</option>
            <option value="EM_ANDAMENTO">Em andamento</option>
            <option value="CONCLUIDO">Concluído</option>
            <option value="CANCELADO">Cancelado</option>
          </Form.Select>
        </Form.Group>

        <div className="d-flex gap-2">
          <Button variant="secondary" onClick={() => navigate('/processos-seletivos')} disabled={loading}>
            Voltar
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default ProcessoSeletivoForm;