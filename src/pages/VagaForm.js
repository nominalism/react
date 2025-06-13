import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Alert, Container } from 'react-bootstrap';
import { vagaService, areaService, processoSeletivoService } from '../services/api';

function VagaForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    cargo: '',
    carga_horaria: '',
    remuneracao: '',
    turno: '',
    nivel_escolaridade: '',
    modalidade: '',
    quantidade: 1,
    areaId: '',
    processoSeletivoId: ''
  });

  const [areas, setAreas] = useState([]);
  const [processos, setProcessos] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const carregarDados = useCallback(async () => {
    try {
      const [areasResponse, processosResponse] = await Promise.all([
        areaService.findAll(),
        processoSeletivoService.findAll()
      ]);
      setAreas(areasResponse.data);
      setProcessos(processosResponse.data);
    } catch (error) {
      setError('Erro ao carregar dados.');
    }
  }, [setAreas, setProcessos, setError]); // Added dependencies to useCallback

  const carregarVaga = useCallback(async () => {
    setLoading(true);
    try {
      const response = await vagaService.findById(id);
      const vaga = response.data;
      setFormData({
        cargo: vaga.cargo || '',
        carga_horaria: vaga.carga_horaria || '',
        remuneracao: vaga.remuneracao || '',
        turno: vaga.turno || '',
        nivel_escolaridade: vaga.nivel_escolaridade || '',
        modalidade: vaga.modalidade || '',
        quantidade: vaga.quantidade || 1,
        areaId: vaga.areaId || '',
        processoSeletivoId: vaga.processoSeletivoId || ''
      });
    } catch (error) {
      setError('Erro ao carregar vaga.');
    } finally {
      setLoading(false);
    }
  }, [id, setLoading, setFormData, setError]); // Added dependencies to useCallback

  useEffect(() => {
    carregarDados();
    if (isEdit) {
      carregarVaga();
    }
  }, [id, isEdit, carregarVaga, carregarDados]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      if (isEdit) {
        await vagaService.update(id, formData);
        setSuccess('Vaga atualizada com sucesso!');
      } else {
        await vagaService.create(formData);
        setSuccess('Vaga cadastrada com sucesso!');
      }
      setTimeout(() => navigate('/vagas'), 1000);
    } catch (error) {
      setError(error.response?.data?.message || 'Erro ao salvar vaga. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-4" style={{ maxWidth: 800 }}>
      <h2>{isEdit ? 'Editar Vaga' : 'Nova Vaga'}</h2>
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
          <Form.Label>Cargo</Form.Label>
          <Form.Control
            type="text"
            value={formData.cargo}
            onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
            required
            disabled={loading}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Carga Horária</Form.Label>
          <Form.Control
            type="number"
            value={formData.carga_horaria}
            onChange={(e) => setFormData({ ...formData, carga_horaria: e.target.value })}
            required
            disabled={loading}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Remuneração</Form.Label>
          <Form.Control
            type="number"
            value={formData.remuneracao}
            onChange={(e) => setFormData({ ...formData, remuneracao: e.target.value })}
            required
            disabled={loading}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Turno</Form.Label>
          <Form.Select
            value={formData.turno}
            onChange={(e) => setFormData({ ...formData, turno: e.target.value })}
            required
            disabled={loading}
          >
            <option value="">Selecione o turno</option>
            <option value="MATUTINO">Matutino</option>
            <option value="VESPERTINO">Vespertino</option>
            <option value="NOTURNO">Noturno</option>
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Nível de Escolaridade</Form.Label>
          <Form.Select
            value={formData.nivel_escolaridade}
            onChange={(e) => setFormData({ ...formData, nivel_escolaridade: e.target.value })}
            required
            disabled={loading}
          >
            <option value="">Selecione o nível</option>
            <option value="ENS_MEDIO">Ensino Médio</option>
            <option value="ENS_MEDIO_INC">Ensino Médio Incompleto</option>
            <option value="GRADUACAO">Graduação</option>
            <option value="GRADUACAO_INC">Graduação Incompleta</option>
            <option value="POS">Pós-graduação</option>
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Modalidade</Form.Label>
          <Form.Select
            value={formData.modalidade}
            onChange={(e) => setFormData({ ...formData, modalidade: e.target.value })}
            required
            disabled={loading}
          >
            <option value="">Selecione a modalidade</option>
            <option value="à distância">À distância</option>
            <option value="presencial">Presencial</option>
            <option value="semi-presencial">Semi-presencial</option>
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Quantidade</Form.Label>
          <Form.Control
            type="number"
            min={1}
            value={formData.quantidade}
            onChange={(e) => setFormData({ ...formData, quantidade: e.target.value })}
            required
            disabled={loading}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Área</Form.Label>
          <Form.Select
            value={formData.areaId}
            onChange={(e) => setFormData({ ...formData, areaId: e.target.value })}
            required
            disabled={loading}
          >
            <option value="">Selecione uma área</option>
            {areas.map((area) => (
              <option key={area.id} value={area.id}>
                {area.nome}
              </option>
            ))}
          </Form.Select>
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
        <div className="d-flex gap-2">
          <Button variant="secondary" onClick={() => navigate('/vagas')} disabled={loading}>
            Voltar
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            Salvar
          </Button>
        </div>
      </Form>
    </Container>
  );
}

export default VagaForm;