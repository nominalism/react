import React, { useEffect, useState, useCallback } from 'react';
import { Table, Button, Alert, Spinner, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { processoSeletivoService, etapaService } from '../services/api';

function FinalizarProcesso() {
  const [processos, setProcessos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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

  const carregarDados = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [processosRes, etapasRes] = await Promise.all([
        processoSeletivoService.findAll(),
        etapaService.findAll()
      ]);

      const processosData = processosRes.data || [];
      const etapasData = etapasRes.data || [];

      const processosComEtapasIds = new Set();
      if (Array.isArray(etapasData)) {
        etapasData.forEach(etapa => {
          if (etapa.processo_seletivo_id) {
            processosComEtapasIds.add(etapa.processo_seletivo_id);
          } else if (etapa.processoSeletivo && typeof etapa.processoSeletivo === 'object' && etapa.processoSeletivo.id) {
            processosComEtapasIds.add(etapa.processoSeletivo.id);
          } else if (etapa.processoSeletivoId) {
            processosComEtapasIds.add(etapa.processoSeletivoId);
          }
        });
      }

      const processosFiltrados = processosData.filter(processo =>
        processo.status === 'EM_ANDAMENTO' && processosComEtapasIds.has(processo.id)
      );

      setProcessos(processosFiltrados);
    } catch (err) {
      console.error("Erro ao carregar dados para finalizar processos:", err);
      setError('Erro ao carregar dados. Verifique o console para mais detalhes ou se o serviço de etapas está configurado corretamente.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  if (loading) return <div className="text-center mt-5"><Spinner animation="border" /></div>;
  if (error) return <Alert variant="danger" className="mt-4">{error}</Alert>;

  return (
    <Container className="mt-4" style={{ maxWidth: 1100, padding: 32 }}>
      <h2 style={{ textAlign: 'center', marginBottom: 32, fontSize: 32, fontWeight: 700 }}>Finalizar Processo Seletivo</h2>
      <Table hover responsive style={{ fontSize: 18, minWidth: 900 }}>
        <thead style={{ background: '#7c3aed', color: '#fff' }}>
          <tr style={{ height: 56 }}>
            <th style={{ textAlign: 'center', fontWeight: 700, fontSize: 20 }}>ID</th>
            <th style={{ textAlign: 'center', fontWeight: 700, fontSize: 20 }}>Nome</th>
            <th style={{ textAlign: 'center', fontWeight: 700, fontSize: 20 }}>Empresa</th>
            <th style={{ textAlign: 'center', fontWeight: 700, fontSize: 20 }}>Período</th>
            <th style={{ textAlign: 'center', fontWeight: 700, fontSize: 20 }}>Status</th>
            <th style={{ textAlign: 'center', fontWeight: 700, fontSize: 20 }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {processos.map((processo, idx) => (
            <tr key={processo.id} style={{ background: idx % 2 === 0 ? '#a78bfa' : '#ede9fe', height: 52 }}>
              <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>{processo.id}</td>
              <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>{processo.nome}</td>
              <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>{processo.empresa?.nome || '-'}</td>
              <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>
                {new Date(processo.data_inicio).toLocaleDateString('pt-BR')} a {new Date(processo.data_final).toLocaleDateString('pt-BR')}
              </td>
              <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>
                <span className="badge rounded-pill" style={{background: getStatusColor(processo.status), color: '#fff'}}>
                  {getStatusLabel(processo.status)}
                </span>
              </td>
              <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate(`/processos-seletivos/finalizar/${processo.id}`)}
                >
                  Finalizar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default FinalizarProcesso;