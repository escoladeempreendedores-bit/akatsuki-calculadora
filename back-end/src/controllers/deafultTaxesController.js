const {getAllDefaultTaxes, getDefaultTaxById, updateDefaultTax} = require("../models/defaultTaxesModel.js");

const getAllDefaultTaxesHandler = async (req, res) => {
    try {
        const defaultTaxes = await getAllDefaultTaxes();

        res.status(200).json(defaultTaxes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getDefaultTaxByIdHandler = async (req, res) => {
    const id = parseInt(req.params.id);

    try {
        const defaultTax = await getDefaultTaxById(id);

        res.status(200).json(defaultTax);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateDefaultTaxHandler = async (req, res) => {
    const id = Number(req.params.id);
    const value = req.body.value;

    if(!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ error: "ID não encontrado!" });
    }

    if(value === undefined) {
        return res.status(400).json({ error: "Altere o campo para atualizar." });
    }
    
    try {
        const updatedDefaultTax = await updateDefaultTax(id, value);

        res.status(200).json(updatedDefaultTax);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllDefaultTaxesHandler,
    getDefaultTaxByIdHandler,
    updateDefaultTaxHandler
};