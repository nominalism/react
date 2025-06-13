import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { processoSeletivoService, etapaService, vagaService, candidaturaService } from '../services/api';
import { Button, Card, Table, Alert, Spinner, Container, Form, Accordion } from 'react-bootstrap';

function FinalizarProcessoDetalhe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [processo, setProcesso] = useState(null);
  const [etapas, setEtapas] = useState([]);
  const [vagas, setVagas] = useState([]);
  const [candidaturasPorVaga, setCandidaturasPorVaga] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [finalizando, setFinalizando] = useState(false);

  useEffect(() => {
    carregarTudo();
    // eslint-disable-next-line
  }, [id]);

  const carregarTudo = async () => {
    setLoading(true);
    setError(null);
    try {
      // Buscar dados do processo
      const processoRes = await processoSeletivoService.findById(id);
      setProcesso(processoRes.data);
      // Buscar etapas
      const etapasRes = await etapaService.findByProcessoSeletivo(id);
      setEtapas(etapasRes.data);
      // Buscar vagas
      const vagasRes = await vagaService.findByProcessoSeletivo(id);
      setVagas(vagasRes.data);
      // Buscar candidaturas de cada vaga
      const candidaturasObj = {};
      for (const vaga of vagasRes.data) {
        const candidaturasRes = await candidaturaService.findByVaga(vaga.id);
        candidaturasObj[vaga.id] = candidaturasRes.data;
      }
      setCandidaturasPorVaga(candidaturasObj);
    } catch (err) {
      setError('Erro ao carregar dados do processo.');
    } finally {
      setLoading(false);
    }
  };

  const handleFinalizar = async () => {
    setFinalizando(true);
    setError(null);
    setSuccess(null);
    try {
      await processoSeletivoService.update(id, { status: 'CONCLUIDO' });
      setSuccess('Processo finalizado com sucesso!');
      setTimeout(() => navigate('/processos-seletivos'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao finalizar processo.');
    } finally {
      setFinalizando(false);
    }
  };

  // NOVA FUNÇÃO: Selecionar candidato por vaga
  const handleSelecionarCandidato = async (vagaId, candidaturaId) => {
    setError(null);
    try {
      // Atualiza todas as candidaturas da vaga: só uma pode ser selecionada
      const candidaturas = candidaturasPorVaga[vagaId] || [];
      await Promise.all(
        candidaturas.map(cand =>
          candidaturaService.update(cand.id, { selecionado: cand.id === candidaturaId })
        )
      );
      // Atualiza o estado local para refletir a seleção
      setCandidaturasPorVaga(prev => ({
        ...prev,
        [vagaId]: candidaturas.map(cand => ({ ...cand, selecionado: cand.id === candidaturaId }))
      }));
    } catch (err) {
      setError('Erro ao selecionar candidato.');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'NAO_INICIADO':
        return '#a78bfa';
      case 'EM_ANDAMENTO':
        return '#a259c6';
      case 'CONCLUIDO':
        return '#7c3aed';
      case 'CANCELADO':
        return '#c084fc';
      default:
        return '#e9d5ff';
    }
  };
  const getStatusLabel = (status) => {
    switch (status) {
      case 'NAO_INICIADO':
        return 'Não Iniciado';
      case 'EM_ANDAMENTO':
        return 'Em Andamento';
      case 'CONCLUIDO':
        return 'Concluído';
      case 'CANCELADO':
        return 'Cancelado';
      default:
        return 'Desconhecido';
    }
  };
  const getEtapaStatusColor = (status) => {
    switch (status) {
      case 'PENDENTE':
        return '#a78bfa';
      case 'EM_ANDAMENTO':
        return '#a259c6';
      case 'CONCLUIDO':
        return '#7c3aed';
      default:
        return '#e9d5ff';
    }
  };
  const getEtapaStatusLabel = (status) => {
    switch (status) {
      case 'PENDENTE':
        return 'Pendente';
      case 'EM_ANDAMENTO':
        return 'Em Andamento';
      case 'CONCLUIDO':
        return 'Concluída';
      default:
        return status;
    }
  };

  if (loading) return <div className="text-center mt-5"><Spinner animation="border" /></div>;
  if (error) return <Alert variant="danger" className="mt-4">{error}</Alert>;

  return (
    <Container className="mt-4" style={{ maxWidth: 900 }}>
      <h2>Finalizar Processo Seletivo</h2>
      {success && <Alert variant="success">{success}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}
      {processo && (
        <Card className="mb-4">
          <Card.Body>
            <h4>{processo.nome}</h4>
            <p><b>Empresa:</b> {processo.empresa?.nome || '-'}</p>
            <p><b>Descrição:</b> {processo.descricao}</p>
            <p><b>Período:</b> {new Date(processo.data_inicio).toLocaleDateString('pt-BR')} a {new Date(processo.data_final).toLocaleDateString('pt-BR')}</p>
            <p><b>Status:</b> <span className="badge rounded-pill" style={{background: getStatusColor(processo.status), color: '#fff'}}>{getStatusLabel(processo.status)}</span></p>
          </Card.Body>
        </Card>
      )}
      <h5>Etapas</h5>
      <Table striped bordered hover size="sm" className="mb-4">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {etapas.map(etapa => (
            <tr key={etapa.id}>
              <td>{etapa.id}</td>
              <td>{etapa.nome}</td>
              <td>
                <span className="badge rounded-pill" style={{background: getEtapaStatusColor(etapa.status_Etapa), color: '#fff'}}>
                  {getEtapaStatusLabel(etapa.status_Etapa)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <h5>Vagas</h5>
      <Accordion defaultActiveKey={vagas.length ? String(vagas[0].id) : undefined} alwaysOpen className="mb-3">
        {vagas.map(vaga => (
          <Accordion.Item eventKey={String(vaga.id)} key={vaga.id}>
            <Accordion.Header>
              <b>{vaga.cargo}</b> (ID: {vaga.id}) — <span className="ms-2"><b>Área:</b> {vaga.area?.nome || '-'}</span> <span className="ms-3"><b>Quantidade:</b> {vaga.quantidade}</span>
            </Accordion.Header>
            <Accordion.Body>
              <Table striped bordered hover size="sm" className="mb-0 align-middle text-center">
                <thead>
                  <tr>
                    <th></th>
                    <th>ID</th>
                    <th>Candidato</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {(candidaturasPorVaga[vaga.id] || []).map(cand => (
                    <tr key={cand.id} className={cand.selecionado ? 'table-success' : ''}>
                      <td style={{ width: 40 }}>
                        <Form.Check
                          type="radio"
                          name={`selecionado-vaga-${vaga.id}`}
                          checked={!!cand.selecionado}
                          onChange={() => handleSelecionarCandidato(vaga.id, cand.id)}
                          aria-label="Selecionar candidato"
                        />
                      </td>
                      <td>{cand.id}</td>
                      <td>{cand.candidato?.nome}</td>
                      <td>
                        {cand.selecionado ? (
                          <span className="badge bg-success">Selecionado</span>
                        ) : (
                          <span className="badge bg-secondary">Não Selecionado</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
      <div className="d-flex justify-content-end mt-4">
        <Button variant="primary" onClick={handleFinalizar} disabled={finalizando}>
          {finalizando ? 'Finalizando...' : 'Finalizar Processo'}
        </Button>
      </div>
    </Container>
  );
}

export default FinalizarProcessoDetalhe; 