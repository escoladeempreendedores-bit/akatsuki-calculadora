const prisma = require("../prisma.js");
const {
  getMissionPrice,
  getMissionMarginValue,
} = require("./missionDashModel.js");

const getTotalMissionProfit = async () => {
  const missions = await prisma.missions.findMany({
    select: {
      id: true,
    },
    orderBy: {
      id: "desc",
    },
    take: 5,
  });

  let totalProfit = 0;

  for (const mission of missions) {
    try {
      const price = await getMissionPrice(mission.id);
      const numericPrice = Number(price) || 0;

      totalProfit += numericPrice;
    } catch (error) {
      console.warn(
        `Erro ao calcular a margem da missão ${mission.id}:`,
        error.message
      );
      continue;
    }
  }

  return totalProfit;
};

const getTotalMissionsParticipants = async () => {
  const missions = await prisma.missions.findMany({
    select: {
      number_participants: true,
      number_consolidated_participants: true,
    },
    orderBy: {
      id: "desc",
    },
    take: 5,
  });

  let totalParticipants = 0;

  for (const mission of missions) {
    const participants =
      mission.number_consolidated_participants ?? mission.number_participants;
    totalParticipants += participants || 0;
  }

  return totalParticipants;
};

const getTotalMarginValueMissions = async () => {
  const missions = await prisma.missions.findMany({
    select: {
      id: true,
    },
    orderBy: {
      id: "desc",
    },
    take: 5,
  });

  let totalMarginValue = 0;

  for (const mission of missions) {
    try {
      const margin = await getMissionMarginValue(mission.id);
      const numericMargin = Number(margin) || 0;

      totalMarginValue += numericMargin;
    } catch (error) {
      console.warn(
        `Erro ao buscar o Lucro Bruto da missão ${mission.id}: `,
        error.message
      );
      continue;
    }
  }
  return totalMarginValue;
};

const getAllMissions = async () => {
  return await prisma.missions.findMany({
    select: {
      id: true,
      name: true,
      created_at: true,
    },
    orderBy: {
      id: "desc",
    },
  });
};

const getMissionCount = async () => {
  return await prisma.missions.count();
};

const getTotalAverageMargin = async () => {
  const totalProfit = Number(await getTotalMissionProfit()) || 0;
  const totalMargin = Number(await getTotalMarginValueMissions()) || 0;

  if (totalProfit === 0) return 0;

  return (totalMargin / totalProfit) * 100;
};

module.exports = {
  getTotalMissionProfit,
  getTotalMissionsParticipants,
  getTotalMarginValueMissions,
  getAllMissions,
  getMissionCount,
  getTotalAverageMargin,
};
