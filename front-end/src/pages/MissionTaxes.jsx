import InputTax from "../components/InputTax";
import OrangeButton from "../components/OrangeButton";
import missionTaxesService from "../services/missionTaxesService";
import MissionTabs from '../components/MissionTabs';
import PageTitle from "../components/PageTitle";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const MissionTaxes = () => {
  const location = useLocation();
  const missionId = location.state?.missionId;
  const [defaultTaxes, setDefaultTaxes] = useState([]);
  const [originalTaxes, setOriginalTaxes] = useState([]);
  const [error, setError] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  async function loadTaxes() {
    try {
      setError({});
      const data = await missionTaxesService.getTaxesByMission(missionId);
      setDefaultTaxes(data);
      setOriginalTaxes(data);
    } catch (error) {
      setError({ general: "Erro ao carregar taxas: " + error.message });
    }
  }

  useEffect(() => {
    if(missionId) loadTaxes();
  }, [missionId]);

  const handleValueChange = (id, newValue) => {
    setDefaultTaxes((prevTaxes) =>
      prevTaxes.map((tax) =>
        tax.id === id ? { ...tax, value: newValue } : tax
      )
    );
  };
  
  const handleSave = async () => {
    const modified = defaultTaxes.filter((tax, i) => {
      return Number(tax.value) !== Number(originalTaxes[i].value);
    });

    if (modified.length === 0) {
      alert("Nenhuma taxa foi modificada.");
      return;
    }

    setIsSaving(true);
    try {
      const promises = modified.map((tax) =>
        missionTaxesService.updateTax(missionId, tax.id, {
          value: Number(tax.value),
        })
      );

      await Promise.all(promises);

      alert("Taxas atualizadas com sucesso!");
      setOriginalTaxes(defaultTaxes);

    } catch (error) {
        alert("Erro ao atualizar taxas. Verifique o console.");
    } finally {
        setIsSaving(false);
    }
  };

  return (
    <main className="w-full">
      <PageTitle title="Taxas da Missão" />
      <MissionTabs />
      <div className="bg-white rounded-md shadow-md overflow-hidden">
        <table className="w-full border-collapse text-center">
          <thead className="bg-[#2a3b8f] text-white rounded-t-md">
            <tr>
                <th className="py-5 w-[33.3%]">Taxa</th>
                <th className="py-5 w-[33.3%]">Descrição</th>
                <th className="py-5 w-[33.3%]">Valor</th>
            </tr>
          </thead>
        </table>
        <div className="max-h-[390px] overflow-y-auto">
          <table className="w-full border-collapse text-center">
            <tbody>
              {defaultTaxes.length === 0 ? (
                <tr>
                  <td colSpan={0} className="text-left pl-5 py-6 text-gray-500">
                    Carregando...
                  </td>
                </tr>
              ) : (
                defaultTaxes.map((tax) => (
                  <tr key={tax.id} className="border-b border-border-color">
                    <td className="py-3 w-[34%]">{tax.name}</td>
                    <td className="py-3 w-[34%]">{tax.description}</td>
                    <td className="py-3 w-[34%]">
                      <div className="flex justify-between items-center px-2 bg-background-blue mx-[38%] rounded-2xl py-3">
                        <InputTax
                          value={tax.value}
                          onChange={((newValue) => handleValueChange(tax.id, newValue))}
                        />
                        <p className="text-primary-blue font-bold text-[1.2rem]">%</p>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex justify-center pt-10">
        <OrangeButton
          buttontype="button"
          buttonMessage={isSaving ? "Salvando..." : "Salvar Taxas"}
          onClick={handleSave}
        />
      </div>
    </main>
  );
};

export default MissionTaxes;
