import React, { useState, useEffect, useCallback } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { candidaturaService, candidatoService, vagaService, processoSeletivoService } from '../services/api';

function CandidaturaForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    candidatoId: '',
    processoSeletivoId: '',
    vagaId: '',
    dados_atualizados: false
  });
  const [candidatos, setCandidatos] = useState([]);
  const [vagas, setVagas] = useState([]);
  const [processos, setProcessos] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const carregarDados = useCallback(async () => {
    try {
      const [candidatosResponse, processosResponse] = await Promise.all([
        candidatoService.findAll(),
        processoSeletivoService.findAll()
      ]);
      setCandidatos(candidatosResponse.data);
      setProcessos(processosResponse.data);

      if (id) {
        const candidaturaResponse = await candidaturaService.findById(id);
        const candidatura = candidaturaResponse.data;
        setFormData({
          candidatoId: candidatura.candidatoId,
          processoSeletivoId: candidatura.vaga?.processoSeletivoId || '',
          vagaId: candidatura.vagaId,
          dados_atualizados: candidatura.dados_atualizados || false
        });
        // Carregar vagas do processo selecionado
        if (candidatura.vaga?.processoSeletivoId) {
          const vagasResponse = await vagaService.findByProcessoSeletivo(candidatura.vaga.processoSeletivoId);
          setVagas(vagasResponse.data);
        }
      }
    } catch (error) {
      setError('Erro ao carregar dados. Por favor, tente novamente.');
    }
  }, [id]);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  // Atualiza vagas ao selecionar processo
  useEffect(() => {
    if (formData.processoSeletivoId) {
      vagaService.findByProcessoSeletivo(formData.processoSeletivoId)
        .then(res => setVagas(res.data))
        .catch(() => setVagas([]));
    } else {
      setVagas([]);
      setFormData(f => ({ ...f, vagaId: '' }));
    }
    // eslint-disable-next-line
  }, [formData.processoSeletivoId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const envio = {
        candidatoId: formData.candidatoId,
        vagaId: formData.vagaId,
        dados_atualizados: formData.dados_atualizados
      };
      if (id) {
        await candidaturaService.update(id, envio);
        setSuccess('Candidatura atualizada com sucesso!');
      } else {
        envio.data = new Date().toISOString();
        await candidaturaService.create(envio);
        setSuccess('Candidatura criada com sucesso!');
      }
      setTimeout(() => navigate('/candidaturas'), 2000);
    } catch (error) {
      setError(error.response?.data?.message || 'Erro ao salvar candidatura. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid p-0">
      <div className="page-header d-flex justify-content-between align-items-center mb-4">
        <h1>{id ? 'Editar Candidatura' : 'Nova Candidatura'}</h1>
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
          <Form.Label>Processo Seletivo</Form.Label>
          <Form.Select
            value={formData.processoSeletivoId}
            onChange={e => setFormData({ ...formData, processoSeletivoId: e.target.value, vagaId: '' })}
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
        <Form.Group className="mb-3">
          <Form.Label>Vaga</Form.Label>
          <Form.Select
            value={formData.vagaId}
            onChange={e => setFormData({ ...formData, vagaId: e.target.value })}
            required
            disabled={loading || !formData.processoSeletivoId}
          >
            <option value="">Selecione uma vaga</option>
            {vagas.map((vaga) => (
              <option key={vaga.id} value={vaga.id}>
                {vaga.cargo || '-'}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Candidato</Form.Label>
          <Form.Select
            value={formData.candidatoId}
            onChange={e => setFormData({ ...formData, candidatoId: e.target.value })}
            required
            disabled={loading}
          >
            <option value="">Selecione um candidato</option>
            {candidatos.map((candidato) => (
              <option key={candidato.id} value={candidato.id}>
                {candidato.nome} | CPF: {candidato.cpf} | {candidato.email} | {candidato.curso}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Check
            type="checkbox"
            label="Confirmo que os dados estão atualizados"
            checked={formData.dados_atualizados}
            onChange={e => setFormData({ ...formData, dados_atualizados: e.target.checked })}
            required
            disabled={loading}
          />
        </Form.Group>
        <div className="d-flex gap-2">
          <Button variant="secondary" onClick={() => navigate('/candidaturas')} disabled={loading}>
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

export default CandidaturaForm;