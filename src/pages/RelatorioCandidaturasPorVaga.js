import React, { useEffect, useState } from 'react';
import { Table, Alert, Spinner, Form, InputGroup, Button } from 'react-bootstrap';
import { candidaturaService, vagaService, processoSeletivoService, empresaService } from '../services/api';
import { FaSearch } from 'react-icons/fa';

const PAGE_SIZE = 7;

function RelatorioCandidaturasPorVaga() {
  const [dadosCompletos, setDadosCompletos] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await candidaturaService.findCandidaturasPorVaga();
        const detalhes = await Promise.all(res.data.map(async (item) => {
          let empresaNome = '-';
          try {
            const vagaRes = await vagaService.findById(item.vaga_id);
            if (vagaRes.data.processoSeletivo?.empresa?.nome) {
              empresaNome = vagaRes.data.processoSeletivo.empresa.nome;
            } else if (vagaRes.data.processoSeletivo?.empresaId) {
              const empresaRes = await empresaService.findById(vagaRes.data.processoSeletivo.empresaId);
              empresaNome = empresaRes.data.nome || '-';
            } else if (vagaRes.data.processoSeletivoId) {
              const psRes = await processoSeletivoService.findById(vagaRes.data.processoSeletivoId);
              if (psRes.data.empresa?.nome) {
                empresaNome = psRes.data.empresa.nome;
              } else if (psRes.data.empresaId) {
                const empresaRes = await empresaService.findById(psRes.data.empresaId);
                empresaNome = empresaRes.data.nome || '-';
              }
            }
          } catch (e) {}
          return {
            ...item,
            empresa: empresaNome
          };
        }));
        setDadosCompletos(detalhes);
      } catch (err) {
        setError('Erro ao buscar relatório de candidaturas por vaga.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Busca e paginação
  const filtered = dadosCompletos.filter(item =>
    (typeof item.cargo === 'string' ? item.cargo.toLowerCase() : '').includes(search.toLowerCase()) ||
    (typeof item.empresa === 'string' ? item.empresa.toLowerCase() : '').includes(search.toLowerCase())
  );
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
      <InputGroup className="mb-4" style={{ maxWidth: 500, margin: '0 auto' }}>
        <Form.Control
          style={{ fontSize: 18, padding: '12px 16px' }}
          placeholder="Buscar..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
        />
        <Button variant="outline-secondary" disabled style={{ fontSize: 20 }}>
          <FaSearch />
        </Button>
      </InputGroup>
      <div style={{ borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 12px #e0e0e0' }}>
        <Table hover responsive style={{ marginBottom: 0, fontSize: 20, minWidth: 900 }}>
          <thead style={{ background: '#7c3aed', color: '#fff' }}>
            <tr style={{ height: 56 }}>
              <th style={{ textAlign: 'center', fontWeight: 700, fontSize: 22 }}>Vaga</th>
              <th style={{ textAlign: 'center', fontWeight: 700, fontSize: 22 }}>Empresa</th>
              <th style={{ textAlign: 'center', fontWeight: 700, fontSize: 22 }}>Total de Candidaturas</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((item, idx) => (
              <tr key={idx} style={{ background: idx % 2 === 0 ? '#a78bfa' : '#ede9fe', height: 52 }}>
                <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>{item.cargo}</td>
                <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>{item.empresa}</td>
                <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>{item.total_candidaturas}</td>
                <td></td>
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