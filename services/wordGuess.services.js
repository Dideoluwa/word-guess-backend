const { GoogleGenerativeAI } = require("@google/generative-ai");
const words = require("../utils/five-letter-words");

require("dotenv").config();

const generateHint = async (payload) => {
  const wordsLength = words.length;
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const hintForTheDayIndex = Math.floor(Math.random() * wordsLength);

  const hintForTheDay = words[hintForTheDayIndex];

  const hintPrompt = `${process.env.QUESTION} '${hintForTheDay}'`;

  const prompt = hintPrompt;

  try {
    const result = await model.generateContent(prompt);

    const data = result.response.text();

    const hints = data
      .split(/,|and/)
      .map((hint) => hint.replace(/\*/g, "").trim());

    console.log(hintForTheDay, hints);

    return { data, hintForTheDay };
  } catch (error) {
    console.error("Failed to generate hints:", error);
  }
};

module.exports = { generateHint };
