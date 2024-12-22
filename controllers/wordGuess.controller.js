const {
  generateHint,
  getAllWords,
  getWordForTheDay,
  incrementDailyPlays,
} = require("../services/wordGuess.services");

const getHints = async (req, res) => {
  const { data, word, hintForTheDay, hints, sendDataRes } =
    await generateHint();

  if (data) {
    res.status(200).send({
      wordOfTheDay: word,
      hint: hints,
      sendDataRes,
      success: true,
    });
  } else {
    res.status(500).send(
      JSON.stringify({
        message: `Error generating hint for ${hintForTheDay}`,
        success: false,
      })
    );
  }
};

const getWords = async (req, res) => {
  try {
    const words = await getAllWords();
    res.status(200).send(words);
  } catch (error) {
    res.status(500).send(
      JSON.stringify({
        message: "Error getting all words",
        success: false,
      })
    );
  }
};

const getWordByTimeStamp = async (req, res) => {
  const { date } = req.params;

  const timestamp = date.replace(/-/g, "/");

  try {
    const words = await getWordForTheDay(timestamp);
    res.status(200).send({ words, success: true });
  } catch (error) {
    res.status(500).send(
      JSON.stringify({
        message: error?.reponse?.data || error?.message,
        success: false,
      })
    );
  }
};

const dailyPlaysIncrement = async (req, res) => {
  const { date } = req.params;

  const timestamp = date.replace(/-/g, "/");

  try {
    const incrementMsg = await incrementDailyPlays(timestamp);
    res.status(200).send({ incrementMsg, success: true });
  } catch (error) {
    res.status(500).send(
      JSON.stringify({
        message: error?.reponse?.data || error?.message,
        success: false,
      })
    );
  }
};

module.exports = {
  getHints,
  getWords,
  getWordByTimeStamp,
  dailyPlaysIncrement,
};
