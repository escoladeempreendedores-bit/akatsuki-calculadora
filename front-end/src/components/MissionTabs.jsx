// src/components/MissionTabs.jsx
import { useLocation, useNavigate } from 'react-router-dom';

const TABS = [
  {
    label: 'Dados',
    path: '/missiondata', // <Route path="missiondata" element={<MissionData />} />
  },
  {
    label: 'Custos',
    path: '/costs', // <Route path="costs" element={<Costs />} />
  },
  {
    label: 'Taxas',
    path: '/missiontaxes', // se ainda não quiser liberar, pode remover esse path
  },
  {
    label: 'Simulação Final',
    path: '/finalsimulation',
  },
  {
    label: 'Dashboard da Missão',
    path: '/dashboardmission',
  },
];

const MissionTabs = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // missionId vindo da tela atual (ex.: Costs ou MissionData)
  const missionId = location.state?.missionId;

  const isActive = (path) => {
    if (!path) return false;
    // cobre rotas "filhas", como /costs/123
    return (
      location.pathname === path ||
      location.pathname.startsWith(path + '/')
    );
  };

  const handleClick = (tab) => {
    if (!tab.path) return; // aba sem rota → não navega

    // se tiver missionId no state, repassa para a próxima rota
    const state = missionId ? { missionId } : undefined;

    navigate(tab.path, { state });
  };

  return (
    <div className="flex gap-4 mb-8">
      {TABS.map((tab) => {
        const active = isActive(tab.path);

        const baseClasses =
          'font-semibold px-4 py-2 rounded-md transition-colors';
        const activeClasses = 'bg-[#ff5c00] text-white shadow-md';
        const inactiveClasses =
          'text-[#2a3b8f] hover:text-[#ff5c00] cursor-pointer';
        const disabledClasses =
          'text-[#a0a7c0] cursor-not-allowed';

        const canNavigate = Boolean(tab.path);

        return (
          <button
            key={tab.label}
            type="button"
            disabled={!canNavigate}
            onClick={() => canNavigate && handleClick(tab)}
            className={`${baseClasses} ${
              active
                ? activeClasses
                : canNavigate
                ? inactiveClasses
                : disabledClasses
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};

export default MissionTabs;
