import React, { useState, useEffect } from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { 
  RiDashboardLine,
  RiBriefcaseLine,
  RiUserLine,
  RiBuildingLine,
  RiFileListLine,
  RiFilePaperLine,
  RiLayoutLine,
  RiFlowChart,
  RiBarChartLine,
  RiMenuLine,
  RiCloseLine,
  RiCheckLine
} from 'react-icons/ri';
import { BsBullseye } from 'react-icons/bs';

function Navbar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 900);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 900);
      if (window.innerWidth > 900) {
        setIsOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    if (isMobile) {
      setIsOpen(false);
    }
  };

  const menuItems = [
    { path: '/', label: 'Dashboard', icon: <RiDashboardLine size={20} /> },
    { path: '/vagas', label: 'Vagas', icon: <RiBriefcaseLine size={20} /> },
    { path: '/candidatos', label: 'Candidatos', icon: <RiUserLine size={20} /> },
    { path: '/empresas', label: 'Empresas', icon: <RiBuildingLine size={20} /> },
    { path: '/processos-seletivos', label: 'Processos Seletivos', icon: <RiFileListLine size={20} /> },
    { path: '/areas', label: 'Áreas', icon: <RiLayoutLine size={20} /> },
    { path: '/etapas', label: 'Etapas', icon: <RiFlowChart size={20} /> },
    { path: '/candidaturas', label: 'Candidaturas', icon: <RiFilePaperLine size={20} /> },
    { path: '/interesses', label: 'Interesses', icon: <BsBullseye style={{ marginRight: 8 }} /> },
    { path: '/finalizar-processo', label: 'Finalizar Processo', icon: <RiCheckLine size={20} /> },
    { path: '/relatorios', label: 'Relatórios', icon: <RiBarChartLine size={20} /> }
  ];

  return (
    <>
      {isMobile && (
        <button className="hamburger" onClick={toggleSidebar} aria-label="Menu">
          {isOpen ? <RiCloseLine size={24} /> : <RiMenuLine size={24} />}
        </button>
      )}
      {isMobile && (
        <div 
          className={`sidebar-overlay ${isOpen ? 'open' : ''}`}
          onClick={closeSidebar}
        />
      )}
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h3>Sistema de Vagas</h3>
        </div>
        <Nav className="flex-column">
          {menuItems.map((item, idx) => (
            <React.Fragment key={item.path}>
              <Nav.Link
                as={Link}
                to={item.path}
                className={location.pathname === item.path ? 'active' : ''}
                onClick={closeSidebar}
              >
                <span className="menu-icon">{item.icon}</span>
                {item.label}
              </Nav.Link>
              {(item.label === 'Dashboard' || item.label === 'Etapas' || item.label === 'Finalizar Processo') && (
                <hr style={{ margin: '0.2rem 0', borderColor: '#eee' }} />
              )}
            </React.Fragment>
          ))}
        </Nav>
      </div>
    </>
  );
}

export default Navbar; 