import MissionCostCard from "../components/MissionCostCard";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import PageTitle from "../components/PageTitle.jsx";
import { 
  getAllMissions, 
  getAverageMargin, 
  getMissionCount, 
  getMissionParticipants, 
  getMissionProfit, 
  getTotalMargin 
} from "../services/generalDashService.js";

const GeneralDashboard = () => {
  const [missions, setMissions] = useState([]);
  const [avMargin, setAvMargin] = useState(0);
  const [missionCount, setMissionCount] = useState(0);
  const [totalParticipants, setTotalParticipants] = useState(0);
  const [profit, setProfit] = useState(0);
  const [totalMargin, setTotalMargin] = useState(0);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [
        missionsRes,
        countRes,
        profitRes,
        avgRes,
        participantsRes,
        marginRes
      ] = await Promise.all([
        getAllMissions(),
        getMissionCount(),
        getMissionProfit(),
        getAverageMargin(),
        getMissionParticipants(),
        getTotalMargin()
      ]);

      setMissions(missionsRes);
      setAvMargin(avgRes);
      setMissionCount(countRes);
      setTotalParticipants(participantsRes);
      setProfit(profitRes);
      setTotalMargin(marginRes);

    } catch(error) {
      console.error("Erro ao carregar o dashboard: ", error);

      setMissions([]);
      setAvMargin(0);
      setMissionCount(0);
      setTotalParticipants(0);
      setProfit(0);
      setTotalMargin(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  return (
    <section className=" w-full">
      <PageTitle
        title="Dashboard Geral"
      />

      <div className="grid grid-cols-2 gap-8 mb-10 pt-10">
        <MissionCostCard
          label="Faturamento Total"
          value={`R$ ${profit.toLocaleString("pt-br", { minimumFractionDigits: 2 })}`}
          description="Todas as Missões"
          icon={"bi bi-currency-dollar"}
        />
        <MissionCostCard
          label="Lucro Bruto Total"
          value={`R$ ${totalMargin.toLocaleString("pt-br", { minimumFractionDigits: 2 })}`}
          description={`Margem média de ${avMargin.toFixed(0)}%`}
          icon={"bi bi-currency-dollar"}
        />
        <MissionCostCard
          label="Total de Missões"
          value={`${missionCount.toFixed(0)}`}
          description="Total de Missões"
          icon={"bi bi-currency-dollar"}
        />
        <MissionCostCard
          label="Total de Participantes"
          value={`${totalParticipants.toFixed(0)}`}
          description="Todas as Missões"
          icon={"bi bi-currency-dollar"}
        />
      </div>

      <div className="rounded-xl border border-[#394C97] flex h-58">
        <div className="w-6 bg-[#394C97] h-full rounded-bl-xl rounded-tl-xl"></div>
        <div className="p-6 w-full">
          <p className="mb-6 font-semibold text-xl text-[#394C97]">
            Últimas Missões
          </p>

          <ul className="flex flex-col gap-2 mb-3">
            {missions.length === 0 ? (
              <li className="font-bold text-center py-8">Carregando o Dashboard...</li>
            ) : (
              missions.slice(0, 3).map((mission) => (
                <li
                  key={mission.id}
                  onClick={() =>
                    navigate("/missiondata", { state: { missionId: mission.id } })
                  }
                  className="cursor-pointer hover:text-[#ff5c00] transition font-semibold"
                >
                  <span className="font-semibold">
                    {new Date(mission.created_at).toLocaleDateString("pt-br")} -
                  </span>{" "}
                  {mission.name}
                </li>
              ))
            )}
          </ul>

          <div className="flex justify-center w-full ">
            <Link
              to="/mission"
              className="border border-[#394C97] rounded-lg max-w-80 w-full py-1 bg-blue-600/20 text-[#394C97] font-bold text-center"
            >
              Ver Mais
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GeneralDashboard;
