const {
  getAllMissions,
  getMissionsByAccount,
  getMissionById,
  addMission,
  updateMission,
  deleteMission,
} = require("../models/missionModel.js");
const { cloneMissionsService } = require("../services/cloneMissionsService");
const { getAllDefaultTaxes } = require("../models/defaultTaxesModel.js");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getAllMissionsHandler = async (req, res) => {
  try {
    const missions = await getAllMissions();

    res.status(200).json(missions);
  } catch (error) {
    res.status(500).json({ error: "Erro ao procurar missões" });
  }
};

const getMissionsByAccountHandler = async (req, res) => {
  const user_id = req.userId;

  try {
    const mission = await getMissionsByAccount(user_id);

    if (!mission) {
      return res.status(404).json({ error: "Missão não encontrada!" });
    }

    res.status(200).json(mission);
  } catch (error) {
    res.status(500).json({ error: "Erro ao procurar missão" });
  }
};

const getMissionByIdHandler = async (req, res) => {
  const id = parseInt(req.params.id);

  if (!id) {
    return res.status(400).json({ error: "ID não encontrado." });
  }

  try {
    const mission = await getMissionById(id);

    if (!mission) {
      return res.status(404).json({ error: "Missão não encontrada! " });
    }

    res.status(200).json(mission);
  } catch (error) {
    res.status(500).json({ error: "Erro ao procurar missão" });
  }
};

const addMissionHandler = async (req, res) => {
  const {
    name,
    number_participants,
    number_consolidated_participants,
    profit_margin,
    description,
  } = req.body;

  const user_id = req.userId;

  if (!name) {
    return res.status(400).json({ error: "Dados incompletos." });
  }

  // Validar número de participantes (mínimo 1)
  if (!number_participants || number_participants < 1) {
    return res.status(400).json({ error: "A missão deve ter pelo menos 1 participante." });
  }

  try {
    // 👇 ATENÇÃO: ajustar assinatura de addMission no missionModel.js
    const newMission = await addMission(
      name,
      number_participants,
      description,
      user_id,
      number_consolidated_participants,
      profit_margin
    );

    const defaultTaxes = await getAllDefaultTaxes();

    // Cria cópias dessas taxas para a missão recém-criada
    if (defaultTaxes.length > 0) {
      await prisma.taxes.createMany({
        data: defaultTaxes.map((tax) => ({
          name: tax.name,
          description: tax.description,
          value: tax.value,
          mission_id: newMission.id,
        })),
      });
    }

    // Retorna missão + taxas associadas
    const missionWithTaxes = await prisma.missions.findUnique({
      where: { id: newMission.id },
      include: { Taxes: true },
    });

    return res.status(201).json(missionWithTaxes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao adicionar missão" });
  }
};

const cloneMissionHandler = async (req, res) => {
  const id = parseInt(req.params.id);

  if (!id) {
    return res.status(400).json({ error: "ID não encontrado." });
  }

  try {
    const cloned = await cloneMissionsService(id);
    return res.status(201).json(cloned);
  } catch (error) {
    console.error("Erro ao clonar missão:", error);
    return res.status(500).json({ error: "Erro ao clonar missão" });
  }
};

const exportMission = async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const mission = await prisma.missions.findUnique({
      where: { id: Number(id) },
      include: {
        Categories: {
          include: {
            Costs: true,
          },
        },
        Taxes: true,
      },
    });

    if (!mission) {
      return res.status(404).json({ error: "Missão não encontrada." });
    }

    res.json(mission);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao exportar dados da missão." });
  }
};

const updateMissionHandler = async (req, res) => {
  const id = parseInt(req.params.id);
  const {
    name,
    number_participants,
    number_consolidated_participants,
    profit_margin,
    description,
  } = req.body;

  if (!id) {
    return res.status(400).json({ error: "ID não encontrado." });
  }

  const hasUpdates =
    name !== undefined ||
    number_participants !== undefined ||
    number_consolidated_participants !== undefined ||
    profit_margin !== undefined ||
    description !== undefined;

  if (!hasUpdates) {
    return res.status(400).json({
      error: "Pelo menos um dos campos deve ser alterado para atualizar.",
    });
  }

  // Validar número de participantes (mínimo 1)
  if (number_participants !== undefined && number_participants < 1) {
    return res.status(400).json({ error: "A missão deve ter pelo menos 1 participante." });
  }

  try {
    // 👇 ATENÇÃO: ajustar assinatura de updateMission no missionModel.js
    const updatedMission = await updateMission(
      id,
      name,
      number_participants,
      description,
      number_consolidated_participants,
      profit_margin
    );

    res.status(200).json(updatedMission);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao atualizar missão" });
  }
};

const deleteMissionHandler = async (req, res) => {
  const id = parseInt(req.params.id);

  if (!id) {
    return res.status(400).json({ error: "ID não encontrado." });
  }

  try {
    await deleteMission(id);

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Erro ao deletar missão", error });
  }
};

module.exports = {
  getAllMissionsHandler,
  getMissionsByAccountHandler,
  getMissionByIdHandler,
  addMissionHandler,
  cloneMissionHandler,
  exportMission,
  updateMissionHandler,
  deleteMissionHandler,
};
