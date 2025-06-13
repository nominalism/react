import React, { useState, useEffect } from 'react';
import { Table, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { vagaService } from '../services/api';
import { BsPencil, BsTrash } from 'react-icons/bs';

function Vagas() {
  const [vagas, setVagas] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    carregarVagas();
  }, []);

  const carregarVagas = async () => {
    try {
      const response = await vagaService.findAll();
      setVagas(response.data);
      setError(null);
    } catch (error) {
      setError('Erro ao carregar vagas. Por favor, tente novamente.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir esta vaga?')) return;
    try {
      await vagaService.delete(id);
      setSuccess('Vaga excluída com sucesso!');
      carregarVagas();
    } catch (error) {
      setError(error.response?.data?.message || 'Erro ao excluir vaga. Por favor, tente novamente.');
    }
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: 36 }}>
      <div className="page-header d-flex justify-content-between align-items-center mb-4">
        <h1 style={{ fontSize: 34, fontWeight: 700, textAlign: 'center', width: '100%' }}>Vagas</h1>
        <Button variant="primary" style={{ fontSize: 20, padding: '12px 28px' }} onClick={() => navigate('/vagas/novo')}>
          Nova Vaga
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
        <Table hover responsive style={{ fontSize: 20, minWidth: 1000, borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 12px #e0e0e0' }}>
          <thead style={{ background: '#7c3aed', color: '#fff' }}>
            <tr style={{ height: 60 }}>
              <th style={{ textAlign: 'center', fontWeight: 700, fontSize: 16, paddingLeft: 16 }}>ID</th>
              <th style={{ textAlign: 'center', fontWeight: 700, fontSize: 16 }}>Cargo</th>
              <th style={{ textAlign: 'center', fontWeight: 700, fontSize: 16 }}>Área</th>
              <th style={{ textAlign: 'center', fontWeight: 700, fontSize: 16 }}>Processo Seletivo</th>
              <th style={{ textAlign: 'center', fontWeight: 700, fontSize: 16 }}>Remuneração</th>
              <th style={{ textAlign: 'center', fontWeight: 700, fontSize: 16 }}>Carga Horária</th>
              <th style={{ textAlign: 'center', fontWeight: 700, fontSize: 16 }}>Turno</th>
              <th style={{ textAlign: 'center', fontWeight: 700, fontSize: 16 }}>Modalidade</th>
              <th style={{ textAlign: 'center', fontWeight: 700, fontSize: 16 }}>Quantidade</th>
              <th style={{ textAlign: 'center', fontWeight: 700, fontSize: 16 }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {vagas.map((vaga, idx) => (
              <tr key={vaga.id} style={{ background: idx % 2 === 0 ? '#a78bfa' : '#ede9fe', height: 56 }}>
                <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>{vaga.id}</td>
                <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>{vaga.cargo || '-'}</td>
                <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>{vaga.area?.nome || '-'}</td>
                <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>{vaga.processoSeletivo?.nome || '-'}</td>
                <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>
                  {vaga.remuneracao ? 
                    `R$ ${vaga.remuneracao.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : 
                    '-'
                  }
                </td>
                <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>{vaga.carga_horaria ? `${vaga.carga_horaria}h` : '-'}</td>
                <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>{vaga.turno || '-'}</td>
                <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>{vaga.modalidade || '-'}</td>
                <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>{vaga.quantidade}</td>
                <td className="text-center" style={{ verticalAlign: 'middle' }}>
                  <div className="action-buttons d-flex justify-content-center gap-2">
                    <Button variant="info" size="sm" style={{background: '#a259c6', border: 'none'}} onClick={() => navigate(`/vagas/editar/${vaga.id}`)}>
                      <BsPencil color="#fff" />
                    </Button>
                    <Button variant="danger" size="sm" style={{background: '#7c3aed', border: 'none'}} onClick={() => handleDelete(vaga.id)}>
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

export default Vagas; 