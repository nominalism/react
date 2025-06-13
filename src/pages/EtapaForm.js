import React, { useState, useEffect, useCallback } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { etapaService, processoSeletivoService } from '../services/api';

function EtapaForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    ordem: '',
    tipo: '',
    max_candidatos: '',
    processoSeletivoId: '',
    status_Etapa: 'PENDENTE'
  });
  const [processos, setProcessos] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const carregarDados = useCallback(async () => {
    try {
      const processosResponse = await processoSeletivoService.findAll();
      setProcessos(processosResponse.data);

      if (id) {
        const etapaResponse = await etapaService.findById(id);
        const etapa = etapaResponse.data;
        setFormData({
          nome: etapa.nome,
          descricao: etapa.descricao,
          ordem: etapa.ordem,
          tipo: etapa.tipo || '',
          max_candidatos: etapa.max_candidatos || '',
          processoSeletivoId: etapa.processoSeletivoId,
          status_Etapa: etapa.status_Etapa || 'PENDENTE'
        });
      }
    } catch (error) {
      setError('Erro ao carregar dados. Por favor, tente novamente.');
    }
  }, [id, setProcessos, setFormData, setError]); // Added dependencies to useCallback

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
        await etapaService.update(id, formData);
        setSuccess('Etapa atualizada com sucesso!');
      } else {
        await etapaService.create({ ...formData, status_Etapa: 'PENDENTE' });
        setSuccess('Etapa criada com sucesso!');
      }
      setTimeout(() => navigate('/etapas'), 2000);
    } catch (error) {
      setError(error.response?.data?.message || 'Erro ao salvar etapa. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid p-0">
      <div className="page-header d-flex justify-content-between align-items-center mb-4">
        <h1>{id ? 'Editar Etapa' : 'Nova Etapa'}</h1>
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
          <Form.Label>Nome</Form.Label>
          <Form.Control
            type="text"
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
          <Form.Label>Ordem</Form.Label>
          <Form.Control
            type="number"
            value={formData.ordem}
            onChange={(e) => setFormData({ ...formData, ordem: e.target.value })}
            required
            disabled={loading}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Tipo</Form.Label>
          <Form.Select
            value={formData.tipo}
            onChange={e => setFormData({ ...formData, tipo: e.target.value })}
            required
            disabled={loading}
          >
            <option value="">Selecione o tipo</option>
            <option value="ENTREVISTA">Entrevista</option>
            <option value="TESTE_PRATICO">Teste Prático</option>
            <option value="DINAMICA">Dinâmica</option>
            <option value="QUESTIONARIO">Questionário</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Máximo de Candidatos</Form.Label>
          <Form.Control
            type="number"
            value={formData.max_candidatos}
            onChange={e => setFormData({ ...formData, max_candidatos: e.target.value })}
            required
            disabled={loading}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Processo Seletivo</Form.Label>
          <Form.Select
            value={formData.processoSeletivoId}
            onChange={(e) => setFormData({ ...formData, processoSeletivoId: e.target.value })}
            required
            disabled={loading}
          >
            <option value="">Selecione um processo seletivo</option>
            {processos.map((processo) => (
              <option key={processo.id} value={processo.id}>
                {processo.nome}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        {id && (
          <Form.Group className="mb-3">
            <Form.Label>Status</Form.Label>
            <Form.Select
              value={formData.status_Etapa}
              onChange={e => setFormData({ ...formData, status_Etapa: e.target.value })}
              required
              disabled={loading}
            >
              <option value="PENDENTE">Pendente</option>
              <option value="CONCLUIDO">Concluída</option>
            </Form.Select>
          </Form.Group>
        )}

        <div className="d-flex gap-2">
          <Button variant="secondary" onClick={() => navigate('/etapas')} disabled={loading}>
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

export default EtapaForm;