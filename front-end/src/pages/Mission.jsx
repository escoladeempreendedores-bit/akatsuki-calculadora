// src/pages/Mission.jsx
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OrangeButton from '../components/OrangeButton';
import PageTitle from '../components/PageTitle';
import { cloneMission, deleteMission, getMissions } from '../services/missionService';
import { formatBRL } from '../utils/currency';

const PAGE_SIZE = 8; // 8 missões por página

export default function Mission() {
  const navigate = useNavigate();

  const [missions, setMissions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [openMenuId, setOpenMenuId] = useState(null);
  const [sortDirection, setSortDirection] = useState('desc');
  const [page, setPage] = useState(1);

  // carregar missões do backend
  useEffect(() => {
    getMissions()
      .then((res) => setMissions(res.data))
      .catch((err) => {
        console.error(err);
        alert('Erro ao carregar missões');
      });
  }, []);

  // fechar menu ao clicar fora
  useEffect(() => {
    const handleClickOutside = () => {
      if (openMenuId !== null) {
        setOpenMenuId(null);
      }
    };

    if (openMenuId !== null) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [openMenuId]);

  // sempre que filtro / ordenação / quantidade mudar, volta pra página 1
  useEffect(() => {
    setPage(1);
  }, [searchTerm, sortDirection, missions.length]);

  // filtro por nome
  const filtered = useMemo(
    () =>
      missions.filter((mission) =>
        mission.name?.toLowerCase().includes(searchTerm.toLowerCase().trim())
      ),
    [missions, searchTerm]
  );

  // ordenação por created_at
  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      const da = a.created_at ? new Date(a.created_at) : 0;
      const db = b.created_at ? new Date(b.created_at) : 0;
      return sortDirection === 'asc' ? da - db : db - da;
    });
    return arr;
  }, [filtered, sortDirection]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const startIndex = (page - 1) * PAGE_SIZE;
  const pageMissions = sorted.slice(startIndex, startIndex + PAGE_SIZE);

  const toggleSortByDate = () => {
    setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  };

  // ===== Helpers de cálculo / exibição =====

  const getTotalCost = (mission) => {
    // ajuste conforme o campo que vier do backend
    const raw = mission.total_cost ?? mission.total_amount ?? mission.total ?? null;
    return raw;
  };

  const getTotalCostDisplay = (mission) => {
    const total = getTotalCost(mission);
    if (total == null) return '-';
    return formatBRL(total);
  };

  // usa consolidado se existir (>0); senão, esperado
  const getParticipantsForCalc = (mission) => {
    const consolidated = mission.number_consolidated_participants;
    if (
      typeof consolidated === 'number' &&
      !Number.isNaN(consolidated) &&
      consolidated > 0
    ) {
      return consolidated;
    }

    const expected = mission.number_participants;
    if (
      typeof expected === 'number' &&
      !Number.isNaN(expected) &&
      expected > 0
    ) {
      return expected;
    }

    return 0;
  };

  // exibição na coluna "Participantes" (preferir consolidado se > 0; senão esperado)
const getParticipantsDisplay = (mission) => {
  const consolidated = Number(mission.number_consolidated_participants);
  if (!Number.isNaN(consolidated) && consolidated > 0) return consolidated;

  const expected = Number(mission.number_participants);
  if (!Number.isNaN(expected) && expected > 0) return expected;

  return "-";
};

