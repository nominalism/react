import React, { useEffect, useState } from 'react';
import { Table, Alert, Spinner, Form, InputGroup, Button, Row, Col } from 'react-bootstrap';
import { areaService } from '../services/api';
import { FaSearch } from 'react-icons/fa';

const PAGE_SIZE = 7;

function RelatorioContratacoesPorArea() {
  const [dados, setDados] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [areas, setAreas] = useState([]);
  const [filtroArea, setFiltroArea] = useState('');
  const [filtroCurso, setFiltroCurso] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const areasRes = await areaService.findAll();
        setAreas(areasRes.data || []);

        const res = await areaService.findContratacoesPorArea();
        setDados(res.data || []);
      } catch (err) {
        console.error("Erro ao buscar dados para Relatório Contratações por Área:", err);
        setError('Erro ao buscar dados. Verifique o console.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered = dados.filter(item => {
    const searchLower = search.toLowerCase();
    const cursoLower = filtroCurso.toLowerCase();

    const matchesSearch = searchLower ? (typeof item.area_nome === 'string' ? item.area_nome.toLowerCase().includes(searchLower) : false) : true;
    const matchesArea = filtroArea ? item.area_id?.toString() === filtroArea : true;
    const matchesCurso = filtroCurso ? (typeof item.curso === 'string' ? item.curso.toLowerCase().includes(cursoLower) : false) : true;

    return matchesSearch && matchesArea && matchesCurso;
  });
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handlePage = (p) => {
    if (p >= 1 && p <= totalPages) setPage(p);
  };

  if (loading) return <div className="text-center mt-5"><Spinner animation="border" /></div>;
  if (error) return <Alert variant="danger" className="mt-4">{error}</Alert>;

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: 32 }}>
      <h2 style={{ textAlign: 'center', marginBottom: 32, fontSize: 32, fontWeight: 700 }}>Contratações por Área</h2>
      <Row className="mb-4">
        <Col md={4}>
          <InputGroup>
            <Form.Control
              style={{ fontSize: 18, padding: '12px 16px' }}
              placeholder="Buscar por nome da área..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
            />
            <Button variant="outline-secondary" disabled style={{ fontSize: 20 }}>
              <FaSearch />
            </Button>
          </InputGroup>
        </Col>
        <Col md={4}>
          <Form.Group controlId="filtroArea">
            <Form.Select
              aria-label="Filtrar por Área"
              value={filtroArea}
              onChange={e => { setFiltroArea(e.target.value); setPage(1); }}
              style={{ fontSize: 18, padding: '12px 16px', height: 'calc(2.25rem + 28px)' }}
            >
              <option value="">Todas as Áreas</option>
              {areas.map(area => <option key={area.id} value={area.id}>{area.nome}</option>)}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group controlId="filtroCurso">
            <Form.Control
              type="text"
              placeholder="Filtrar por Curso..."
              value={filtroCurso}
              onChange={e => { setFiltroCurso(e.target.value); setPage(1); }}
              style={{ fontSize: 18, padding: '12px 16px', height: 'calc(2.25rem + 28px)' }}
            />
          </Form.Group>
        </Col>
      </Row>
      <div style={{ borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 12px #e0e0e0' }}>
        <Table hover responsive style={{ marginBottom: 0, fontSize: 20, minWidth: 900 }}>
          <thead style={{ background: '#7c3aed', color: '#fff' }}>
            <tr style={{ height: 56 }}>
              <th style={{ textAlign: 'center', fontWeight: 700, fontSize: 22 }}>Área</th>
              <th style={{ textAlign: 'center', fontWeight: 700, fontSize: 22 }}>Curso</th>
              <th style={{ textAlign: 'center', fontWeight: 700, fontSize: 22 }}>Total de Contratações</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((item, idx) => (
              <tr key={idx} style={{ background: idx % 2 === 0 ? '#a78bfa' : '#ede9fe', height: 52 }}>
                <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>{item.area_nome}</td>
                <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>{item.curso}</td>
                <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>{item.total_contratacoes}</td>
              </tr>
            ))}
            {paginated.length === 0 && (
              <tr><td colSpan={3} className="text-center">Nenhum resultado encontrado.</td></tr>
            )}
          </tbody>
        </Table>
      </div>
      {/* Paginação */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-between align-items-center mt-4">
          <Button variant="secondary" style={{ background: '#7c3aed', border: 'none', fontSize: 18, padding: '8px 20px' }} onClick={() => handlePage(page - 1)} disabled={page === 1}>Anterior</Button>
          <div>
            {[...Array(totalPages)].map((_, i) => (
              <Button
                key={i}
                variant={page === i + 1 ? 'primary' : 'outline-secondary'}
                style={{ margin: '0 4px', background: page === i + 1 ? '#7c3aed' : '#ede9fe', color: page === i + 1 ? '#fff' : '#7c3aed', border: 'none', fontSize: 18, padding: '8px 16px' }}
                onClick={() => handlePage(i + 1)}
              >
                {i + 1}
              </Button>
            ))}
          </div>
          <Button variant="secondary" style={{ background: '#7c3aed', border: 'none', fontSize: 18, padding: '8px 20px' }} onClick={() => handlePage(page + 1)} disabled={page === totalPages}>Próximo</Button>
        </div>
      )}
    </div>
  );
}

export default RelatorioContratacoesPorArea;