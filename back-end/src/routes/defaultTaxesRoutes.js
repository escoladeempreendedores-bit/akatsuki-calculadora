const express = require("express");
const router = express.Router();

const {
    getAllDefaultTaxesHandler,
    getDefaultTaxByIdHandler,
    updateDefaultTaxHandler
} = require("../controllers/deafultTaxesController");

router.get('/', getAllDefaultTaxesHandler);
router.get('/:id', getDefaultTaxByIdHandler);
router.put('/:id', updateDefaultTaxHandler);

module.exports = router;