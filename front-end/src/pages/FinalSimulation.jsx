import { useMemo, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import MissionTabs from "../components/MissionTabs";
import PageTitle from "../components/PageTitle";

import { formatBRL } from "../utils/currency";

import PdfGenerator from "../components/PdfGenerator";

import {
  getMarginOptions,
  getMissionTotalCosts,
  getMissionMargin,
  getMissionMarginPercentege,
  getMissionTaxe,
  getMissionTaxePercentege,
  getMissionPrice,
  getMissionPricePerPerson,
} from "../services/missionDashService.js";

import { api } from "../services/api";

const FinalSimulation = () => {
  const location = useLocation();
  const missionId = location.state?.missionId;

  // Estados para dados do backend
  const [loading, setLoading] = useState(true);
  const [totalCost, setTotalCost] = useState(0);
  const [profit, setProfit] = useState(0);
  const [profitPercent, setProfitPercent] = useState(0);
  const [taxes, setTaxes] = useState(0);
  const [taxesPercent, setTaxesPercent] = useState(0);
  const [finalPrice, setFinalPrice] = useState(0);
  const [pricePerPerson, setPricePerPerson] = useState(0);

  // Estado para seleção de margem
  const [marginOptions, setMarginOptions] = useState([]);
  const [selectedMargin, setSelectedMargin] = useState("lancamento");

  // Estado para taxas de cartão (do backend)
  const [fees, setFees] = useState([]);

  const [downPayment, setDownPayment] = useState(0);

  // Carrega opções de margem e taxas de cartão uma vez
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const options = await getMarginOptions();
        setMarginOptions(options);
      } catch (error) {
        console.error("Erro ao carregar opções de margem", error);
      }
    };
    loadInitialData();
  }, []);

  // Carrega taxas de cartão da missão
  useEffect(() => {
    const loadCardFees = async () => {
      if (!missionId) return;
      
      try {
        const response = await api.get(`/simulationCosts/${missionId}/card-fees`);
        setFees(response.data);
      } catch (error) {
        console.error("Erro ao carregar taxas de cartão", error);
        // Fallback para valores padrão caso não consiga carregar
        setFees([
          { label: "Débito", percent: 0 },
          { label: "Crédito 1x", percent: 0 },
          { label: "Crédito 2x", percent: 0 },
          { label: "Crédito 3x", percent: 0 },
          { label: "Crédito 4x", percent: 0 },
          { label: "Crédito 5x", percent: 0 },
          { label: "Crédito 6x", percent: 0 },
          { label: "Crédito 7x", percent: 0 },
          { label: "Crédito 8x", percent: 0 },
          { label: "Crédito 9x", percent: 0 },
          { label: "Crédito 10x", percent: 0 },
          { label: "Crédito 11x", percent: 0 },
          { label: "Crédito 12x", percent: 0 },
        ]);
      }
    };
    loadCardFees();
  }, [missionId]);

  // Carrega dados da missão
  useEffect(() => {
    const loadData = async () => {
      if (!missionId) return;
      
      try {
        setLoading(true);
        const [
          totalCostRes,
          profitRes,
          profitPercentRes,
          taxesRes,
          taxesPercentRes,
          finalPriceRes,
          pricePerPersonRes,
        ] = await Promise.all([
          getMissionTotalCosts(missionId),
          getMissionMargin(missionId, selectedMargin),
          getMissionMarginPercentege(missionId, selectedMargin),
          getMissionTaxe(missionId, selectedMargin),
          getMissionTaxePercentege(missionId),
          getMissionPrice(missionId, selectedMargin),
          getMissionPricePerPerson(missionId, selectedMargin),
        ]);

        setTotalCost(totalCostRes);
        setProfit(profitRes);
        setProfitPercent(profitPercentRes);
        setTaxes(taxesRes);
        setTaxesPercent(taxesPercentRes);
        setFinalPrice(finalPriceRes);
        setPricePerPerson(pricePerPersonRes);
      } catch (error) {
        console.error("Erro ao carregar dados da simulação", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [missionId, selectedMargin]);

  const handleMarginChange = (e) => {
    setSelectedMargin(e.target.value);
  };

  // Saldo = preço por pessoa - entrada
  const balance = useMemo(
    () => Math.max(0, pricePerPerson - downPayment),
    [pricePerPerson, downPayment]
  );

  const installments = useMemo(() => {
    return fees.map((t, i) => {
      const amountWithFee = balance + balance * (t.percent / 100);
      // Débito = 1 parcela, Crédito Nx = N parcelas
      const numInstallments = t.label === "Débito" ? 1 : parseInt(t.label.replace(/\D/g, "")) || 1;

      return {
        label: t.label,
        balance,
        amountWithFee,
        installmentValue: amountWithFee / numInstallments,
        fee: t.percent,
      };
    });
  }, [balance, fees]);


  return (
    <div id="pdf-content">
      <div className="min-h-screen">
        <main className="w-full">
          <PageTitle title="Simulação Final" />

          <MissionTabs />

          {/* Seletor de Margem e PDF */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-4">
              <label htmlFor="marginSelect" className="text-[#2a3b8f] font-semibold">
                Calcular com:
              </label>
              <div className="relative">
                <select
                  id="marginSelect"
                  value={selectedMargin}
                  onChange={handleMarginChange}
                  disabled={loading}
                  className="border border-[#2a3b8f] rounded-lg px-4 py-2 text-[#2a3b8f] bg-white focus:outline-none focus:ring-2 focus:ring-[#ff5c00] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {marginOptions.map((option) => (
                    <option key={option.key} value={option.key}>
                      {option.name}
                    </option>
                  ))}
                </select>
                {loading && (
                  <div className="absolute right-10 top-1/2 -translate-y-1/2">
                    <div className="w-4 h-4 border-2 border-[#2a3b8f] border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
            </div>
            <PdfGenerator />
          </div>

          {/* BLOCK 1 – Detailed Calculation */}
          <section className="bg-white rounded-md shadow-md mb-12">
            <div className="bg-[#2a3b8f] text-white py-3 px-5 font-semibold rounded-t-md">
              Cálculo Detalhado
            </div>

            <div className="divide-y text-sm">
              <Row label="Custo Total" value={formatBRL(totalCost)} />
              <Row label={`+ Margem de Lucro (${profitPercent}%)`} value={formatBRL(profit)} />
              <Row label={`+ Impostos (${taxesPercent}%)`} value={formatBRL(taxes)} />
              <Row
                label="Preço Total Estimado"
                value={formatBRL(finalPrice)}
                highlight
              />
              <Row
                label="Preço por Pessoa"
                value={formatBRL(pricePerPerson)}
                highlight
              />
            </div>
          </section>

          {/* BLOCK 2 – Installment Simulation */}
          <h2 className="text-2xl font-bold text-[#2a3b8f] mb-4">
            Simulação de Pagamento (por pessoa)
          </h2>

          <div className="grid grid-cols-3 gap-8">
            {/* Installments table */}
            <div className="col-span-2 bg-white shadow-md rounded-md h-full flex flex-col">
              <div className="bg-[#2a3b8f] text-white py-3 px-5 font-semibold rounded-t-md">
                Comparação de Parcelas
              </div>

              <div className="flex items-center gap-3 p-4 text-sm flex-wrap">
                <span className="font-bold text-[#2a3b8f]">Valor por Pessoa:</span>
                <span className="font-semibold text-[#2a3b8f]">
                  {formatBRL(pricePerPerson)}
                </span>

                <span className="font-bold text-[#2a3b8f] ml-4">Entrada:</span>
                <input
                  type="number"
                  min="0"
                  max={pricePerPerson}
                  className="w-36 border border-gray-300 rounded-md px-3 py-1 text-right"
                  value={downPayment}
                  onChange={(e) => setDownPayment(Math.max(0, Number(e.target.value)))}
                />

                <span className="font-semibold text-[#2a3b8f]">
                  Saldo: {formatBRL(balance)}
                </span>
              </div>

              <div className="flex-1 overflow-auto" data-pdf-scroll>
                <table className="w-full text-sm border-collapse">
                  <thead className="bg-gray-100 text-[#2a3b8f]">
                    <tr>
                      <th className="py-2 px-4">Parcelas</th>
                      <th className="py-2 px-4">Saldo</th>
                      <th className="py-2 px-4">Valor com Imposto</th>
                      <th className="py-2 px-4">Valor da Parcela</th>
                    </tr>
                  </thead>

                  <tbody>
                    {installments.map((p, i) => (
                      <tr key={i} className="border-b hover:bg-[#f8f9fe]">
                        <td className="py-2 px-4">{p.label}</td>
                        <td className="py-2 px-4">{formatBRL(p.balance)}</td>
                        <td className="py-2 px-4 text-[#2a3b8f] font-semibold">
                          {formatBRL(p.amountWithFee)}
                        </td>
                        <td className="py-2 px-4 text-[#2a3b8f]">
                          {formatBRL(p.installmentValue)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Fees table */}
            <div className="bg-white shadow-md rounded-md h-full flex flex-col">
              <div className="bg-[#2a3b8f] text-white py-3 px-5 font-semibold rounded-t-md">
                Taxas
              </div>

              <div className="flex-1 overflow-auto" data-pdf-scroll>
                <table className="w-full text-sm border-collapse h-full">
                  <thead className="bg-gray-100 text-[#2a3b8f] rounded-t-md">
                    <tr>
                      {/* alinhar igual às células de baixo */}
                      <th className="py-2 px-4 w-1/2 text-left">Parcelas</th>
                      <th className="py-2 px-4 w-1/2 text-right">%</th>
                    </tr>
                  </thead>

                  <tbody>
                    {fees.map((t, i) => (
                      <tr key={i} className="border-b hover:bg-[#f8f9fe]">
                        <td className="py-2 px-4 w-1/2 text-left">{t.label}</td>
                        <td className="py-2 px-4 w-1/2 text-right">
                          {t.percent}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

/* ---------------------------------------- */
/* Reusable row component */
/* ---------------------------------------- */
const Row = ({ label, value, highlight }) => (
  <div className="flex justify-between py-3 px-5">
    <span className={`font-medium ${highlight ? "text-[#2a3b8f]" : ""}`}>
      {label}
    </span>
    <span
      className={`font-semibold ${
        highlight ? "text-[#2a3b8f]" : "text-gray-700"
      }`}
    >
      {value}
    </span>
  </div>
);

export default FinalSimulation;
