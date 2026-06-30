// src/models/missionModel.js
const prisma = require("../prisma.js");

// helper para calcular o total da missão (somando Costs)
async function attachTotals(missions) {
  return Promise.all(
    missions.map(async (mission) => {
      const categories = await prisma.categories.findMany({
        where: { mission_id: mission.id },
        include: { 
          Costs: {
            where: { selected: true }
          }
        },
      });

      const total_amount = categories.reduce((accCat, cat) => {
        if (!cat.Costs || cat.Costs.length === 0) return accCat;

        const catTotal = cat.Costs.reduce((accCost, c) => {
          const q = c.final_quantity ?? c.initial_quantity ?? 0;
          const v = c.final_unit_value ?? c.initial_unit_value ?? 0;
          return accCost + q * v;
        }, 0);

        return accCat + catTotal;
      }, 0);

      // devolve o objeto da missão com o campo extra total_amount
      return {
        ...mission,
        total_amount,
      };
    })
  );
}

const getAllMissions = async () => {
  const missions = await prisma.missions.findMany({
    orderBy: { id: "asc" },
  });

  return attachTotals(missions);
};

const getMissionsByAccount = async (user_id) => {
  const missions = await prisma.missions.findMany({
    where: { user_id },
    orderBy: { id: "asc" },
  });

  return attachTotals(missions);
};

const getMissionById = async (id) => {
  return prisma.missions.findUnique({
    where: { id },
  });
};

const addMission = async (
  name,
  number_participants,
  description,
  user_id,
  number_consolidated_participants
) => {
  return prisma.missions.create({
    data: {
      name,
      number_participants,
      description,
      user_id,
      number_consolidated_participants:
        number_consolidated_participants ?? null,
      created_at: new Date(),
    },
  });
};

const updateMission = async (
  id,
  name,
  number_participants,
  description,
  number_consolidated_participants
) => {
  const missionExist = await getMissionById(id);

  if (!missionExist) {
    throw new Error("Missão não encontrada!");
  }

  return prisma.missions.update({
    where: { id },
    data: {
      name,
      number_participants,
      description,
      number_consolidated_participants:
        number_consolidated_participants ?? null,
      updated_at: new Date(),
    },
  });
};

const deleteMission = async (id) => {
  const missionExist = await getMissionById(id);

  if (!missionExist) {
    throw new Error("Missão não encontrada!");
  }

  return prisma.missions.delete({
    where: { id },
  });
};

module.exports = {
  getAllMissions,
  getMissionsByAccount,
  getMissionById,
  addMission,
  updateMission,
  deleteMission,
};
