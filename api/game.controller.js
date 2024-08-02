const { startGame, spinSlot, cashOut } = require("./game.service");

const startGameController = (req, res) => {
  try {
    const result = startGame();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const spinSlotController = (req, res) => {
  const { sessionId } = req.body;
  try {
    const result = spinSlot(sessionId);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const cashOutController = (req, res) => {
  const { sessionId } = req.body;
  try {
    const result = cashOut(sessionId);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  startGameController,
  spinSlotController,
  cashOutController,
};
