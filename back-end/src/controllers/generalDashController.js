const {
  getTotalMissionProfit,
  getTotalMissionsParticipants,
  getTotalMarginValueMissions,
  getAllMissions,
  getMissionCount,
  getTotalAverageMargin,
} = require("../models/generalDashModel.js");

const getTotalMissionProfitHandler = async (req, res) => {
    try {
        const totalMargin = await getTotalMissionProfit();

        return res.status(200).json(totalMargin);
    } catch (error) {
        return res.status(500).json({ error: "Erro ao buscar o faturamento total das missões." });
    }
};

const getTotalMissionsParticipantsHandler = async (req, res) => {
    try {
        const totalParticipants = await getTotalMissionsParticipants();

        return res.status(200).json(totalParticipants);
    } catch (error) {
        return res.status(500).json({ error: "Erro ao buscar o número total de participantes das missões." });
    }
};

const getTotalMarginValueMissionsHandler = async (req, res) => {
    try {
        const totalMargin = await getTotalMarginValueMissions();

        return res.status(200).json(totalMargin);
    } catch (error) {
        return res.status(500).json({ error: "Erro ao buscar o Lucro Bruto das missões." });
    }
};

const getAllMissionsHandler = async (req, res) => {
    try {
        const allMission = await getAllMissions();
    
        return res.status(200).json(allMission);
    } catch (error) {
        return res.status(500).json({ error: "Erro ao buscar todas as missões." });
    }
};

const getMissionCountHandler = async (req, res) => {
    try {
        const missionCount = await getMissionCount();

        return res.status(200).json(missionCount);
    } catch (error) {
        return res.status(500).json({ error: "Erro ao fazer a contagem do total das missões." });
    }
};

const getTotalAverageMarginHandler = async (req, res) => {
    try {
        const averageMargin = await getTotalAverageMargin();

        res.status(200).json(averageMargin);
    } catch (error) {
        return res.status(500).json({ error: "Erro ao buscar a média da porcentagem do Lucro Bruto." });
    }
};

module.exports = {
    getTotalMissionProfitHandler,
    getTotalMissionsParticipantsHandler,
    getTotalMarginValueMissionsHandler,
    getAllMissionsHandler,
    getMissionCountHandler,
    getTotalAverageMarginHandler
};