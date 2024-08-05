const fs = require("fs");
const SYMBOLS = ["C", "L", "O", "W"];
const REWARDS = {
  C: 10,
  L: 20,
  O: 30,
  W: 40,
};

let sessions = require("../dbMock/sessions.json");

const startGame = () => {
  const sessionId = _generateSessionId();
  sessions[sessionId] = { credits: 10 };
  _saveSessionsToFile();
  return { sessionId, credits: 10 };
};

const spinSlot = (sessionId) => {
  if (!sessions[sessionId]) {
    throw new Error("Invalid session ID");
  }

  let credits = sessions[sessionId].credits;
  if (credits < 1) {
    throw new Error("Insufficient credits");
  }

  credits -= 1;
  const firstSpinResult = _createSpin();
  let winAmount = 0;

  if (_isUserWon(firstSpinResult)) {
    winAmount = REWARDS[firstSpinResult[0]];
  }

  let finalSpinResult = firstSpinResult;

  // re-spin logic
  if (credits >= 40) {
    const reSpinProbability = credits < 60 ? 0.3 : 0.6;
    if (Math.random() < reSpinProbability && winAmount > 0) {
      const secondSpinResult = _createSpin();
      finalSpinResult = secondSpinResult; // always update to second spin result
      if (_isUserWon(secondSpinResult)) {
        winAmount = REWARDS[secondSpinResult[0]];
      } else {
        winAmount = 0; // no win on the second spin
      }
    }
  }

  credits += winAmount;
  sessions[sessionId].credits = credits;
  _saveSessionsToFile();
  return { spinResult: finalSpinResult, credits };
};

const cashOut = (sessionId) => {
  if (!sessions[sessionId]) {
    throw new Error("Invalid session ID");
  }

  const credits = sessions[sessionId].credits;
  _saveSessionsToFile();
  delete sessions[sessionId];
  return { credits };
};

const _generateSessionId = () => {
  return "xxxxxx".replace(/x/g, () => ((Math.random() * 36) | 0).toString(36));
};

const _createSpin = () => {
  return Array(3)
    .fill()
    .map(() => SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]);
};

const _isUserWon = (array) => array.every((element) => element === array[0]);

const _saveSessionsToFile = () => {
  return new Promise((resolve, reject) => {
    fs.writeFile(
      "dbMock/sessions.json",
      JSON.stringify(sessions, null, 2),
      (err) => {
        if (err) reject(err);
        else resolve();
      }
    );
  });
};

module.exports = {
  startGame,
  spinSlot,
  cashOut,
};
