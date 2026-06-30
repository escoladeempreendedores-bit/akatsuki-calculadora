const express = require("express");
const router = express.Router();

const {
  getAllMissionsHandler,
  getMissionCountHandler,
  getTotalAverageMarginHandler,
  getTotalMarginValueMissionsHandler,
  getTotalMissionProfitHandler,
  getTotalMissionsParticipantsHandler,
} = require("../controllers/generalDashController.js");

const authMiddleware = require("../middlewares/authMiddleware");

router.use(authMiddleware);

router.get('/missions', getAllMissionsHandler);
router.get('/average', getTotalAverageMarginHandler);
router.get('/count', getMissionCountHandler);
router.get('/margin', getTotalMarginValueMissionsHandler);
router.get('/profit', getTotalMissionProfitHandler);
router.get('/participants', getTotalMissionsParticipantsHandler);

module.exports = router;