const { GoogleGenerativeAI } = require("@google/generative-ai");
const words = require("../utils/five-letter-words");
const axios = require("axios");

require("dotenv").config();

const sentDataHandler = (payload) => {
  const base_url = process.env.API_URL;

  const key = process.env.API_KEY;

  const name = process.env.NAME;

  const id = process.env.SECRET_ID;

  const response = axios({
    url: `${base_url}/v0/${id}/${encodeURIComponent(name)}`,
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    data: {
      records: [
        {
          fields: {
            word: payload.wordForTheDay,
            hints: JSON.stringify(payload.hints),
          },
        },
      ],
    },
  });
  return response;
};

const sendData = async (payload) => {
  try {
    console.log(payload.wordForTheDay);
    const sentDataRes = await sentDataHandler(payload);
    console.log(`word of the day sent (${payload.wordForTheDay})`);
    return sentDataRes.data.records;
  } catch (err) {
    console.error(
      "Error posting to Airtable:",
      err.response?.data || err.message
    );
  }
};

const generateHint = async (payload) => {
  const wordsLength = words.length;
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const wordForTheDayIndex = Math.floor(Math.random() * wordsLength);

  const wordForTheDay = words[wordForTheDayIndex];

  const hintPrompt = `${process.env.QUESTION} '${wordForTheDay}'`;

  const prompt = hintPrompt;

  try {
    const result = await model.generateContent(prompt);

    const data = result.response.text();

    const hints = data
      .split(/,|and/)
      .map((hint) => hint.replace(/\*/g, "").trim());

    console.log(wordForTheDay, hints);

    const payloadData = {
      hints,
      wordForTheDay,
    };

    const sendDataRes = await sendData(payloadData);

    return { data, wordForTheDay, sendDataRes };
  } catch (error) {
    console.error("Failed to generate hints:", error);
  }
};

module.exports = { generateHint };
