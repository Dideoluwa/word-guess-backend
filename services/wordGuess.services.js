const words = require("../utils/five-letter-words");
const { GoogleGenerativeAI } = require("@google/generative-ai");

require("dotenv").config();

const generateHint = async (payload) => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = payload.prompt;

  try {
    const result = await model.generateContent(prompt);

    return result.response.text();
  } catch (error) {
    console.error("Failed to generate hints:", error);
  }
};

module.exports = { generateHint };
