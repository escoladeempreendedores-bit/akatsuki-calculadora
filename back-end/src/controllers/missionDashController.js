const {
  getPersonsByMission,
  getMission,
  getItemsByMission,
  getMissionTotalCosts,
  getMissionMarginPercentege,
  getMissionMarginValue,
  getMissionTaxePercentege,
  getMissionTaxeValue,
  getMissionPrice,
  getMissionPricePerPerson,
  getMarginOptions
} = require("../models/missionDashModel.js");

// Handler simples para funções sem parâmetro de margem
const missionHandler = (model, defaultErrorMessage) => async (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ error: "ID inválido." });
  }

  try {
    const result = await model(id);
    
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message || defaultErrorMessage });
  }
};

// Handler para funções que aceitam parâmetro de margem
const missionMarginHandler = (model, defaultErrorMessage) => async (req, res) => {
  const id = parseInt(req.params.id);
  const marginKey = req.query.margin || null;

  if (isNaN(id)) {
    return res.status(400).json({ error: "ID inválido." });
  }

  try {
    const result = await model(id, marginKey);
    
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message || defaultErrorMessage });
  }
};

const getPersonsByMissionHandler = missionHandler(getPersonsByMission, "Erro ao procurar o número de pessoas da missão.");

const getMissionHandler = missionHandler(getMission, "Erro ao buscar missão.");

const getMissionMarginPercentegeHandler = missionMarginHandler(getMissionMarginPercentege, "Erro ao buscar porcentagem da margem de lucro da missão.");

const getMissionMarginValueHandler = missionMarginHandler(getMissionMarginValue, "Erro ao buscar o valor da margem de lucro da missão.");

const getMissionTaxePercentegeHandler = missionHandler(getMissionTaxePercentege, "Erro ao buscar a porcentagem dos imposto da missão.");

const getMissionTaxeValueHandler = missionMarginHandler(getMissionTaxeValue, "Erro ao buscar o valor da taxa de imposto da missão.");

const getItemsByMissionHandler = missionHandler(getItemsByMission, "Erro ao buscar o número total de categorias da missão.");

const getMissionTotalCostsHandler = missionHandler(getMissionTotalCosts, "Erro ao buscar o preço total da missão.");

const getMissionPriceHandler = missionMarginHandler(getMissionPrice, "Erro ao buscar o preço de venda da missão.");

const getMissionPricePerPersonHandler = missionMarginHandler(getMissionPricePerPerson, "Erro ao buscar o preço de venda individual da missão.");

const getMarginOptionsHandler = async (req, res) => {
  try {
    const options = getMarginOptions();
    return res.status(200).json(options);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao buscar opções de margem." });
  }
};

module.exports = {
  getPersonsByMissionHandler,
  getMissionHandler,
  getMissionMarginPercentegeHandler,
  getMissionMarginValueHandler,
  getMissionTaxePercentegeHandler,
  getMissionTaxeValueHandler,
  getItemsByMissionHandler,
  getMissionTotalCostsHandler,
  getMissionPriceHandler,
  getMissionPricePerPersonHandler,
  getMarginOptionsHandler
};
