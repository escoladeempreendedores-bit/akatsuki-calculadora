const express = require("express");
const router = express.Router();

const {
  getItemsByMissionHandler,
  getMissionHandler,
  getMissionMarginValueHandler,
  getMissionMarginPercentegeHandler,
  getMissionPriceHandler,
  getMissionPricePerPersonHandler,
  getMissionTaxeValueHandler,
  getMissionTaxePercentegeHandler,
  getMissionTotalCostsHandler,
  getPersonsByMissionHandler,
  getMarginOptionsHandler
} = require("../controllers/missionDashController.js");

const authMiddleware = require("../middlewares/authMiddleware");

router.use(authMiddleware);

router.get('/margin-options', getMarginOptionsHandler);
router.get('/:id/persons', getPersonsByMissionHandler);
router.get('/:id/mission', getMissionHandler);
router.get('/:id/items', getItemsByMissionHandler);
router.get('/:id/margin', getMissionMarginValueHandler);
router.get('/:id/margin-percentege', getMissionMarginPercentegeHandler);
router.get('/:id/taxes', getMissionTaxeValueHandler);
router.get('/:id/taxes-percentege', getMissionTaxePercentegeHandler);
router.get('/:id/costs-total', getMissionTotalCostsHandler);
router.get('/:id/price', getMissionPriceHandler);
router.get('/:id/price-per-person', getMissionPricePerPersonHandler);

module.exports = router;