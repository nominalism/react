import React, { useState, useEffect } from 'react';
import { Table, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { candidatoService } from '../services/api';
import { BsPencil, BsTrash } from 'react-icons/bs';

function Candidatos() {
  const [candidatos, setCandidatos] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    carregarCandidatos();
  }, []);

  const carregarCandidatos = async () => {
    try {
      const response = await candidatoService.findAll();
      setCandidatos(response.data);
      setError(null);
    } catch (error) {
      setError('Erro ao carregar candidatos. Por favor, tente novamente.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este candidato?')) return;
    try {
      await candidatoService.delete(id);
      setSuccess('Candidato excluído com sucesso!');
      carregarCandidatos();
    } catch (error) {
      setError(error.response?.data?.message || 'Erro ao excluir candidato. Por favor, tente novamente.');
    }
  };

  return (
    <div style={{ maxWidth: 1300, margin: '0 auto', padding: 36 }}>
      <div className="page-header d-flex justify-content-between align-items-center mb-4">
        <h1 style={{ fontSize: 34, fontWeight: 700, textAlign: 'center', width: '100%' }}>Candidatos</h1>
        <Button variant="primary" style={{ fontSize: 20, padding: '12px 28px' }} onClick={() => navigate('/candidatos/novo')}>
          Novo Candidato
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
              <th style={{ textAlign: 'center', fontWeight: 700, fontSize: 16 }}>CPF</th>
              <th style={{ textAlign: 'center', fontWeight: 700, fontSize: 16 }}>Email</th>
              <th style={{ textAlign: 'center', fontWeight: 700, fontSize: 16 }}>Telefone</th>
              <th style={{ textAlign: 'center', fontWeight: 700, fontSize: 16 }}>Data de Nascimento</th>
              <th style={{ textAlign: 'center', fontWeight: 700, fontSize: 16 }}>Curso</th>
              <th style={{ textAlign: 'center', fontWeight: 700, fontSize: 16 }}>Turno</th>
              <th style={{ textAlign: 'center', fontWeight: 700, fontSize: 16 }}>Número</th>
              <th style={{ textAlign: 'center', fontWeight: 700, fontSize: 16 }}>Complemento</th>
              <th style={{ textAlign: 'center', fontWeight: 700, fontSize: 16 }}>Bairro</th>
              <th style={{ textAlign: 'center', fontWeight: 700, fontSize: 16 }}>Cidade</th>
              <th style={{ textAlign: 'center', fontWeight: 700, fontSize: 16 }}>UF</th>
              <th style={{ textAlign: 'center', fontWeight: 700, fontSize: 16 }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {candidatos.map((candidato, idx) => (
              <tr key={candidato.id} style={{ background: idx % 2 === 0 ? '#a78bfa' : '#ede9fe', height: 56 }}>
                <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>{candidato.id}</td>
                <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>{candidato.nome}</td>
                <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>{candidato.cpf}</td>
                <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>{candidato.email}</td>
                <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>{candidato.telefone}</td>
                <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>{candidato.data_nascimento ? new Date(candidato.data_nascimento).toLocaleDateString() : ''}</td>
                <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>{candidato.curso}</td>
                <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>{candidato.turno}</td>
                <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>{candidato.numCasa}</td>
                <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>{candidato.complemento}</td>
                <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>{candidato.bairro?.bairro}</td>
                <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>{candidato.bairro?.cidade?.nome}</td>
                <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>{candidato.bairro?.cidade?.uf?.sigla}</td>
                <td className="text-center" style={{ verticalAlign: 'middle' }}>
                  <div className="action-buttons d-flex justify-content-center gap-2">
                    <Button variant="info" size="sm" style={{background: '#a259c6', border: 'none'}} onClick={() => navigate(`/candidatos/editar/${candidato.id}`)}>
                      <BsPencil color="#fff" />
                    </Button>
                    <Button variant="danger" size="sm" style={{background: '#7c3aed', border: 'none'}} onClick={() => handleDelete(candidato.id)}>
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

export default Candidatos; 