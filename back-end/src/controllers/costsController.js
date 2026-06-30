const { getAllCosts,
    getCostsByCategory,
    getCostsById,
    addCosts,
    updateCosts,
    deleteCosts,
    toggleSelectedCosts} = require("../models/costsModel.js");

const getAllCostsHandler = async (req, res) => {
    try {
        const costs = await getAllCosts ();

        res.status(200).json(costs);
    } catch (error) {
       res.status(500).json({ error: "Erro ao procurar custos" });
    }
};

const getCostsByCategoryHandler = async (req, res) => {
    const category_id = parseInt(req.params.category_id);

    try {
        const costs = await getCostsByCategory(category_id);

        if (!costs) {
            return res.status(404).json({ error: "custos não encontrados!" });
        }

        res.status(200).json(costs);
    } catch (error) {
        res.status(500).json({ error: "Erro ao procurar custos" });
    }
};

const getCostsByIdHandler = async (req, res) => {
    const id = parseInt(req.params.id);

    if (!id) {
        return res.status(400).json({ error: "ID não encontrado." });
    }

    try {
        const costs = await getCostsById (id);

        if (!costs) {
            return res.status(404).json({ error: "custos não encontrados! "});
        }

        res.status(200).json(costs);
    } catch (error) {
        res.status(500).json({ error: "Erro ao procurar custos" });
    }
};

const addCostsHandler = async (req, res) => {
  const { description, initial_quantity, initial_unit_value, category_id } = req.body;

  if (!description) {
    return res.status(400).json({ error: "Descrição é obrigatória." });
  }

  try {
    const newCosts = await addCosts(
      description,
      Number(initial_quantity),   
      Number(initial_unit_value), 
      null,                       
      null,                       
      null,                       
      Number(category_id),        
      true                        
    );
    res.status(201).json(newCosts);
  } catch (error) {
    res.status(500).json({ error: "Erro ao adicionar custos", details: error.message });
  }
};


const updateCostsHandler = async (req, res) => {
    const id = parseInt(req.params.id);
    const { description, initial_quantity, initial_unit_value, final_quantity, final_unit_value,
observation, category_id, selected } = req.body;

    if (!id) {
        return res.status(400).json({ error: "ID não encontrado." });
    }

    const hasUpdates = description !== undefined || initial_quantity !== undefined || initial_unit_value !== undefined;

    if (!hasUpdates) {
        return res.status(400).json({ error: "Pelo menos um dos campos deve ser alterado para atualizar." });
    }

    try {
        const updatedCosts = await updateCosts(id, description, initial_quantity, initial_unit_value, final_quantity, final_unit_value,
observation, category_id, selected);

        res.status(200).json(updatedCosts);
    } catch (error) {
        res.status(500).json({ error: "Erro ao atualizar custos" });
    }
};

const deleteCostsHandler = async (req, res) => {
    const id = parseInt(req.params.id);

    if (!id) {
        return res.status(400).json({ error: "ID não encontrado." });
    }

    try {
        await deleteCosts(id);

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: "Erro ao deletar custos" });
    }
};

// Novo controller para alternar selected  (Sâmia)
const toggleSelectedCostsHandler = async (req, res) => {
  const costId = parseInt(req.params.costId, 10);

  if (!costId) {
    return res.status(400).json({ error: "ID do custo não encontrado." });
  }

  try {
    const updatedCost = await toggleSelectedCosts(costId);
    return res.status(200).json(updatedCost);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao atualizar seleção do custo" });
  }
};


module.exports = {
    getAllCostsHandler,
    getCostsByCategoryHandler,
    getCostsByIdHandler,
    addCostsHandler,
    updateCostsHandler,
    deleteCostsHandler,
    toggleSelectedCostsHandler
};
