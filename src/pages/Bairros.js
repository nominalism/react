import React, { useState, useEffect } from 'react';
import { bairroService } from '../services/api';

function Bairros() {
  const [bairros, setBairros] = useState([]);

  useEffect(() => {
    const fetchBairros = async () => {
      try {
        const response = await bairroService.findAll();
        setBairros(response.data);
      } catch (error) {
        console.error('Erro ao buscar bairros:', error);
      }
    };

    fetchBairros();
  }, []);

  return (
    <div className="container mt-4">
      <h2>Bairros</h2>
      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Cidade</th>
            </tr>
          </thead>
          <tbody>
            {bairros.map((bairro) => (
              <tr key={bairro.id}>
                <td>{bairro.id}</td>
                <td>{bairro.nome}</td>
                <td>{bairro.cidade?.nome}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Bairros; 