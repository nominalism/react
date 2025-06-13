import React, { useState, useEffect } from 'react';
import { cidadeService } from '../services/api';

function Cidades() {
  const [cidades, setCidades] = useState([]);

  useEffect(() => {
    const fetchCidades = async () => {
      try {
        const response = await cidadeService.findAll();
        setCidades(response.data);
      } catch (error) {
        console.error('Erro ao buscar cidades:', error);
      }
    };

    fetchCidades();
  }, []);

  return (
    <div className="container mt-4">
      <h2>Cidades</h2>
      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>UF</th>
            </tr>
          </thead>
          <tbody>
            {cidades.map((cidade) => (
              <tr key={cidade.id}>
                <td>{cidade.id}</td>
                <td>{cidade.nome}</td>
                <td>{cidade.uf?.sigla}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Cidades; 