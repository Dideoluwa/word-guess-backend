// const cron = require("node-cron");
const { generateHint } = require("../services/wordGuess.services");
const { onSchedule } = require("firebase-functions/v2/scheduler");

// cron.schedule(
//   "* * * * *",
//   () => {
//     generateHint();
//   },
//   {
//     scheduled: true,
//     timezone: "UTC",
//   }
// );

exports.schedule = onSchedule("0 12 * * *", async (event) => {
  generateHint();
  return null;
});

// module.exports = cron;
