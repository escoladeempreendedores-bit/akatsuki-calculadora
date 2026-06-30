const express = require("express");
const router = express.Router();

const {
    getAllCostsHandler,
    getCostsByCategoryHandler,
    getCostsByIdHandler,
    addCostsHandler,
    updateCostsHandler,
    deleteCostsHandler,
    toggleSelectedCostsHandler
} = require("../controllers/costsController.js");

router.get('/', getAllCostsHandler);
router.get('/categories/:category_id', getCostsByCategoryHandler);
router.get('/:id', getCostsByIdHandler);
router.post('/', addCostsHandler);
router.put('/:id', updateCostsHandler);
router.delete('/:id', deleteCostsHandler);
router.patch('/:costId/toggle-selected', toggleSelectedCostsHandler);

module.exports = router;
