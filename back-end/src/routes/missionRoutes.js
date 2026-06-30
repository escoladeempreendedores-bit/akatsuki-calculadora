const express = require("express");
const router = express.Router();

const {
    getAllMissionsHandler,
    getMissionsByAccountHandler,
    getMissionByIdHandler,
    addMissionHandler,
    cloneMissionHandler,
    exportMission,
    updateMissionHandler,
    deleteMissionHandler
} = require("../controllers/missionController.js");

const authMiddleware = require("../middlewares/authMiddleware");

router.use(authMiddleware);

router.get('/', getAllMissionsHandler);
router.get('/users/:user_id', getMissionsByAccountHandler);
router.get('/:id', getMissionByIdHandler);
router.post('/', addMissionHandler);
router.post('/:id/clone', cloneMissionHandler);
router.get("/:id/export", exportMission);
router.put('/:id', updateMissionHandler);
router.delete('/:id', deleteMissionHandler);

module.exports = router;