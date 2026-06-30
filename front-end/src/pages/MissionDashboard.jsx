// import MissionStepsNav from "../components/MissionStepsNav";
import MissionCostCard from "../components/MissionCostCard";
import MissionMetricCard from "../components/MissionMetricCard";
import MissionTabs from "../components/MissionTabs";
import { formatBRL } from "../utils/currency.js";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  getItemByMission,
  getMarginOptions,
  getMission,
  getMissionMargin,
  getMissionMarginPercentege,
  getMissionPrice,
  getMissionPricePerPerson,
  getMissionTaxe,
  getMissionTaxePercentege,
  getMissionTotalCosts,
  getPersonsByMission,
} from "../services/missionDashService.js";

const DashboardMisson = () => {
  const location = useLocation();
  const missionId = location.state?.missionId;
  const [loading, setLoading] = useState(true);
  const [numPersons, setNumPersons] = useState(0);
  const [mission, setMission] = useState({});
  const [percentegeMargin, setPercentegeMargin] = useState(0);
  const [margin, setMargin] = useState(0);
  const [percentegeTaxe, setPercentegeTaxe] = useState(0);
  const [taxe, setTaxe] = useState(0);
  const [item, setItem] = useState(0);
  const [totalCosts, setTotalCosts] = useState(0);
  const [price, setPrice] = useState(0);
  const [pricePerson, setPricePerson] = useState(0);

  // Estado para seleção de margem
  const [marginOptions, setMarginOptions] = useState([]);
  const [selectedMargin, setSelectedMargin] = useState("lancamento");
  const [_, setSelectedMarginLabel] = useState("Margem de Lucro Lançamento");

  // Carrega opções de margem uma vez
  useEffect(() => {
    const loadMarginOptions = async () => {
      try {
        const options = await getMarginOptions();
        setMarginOptions(options);
        // Define o label inicial
        const initial = options.find(o => o.key === "lancamento");
        if (initial) {
          setSelectedMarginLabel(initial.name);
        }
      } catch (error) {
        console.error("Erro ao carregar opções de margem", error);
      }
    };
    loadMarginOptions();
  }, []);

  const loadDashboardData = async (id, marginKey = null) => {
    try {
      setLoading(true);
      const [
        numPersonsRes,
        missionRes,
        marPercentegeRes,
        marginRes,
        taxPercentegeRes,
        taxeRes,
        itemRes,
        totalCostsRes,
        priceRes,
        pricePerPersonRes,
      ] = await Promise.all([
        getPersonsByMission(id),
        getMission(id),
        getMissionMarginPercentege(id, marginKey),
        getMissionMargin(id, marginKey),
        getMissionTaxePercentege(id),
        getMissionTaxe(id, marginKey),
        getItemByMission(id),
        getMissionTotalCosts(id),
        getMissionPrice(id, marginKey),
        getMissionPricePerPerson(id, marginKey),
      ]);

      setNumPersons(numPersonsRes),
        setMission(missionRes),
        setPercentegeMargin(marPercentegeRes),
        setMargin(marginRes),
        setPercentegeTaxe(taxPercentegeRes),
        setTaxe(taxeRes),
        setItem(itemRes),
        setTotalCosts(totalCostsRes),
        setPrice(priceRes),
        setPricePerson(pricePerPersonRes);
    } catch (error) {
      console.error("Erro ao carregar o dashboard...", error);
      setNumPersons(0),
        setMission({}),
        setPercentegeMargin(0),
        setMargin(0),
        setPercentegeTaxe(0),
        setTaxe(0),
        setItem(0),
        setTotalCosts(0),
        setPrice(0),
        setPricePerson(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData(missionId, selectedMargin);
  }, [missionId, selectedMargin]);

  const handleMarginChange = (e) => {
    const key = e.target.value;
    setSelectedMargin(key);
    const option = marginOptions.find(o => o.key === key);
    if (option) {
      setSelectedMarginLabel(option.name);
    }
  };

  return (
    <section className="w-full">
      {!mission.name ? (
        <h2 className="text-3xl text-[#394C97] font-bold mb-6">
          Carregando Dashboard...
        </h2>
      ) : (
        <h2 className="text-3xl text-[#394C97] font-bold mb-6">
          Dashboard - {`${mission.name}`}
        </h2>
      )}

      {/* <MissionStepsNav /> */}
      <MissionTabs />

      {/* Seletor de Margem de Lucro */}
      <div className="mb-6 flex items-center justify-end gap-4">
        <label htmlFor="marginSelect" className="text-[#394C97] font-semibold">
          Calcular com:
        </label>
        <div className="relative">
          <select
            id="marginSelect"
            value={selectedMargin}
            onChange={handleMarginChange}
            disabled={loading}
            className="border border-[#394C97] rounded-lg px-4 py-2 text-[#394C97] bg-white focus:outline-none focus:ring-2 focus:ring-[#ff5c00] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {marginOptions.map((option) => (
              <option key={option.key} value={option.key}>
                {option.name}
              </option>
            ))}
          </select>
          {loading && (
            <div className="absolute right-10 top-1/2 -translate-y-1/2">
              <div className="w-4 h-4 border-2 border-[#394C97] border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-6 grid-cols-2">
        <MissionCostCard
          label="Custo Total"
          value={`${formatBRL(totalCosts)}`}
          description="Soma de todos os custos"
        />
        <MissionCostCard
          label="Lucro Bruto"
          value={`${formatBRL(margin)}`}
          description={`${percentegeMargin}% sobre o custo total`}
        />
        <MissionCostCard
          label="Impostos"
          value={`${formatBRL(taxe)}`}
          description={`${percentegeTaxe}% sobre subtotal`}
        />
        <MissionCostCard
          label="Preço Final"
          value={`${formatBRL(price)}`}
          description="Valor total calculado"
        />
        <MissionCostCard
          label="Preço por Pessoa"
          value={`${formatBRL(pricePerson)}`}
          description="Base para orçamentos individuais"
        />
      </div>

      <div className="grid md:grid-cols-2 mb-6 gap-6">
        <div className="bg-[#394C97] p-6 rounded-xl text-white">
          <p className="font-semibold text-xl mb-3">
            Composição do Preço Final
          </p>
          <div className="flex flex-col gap-2">
            <MissionMetricCard
              label="Custos Base"
              value={`${formatBRL(totalCosts)}`}
            />
            <MissionMetricCard
              label={`+ Margem de Lucro (${percentegeMargin}%)`}
              value={`${formatBRL(margin)}`}
            />
            <MissionMetricCard
              label={`+ Impostos (${percentegeTaxe}%)`}
              value={`${formatBRL(taxe)}`}
            />
            <MissionMetricCard
            //  label="+ Taxa Cartão (0,89%)"
            //  value="266,77"
            />
          </div>
          <hr className="my-2" />
          <MissionMetricCard label="Total" value={`${formatBRL(price)}`} />
        </div>

        <div className="bg-white p-6 rounded-xl text-gray-600 border border-[#394C97] shadow-[#394C97] shadow-sm flex flex-col justify-center">
          <p className="font-semibold text-xl mb-3 text-[#394C97]">
            Informações da Missão
          </p>
          <div className="flex flex-col gap-2">
            <MissionMetricCard
              label="Total de Participantes"
              value={`${numPersons}`}
            />
            <MissionMetricCard label="Itens de Custo" value={`${item}`} />
            <MissionMetricCard
              label="Valor por Pessoa"
              value={`${formatBRL(pricePerson)}`}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 border border-[#394C97] shadow-sm shadow-[#394C97]">
        <p className="text-[#394C97] text-xl font-medium">Descrição</p>
        {!mission.description ? (
          <p className="text-gray-600">...</p>
        ) : (
          <p className="text-gray-600">{`${mission.description}`}</p>
        )}
      </div>
    </section>
  );
};

export default DashboardMisson;
