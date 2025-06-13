import React, { useState, useEffect } from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { vagaService, candidatoService, empresaService, processoSeletivoService } from '../services/api';

function Home() {
  const [stats, setStats] = useState({
    vagas: 0,
    candidatos: 0,
    empresas: 0,
    processos: 0
  });
  const [vagasRecentes, setVagasRecentes] = useState([]);
  const [processosAtivos, setProcessosAtivos] = useState([]);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const [vagasResponse, candidatosResponse, empresasResponse, processosResponse] = await Promise.all([
        vagaService.findAll(),
        candidatoService.findAll(),
        empresaService.findAll(),
        processoSeletivoService.findAll()
      ]);

      setStats({
        vagas: vagasResponse.data.length,
        candidatos: candidatosResponse.data.length,
        empresas: empresasResponse.data.length,
        processos: processosResponse.data.length
      });

      // Carregar vagas recentes (últimas 3)
      const vagasOrdenadas = [...vagasResponse.data].sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      ).slice(0, 3);
      setVagasRecentes(vagasOrdenadas);

      // Exibir apenas processos em andamento
      const processosEmAndamento = processosResponse.data.filter(processo => processo.status === 'EM_ANDAMENTO').slice(0, 3);
      setProcessosAtivos(processosEmAndamento);

    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'NAO_INICIADO':
        return 'Não Iniciado';
      case 'EM_ANDAMENTO':
        return 'Em andamento';
      case 'CONCLUIDO':
        return 'Concluído';
      case 'CANCELADO':
        return 'Cancelado';
      default:
        return 'Outro status';
    }
  };

  return (
    <div className="container-fluid p-0">
      <h1 className="mb-4">Dashboard</h1>
      <Row>
        <Col md={3}>
          <Card className="mb-4" style={{ background: 'linear-gradient(135deg, #a259c6 0%, #6d28d9 100%)', color: '#fff', boxShadow: '0 4px 16px rgba(162,89,198,0.15)' }}>
            <Card.Body>
              <Card.Title>Vagas</Card.Title>
              <Card.Text className="h2">{stats.vagas}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="mb-4" style={{ background: 'linear-gradient(135deg, #b983ff 0%, #8f5fe8 100%)', color: '#fff', boxShadow: '0 4px 16px rgba(185,131,255,0.15)' }}>
            <Card.Body>
              <Card.Title>Candidatos</Card.Title>
              <Card.Text className="h2">{stats.candidatos}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="mb-4" style={{ background: 'linear-gradient(135deg, #c084fc 0%, #a21caf 100%)', color: '#fff', boxShadow: '0 4px 16px rgba(192,132,252,0.15)' }}>
            <Card.Body>
              <Card.Title>Empresas</Card.Title>
              <Card.Text className="h2">{stats.empresas}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="mb-4" style={{ background: 'linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)', color: '#fff', boxShadow: '0 4px 16px rgba(167,139,250,0.15)' }}>
            <Card.Body>
              <Card.Title>Processos Seletivos</Card.Title>
              <Card.Text className="h2">{stats.processos}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Vagas Recentes</h5>
            </Card.Header>
            <Card.Body>
              <ul className="list-group list-group-flush">
                {vagasRecentes.map((vaga) => (
                  <li key={vaga.id} className="list-group-item d-flex justify-content-between align-items-center">
                    {vaga.cargo || '-'}
                    <span className="badge bg-primary rounded-pill" style={{background: '#a259c6'}}>
                      {vaga.empresa?.nome || '-'}
                    </span>
                  </li>
                ))}
              </ul>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Processos em Andamento</h5>
            </Card.Header>
            <Card.Body>
              <ul className="list-group list-group-flush">
                {processosAtivos.map((processo) => (
                  <li key={processo.id} className="list-group-item d-flex justify-content-between align-items-center">
                    {processo.nome || '-'}
                    <span className={`badge rounded-pill`} style={{background: processo.status === 'EM_ANDAMENTO' ? '#a259c6' : '#c084fc', color: '#fff'}}>
                      {processo.status === 'EM_ANDAMENTO' ? 'Em andamento' : getStatusLabel(processo.status)}
                    </span>
                  </li>
                ))}
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Home;