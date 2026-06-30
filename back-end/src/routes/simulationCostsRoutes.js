const express = require("express");
const router = express.Router();

const {
  getMissionCardFees,
} = require("../controllers/simulationCostsController");

// Ex.: GET /api/simulation-costs/123/card-fees
router.get("/:mission_id/card-fees", getMissionCardFees);

module.exports = router;