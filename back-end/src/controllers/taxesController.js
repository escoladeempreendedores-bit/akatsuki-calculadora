const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();


async function getAllTaxes(req, res) {
  try {
    const { mission_id } = req.params;

    const taxes = await prisma.taxes.findMany({
      where: { mission_id: Number(mission_id) },
      orderBy: { id: 'asc' }
    });

    return res.status(200).json(taxes);
  } catch (error) {
    console.error("Erro ao buscar taxes:", error);
    return res.status(500).json({ error: "Erro ao buscar taxas" });
  }
}

async function getTaxById(req, res) {
  try {
    const { mission_id, id } = req.params;

    const tax = await prisma.taxes.findFirst({
      where: {
        id: Number(id),
        mission_id: Number(mission_id)
      }
    });

    if (!tax) {
      return res.status(404).json({ error: "Taxa não encontrada" });
    }

    return res.status(200).json(tax);
  } catch (error) {
    console.error("Erro ao buscar tax:", error);
    return res.status(500).json({ error: "Erro ao buscar taxa" });
  }
}

async function createTax(req, res) {
  try {
    const { mission_id } = req.params;
    const { name, description, value } = req.body;

    const newTax = await prisma.taxes.create({
      data: {
        name,
        description: description ?? null,
        value: value ? Number(value) : null,
        mission_id: Number(mission_id)
      }
    });

    return res.status(201).json(newTax);
  } catch (error) {
    console.error("Erro ao criar tax:", error);
    return res.status(500).json({ error: "Erro ao criar taxa" });
  }
}

async function updateTax(req, res) {
    try {
        const { mission_id, id } = req.params;
        const { name, description, value } = req.body;

        const dataToUpdate = {};

        if (name !== undefined) dataToUpdate.name = name;
        if (description !== undefined) dataToUpdate.description = description;
        if (value !== undefined) dataToUpdate.value = value !== null ? Number(value) : null;

        const updated = await prisma.taxes.updateMany({
            where: {
                id: Number(id),
                mission_id: Number(mission_id)
            },
            data: dataToUpdate
        });

        if (updated.count === 0) {
            return res.status(404).json({ error: 'Taxa não encontrada' });
        }

        return res.status(200).json({ message: 'Taxa atualizada com sucesso' });

    } catch (error) {
        console.error('Erro ao atualizar tax:', error);
        return res.status(500).json({ error: 'Erro ao atualizar taxa' });
    }
}


async function removeTax(req, res) {
  try {
    const { mission_id, id } = req.params;

    const deleted = await prisma.taxes.deleteMany({
      where: {
        id: Number(id),
        mission_id: Number(mission_id)
      }
    });

    if (deleted.count === 0) {
      return res.status(404).json({ error: "Taxa não encontrada" });
    }

    return res.status(200).json({ message: "Taxa removida com sucesso" });
  } catch (error) {
    console.error("Erro ao remover tax:", error);
    return res.status(500).json({ error: "Erro ao remover taxa" });
  }
}

module.exports = {
  getAllTaxes,
  getTaxById,
  createTax,
  updateTax,
  removeTax
};
