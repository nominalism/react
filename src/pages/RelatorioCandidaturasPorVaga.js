import React, { useEffect, useState } from 'react';
import { Table, Alert, Spinner, Form, InputGroup, Button, Row, Col } from 'react-bootstrap';
import { candidaturaService, vagaService, processoSeletivoService, empresaService, areaService } from '../services/api';
import { FaSearch } from 'react-icons/fa';

const PAGE_SIZE = 7;

function RelatorioCandidaturasPorVaga() {
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
          candidaturaService.findCandidaturasPorVaga(),
          empresaService.findAll(),
          areaService.findAll()
        ]);

        setEmpresas(resEmpresas.data || []);
        setAreas(resAreas.data || []);

        const detalhes = await Promise.all((resCandidaturas.data || []).map(async (item) => {
          let empresaNome = '-';
          let empresaId = null;
          let areaNome = '-';
          let areaId = null;

          try {
            const vagaRes = await vagaService.findById(item.vaga_id);
            const vagaData = vagaRes.data;

            if (vagaData) {
              areaNome = vagaData.area?.nome || '-';
              areaId = vagaData.area?.id || null;

              if (vagaData.processoSeletivo?.empresa?.nome) {
                empresaNome = vagaData.processoSeletivo.empresa.nome;
                empresaId = vagaData.processoSeletivo.empresa.id;
              } else if (vagaData.processoSeletivo?.empresaId) {
                empresaId = vagaData.processoSeletivo.empresaId;
                const empresaRes = await empresaService.findById(empresaId);
                empresaNome = empresaRes.data?.nome || '-';
              } else if (vagaData.processoSeletivoId) {
                const psRes = await processoSeletivoService.findById(vagaData.processoSeletivoId);
                const psData = psRes.data;
                if (psData?.empresa?.nome) {
                  empresaNome = psData.empresa.nome;
                  empresaId = psData.empresa.id;
                } else if (psData?.empresaId) {
                  empresaId = psData.empresaId;
                  const empresaRes = await empresaService.findById(empresaId);
                  empresaNome = empresaRes.data?.nome || '-';
                }
              }
            }
          } catch (e) {
            console.error("Erro ao buscar detalhes da vaga:", e, "para o item:", item);
          }
          return {
            ...item,
            empresa: empresaNome,
            empresaId: empresaId,
            area: areaNome,
            areaId: areaId
          };
        }));
        setDadosCompletos(detalhes);
      } catch (err) {
        console.error("Erro ao buscar relatório de candidaturas por vaga:", err);
        setError('Erro ao buscar relatório de candidaturas por vaga. Verifique o console.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Busca e paginação
  const filtered = dadosCompletos.filter(item => {
    const searchLower = search.toLowerCase();
    const matchesSearch =
      (typeof item.cargo === 'string' ? item.cargo.toLowerCase() : '').includes(searchLower) ||
      (typeof item.empresa === 'string' ? item.empresa.toLowerCase() : '').includes(searchLower) ||
      (typeof item.area === 'string' ? item.area.toLowerCase() : '').includes(searchLower);

    const matchesEmpresa = filtroEmpresa ? item.empresaId?.toString() === filtroEmpresa : true;
    const matchesArea = filtroArea ? item.areaId?.toString() === filtroArea : true;

    return matchesSearch && matchesEmpresa && matchesArea;
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
      <h2 style={{ textAlign: 'center', marginBottom: 32, fontSize: 32, fontWeight: 700 }}>Candidaturas por Vaga</h2>
      <Row className="mb-4">
        <Col md={6}>
          <InputGroup>
            <Form.Control
              style={{ fontSize: 18, padding: '12px 16px' }}
              placeholder="Buscar por cargo, empresa, área..."
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
      <div style={{ borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 12px #e0e0e0' }}>
        <Table hover responsive style={{ marginBottom: 0, fontSize: 20, minWidth: 900 }}>
          <thead style={{ background: '#7c3aed', color: '#fff' }}>
            <tr style={{ height: 56 }}>
              <th style={{ textAlign: 'center', fontWeight: 700, fontSize: 22 }}>Vaga</th>
              <th style={{ textAlign: 'center', fontWeight: 700, fontSize: 22 }}>Empresa</th>
              <th style={{ textAlign: 'center', fontWeight: 700, fontSize: 22 }}>Área</th>
              <th style={{ textAlign: 'center', fontWeight: 700, fontSize: 22 }}>Total de Candidaturas</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((item, idx) => (
              <tr key={idx} style={{ background: idx % 2 === 0 ? '#a78bfa' : '#ede9fe', height: 52 }}>
                <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>{item.cargo}</td>
                <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>{item.empresa}</td>
                <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>{item.area}</td>
                <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>{item.total_candidaturas}</td>
              </tr>
            ))}
            {paginated.length === 0 && (
              <tr><td colSpan={4} className="text-center">Nenhum resultado encontrado.</td></tr>
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

export default RelatorioCandidaturasPorVaga;