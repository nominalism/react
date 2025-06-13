import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Alert, Container } from 'react-bootstrap';
import { empresaService, bairroService } from '../services/api';

function EmpresaForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    nome: '',
    cnpj: '',
    email: '',
    telefone: '',
    setor: '',
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
    } catch (error) {
      setError('Erro ao carregar bairros.');
    }
  }, [setAllBairros, setError]);

  const carregarEmpresa = useCallback(async () => {
    setLoading(true);
    try {
      const response = await empresaService.findById(id);
      const empresa = response.data;
      setFormData({
        nome: empresa.nome,
        cnpj: empresa.cnpj,
        email: empresa.email,
        telefone: empresa.telefone,
        setor: empresa.setor || '',
        numCasa: empresa.numCasa || '',
        complemento: empresa.complemento || '',
        bairroId: empresa.bairroId || ''
      });
    } catch (error) {
      setError('Erro ao carregar empresa.');
    } finally {
      setLoading(false);
    }
  }, [id, setLoading, setFormData, setError]);

  useEffect(() => {
    carregarBairros();
    if (isEdit) {
      carregarEmpresa();
    }
  }, [id, isEdit, carregarEmpresa, carregarBairros]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      if (isEdit) {
        await empresaService.update(id, formData);
        setSuccess('Empresa atualizada com sucesso!');
      } else {
        await empresaService.create(formData);
        setSuccess('Empresa cadastrada com sucesso!');
      }
      setTimeout(() => navigate('/empresas'), 1000);
    } catch (error) {
      setError(error.response?.data?.message || 'Erro ao salvar empresa. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-4" style={{ maxWidth: 800 }}>
      <h2>{isEdit ? 'Editar Empresa' : 'Nova Empresa'}</h2>
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
          <Form.Label>CNPJ</Form.Label>
          <Form.Control
            type="text"
            value={formData.cnpj}
            onChange={e => setFormData({ ...formData, cnpj: e.target.value })}
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
          <Form.Label>Setor</Form.Label>
          <Form.Select
            value={formData.setor}
            onChange={e => setFormData({ ...formData, setor: e.target.value })}
            required
            disabled={loading}
          >
            <option value="">Selecione o setor</option>
            <option value="TECNOLOGIA">Tecnologia</option>
            <option value="MARMORE">Mármore</option>
            <option value="COMERCIO">Comércio</option>
            <option value="SAUDE">Saúde</option>
            <option value="ADMINISTRACAO">Administração</option>
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Número da Casa</Form.Label>
          <Form.Control
            type="number"
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
            <option value="">Selecione um bairro</option>
            {allBairros.map((bairro) => (
              <option key={bairro.id} value={bairro.id}>{bairro.bairro}</option>
            ))}
          </Form.Select>
        </Form.Group>
        <div className="d-flex gap-2">
          <Button variant="secondary" onClick={() => navigate('/empresas')} disabled={loading}>
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

export default EmpresaForm;