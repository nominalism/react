import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Alert, Container } from 'react-bootstrap';
import { areaService } from '../services/api';

function AreaForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    curso: '',
    candidatos_vaga: ''
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      setLoading(true);
      areaService.findById(id)
        .then((response) => {
          setFormData({
            nome: response.data.nome,
            descricao: response.data.descricao,
            curso: response.data.curso || '',
            candidatos_vaga: response.data.candidatos_vaga || ''
          });
          setLoading(false);
        })
        .catch((error) => {
          setError('Erro ao carregar área.');
          setLoading(false);
        });
    }
  }, [id, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      if (isEdit) {
        await areaService.update(id, formData);
        setSuccess('Área atualizada com sucesso!');
      } else {
        await areaService.create(formData);
        setSuccess('Área cadastrada com sucesso!');
      }
      setTimeout(() => navigate('/areas'), 1000);
    } catch (error) {
      setError(error.response?.data?.message || 'Erro ao salvar área. Por favor, tente novamente.');
    }
  };

  return (
    <Container className="mt-4" style={{ maxWidth: 600 }}>
      <h2>{isEdit ? 'Editar Área' : 'Nova Área'}</h2>
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
            placeholder="Digite o nome da área"
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
            placeholder="Digite a descrição da área"
            disabled={loading}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Curso</Form.Label>
          <Form.Select
            value={formData.curso}
            onChange={e => setFormData({ ...formData, curso: e.target.value })}
            required
            disabled={loading}
          >
            <option value="">Selecione o curso</option>
            <option value="SIS_INFORMACAO">Sistemas de Informação</option>
            <option value="ADM">Administração</option>
            <option value="ENFERMAGEM">Enfermagem</option>
            <option value="CONTABILIDADE">Contabilidade</option>
            <option value="ENG_MECANICA">Engenharia Mecânica</option>
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Candidatos por Vaga</Form.Label>
          <Form.Control
            type="number"
            min={1}
            value={formData.candidatos_vaga}
            onChange={e => setFormData({ ...formData, candidatos_vaga: e.target.value })}
            required
            placeholder="Digite o número de candidatos por vaga"
            disabled={loading}
          />
        </Form.Group>
        <div className="d-flex gap-2">
          <Button variant="secondary" onClick={() => navigate('/areas')} disabled={loading}>
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

export default AreaForm; 