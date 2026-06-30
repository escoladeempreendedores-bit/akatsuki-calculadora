const prisma = require("../prisma.js");

const getAllDefaultTaxes = async () => {
    return prisma.defaultTaxes.findMany({
        orderBy: {
            id: "asc"
        }
    });
};

const getDefaultTaxById = async (id) => {
    return prisma.defaultTaxes.findUnique({
        where: {
            id: id
        }
    });
};

const updateDefaultTax = async (id, value) => {
    const defaultTaxExist = await getDefaultTaxById (id);

    if (!defaultTaxExist) {
        throw new Error("Taxa não encontrada!");
    }

    return prisma.defaultTaxes.update({
        where: {
            id: id
        },
        
        data: {
            value: value,
            updated_at: new Date()
        }
    });
};

module.exports = {
    getAllDefaultTaxes,
    getDefaultTaxById,
    updateDefaultTax
};