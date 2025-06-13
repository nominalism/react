import React, { useEffect, useState } from 'react';
import { Table, Alert, Spinner, Form, InputGroup, Button, Row, Col } from 'react-bootstrap';
import { candidaturaService, candidatoService, vagaService, empresaService, areaService } from '../services/api';
import { FaSearch } from 'react-icons/fa';

const PAGE_SIZE = 7;

function RelatorioContratados() {
  const [dadosCompletos, setDadosCompletos] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [empresas, setEmpresas] = useState([]);
  const [areas, setAreas] = useState([]);
  const [filtroEmpresa, setFiltroEmpresa] = useState('');
  const [filtroArea, setFiltroArea] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [resCandidaturas, resEmpresas, resAreas] = await Promise.all([
          candidaturaService.findBySelecionado(true),
          empresaService.findAll(),
          areaService.findAll()
        ]);

        setEmpresas(resEmpresas.data || []);
        setAreas(resAreas.data || []);

        const detalhes = await Promise.all(resCandidaturas.data.map(async (c) => {
          const [candidatoRes, vagaRes] = await Promise.all([
            candidatoService.findById(c.candidatoId),
            vagaService.findById(c.vagaId)
          ]);
          return {
            ...c,
            candidato: candidatoRes.data,
            vaga: vagaRes.data,
            empresa: vagaRes.data.processoSeletivo?.empresa?.nome || '-',
            empresaId: vagaRes.data.processoSeletivo?.empresa?.id || null,
            processo: vagaRes.data.processoSeletivo?.nome || '-',
            area: vagaRes.data.area?.nome || '-',
            areaId: vagaRes.data.area?.id || null,
          };
        }));
        setDadosCompletos(detalhes);
      } catch (err) {
        console.error("Erro ao buscar dados para relatório de contratados:", err);
        setError('Erro ao buscar dados. Verifique o console.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Busca e paginação
  const filtered = dadosCompletos.filter(c => {
    const searchLower = search.toLowerCase();
    const matchesSearch =
      (typeof c.candidato?.nome === 'string' ? c.candidato.nome.toLowerCase() : '').includes(searchLower) ||
      (typeof c.processo === 'string' ? c.processo.toLowerCase() : '').includes(searchLower) ||
      (typeof c.empresa === 'string' ? c.empresa.toLowerCase() : '').includes(searchLower) ||
      (typeof c.area === 'string' ? c.area.toLowerCase() : '').includes(searchLower);

    const matchesEmpresa = filtroEmpresa ? c.empresaId?.toString() === filtroEmpresa : true;
    const matchesArea = filtroArea ? c.areaId?.toString() === filtroArea : true;

    return matchesSearch && matchesEmpresa && matchesArea;
  });
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handlePage = (p) => {
    if (p >= 1 && p <= totalPages) setPage(p);
  };

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: 32 }}>
      <h2 style={{ textAlign: 'center', marginBottom: 32, fontSize: 32, fontWeight: 700 }}>Contratados</h2>
      <Row className="mb-4">
        <Col md={6}>
          <InputGroup>
            <Form.Control
              style={{ fontSize: 18, padding: '12px 16px' }}
              placeholder="Buscar por nome, processo, empresa, área..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
            />
            <Button variant="outline-secondary" disabled style={{ fontSize: 20 }}>
              <FaSearch />
            </Button>
          </InputGroup>
        </Col>
        <Col md={3}>
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
        <Col md={3}>
          <Form.Group controlId="filtroArea">
            <Form.Select
              aria-label="Filtrar por Área"
              value={filtroArea}
              onChange={e => { setFiltroArea(e.target.value); setPage(1); }}
              style={{ fontSize: 18, padding: '12px 16px', height: 'calc(2.25rem + 28px)' }}
            >
              <option value="">Todas as Áreas</option>
              {areas.map(ar => <option key={ar.id} value={ar.id}>{ar.nome}</option>)}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>
      {error && <Alert variant="danger">{error}</Alert>}
      {loading ? (
        <div className="text-center mt-5"><Spinner animation="border" /></div>
      ) : (
        <div style={{ borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 12px #e0e0e0' }}>
          <Table hover responsive style={{ marginBottom: 0, fontSize: 18, minWidth: 900 }}>
            <thead style={{ background: '#7c3aed', color: '#fff' }}>
              <tr style={{ height: 56 }}>
                <th style={{ textAlign: 'center', fontWeight: 700, fontSize: 20 }}>Candidato</th>
                <th style={{ textAlign: 'center', fontWeight: 700, fontSize: 20 }}>Processo Seletivo</th>
                <th style={{ textAlign: 'center', fontWeight: 700, fontSize: 20 }}>Empresa</th>
                <th style={{ textAlign: 'center', fontWeight: 700, fontSize: 20 }}>Área</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((c, idx) => (
                <tr key={c.id} style={{ background: idx % 2 === 0 ? '#a78bfa' : '#ede9fe', height: 52 }}>
                  <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>{c.candidato?.nome}</td>
                  <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>{c.processo}</td>
                  <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>{c.empresa}</td>
                  <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>{c.area}</td>
                </tr>
              ))}
              {paginated.length === 0 && (
                <tr><td colSpan={4} className="text-center">Nenhum resultado encontrado.</td></tr>
              )}
            </tbody>
          </Table>
        </div>
      )}
      {/* Paginação */}
      {!loading && totalPages > 1 && (
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

export default RelatorioContratados;