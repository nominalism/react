import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Vagas from './pages/Vagas';
import Candidatos from './pages/Candidatos';
import Empresas from './pages/Empresas';
import ProcessosSeletivos from './pages/ProcessosSeletivos';
import Candidaturas from './pages/Candidaturas';
import Areas from './pages/Areas';
import Etapas from './pages/Etapas';
import Relatorios from './pages/Relatorios';
import Interesses from './pages/Interesses';
import AreaForm from './pages/AreaForm';
import CandidatoForm from './pages/CandidatoForm';
import VagaForm from './pages/VagaForm';
import EmpresaForm from './pages/EmpresaForm';
import ProcessoSeletivoForm from './pages/ProcessoSeletivoForm';
import CandidaturaForm from './pages/CandidaturaForm';
import EtapaForm from './pages/EtapaForm';
import InteresseForm from './pages/InteresseForm';
import FinalizarProcesso from './pages/FinalizarProcesso';
import FinalizarProcessoDetalhe from './pages/FinalizarProcessoDetalhe';
import RelatorioEtapasProcesso from './pages/RelatorioEtapasProcesso';
import RelatorioContratados from './pages/RelatorioContratados';
import RelatorioCandidaturasPorVaga from './pages/RelatorioCandidaturasPorVaga';
import RelatorioContratacoesPorEmpresa from './pages/RelatorioContratacoesPorEmpresa';
import RelatorioProcessosPorEmpresa from './pages/RelatorioProcessosPorEmpresa';
import RelatorioContratacoesPorArea from './pages/RelatorioContratacoesPorArea';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/vagas" element={<Vagas />} />
            <Route path="/vagas/novo" element={<VagaForm />} />
            <Route path="/vagas/editar/:id" element={<VagaForm />} />
            <Route path="/candidatos" element={<Candidatos />} />
            <Route path="/candidatos/novo" element={<CandidatoForm />} />
            <Route path="/candidatos/editar/:id" element={<CandidatoForm />} />
            <Route path="/empresas" element={<Empresas />} />
            <Route path="/empresas/novo" element={<EmpresaForm />} />
            <Route path="/empresas/editar/:id" element={<EmpresaForm />} />
            <Route path="/processos-seletivos" element={<ProcessosSeletivos />} />
            <Route path="/processos-seletivos/novo" element={<ProcessoSeletivoForm />} />
            <Route path="/processos-seletivos/editar/:id" element={<ProcessoSeletivoForm />} />
            <Route path="/processos-seletivos/finalizar/:id" element={<FinalizarProcessoDetalhe />} />
            <Route path="/candidaturas" element={<Candidaturas />} />
            <Route path="/candidaturas/novo" element={<CandidaturaForm />} />
            <Route path="/candidaturas/editar/:id" element={<CandidaturaForm />} />
            <Route path="/areas" element={<Areas />} />
            <Route path="/areas/novo" element={<AreaForm />} />
            <Route path="/areas/editar/:id" element={<AreaForm />} />
            <Route path="/etapas" element={<Etapas />} />
            <Route path="/etapas/novo" element={<EtapaForm />} />
            <Route path="/etapas/editar/:id" element={<EtapaForm />} />
            <Route path="/interesses" element={<Interesses />} />
            <Route path="/interesses/novo" element={<InteresseForm />} />
            <Route path="/interesses/editar/:id" element={<InteresseForm />} />
            <Route path="/relatorios" element={<Relatorios />} />
            <Route path="/finalizar-processo" element={<FinalizarProcesso />} />
            <Route path="/relatorios/etapas-processo" element={<RelatorioEtapasProcesso />} />
            <Route path="/relatorios/contratados" element={<RelatorioContratados />} />
            <Route path="/relatorios/candidaturas-por-vaga" element={<RelatorioCandidaturasPorVaga />} />
            <Route path="/relatorios/contratacoes-por-empresa" element={<RelatorioContratacoesPorEmpresa />} />
            <Route path="/relatorios/processos-por-empresa" element={<RelatorioProcessosPorEmpresa />} />
            <Route path="/relatorios/contratacoes-por-area" element={<RelatorioContratacoesPorArea />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
