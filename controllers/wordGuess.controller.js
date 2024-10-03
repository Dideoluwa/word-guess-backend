const { generateHint } = require("../services/wordGuess.services");

const getHints = async (req, res) => {
  const prompt = "only two very simple words that describe 'HUMOR'";

  const hintRes = await generateHint({
    prompt,
  });

  if (hintRes) {
    res.status(200).send({
      hint: hintRes,
      success: true,
    });
  } else {
    res.status(500).send(
      JSON.stringify({
        message: "Error generating hint: " + hintRes.error,
        success: false,
      })
    );
  }
};

module.exports = { getHints };
