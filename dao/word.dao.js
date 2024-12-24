const db = require("../config/database");
const admin = require("firebase-admin");

class WordsDao {
  async getAllWords() {
    const dataArray = [];
    const snapshot = await db.collection("words").get();
    snapshot.forEach((doc) => dataArray.push(doc.data()));
    return dataArray;
  }
  async sendWordToDb(payload) {
    try {
      const docRef = await db
        .collection("words")
        .doc(payload.timestamp.replace(/\//g, "-"))
        .set({
          ...payload,
          createdAt: new Date(),
        });
      return docRef.id;
    } catch (error) {
      throw new Error(`Error adding word to database: ${error}`);
    }
  }
  async getWordByTimestamp(timestamp) {
    const snapshot = await db
      .collection("words")
      .doc(timestamp.replace(/\//g, "-"))
      .get();

    if (snapshot.empty) {
      throw new Error(`No data found for the given timestamp: ${timestamp}`);
    }

    return snapshot.data();
  }

  async incrementDailyPlays(timestamp) {
    try {
      const docRef = db.collection("words").doc(timestamp.replace(/\//g, "-"));

      await docRef.update({
        dailyPlays: admin.firestore.FieldValue.increment(1),
      });

      return `Daily plays for ${timestamp} incremented successfully.`;
    } catch (error) {
      if (error.code === "not-found") {
        throw new Error(`No document found for timestamp: ${timestamp}`);
      }
      throw new Error(`Error incrementing daily plays: ${error.message}`);
    }
  }
}

module.exports = new WordsDao();
