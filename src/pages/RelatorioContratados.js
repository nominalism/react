import React, { useEffect, useState } from 'react';
import { Table, Alert, Spinner, Form, InputGroup, Button } from 'react-bootstrap';
import { candidaturaService, candidatoService, vagaService } from '../services/api';
import { FaSearch, FaFilter } from 'react-icons/fa';

const PAGE_SIZE = 7;

function RelatorioContratados() {
  const [dadosCompletos, setDadosCompletos] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchContratados = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await candidaturaService.findBySelecionado(true);
        const detalhes = await Promise.all(res.data.map(async (c) => {
          const [candidatoRes, vagaRes] = await Promise.all([
            candidatoService.findById(c.candidatoId),
            vagaService.findById(c.vagaId)
          ]);
          return {
            ...c,
            candidato: candidatoRes.data,
            vaga: vagaRes.data,
            empresa: vagaRes.data.processoSeletivo?.empresa?.nome || '-',
            processo: vagaRes.data.processoSeletivo?.nome || '-',
            area: vagaRes.data.area?.nome || '-',
          };
        }));
        setDadosCompletos(detalhes);
      } catch (err) {
        setError('Erro ao buscar contratados.');
      } finally {
        setLoading(false);
      }
    };
    fetchContratados();
  }, []);

  // Busca e paginação
  const filtered = dadosCompletos.filter(c =>
    (typeof c.candidato?.nome === 'string' ? c.candidato.nome.toLowerCase() : '').includes(search.toLowerCase()) ||
    (typeof c.processo === 'string' ? c.processo.toLowerCase() : '').includes(search.toLowerCase()) ||
    (typeof c.empresa === 'string' ? c.empresa.toLowerCase() : '').includes(search.toLowerCase()) ||
    (typeof c.area === 'string' ? c.area.toLowerCase() : '').includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handlePage = (p) => {
    if (p >= 1 && p <= totalPages) setPage(p);
  };

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: 32 }}>
      <h2 style={{ textAlign: 'center', marginBottom: 32, fontSize: 32, fontWeight: 700 }}>Contratados</h2>
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
                <th style={{ width: 40 }}><FaFilter /></th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((c, idx) => (
                <tr key={c.id} style={{ background: idx % 2 === 0 ? '#a78bfa' : '#ede9fe', height: 52 }}>
                  <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>{c.candidato?.nome}</td>
                  <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>{c.processo}</td>
                  <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>{c.empresa}</td>
                  <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>{c.area}</td>
                  <td></td>
                </tr>
              ))}
              {paginated.length === 0 && (
                <tr><td colSpan={5} className="text-center">Nenhum resultado encontrado.</td></tr>
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