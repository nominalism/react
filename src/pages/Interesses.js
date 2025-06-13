import React, { useState, useEffect } from 'react';
import { Table, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { interesseService } from '../services/api';
import { BsPencil, BsTrash } from 'react-icons/bs';

function Interesses() {
  const [interesses, setInteresses] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    carregarInteresses();
  }, []);

  const carregarInteresses = async () => {
    try {
      const response = await interesseService.findAll();
      setInteresses(response.data);
      setError(null);
    } catch (error) {
      setError('Erro ao carregar interesses.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este interesse?')) return;
    try {
      await interesseService.delete(id);
      setSuccess('Interesse excluído com sucesso!');
      carregarInteresses();
    } catch (error) {
      setError(error.response?.data?.message || 'Erro ao excluir interesse.');
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 32 }}>
      <div className="page-header d-flex justify-content-between align-items-center mb-4">
        <h1 style={{ fontSize: 32, fontWeight: 700 }}>Interesses</h1>
        <Button variant="primary" style={{ fontSize: 18, padding: '10px 24px' }} onClick={() => navigate('/interesses/novo')}>
          Novo Interesse
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
        <Table hover responsive style={{ fontSize: 18, minWidth: 700 }}>
          <thead style={{ background: '#7c3aed', color: '#fff' }}>
            <tr style={{ height: 56 }}>
              <th style={{ textAlign: 'center', fontWeight: 700, fontSize: 20 }}>ID</th>
              <th style={{ textAlign: 'center', fontWeight: 700, fontSize: 20 }}>Candidato</th>
              <th style={{ textAlign: 'center', fontWeight: 700, fontSize: 20 }}>Área</th>
              <th style={{ textAlign: 'center', fontWeight: 700, fontSize: 20 }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {interesses.map((interesse, idx) => (
              <tr key={interesse.id} style={{ background: idx % 2 === 0 ? '#a78bfa' : '#ede9fe', height: 52 }}>
                <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>{interesse.id}</td>
                <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>{interesse.candidato?.nome}</td>
                <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>{interesse.area?.nome}</td>
                <td className="text-center" style={{ verticalAlign: 'middle' }}>
                  <div className="action-buttons d-flex justify-content-center gap-2">
                    <Button variant="info" size="sm" style={{background: '#a259c6', border: 'none'}} onClick={() => navigate(`/interesses/editar/${interesse.id}`)}>
                      <BsPencil color="#fff" />
                    </Button>
                    <Button variant="danger" size="sm" style={{background: '#7c3aed', border: 'none'}} onClick={() => handleDelete(interesse.id)}>
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

export default Interesses; 