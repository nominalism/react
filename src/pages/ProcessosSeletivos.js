import React, { useState, useEffect } from 'react';
import { Table, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { processoSeletivoService } from '../services/api';
import { BsPencil, BsTrash } from 'react-icons/bs';

function ProcessosSeletivos() {
  const [processos, setProcessos] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    carregarProcessos();
  }, []);

  const carregarProcessos = async () => {
    try {
      const response = await processoSeletivoService.findAll();
      setProcessos(response.data);
      setError(null);
    } catch (error) {
      setError('Erro ao carregar processos seletivos. Por favor, tente novamente.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este processo seletivo?')) return;
    try {
      await processoSeletivoService.delete(id);
      setSuccess('Processo seletivo excluído com sucesso!');
      carregarProcessos();
    } catch (error) {
      setError(error.response?.data?.message || 'Erro ao excluir processo seletivo. Por favor, tente novamente.');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'NAO_INICIADO':
        return '#a78bfa';
      case 'EM_ANDAMENTO':
        return '#a259c6';
      case 'CONCLUIDO':
        return '#7c3aed';
      case 'CANCELADO':
        return '#c084fc';
      default:
        return '#e9d5ff';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'NAO_INICIADO':
        return 'Não Iniciado';
      case 'EM_ANDAMENTO':
        return 'Em Andamento';
      case 'CONCLUIDO':
        return 'Concluído';
      case 'CANCELADO':
        return 'Cancelado';
      default:
        return 'Desconhecido';
    }
  };

  return (
    <div style={{ maxWidth: 1300, margin: '0 auto', padding: 36 }}>
      <div className="page-header d-flex justify-content-between align-items-center mb-4">
        <h1 style={{ fontSize: 34, fontWeight: 700, textAlign: 'center', width: '100%' }}>Processos Seletivos</h1>
        <Button variant="primary" style={{ fontSize: 20, padding: '12px 28px' }} onClick={() => navigate('/processos-seletivos/novo')}>
          Novo Processo Seletivo
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
        <Table hover responsive style={{ fontSize: 20, minWidth: 1200, borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 12px #e0e0e0' }}>
          <thead style={{ background: '#7c3aed', color: '#fff' }}>
            <tr style={{ height: 60 }}>
              <th style={{ textAlign: 'center', fontWeight: 700, fontSize: 16, paddingLeft: 16 }}>ID</th>
              <th style={{ textAlign: 'center', fontWeight: 700, fontSize: 16 }}>Nome</th>
              <th style={{ textAlign: 'center', fontWeight: 700, fontSize: 16 }}>Descrição</th>
              <th style={{ textAlign: 'center', fontWeight: 700, fontSize: 16 }}>Empresa</th>
              <th style={{ textAlign: 'center', fontWeight: 700, fontSize: 16 }}>Período</th>
              <th style={{ textAlign: 'center', fontWeight: 700, fontSize: 16 }}>Status</th>
              <th style={{ textAlign: 'center', fontWeight: 700, fontSize: 16 }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {processos.map((processo, idx) => (
              <tr key={processo.id} style={{ background: idx % 2 === 0 ? '#a78bfa' : '#ede9fe', height: 56 }}>
                <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>{processo.id}</td>
                <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>{processo.nome}</td>
                <td className="text-truncate" style={{ maxWidth: '180px', verticalAlign: 'middle', textAlign: 'center' }}>{processo.descricao}</td>
                <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>{processo.empresa?.nome || '-'}</td>
                <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>
                  {new Date(processo.data_inicio).toLocaleDateString('pt-BR')} a {new Date(processo.data_final).toLocaleDateString('pt-BR')}
                </td>
                <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>
                  <span className={`badge rounded-pill`} style={{background: getStatusColor(processo.status), color: '#fff'}}>
                    {getStatusLabel(processo.status)}
                  </span>
                </td>
                <td className="text-center" style={{ verticalAlign: 'middle' }}>
                  <div className="action-buttons d-flex justify-content-center gap-2">
                    <Button variant="info" size="sm" style={{background: '#a259c6', border: 'none'}} onClick={() => navigate(`/processos-seletivos/editar/${processo.id}`)}>
                      <BsPencil color="#fff" />
                    </Button>
                    <Button variant="danger" size="sm" style={{background: '#7c3aed', border: 'none'}} onClick={() => handleDelete(processo.id)}>
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

export default ProcessosSeletivos; 