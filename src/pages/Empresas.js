import React, { useState, useEffect } from 'react';
import { Table, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { empresaService } from '../services/api';
import { BsPencil, BsTrash } from 'react-icons/bs';

function Empresas() {
  const [empresas, setEmpresas] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    carregarEmpresas();
  }, []);

  const carregarEmpresas = async () => {
    try {
      const response = await empresaService.findAll();
      setEmpresas(response.data);
      setError(null);
    } catch (error) {
      setError('Erro ao carregar empresas. Por favor, tente novamente.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir esta empresa?')) return;
    try {
      await empresaService.delete(id);
      setSuccess('Empresa excluída com sucesso!');
      carregarEmpresas();
    } catch (error) {
      setError(error.response?.data?.message || 'Erro ao excluir empresa. Por favor, tente novamente.');
    }
  };

  const getSetorLabel = (setor) => {
    switch (setor) {
      case 'TECNOLOGIA':
        return 'Tecnologia';
      case 'MARMORE':
        return 'Mármore';
      case 'COMERCIO':
        return 'Comércio';
      case 'SAUDE':
        return 'Saúde';
      case 'ADMINISTRACAO':
        return 'Administração';
      default:
        return setor;
    }
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: 36 }}>
      <div className="page-header d-flex justify-content-between align-items-center mb-4">
        <h1 style={{ fontSize: 34, fontWeight: 700, textAlign: 'center', width: '100%' }}>Empresas</h1>
        <Button variant="primary" style={{ fontSize: 20, padding: '12px 28px' }} onClick={() => navigate('/empresas/novo')}>
          Nova Empresa
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
              <th style={{ textAlign: 'center', fontWeight: 700, fontSize: 16 }}>CNPJ</th>
              <th style={{ textAlign: 'center', fontWeight: 700, fontSize: 16 }}>Email</th>
              <th style={{ textAlign: 'center', fontWeight: 700, fontSize: 16 }}>Telefone</th>
              <th style={{ textAlign: 'center', fontWeight: 700, fontSize: 16 }}>Setor</th>
              <th style={{ textAlign: 'center', fontWeight: 700, fontSize: 16 }}>Número</th>
              <th style={{ textAlign: 'center', fontWeight: 700, fontSize: 16 }}>Complemento</th>
              <th style={{ textAlign: 'center', fontWeight: 700, fontSize: 16 }}>Bairro</th>
              <th style={{ textAlign: 'center', fontWeight: 700, fontSize: 16 }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {empresas.map((empresa, idx) => (
              <tr key={empresa.id} style={{ background: idx % 2 === 0 ? '#a78bfa' : '#ede9fe', height: 56 }}>
                <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>{empresa.id}</td>
                <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>{empresa.nome}</td>
                <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>{empresa.cnpj}</td>
                <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>{empresa.email}</td>
                <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>{empresa.telefone}</td>
                <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>{getSetorLabel(empresa.setor)}</td>
                <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>{empresa.numCasa}</td>
                <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>{empresa.complemento}</td>
                <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>{empresa.bairro?.bairro}</td>
                <td className="text-center" style={{ verticalAlign: 'middle' }}>
                  <div className="action-buttons d-flex justify-content-center gap-2">
                    <Button variant="info" size="sm" style={{background: '#a259c6', border: 'none'}} onClick={() => navigate(`/empresas/editar/${empresa.id}`)}>
                      <BsPencil color="#fff" />
                    </Button>
                    <Button variant="danger" size="sm" style={{background: '#7c3aed', border: 'none'}} onClick={() => handleDelete(empresa.id)}>
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

export default Empresas;