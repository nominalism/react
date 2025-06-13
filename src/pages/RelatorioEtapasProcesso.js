import React, { useEffect, useState } from 'react';
import { Table, Alert, Spinner, Form, InputGroup, Button } from 'react-bootstrap';
import { etapaService, processoSeletivoService } from '../services/api';
import { FaSearch } from 'react-icons/fa';

const PAGE_SIZE = 7;

function RelatorioEtapasProcesso() {
  const [dados, setDados] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      setError(null);
      try {
        const processosRes = await processoSeletivoService.findAll();
        // Para cada processo, buscar as etapas
        const detalhes = await Promise.all(processosRes.data.map(async (proc) => {
          let etapas = [];
          try {
            const etapasRes = await etapaService.findByProcessoSeletivo(proc.id);
            etapas = etapasRes.data;
          } catch {}
          return {
            processo: proc.nome,
            empresa: proc.empresa?.nome || '-',
            quantidadeEtapas: etapas.length
          };
        }));
        setDados(detalhes);
      } catch (err) {
        setError('Erro ao carregar dados dos processos seletivos.');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // Busca e paginação
  const filtered = dados.filter(item =>
    (typeof item.processo === 'string' ? item.processo.toLowerCase() : '').includes(search.toLowerCase()) ||
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
      <h2 style={{ textAlign: 'center', marginBottom: 32, fontSize: 32, fontWeight: 700 }}>Etapas por Processo Seletivo</h2>
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
              <th style={{ textAlign: 'center', fontWeight: 700, fontSize: 22 }}>Quantidade de Etapas</th>
              <th style={{ textAlign: 'center', fontWeight: 700, fontSize: 22 }}>Processo Seletivo</th>
              <th style={{ textAlign: 'center', fontWeight: 700, fontSize: 22 }}>Empresa</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((item, idx) => (
              <tr key={idx} style={{ background: idx % 2 === 0 ? '#a78bfa' : '#ede9fe', height: 52 }}>
                <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>{item.quantidadeEtapas}</td>
                <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>{item.processo}</td>
                <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>{item.empresa}</td>
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

export default RelatorioEtapasProcesso;