const getPricePerPersonDisplay = (mission) => {
  const total = getTotalCost(mission);
  const participants = getParticipantsForCalc(mission);

  if (total == null || participants === 0) return "-";

  const perPerson = total / participants;
  return formatBRL(perPerson);
};
  // Navegações / ações

  const handleView = (mission) => {
    navigate('/dashboardmission', { state: { missionId: mission.id } });
  };

  const handleEdit = (mission) => {
    navigate('/missiondata', {
      state: { missionId: mission.id, mode: 'edit' },
    });
  };

  const handleCreateMission = () => {
    navigate('/missiondata');
  };

  const handleCopy = async (mission) => {
    const ok = window.confirm(
      `Deseja criar uma cópia da missão "${mission.name}"?`
    );
    if (!ok) return;

    try {
      const response = await cloneMission(mission.id);
      // Adiciona a nova missão clonada na lista
      setMissions((prev) => [response.data, ...prev]);
      alert('Cópia da missão criada com sucesso!');
    } catch (err) {
      console.error(err);
      alert('Erro ao criar cópia da missão');
    } finally {
      setOpenMenuId(null);
    }
  };

  const handleDelete = async (mission) => {
    const ok = window.confirm(
      `Tem certeza que deseja excluir a missão "${mission.name}"?`
    );
    if (!ok) return;

    try {
      await deleteMission(mission.id);
      setMissions((prev) => prev.filter((m) => m.id !== mission.id));
    } catch (err) {
      console.error(err);
      alert('Erro ao excluir missão');
    } finally {
      setOpenMenuId(null);
    }
  };

  return (
    <main className="w-full">
      <PageTitle title="Missões" />

      <div className="mt-6 flex gap-6">
        <div className="flex-1 relative mt-[10px]">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-border-color">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="6" />
              <line x1="16" y1="16" x2="21" y2="21" />
            </svg>
          </span>
          <input
            placeholder="Pesquisar Missão..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="
              w-full h-14
              bg-background-white
              border border-border-color
              rounded-2xl
              pl-10 pr-4
              text-description-gray
              outline-none
              shadow-sm
            "
          />
        </div>

        <div className="flex items-center pt-2">
          <OrangeButton
            buttontype="button"
            buttonMessage="+ Criar Nova Missão"
            onClick={handleCreateMission}
          />
        </div>
      </div>
      <p className='mt-8 text-sm'>* Valores sem considerar impostos e margem de lucro.</p>

      {/* Tabela */}
      <section
        className="
          mt-1
          bg-background-white
          rounded-md
          shadow-md
        "
      >
        {/* Cabeçalho */}
        <div
          className="
            grid
            grid-cols-[2fr_1fr_1fr_1.3fr_1.3fr_0.5fr]
            bg-[#2a3b8f]
            text-background-white
            font-semibold
            text-base
            px-8 py-4
          "
        >
          <span>Nome</span>

          <button
            type="button"
            onClick={toggleSortByDate}
            className="flex items-center gap-1 text-background-white cursor-pointer"
          >
            <span>Data</span>
            <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
          </button>

          <span>Participantes</span>
          <span>Preço Total*</span>
          <span>Por Pessoa*</span>
          <span className="text-center">Ações</span>
        </div>

        {/* Linhas */}
        {pageMissions.length === 0 ? (
          <div className="px-8 py-6 text-description-gray">
            Carregando Missões...
          </div>
        ) : (
          pageMissions.map((mission, index) => (
            <div
              key={mission.id}
              className={`
                relative
                grid
                grid-cols-[2fr_1fr_1fr_1.3fr_1.3fr_0.5fr]
                items-center
                px-8 py-4
                border-t border-border-color
                hover:bg-background-blue/40
                ${index === pageMissions.length - 1 ? 'rounded-b-3xl' : ''}
              `}
            >
              {/* Nome  → Dashboard */}
              <span
                className="text-primary-blue cursor-pointer hover:underline"
                onClick={() => handleView(mission)}
              >
                {mission.name}
              </span>

              {/* Data */}
              <span className="text-description-gray">
                {mission.created_at
                  ? new Date(mission.created_at).toLocaleDateString('pt-BR')
                  : '-'}
              </span>

              {/* Participantes (consolidado se existir) */}
              <span className="text-description-gray">
                {getParticipantsDisplay(mission)}
              </span>

              {/* Preço Total */}
              <span className="text-primary-blue">
                {getTotalCostDisplay(mission)}
              </span>

              {/* Preço por Pessoa */}
              <span className="text-[#09B3CF]">
                {getPricePerPersonDisplay(mission)}
              </span>

              {/* Botão ⋮ */}
              <div
                className="text-description-gray text-2xl text-center cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenMenuId(
                    openMenuId === mission.id ? null : mission.id
                  );
                }}
              >
                ⋮
              </div>

              {/* Menu de ações */}
              {openMenuId === mission.id && (
                <div
                  className="
                    absolute right-8 top-12
                    bg-background-white
                    rounded-2xl
                    shadow-lg
                    py-2
                    min-w-[140px]
                    text-sm
                    z-[9999]
                  "
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    className="block text-left w-full px-4 py-2 text-description-gray hover:bg-background-blue/40 hover:text-primary-blue cursor-pointer transition-all duration-150"
                    onClick={() => handleView(mission)}
                  >
                    Ver Missão
                  </button>
                  <button
                    className="block text-left w-full px-4 py-2 text-description-gray hover:bg-background-blue/40 hover:text-primary-blue cursor-pointer transition-all duration-150"
                    onClick={() => handleEdit(mission)}
                  >
                    Editar
                  </button>
                  <button
                    className="block text-left w-full px-4 py-2 text-description-gray hover:bg-background-blue/40 hover:text-primary-blue cursor-pointer transition-all duration-150"
                    onClick={() => handleCopy(mission)}
                  >
                    Criar cópia
                  </button>
                  <button
                    className="block text-left w-full px-4 py-2 text-secondary-orange hover:bg-red-50 hover:text-red-600 cursor-pointer transition-all duration-150"
                    onClick={() => handleDelete(mission)}
                  >
                    Excluir
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </section>

      {/* Paginação */}
      {sorted.length > 0 && (
        <div className="mt-6 flex justify-between items-center text-sm text-description-gray">
          <span>
            Página {page} de {totalPages}
          </span>

          <div className="flex gap-2">
            <button
              type="button"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className={`
                px-3 py-1 rounded-md border border-border-color
                ${
                  page === 1
                    ? 'opacity-40 cursor-not-allowed'
                    : 'hover:bg-background-blue/40 cursor-pointer'
                }
              `}
            >
              Anterior
            </button>

            <button
              type="button"
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className={`
                px-3 py-1 rounded-md border border-border-color
                ${
                  page === totalPages
                    ? 'opacity-40 cursor-not-allowed'
                    : 'hover:bg-background-blue/40 cursor-pointer'
                }
              `}
            >
              Próxima
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
