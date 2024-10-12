const { generateHint } = require("../services/wordGuess.services");

const getHints = async (req, res) => {
  const { data, hintForTheDay } = await generateHint();

  if (data) {
    const hints = data
      .split(/,|and/)
      .map((hint) => hint.replace(/\*/g, "").trim());

    res.status(200).send({
      wordOfTheDay: hintForTheDay,
      hint: hints,
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

module.exports = { getHints };
