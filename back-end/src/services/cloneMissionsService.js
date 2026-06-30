const prisma = require('../prisma');


async function cloneMissionsService(missionId) {
  if (!missionId || isNaN(missionId)) {
    throw new Error('Invalid missionId');
  }

  return await prisma.$transaction(async (tx) => {
    
    const mission = await tx.missions.findUnique({
      where: { id: missionId },
      include: {
        Taxes: true,
        Categories: { include: { Costs: true } },
      },
    });

    if (!mission) {
      throw new Error('Missão não encontrada');
    }

    const { id, created_at, updated_at, Taxes, Categories, ...missionData } = mission;

    //Essa função aqui está responsável por clonar a missão com um nome único
    const baseName = mission.name?.replace(/\s*\(\d+\)\s*$/, '') || 'Missão Clonada';
    const existingMissions = await tx.missions.findMany({
      where: {
        name: { startsWith: baseName },
        user_id: mission.user_id,
      },
      select: { name: true },
    });

    // Aqui ela tá buscando o próximo número disponível para o nome da missão clonada
    const counters = existingMissions
      .map((m) => {
        const match = m.name?.match(/\((\d+)\)$/);
        return match ? parseInt(match[1], 10) : 0;
      })
      .filter((n) => !isNaN(n));

    const nextCounter = Math.max(...counters, 0) + 1;
    missionData.name = `${baseName} (${nextCounter})`;

    const clonedMission = await tx.missions.create({ data: missionData });

 
    if (Array.isArray(Taxes) && Taxes.length > 0) {
      const taxRows = Taxes.map((t) => {
        const { id: tId, created_at: tCreated, updated_at: tUpdated, mission_id, ...taxData } = t;
        return { ...taxData, mission_id: clonedMission.id };
      });
      await tx.taxes.createMany({ data: taxRows });
    }

    for (const category of Categories || []) {
      const { id: cId, created_at: cCreated, updated_at: cUpdated, mission_id, Costs, ...categoryData } = category;

      const clonedCategory = await tx.categories.create({
        data: { ...categoryData, mission_id: clonedMission.id },
      });

      if (Array.isArray(Costs) && Costs.length > 0) {
        const costRows = Costs.map((cost) => {
          const { id: costId, created_at: costCreated, updated_at: costUpdated, category_id, ...costData } = cost;
          return { ...costData, category_id: clonedCategory.id };
        });
        await tx.costs.createMany({ data: costRows });
      }
    }
    const result = await tx.missions.findUnique({
      where: { id: clonedMission.id },
      include: { Taxes: true, Categories: { include: { Costs: true } } },
    });

    return result;
  });
}

module.exports = { cloneMissionsService };
