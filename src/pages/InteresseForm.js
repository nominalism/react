import React, { useState, useEffect, useCallback } from 'react';
import { Form, Button, Alert, Container } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { interesseService, candidatoService, areaService } from '../services/api';

function InteresseForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    candidatoId: '',
    areaId: '',
    data_Inicio: '',
    data_Final: ''
  });
  const [candidatos, setCandidatos] = useState([]);
  const [areas, setAreas] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const carregarDados = useCallback(async () => {
    try {
      const [candidatosRes, areasRes] = await Promise.all([
        candidatoService.findAll(),
        areaService.findAll()
      ]);
      setCandidatos(candidatosRes.data);
      setAreas(areasRes.data);
    } catch (error) {
      setError('Erro ao carregar candidatos ou áreas.');
    }
  }, [setCandidatos, setAreas, setError]); // Added dependencies to useCallback

  const carregarInteresse = useCallback(async () => {
    setLoading(true);
    try {
      const response = await interesseService.findById(id);
      const interesse = response.data;
      setFormData({
        candidatoId: interesse.candidatoId,
        areaId: interesse.areaId,
        data_Inicio: interesse.data_Inicio ? interesse.data_Inicio.split('T')[0] : '',
        data_Final: interesse.data_Final ? interesse.data_Final.split('T')[0] : ''
      });
    } catch (error) {
      setError('Erro ao carregar interesse.');
    } finally {
      setLoading(false);
    }
  }, [id, setLoading, setFormData, setError]); // Added dependencies to useCallback

  useEffect(() => {
    carregarDados();
    if (isEdit) {
      carregarInteresse();
    }
  }, [id, isEdit, carregarInteresse, carregarDados]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      if (isEdit) {
        await interesseService.update(id, formData);
        setSuccess('Interesse atualizado com sucesso!');
      } else {
        await interesseService.create(formData);
        setSuccess('Interesse cadastrado com sucesso!');
      }
      setTimeout(() => navigate('/interesses'), 1200);
    } catch (error) {
      setError(error.response?.data?.message || 'Erro ao salvar interesse.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-4" style={{ maxWidth: 600 }}>
      <h2>{isEdit ? 'Editar Interesse' : 'Novo Interesse'}</h2>
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
          <Form.Label>Candidato</Form.Label>
          <Form.Select
            value={formData.candidatoId}
            onChange={e => setFormData({ ...formData, candidatoId: e.target.value })}
            required
            disabled={loading}
          >
            <option value="">Selecione um candidato</option>
            {candidatos.map((c) => (
              <option key={c.id} value={c.id}>{c.nome}</option>
            ))}
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Área</Form.Label>
          <Form.Select
            value={formData.areaId}
            onChange={e => setFormData({ ...formData, areaId: e.target.value })}
            required
            disabled={loading}
          >
            <option value="">Selecione uma área</option>
            {areas.map((a) => (
              <option key={a.id} value={a.id}>{a.nome}</option>
            ))}
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Data Início</Form.Label>
          <Form.Control
            type="date"
            value={formData.data_Inicio}
            onChange={e => setFormData({ ...formData, data_Inicio: e.target.value })}
            required
            disabled={loading}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Data Final</Form.Label>
          <Form.Control
            type="date"
            value={formData.data_Final}
            onChange={e => setFormData({ ...formData, data_Final: e.target.value })}
            required
            disabled={loading}
          />
        </Form.Group>
        <div className="d-flex gap-2">
          <Button variant="secondary" onClick={() => navigate('/interesses')} disabled={loading}>
            Voltar
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </Form>
    </Container>
  );
}

export default InteresseForm;