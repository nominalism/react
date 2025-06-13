import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { FaListOl, FaUserCheck, FaClipboardList, FaBuilding, FaChartBar, FaLayerGroup } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const relatorios = [
  {
    title: 'Relatório de Etapas por Processo Seletivo',
    text: 'Visualize as etapas de um processo seletivo específico.',
    href: '/relatorios/etapas-processo',
    icon: <FaListOl size={32} />,
    gradient: 'linear-gradient(135deg, #a259c6 0%, #6d28d9 100%)'
  },
  {
    title: 'Relatório de Contratados',
    text: 'Veja todos os candidatos contratados em processos seletivos.',
    href: '/relatorios/contratados',
    icon: <FaUserCheck size={32} />,
    gradient: 'linear-gradient(135deg, #b983ff 0%, #8f5fe8 100%)'
  },
  {
    title: 'Relatório de Candidaturas por Vaga',
    text: 'Analise as candidaturas recebidas para cada vaga.',
    href: '/relatorios/candidaturas-por-vaga',
    icon: <FaClipboardList size={32} />,
    gradient: 'linear-gradient(135deg, #c084fc 0%, #a21caf 100%)'
  },
  {
    title: 'Relatório de Contratações por Empresa',
    text: 'Veja o total de contratações realizadas por cada empresa.',
    href: '/relatorios/contratacoes-por-empresa',
    icon: <FaBuilding size={32} />,
    gradient: 'linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)'
  },
  {
    title: 'Relatório de Processos Seletivos por Empresa',
    text: 'Acompanhe os processos seletivos realizados por cada empresa.',
    href: '/relatorios/processos-por-empresa',
    icon: <FaChartBar size={32} />,
    gradient: 'linear-gradient(135deg, #818cf8 0%, #a21caf 100%)'
  },
  {
    title: 'Relatório de Contratações por Área',
    text: 'Veja a quantidade de contratações realizadas por área de atuação.',
    href: '/relatorios/contratacoes-por-area',
    icon: <FaLayerGroup size={32} />,
    gradient: 'linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)'
  }
];

function Relatorios() {
  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: 32 }}>
      <h1 style={{ textAlign: 'center', fontSize: 40, fontWeight: 800, marginBottom: 40, letterSpacing: 1 }}>Relatórios</h1>
      <Row xs={1} sm={2} md={3} className="g-4 justify-content-center">
        {relatorios.map((rel, idx) => (
          <Col key={idx} className="d-flex align-items-stretch">
            <Link to={rel.href} style={{ textDecoration: 'none', width: '100%' }}>
              <Card
                style={{
                  background: rel.gradient,
                  color: '#fff',
                  border: 'none',
                  borderRadius: 18,
                  boxShadow: '0 4px 24px rgba(162,89,198,0.15)',
                  minHeight: 220,
                  transition: 'transform 0.18s, box-shadow 0.18s',
                  cursor: 'pointer',
                  overflow: 'hidden',
                  width: '100%'
                }}
                className="w-100 relatorio-card"
                onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-6px) scale(1.03)'; e.currentTarget.style.boxShadow = '0 8px 32px #a78bfa55'; }}
                onMouseOut={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 24px rgba(162,89,198,0.15)'; }}
              >
                <Card.Body className="d-flex flex-column align-items-center justify-content-center text-center p-4">
                  <div style={{ marginBottom: 18 }}>{rel.icon}</div>
                  <Card.Title style={{ fontSize: 22, fontWeight: 700, marginBottom: 10 }}>{rel.title}</Card.Title>
                  <Card.Text style={{ fontSize: 16, opacity: 0.93 }}>{rel.text}</Card.Text>
                  <div style={{ marginTop: 18 }}>
                    <span style={{ background: '#fff', color: '#7c3aed', borderRadius: 8, padding: '6px 18px', fontWeight: 700, fontSize: 15, boxShadow: '0 2px 8px #a78bfa22' }}>
                      Gerar Relatório
                    </span>
                  </div>
                </Card.Body>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default Relatorios;