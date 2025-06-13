import React, { useState, useEffect } from 'react';
import { Table, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { candidaturaService } from '../services/api';
import { BsPencil, BsTrash } from 'react-icons/bs';

function Candidaturas() {
  const [candidaturas, setCandidaturas] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    carregarCandidaturas();
  }, []);

  const carregarCandidaturas = async () => {
    try {
      const response = await candidaturaService.findAll();
      setCandidaturas(response.data);
      setError(null);
    } catch (error) {
      setError('Erro ao carregar candidaturas. Por favor, tente novamente.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir esta candidatura?')) return;
    try {
      await candidaturaService.delete(id);
      setSuccess('Candidatura excluída com sucesso!');
      carregarCandidaturas();
    } catch (error) {
      setError(error.response?.data?.message || 'Erro ao excluir candidatura. Por favor, tente novamente.');
    }
  };

  const getStatusColor = (selecionado) => selecionado ? '#7c3aed' : '#a78bfa';
  const getAtualizadoColor = (atualizado) => atualizado ? '#a259c6' : '#e9d5ff';

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: 32 }}>
      <div className="page-header d-flex justify-content-between align-items-center mb-4">
        <h1 style={{ fontSize: 32, fontWeight: 700 }}>Candidaturas</h1>
        <Button variant="primary" style={{ fontSize: 18, padding: '10px 24px' }} onClick={() => navigate('/candidaturas/novo')}>
          Nova Candidatura
        </Button>
      </div>

      {error && (
        <Alert variant="danger" onClose={() => setError(null)} dismissible>
          {error}
        </Alert>
      )}

      {success && (
        <Alert variant="success" onClose={() => setSuccess(null)} dismissible>
          {success}
        </Alert>
      )}

      <div className="table-responsive">
        <Table hover responsive style={{ fontSize: 18, minWidth: 1100 }}>
          <thead style={{ background: '#7c3aed', color: '#fff' }}>
            <tr style={{ height: 56 }}>
              <th style={{ textAlign: 'center', fontWeight: 700, fontSize: 20 }}>ID</th>
              <th style={{ textAlign: 'center', fontWeight: 700, fontSize: 20 }}>Candidato</th>
              <th style={{ textAlign: 'center', fontWeight: 700, fontSize: 20 }}>Vaga</th>
              <th style={{ textAlign: 'center', fontWeight: 700, fontSize: 20 }}>Data</th>
              <th style={{ textAlign: 'center', fontWeight: 700, fontSize: 20 }}>Status</th>
              <th style={{ textAlign: 'center', fontWeight: 700, fontSize: 20 }}>Dados Atualizados</th>
              <th style={{ textAlign: 'center', fontWeight: 700, fontSize: 20 }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {candidaturas.map((candidatura, idx) => (
              <tr key={candidatura.id} style={{ background: idx % 2 === 0 ? '#a78bfa' : '#ede9fe', height: 52 }}>
                <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>{candidatura.id}</td>
                <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>{candidatura.candidato?.nome}</td>
                <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>{candidatura.vaga?.cargo}</td>
                <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>{candidatura.data ? new Date(candidatura.data).toLocaleDateString('pt-BR') : '-'}</td>
                <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>
                  <span className="badge rounded-pill" style={{background: getStatusColor(candidatura.selecionado), color: '#fff'}}>
                    {candidatura.selecionado ? 'Selecionado' : 'Não Selecionado'}
                  </span>
                </td>
                <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>
                  <span className="badge rounded-pill" style={{background: getAtualizadoColor(candidatura.dados_atualizados), color: '#fff'}}>
                    {candidatura.dados_atualizados ? 'Sim' : 'Não'}
                  </span>
                </td>
                <td className="text-center" style={{ verticalAlign: 'middle' }}>
                  <div className="action-buttons d-flex justify-content-center gap-2">
                    <Button variant="info" size="sm" style={{background: '#a259c6', border: 'none'}} onClick={() => navigate(`/candidaturas/editar/${candidatura.id}`)}>
                      <BsPencil color="#fff" />
                    </Button>
                    <Button variant="danger" size="sm" style={{background: '#7c3aed', border: 'none'}} onClick={() => handleDelete(candidatura.id)}>
                      <BsTrash color="#fff" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
}

export default Candidaturas;