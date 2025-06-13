import React, { useEffect, useState } from 'react';
import { Table, Alert, Spinner, Form, InputGroup, Button, Row, Col } from 'react-bootstrap';
import { candidaturaService, empresaService } from '../services/api';
import { FaSearch } from 'react-icons/fa';

const PAGE_SIZE = 7;

function RelatorioContratacoesPorEmpresa() {
  const [dados, setDados] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [empresas, setEmpresas] = useState([]);
  const [filtroEmpresa, setFiltroEmpresa] = useState('');
  const [filtroCnpj, setFiltroCnpj] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const empresasRes = await empresaService.findAll();
        setEmpresas(empresasRes.data || []);

        const res = await candidaturaService.findContratacoesPorEmpresa();
        setDados(res.data || []);
      } catch (err) {
        console.error("Erro ao buscar dados para Relatório Contratações por Empresa:", err);
        setError('Erro ao buscar dados. Verifique o console.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered = dados.filter(item => {
    const searchLower = search.toLowerCase();
    const cnpjLower = filtroCnpj.toLowerCase();

    const matchesSearch = searchLower ? (typeof item.empresa_nome === 'string' ? item.empresa_nome.toLowerCase().includes(searchLower) : false) : true;
    const matchesEmpresa = filtroEmpresa ? item.empresa_id?.toString() === filtroEmpresa : true;
    const matchesCnpj = filtroCnpj ? (typeof item.cnpj === 'string' ? item.cnpj.toLowerCase().includes(cnpjLower) : false) : true;

    return matchesSearch && matchesEmpresa && matchesCnpj;
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
      <h2 style={{ textAlign: 'center', marginBottom: 32, fontSize: 32, fontWeight: 700 }}>Contratações por Empresa</h2>
      <Row className="mb-4">
        <Col md={4}>
          <InputGroup>
            <Form.Control
              style={{ fontSize: 18, padding: '12px 16px' }}
              placeholder="Buscar por nome da empresa..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
            />
            <Button variant="outline-secondary" disabled style={{ fontSize: 20 }}>
              <FaSearch />
            </Button>
          </InputGroup>
        </Col>
        <Col md={4}>
          <Form.Group controlId="filtroEmpresa">
            <Form.Select
              aria-label="Filtrar por Empresa"
              value={filtroEmpresa}
              onChange={e => { setFiltroEmpresa(e.target.value); setPage(1); }}
              style={{ fontSize: 18, padding: '12px 16px', height: 'calc(2.25rem + 28px)' }}
            >
              <option value="">Todas as Empresas</option>
              {empresas.map(emp => <option key={emp.id} value={emp.id}>{emp.nome}</option>)}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group controlId="filtroCnpj">
            <Form.Control
              type="text"
              placeholder="Filtrar por CNPJ..."
              value={filtroCnpj}
              onChange={e => { setFiltroCnpj(e.target.value); setPage(1); }}
              style={{ fontSize: 18, padding: '12px 16px', height: 'calc(2.25rem + 28px)' }}
            />
          </Form.Group>
        </Col>
      </Row>
      <div style={{ borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 12px #e0e0e0' }}>
        <Table hover responsive style={{ marginBottom: 0, fontSize: 20, minWidth: 900 }}>
          <thead style={{ background: '#7c3aed', color: '#fff' }}>
            <tr style={{ height: 56 }}>
              <th style={{ textAlign: 'center', fontWeight: 700, fontSize: 22 }}>Empresa</th>
              <th style={{ textAlign: 'center', fontWeight: 700, fontSize: 22 }}>CNPJ</th>
              <th style={{ textAlign: 'center', fontWeight: 700, fontSize: 22 }}>Total de Contratações</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((item, idx) => (
              <tr key={idx} style={{ background: idx % 2 === 0 ? '#a78bfa' : '#ede9fe', height: 52 }}>
                <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>{item.empresa_nome}</td>
                <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>{item.cnpj}</td>
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

export default RelatorioContratacoesPorEmpresa;