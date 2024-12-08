const cron = require("node-cron");
const { generateHint } = require("../services/wordGuess.services");

cron.schedule(
  "0 12 * * *",
  () => {
    generateHint();
  },
  {
    scheduled: true,
    timezone: "UTC",
  }
);

module.exports = cron;
