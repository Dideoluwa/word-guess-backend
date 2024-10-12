const cron = require("node-cron");
const { generateHint } = require("../services/wordGuess.services");

cron.schedule("0 0 * * * ", () => {
  generateHint();
});

module.exports = cron;
