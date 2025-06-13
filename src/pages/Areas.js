import React, { useState, useEffect } from 'react';
import { Table, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { areaService } from '../services/api';
import { BsPencil, BsTrash } from 'react-icons/bs';

function Areas() {
  const [areas, setAreas] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    carregarAreas();
  }, []);

  const carregarAreas = async () => {
    try {
      const response = await areaService.findAll();
      setAreas(response.data);
      setError(null);
    } catch (error) {
      setError('Erro ao carregar áreas. Por favor, tente novamente.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir esta área?')) return;
    try {
      await areaService.delete(id);
      setSuccess('Área excluída com sucesso!');
      carregarAreas();
    } catch (error) {
      setError(error.response?.data?.message || 'Erro ao excluir área. Por favor, tente novamente.');
    }
  };

  const getCursoLabel = (curso) => {
    switch (curso) {
      case 'SIS_INFORMACAO':
        return 'Sistemas de Informação';
      case 'ADM':
        return 'Administração';
      case 'ENFERMAGEM':
        return 'Enfermagem';
      case 'CONTABILIDADE':
        return 'Contabilidade';
      case 'ENG_MECANICA':
        return 'Engenharia Mecânica';
      default:
        return curso;
    }
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: 36 }}>
      <div className="page-header d-flex justify-content-between align-items-center mb-4">
        <h1 style={{ fontSize: 34, fontWeight: 700, textAlign: 'center', width: '100%' }}>Áreas</h1>
        <Button variant="primary" style={{ fontSize: 20, padding: '12px 28px' }} onClick={() => navigate('/areas/novo')}>
          Nova Área
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
              <th style={{ textAlign: 'center', fontWeight: 700, fontSize: 16 }}>Nome</th>
              <th style={{ textAlign: 'center', fontWeight: 700, fontSize: 16 }}>Descrição</th>
              <th style={{ textAlign: 'center', fontWeight: 700, fontSize: 16 }}>Curso</th>
              <th style={{ textAlign: 'center', fontWeight: 700, fontSize: 16 }}>Candidatos por Vaga</th>
              <th style={{ textAlign: 'center', fontWeight: 700, fontSize: 16 }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {areas.map((area, idx) => (
              <tr key={area.id} style={{ background: idx % 2 === 0 ? '#a78bfa' : '#ede9fe', height: 56 }}>
                <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>{area.id}</td>
                <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>{area.nome}</td>
                <td className="text-truncate" style={{ maxWidth: '180px', verticalAlign: 'middle', textAlign: 'center' }}>{area.descricao}</td>
                <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>{getCursoLabel(area.curso)}</td>
                <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>{area.candidatos_vaga}</td>
                <td className="text-center" style={{ verticalAlign: 'middle' }}>
                  <div className="action-buttons d-flex justify-content-center gap-2">
                    <Button variant="info" size="sm" style={{background: '#a259c6', border: 'none'}} onClick={() => navigate(`/areas/editar/${area.id}`)}>
                      <BsPencil color="#fff" />
                    </Button>
                    <Button variant="danger" size="sm" style={{background: '#7c3aed', border: 'none'}} onClick={() => handleDelete(area.id)}>
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

export default Areas; 