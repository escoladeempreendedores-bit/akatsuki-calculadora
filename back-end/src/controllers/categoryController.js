const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Função auxiliar para serializar BigInt
function serializeBigInt(data) {
  return JSON.parse(
    JSON.stringify(data, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    )
  );
}

const getAllCategories = async (req, res) => {
  try {
    const mission_id = parseInt(req.params.mission_id);

    if (!mission_id) {
      return res.status(400).json({ error: 'mission_id não encontrado.' });
    }

    const categories = await prisma.categories.findMany({
      where: { mission_id },
      include: {
        Costs: {
          // apenas custos selecionados (Sâmia)
          where: {
            selected: true
          }
        },
        Types: true,
        Missions: true
      }
    });

    const response = serializeBigInt(categories);
    res.status(200).json(response);
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    res.status(500).json({ error: 'Erro ao buscar categorias' });
  }
};

const getCategoryById = async (req, res) => {
  const id = parseInt(req.params.id);
  const mission_id = parseInt(req.params.mission_id);

  if (!id) {
    return res.status(400).json({ error: 'ID não encontrado.' });
  }

  if (!mission_id) {
    return res.status(400).json({ error: 'mission_id não encontrado.' });
  }

  try {
    const category = await prisma.categories.findFirst({
      where: {
        id,
        mission_id
      },
      include: {
        Costs: true,
        Types: true,
        Missions: true
      }
    });

    if (!category) {
      return res.status(404).json({ error: 'Categoria não encontrada nesta missão!' });
    }

    const response = serializeBigInt(category);
    res.status(200).json(response);
  } catch (error) {
    console.error('Erro ao buscar categoria:', error);
    res.status(500).json({ error: 'Erro ao buscar categoria' });
  }
};

const createCategory = async (req, res) => {
  const { name, type_id } = req.body;
  const mission_id = parseInt(req.params.mission_id);

  if (!name) {
    return res.status(400).json({ error: 'Nome da categoria é obrigatório.' });
  }

  if (!mission_id) {
    return res.status(400).json({ error: 'mission_id não encontrado.' });
  }

  try {
    const newCategory = await prisma.categories.create({
      data: {
        name: name.trim(),
        type_id: type_id != null ? parseInt(type_id, 10) : null,
        mission_id,
      },
      include: {
        Costs: true,
        Types: true,
        Missions: true
      }
    });

    const response = serializeBigInt(newCategory);
    res.status(201).json(response);
  } catch (error) {
    console.error('Erro ao criar categoria:', error);

    if (error.code === 'P2003') {
      return res.status(400).json({
        error: 'type_id ou mission_id inválido'
      });
    }

    res.status(500).json({ error: 'Erro ao criar categoria' });
  }
};

const updateCategory = async (req, res) => {
  const id = parseInt(req.params.id);
  const mission_id = parseInt(req.params.mission_id);
  const { name, type_id } = req.body;

  if (!id) {
    return res.status(400).json({ error: 'ID não encontrado.' });
  }

  if (!mission_id) {
    return res.status(400).json({ error: 'mission_id não encontrado.' });
  }

  const hasUpdates = name !== undefined || type_id !== undefined;

  if (!hasUpdates) {
    return res.status(400).json({
      error: 'Pelo menos um campo deve ser alterado para atualizar.'
    });
  }

  try {
    // Verifica se a categoria pertence à missão
    const existingCategory = await prisma.categories.findFirst({
      where: {
        id,
        mission_id
      }
    });

    if (!existingCategory) {
      return res.status(404).json({
        error: 'Categoria não encontrada nesta missão'
      });
    }

    const dataToUpdate = {};

    if (name !== undefined) {
      if (name.trim() === '') {
        return res.status(400).json({ error: 'Nome não pode ser vazio.' });
      }
      dataToUpdate.name = name.trim();
    }

    if (type_id !== undefined) {
      dataToUpdate.type_id = type_id != null ? parseInt(type_id, 10) : null;
    }

    const updatedCategory = await prisma.categories.update({
      where: { id },
      data: dataToUpdate,
      include: {
        Costs: true,
        Types: true,
        Missions: true
      }
    });

    const response = serializeBigInt(updatedCategory);
    res.status(200).json(response);
  } catch (error) {
    console.error('Erro ao atualizar categoria:', error);

    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Categoria não encontrada' });
    }

    if (error.code === 'P2003') {
      return res.status(400).json({
        error: 'type_id inválido'
      });
    }

    res.status(500).json({ error: 'Erro ao atualizar categoria' });
  }
};

const removeCategory = async (req, res) => {
  const id = parseInt(req.params.id);
  const mission_id = parseInt(req.params.mission_id);

  if (!id) {
    return res.status(400).json({ error: 'ID não encontrado.' });
  }

  if (!mission_id) {
    return res.status(400).json({ error: 'mission_id não encontrado.' });
  }

  try {
    // Verifica se a categoria pertence à missão
    const existingCategory = await prisma.categories.findFirst({
      where: {
        id,
        mission_id
      }
    });

    if (!existingCategory) {
      return res.status(404).json({
        error: 'Categoria não encontrada nesta missão'
      });
    }

    await prisma.categories.delete({
      where: { id }
    });

    res.status(204).send();
  } catch (error) {
    console.error('Erro ao remover categoria:', error);

    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Categoria não encontrada' });
    }

    if (error.code === 'P2003') {
      return res.status(409).json({
        error: 'Não é possível remover: categoria possui custos relacionados'
      });
    }

    res.status(500).json({ error: 'Erro ao remover categoria' });
  }
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  removeCategory
};
