const express = require("express");
const {
  startGameController,
  spinSlotController,
  cashOutController,
} = require("./game.controller");
const router = express.Router();

router.get("/start", startGameController);
router.post("/spinSlot", spinSlotController);
router.post("/cashOut", cashOutController);

module.exports = router;
