const prisma = require("../prisma");

const getPersonsByMission = async (id) => {
  const mission = await prisma.missions.findUnique({
    where: {
      id: id,
    },
    select: {
      number_participants: true,
      number_consolidated_participants: true
    }
  });

  if (!mission) throw new Error("Missão não encontrada.");

  // Usa number_consolidated_participants se existir e for maior que 0,
  // senão usa number_participants
  const consolidated = mission.number_consolidated_participants;
  const participants = mission.number_participants;

  if (consolidated != null && consolidated > 0) {
    return consolidated;
  }

  return participants ?? 0;
};

const getMission = async (id) => {
  const mission = await prisma.missions.findUnique({
    where: {
      id: id,
    },
    select: {
      name: true,
      description: true
    }
  });

  if (!mission) throw new Error("Missão não encontrada.");

  return mission;
};

const getItemsByMission = async (id) => {
  const mission = await prisma.missions.findUnique({
    where: {
      id: id,
    },
    select: {
      Categories: true,
    }
  });
  if (!mission) throw new Error("Missão não encontrada.");

  return mission.Categories?.length ?? 0;
};

const getTaxByName = async (missionId, name) => {
  const tax = await prisma.taxes.findFirst({
    where: {
      mission_id: missionId,
      name: name
    },
    select: {
      value: true
    }
  });

  if (!tax) return 0;

  return Number(tax.value);
};

const getMissionTotalCosts = async (missionId) => {
  const costs = await prisma.costs.findMany({
    where: {
      Categories: {
        mission_id: missionId,
      },
      selected: true
    }
  });

  return costs.reduce((sum, cost) => {
    const quantity = cost.final_quantity ?? cost.initial_quantity ?? 0;
    const unitValue = cost.final_unit_value ?? cost.initial_unit_value ?? 0;

    const q = Number(quantity);
    const v = Number(unitValue);

    const totalCost = q * v;
    return sum + totalCost;
  }, 0);
};

// Nome padrão da margem de lucro
const DEFAULT_MARGIN_NAME = "Margem de Lucro Lançamento";

// Margens de lucro disponíveis
const MARGIN_OPTIONS = [
  { key: "lancamento", name: "Margem de Lucro Lançamento" },
  { key: "primeiro-lote", name: "Margem de Lucro Primeiro Lote" },
  { key: "segundo-lote", name: "Margem de Lucro Segundo Lote" },
  { key: "terceiro-lote", name: "Margem de Lucro Terceiro Lote" },
];

const getMarginNameByKey = (key) => {
  const found = MARGIN_OPTIONS.find(m => m.key === key);
  return found ? found.name : DEFAULT_MARGIN_NAME;
};

const getMarginOptions = () => MARGIN_OPTIONS;

const getMissionMarginPercentege = async (missionId, marginKey = null) => {
  const marginName = marginKey ? getMarginNameByKey(marginKey) : DEFAULT_MARGIN_NAME;
  return getTaxByName(missionId, marginName);
};

const getMissionMarginValue = async (missionId, marginKey = null) => {
  const total = await getMissionTotalCosts(missionId);
  const percentege = await getMissionMarginPercentege(missionId, marginKey);

  return total * (percentege / 100);
};

const getMissionTaxePercentege = async (missionId) => getTaxByName(missionId, "Impostos");

const getMissionTaxeValue = async (missionId, marginKey = null) => {
  const total = await getMissionTotalCosts(missionId);
  const margin = await getMissionMarginValue(missionId, marginKey);
  const taxePercentage = await getMissionTaxePercentege(missionId);

  return (total + margin) * (taxePercentage / 100);
};


const getMissionPrice = async (missionId, marginKey = null) => {
  const total = await getMissionTotalCosts(missionId);
  const margin = await getMissionMarginValue(missionId, marginKey);
  const taxe = await getMissionTaxeValue(missionId, marginKey);

  return total + margin + taxe;
};

const getMissionPricePerPerson = async (missionId, marginKey = null) => {
  const price = await getMissionPrice(missionId, marginKey);
  const people = await getPersonsByMission(missionId);

  if (people <= 0) {
    throw new Error("Número de participantes inválido");
  };

  return price / people;
};

module.exports = {
  getPersonsByMission,
  getMission,
  getItemsByMission,
  getTaxByName,
  getMissionTotalCosts,
  getMissionMarginPercentege,
  getMissionMarginValue,
  getMissionTaxePercentege,
  getMissionTaxeValue,
  getMissionPrice,
  getMissionPricePerPerson,
  getMarginOptions,
  getMarginNameByKey
};
