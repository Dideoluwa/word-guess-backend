const { GoogleGenerativeAI } = require("@google/generative-ai");
const words = require("../utils/five-letter-words");
const axios = require("axios");

require("dotenv").config();

const base_url = process.env.API_URL;

const key = process.env.API_KEY;

const name = process.env.NAME;

const id = process.env.SECRET_ID;

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL });

const sentDataHandler = (payload) => {
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
            timestamp: payload.timestamp,
          },
        },
      ],
    },
  });
  return response;
};

const getAllWords = () => {
  const response = axios({
    url: `${base_url}/v0/${id}/${encodeURIComponent(name)}`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
  });
  return response;
};

const sendData = async (payload) => {
  try {
    const sentDataRes = await sentDataHandler(payload);
    console.log(`word of the day sent (${payload.wordForTheDay})`);
    return sentDataRes.data.records;
  } catch (err) {
    console.error("Error posting to table:", err.response?.data || err.message);
  }
};

const getWordsFromDb = async () => {
  try {
    const getDataRes = await getAllWords();
    return getDataRes.data.records;
  } catch (err) {
    console.error("Error posting to table:", err.response?.data || err.message);
  }
};

const removeUsedWords = (arr1, arr2) => {
  const fetchedWordsSet = new Set(arr2.map((item) => item?.fields?.word));

  return arr1.filter((word) => !fetchedWordsSet.has(word));
};

const generateHint = async () => {
  const date = new Date().toLocaleDateString("en-GB");

  try {
    const retrievedData = await getWordsFromDb();

    const getWords = removeUsedWords(words, retrievedData);

    if (!getWords.length) {
      throw new Error("No words available after filtering");
    }

    const wordsLength = getWords?.length;

    const wordForTheDayIndex = Math.floor(Math.random() * wordsLength);

    const wordForTheDay = getWords[wordForTheDayIndex];

    const hintPrompt = `${process.env.QUESTION} '${wordForTheDay}'`;

    const prompt = hintPrompt;

    const result = await model.generateContent(prompt);

    const data = result.response.text();

    const hintsArr = data
      .split(/,|and/)
      .map((hint) => hint.replace(/\*/g, "").trim());

    const hints = hintsArr.join(" & ");

    console.log(wordForTheDay, hints);

    const payloadData = {
      hints,
      wordForTheDay,
      timestamp: date,
    };

    const sendDataRes = await sendData(payloadData);

    return { data, wordForTheDay, sendDataRes };
  } catch (error) {
    console.error("Failed to generate hints:", error);
  }
};

module.exports = { generateHint };
