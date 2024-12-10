const { GoogleGenerativeAI } = require("@google/generative-ai");
const words = require("../utils/five-letter-words");
const axios = require("axios");
const crypto = require("crypto");

require("dotenv").config();

const base_url = process.env.API_URL;

const key = process.env.API_KEY;

const name = process.env.NAME;

const id = process.env.SECRET_ID;

const encryptionKey = process.env.ENCRYPTION_KEY;

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const encryptionAlgorithm = process.env.ENCRYPTION_ALGORITHM;

const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL });

const encryptData = (data, key) => {
  if (Buffer.from(key, "hex").length !== 32) {
    throw new Error(
      "Invalid key length: Key must be 32 bytes (256 bits) in hex format"
    );
  }

  const iv = crypto.randomBytes(12);

  const cipher = crypto.createCipheriv(
    encryptionAlgorithm,
    Buffer.from(key, "hex"),
    iv
  );

  let encrypted = cipher.update(JSON.stringify(data), "utf8", "hex");
  encrypted += cipher.final("hex");

  const authTag = cipher.getAuthTag();

  return `${iv.toString("hex")}:${encrypted}:${authTag.toString("hex")}`;
};

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
            hints: payload.hints,
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
  const currentDate = new Date();
  const oneDayInMs = 24 * 60 * 60 * 1000;
  const tomorrow = new Date(currentDate.getTime() + oneDayInMs);
  const date = tomorrow.toLocaleDateString("en-GB");

  try {
    const retrievedData = await getWordsFromDb();

    const getWords = removeUsedWords(words, retrievedData);

    if (!getWords.length) {
      throw new Error("No words available after filtering");
    }

    const wordsLength = getWords?.length;

    const wordForTheDayIndex = Math.floor(Math.random() * wordsLength);

    const wordForTheDay = getWords[wordForTheDayIndex];

    const hintPrompt = `For a word guess game, come up with just and only/strictly (it must never be a statement, it must be ttwo one-word alone) two one-word hints that start their first letters with capital letters for the word '${wordForTheDay}'. 

It’s a daily word game like worlde and the user has only five attempts to guess the word based on the provided hints  

Rules for generating hints:
1. If the word to be guessed is an easy or common word, make the hints difficult

2. If the word to be guessed is less common or difficult , make the hints not so difficult/ easier

3.  The hints should only help narrow down the word’s meaning or context but must not 
explicitly include synonyms or overly obvious clues.

 4.   Ensure the hints are distinct from each other and relate to different aspects of the word (e.g., meaning, usage, cultural reference, etc.).`;
    const prompt = hintPrompt;

    const result = await model.generateContent(prompt);

    const data = result.response.text();

    const hintsArr = data
      .replace(/\s+/g, " ")
      .replace(/\./g, "")
      .split(/\s+|\n|,|and/)
      .map((hint) => hint.replace(/\*/g, "").replace(/,/g, "").trim())
      .filter((hint) => hint !== "");

    const hints = hintsArr.join(" & ");

    const payloadData = {
      hints: hints
        .replace(/&\s*$/, "")
        .replace(/&/g, (match, index) =>
          index === hints.indexOf("&") ? match : " & "
        ),
      wordForTheDay: encryptData(wordForTheDay, encryptionKey),
      timestamp: date,
    };

    const sendDataRes = await sendData(payloadData);

    return { data, wordForTheDay, sendDataRes };
  } catch (error) {
    console.error("Failed to generate hints:", error);
  }
};

module.exports = { generateHint };
