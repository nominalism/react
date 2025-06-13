import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Alert, Container } from 'react-bootstrap';
import { candidatoService, bairroService } from '../services/api';

function CandidatoForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    email: '',
    telefone: '',
    data_nascimento: '',
    curso: '',
    turno: '',
    numCasa: '',
    complemento: '',
    bairroId: ''
  });

  const [allBairros, setAllBairros] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const carregarBairros = useCallback(async () => {
    try {
      const response = await bairroService.findAll();
      setAllBairros(response.data);
    } catch (err) {
      setError('Erro ao carregar bairros.');
    }
  }, [setAllBairros, setError]);

  const handleCidadeChange = useCallback((cidadeId) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      cidadeId,
      bairroId: ''
    }));
  }, [setFormData]);

  const handleUfChange = useCallback((ufId) => {
    setFormData(prev => ({
      ...prev,
      ufId,
      cidadeId: '',
      bairroId: ''
    }));
  }, [setFormData]);

  const carregarCandidato = useCallback(async () => {
    setLoading(true);
    try {
      const response = await candidatoService.findById(id);
      const candidato = response.data;
      setFormData({
        nome: candidato.nome,
        cpf: candidato.cpf,
        email: candidato.email,
        telefone: candidato.telefone,
        data_nascimento: candidato.data_nascimento ? candidato.data_nascimento.split('T')[0] : '',
        curso: candidato.curso || '',
        turno: candidato.turno || '',
        numCasa: candidato.numCasa || '',
        complemento: candidato.complemento || '',
        bairroId: candidato.bairroId || ''
      });
      
      if (candidato.ufId) {
        handleUfChange(candidato.ufId);
      }
      if (candidato.cidadeId) {
        handleCidadeChange(candidato.cidadeId);
      }
    } catch (err) {
      setError('Erro ao carregar candidato.');
    } finally {
      setLoading(false);
    }
  }, [id, setFormData, setLoading, setError, handleUfChange, handleCidadeChange]);

  useEffect(() => {
    carregarBairros();
    if (isEdit) {
      carregarCandidato();
    }
  }, [id, isEdit, carregarCandidato, carregarBairros]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      if (isEdit) {
        await candidatoService.update(id, formData);
        setSuccess('Candidato atualizado com sucesso!');
      } else {
        await candidatoService.create(formData);
        setSuccess('Candidato cadastrado com sucesso!');
      }
      setTimeout(() => navigate('/candidatos'), 1000);
    } catch (error) {
      setError(error.response?.data?.message || 'Erro ao salvar candidato. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-4" style={{ maxWidth: 800 }}>
      <h2>{isEdit ? 'Editar Candidato' : 'Novo Candidato'}</h2>
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
          <Form.Label>CPF</Form.Label>
          <Form.Control
            type="text"
            value={formData.cpf}
            onChange={e => setFormData({ ...formData, cpf: e.target.value })}
            required
            disabled={loading}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            disabled={loading}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Telefone</Form.Label>
          <Form.Control
            type="text"
            value={formData.telefone}
            onChange={e => setFormData({ ...formData, telefone: e.target.value })}
            required
            disabled={loading}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Data de Nascimento</Form.Label>
          <Form.Control
            type="date"
            value={formData.data_nascimento}
            onChange={e => setFormData({ ...formData, data_nascimento: e.target.value })}
            required
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
            <option value="DIREITO">Direito</option>
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Turno</Form.Label>
          <Form.Select
            value={formData.turno}
            onChange={e => setFormData({ ...formData, turno: e.target.value })}
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
          <Form.Label>Número da Casa</Form.Label>
          <Form.Control
            type="text"
            value={formData.numCasa}
            onChange={e => setFormData({ ...formData, numCasa: e.target.value })}
            required
            disabled={loading}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Complemento</Form.Label>
          <Form.Control
            type="text"
            value={formData.complemento}
            onChange={e => setFormData({ ...formData, complemento: e.target.value })}
            disabled={loading}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Bairro</Form.Label>
          <Form.Select
            value={formData.bairroId}
            onChange={e => setFormData({ ...formData, bairroId: e.target.value })}
            required
            disabled={loading}
          >
            <option value="">Selecione o bairro</option>
            {allBairros.map((bairro) => (
              <option key={bairro.id} value={bairro.id}>{bairro.bairro}</option>
            ))}
          </Form.Select>
        </Form.Group>
        <div className="d-flex gap-2">
          <Button variant="secondary" onClick={() => navigate('/candidatos')} disabled={loading}>
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

export default CandidatoForm;