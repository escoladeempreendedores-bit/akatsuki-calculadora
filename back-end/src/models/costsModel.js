const prisma = require("../prisma.js");

const getAllCosts = async () => {
    return prisma.costs.findMany({
        include: { 
        Categories: true,
      },
        orderBy: {
            id: "desc"
        }
    });
};

const getCostsByCategory = async (category_id) => {
    return prisma.costs.findMany({
        where: {
            category_id: category_id
        },
        include: {
            Categories: true
        },
        orderBy: {
            id: "desc",
        }
    });
};

const getCostsById = async (id) => {
    return prisma.costs.findUnique({
        where: {
            id: id
        },
        include: {
            Categories: true
        }
    });
};

const addCosts = async (description, initial_quantity, initial_unit_value, final_quantity, final_unit_value,
observation, category_id, selected) => {
    return prisma.costs.create({
        data: {
            description: description,
            initial_quantity: initial_quantity,
            initial_unit_value: initial_unit_value,
            final_quantity: final_quantity,
            final_unit_value: final_unit_value,
            observation: observation,
            category_id: category_id,
            selected: selected
        }
    });
};

const updateCosts = async (id, description, initial_quantity, initial_unit_value, final_quantity, final_unit_value,
observation, category_id, selected) => {
    const costsExist = await getCostsById(id);

    if (!costsExist) {
        throw new Error("Custos não encontrado!");
    }

    return prisma.costs.update({
        where: {
            id: id
        },

        data: {
            description: description,
            initial_quantity: initial_quantity,
            initial_unit_value: initial_unit_value,
            final_quantity: final_quantity,
            final_unit_value: final_unit_value,
            observation: observation,
            category_id: category_id,
            selected: selected
        }
    });
};

const deleteCosts = async (id) => {
    const costsExist = await getCostsById (id);

    if (!costsExist) {
        throw new Error("Custos não encontrado!");
    }

    return prisma.costs.delete({
        where: {
            id: id
        }
    });
};

// Novo método para alternar selected (Sâmia)
const toggleSelectedCosts = async (costId) => {
    const costsExist = await getCostsById(costId);

    if (!costsExist) {
        throw new Error("Custo não encontrado!");
    }

    return prisma.costs.update({
        where: {
            id: costId
        },
        data: {
            selected: !costsExist.selected
        }
    });
};

module.exports = {
    getAllCosts,
    getCostsByCategory,
    getCostsById,
    addCosts,
    updateCosts,
    deleteCosts,
    toggleSelectedCosts
};
