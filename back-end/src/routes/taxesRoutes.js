const express = require("express");
const router = express.Router();

const {
  getAllTaxes,
  getTaxById,
  createTax,
  updateTax,
  removeTax
} = require("../controllers/taxesController");


router.get('/:mission_id/taxes', getAllTaxes);
router.get('/:mission_id/taxes/:id', getTaxById);
router.post('/:mission_id/taxes', createTax);
router.put('/:mission_id/taxes/:id', updateTax);
router.delete('/:mission_id/taxes/:id', removeTax);

module.exports = router;
