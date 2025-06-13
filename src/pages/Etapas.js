import React, { useState, useEffect } from 'react';
import { Table, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { etapaService } from '../services/api';
import { BsPencil, BsTrash } from 'react-icons/bs';

function Etapas() {
  const [etapas, setEtapas] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const getStatusLabel = (status) => {
    switch (status) {
      case 'PENDENTE':
        return 'Pendente';
      case 'EM_ANDAMENTO':
        return 'Em Andamento';
      case 'CONCLUIDO':
        return 'Concluído';
      default:
        return status;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDENTE':
        return '#a78bfa'; // Roxo claro
      case 'EM_ANDAMENTO':
        return '#a259c6'; // Roxo médio
      case 'CONCLUIDO':
        return '#7c3aed'; // Roxo escuro
      default:
        return '#e9d5ff'; // Roxo bem claro
    }
  };

  useEffect(() => {
    carregarEtapas();
  }, []);

  const carregarEtapas = async () => {
    try {
      const response = await etapaService.findAll();
      setEtapas(response.data);
      setError(null);
    } catch (error) {
      setError('Erro ao carregar etapas. Por favor, tente novamente.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir esta etapa?')) return;
    try {
      await etapaService.delete(id);
      setSuccess('Etapa excluída com sucesso!');
      carregarEtapas();
    } catch (error) {
      setError(error.response?.data?.message || 'Erro ao excluir etapa. Por favor, tente novamente.');
    }
  };

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: 32 }}>
      <div className="page-header d-flex justify-content-between align-items-center mb-4">
        <h1 style={{ fontSize: 32, fontWeight: 700 }}>Etapas</h1>
        <Button variant="primary" style={{ fontSize: 18, padding: '10px 24px' }} onClick={() => navigate('/etapas/novo')}>
          Nova Etapa
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
        <Table hover responsive style={{ fontSize: 18, minWidth: 900 }}>
          <thead style={{ background: '#7c3aed', color: '#fff' }}>
            <tr style={{ height: 56 }}>
              <th style={{ textAlign: 'center', fontWeight: 700, fontSize: 20 }}>ID</th>
              <th style={{ textAlign: 'center', fontWeight: 700, fontSize: 20 }}>Nome</th>
              <th style={{ textAlign: 'center', fontWeight: 700, fontSize: 20 }}>Descrição</th>
              <th style={{ textAlign: 'center', fontWeight: 700, fontSize: 20 }}>Processo Seletivo</th>
              <th style={{ textAlign: 'center', fontWeight: 700, fontSize: 20 }}>Tipo</th>
              <th style={{ textAlign: 'center', fontWeight: 700, fontSize: 20 }}>Status</th>
              <th style={{ textAlign: 'center', fontWeight: 700, fontSize: 20 }}>Máx. Candidatos</th>
              <th style={{ textAlign: 'center', fontWeight: 700, fontSize: 20 }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {etapas.map((etapa, idx) => (
              <tr key={etapa.id} style={{ background: idx % 2 === 0 ? '#a78bfa' : '#ede9fe', height: 52 }}>
                <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>{etapa.id}</td>
                <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>{etapa.nome}</td>
                <td className="text-truncate" style={{ maxWidth: '150px', verticalAlign: 'middle', textAlign: 'center' }}>{etapa.descricao}</td>
                <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>{etapa.processoSeletivo?.nome}</td>
                <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>{etapa.tipo}</td>
                <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>
                  <span className="badge rounded-pill" style={{background: getStatusColor(etapa.status_Etapa), color: '#fff'}}>
                    {getStatusLabel(etapa.status_Etapa)}
                  </span>
                </td>
                <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>{etapa.max_candidatos}</td>
                <td className="text-center" style={{ verticalAlign: 'middle' }}>
                  <div className="action-buttons d-flex justify-content-center gap-2">
                    <Button variant="info" size="sm" style={{background: '#a259c6', border: 'none'}} onClick={() => navigate(`/etapas/editar/${etapa.id}`)}>
                      <BsPencil color="#fff" />
                    </Button>
                    <Button variant="danger" size="sm" style={{background: '#7c3aed', border: 'none'}} onClick={() => handleDelete(etapa.id)}>
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

export default Etapas; 