import React, { useState, useEffect } from 'react';
import { ufService } from '../services/api';

function Ufs() {
  const [ufs, setUfs] = useState([]);

  useEffect(() => {
    const fetchUfs = async () => {
      try {
        const response = await ufService.findAll();
        setUfs(response.data);
      } catch (error) {
        console.error('Erro ao buscar UFs:', error);
      }
    };

    fetchUfs();
  }, []);

  return (
    <div className="container mt-4">
      <h2>Unidades Federativas</h2>
      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Sigla</th>
            </tr>
          </thead>
          <tbody>
            {ufs.map((uf) => (
              <tr key={uf.id}>
                <td>{uf.id}</td>
                <td>{uf.nome}</td>
                <td>{uf.sigla}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Ufs; 