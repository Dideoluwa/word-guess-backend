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
      const docRef = await db.collection("words").add(payload);
      return docRef.id;
    } catch (error) {
      throw new Error(`Error adding word to database: ${error}`);
    }
  }
  async getWordByTimestamp(timestamp) {
    const dataArray = [];
    const snapshot = await db
      .collection("words")
      .where("timestamp", "==", timestamp)
      .get();
    if (snapshot.empty) {
      throw new Error(`No data found for the given timestamp: ${timestamp}`);
    } else {
      snapshot.docs.forEach((doc) => dataArray.push(doc.data()));
      return dataArray;
    }
  }

  async incrementDailyPlays(timestamp) {
    try {
      const snapshot = await db
        .collection("words")
        .where("timestamp", "==", timestamp)
        .get();
      if (snapshot.empty) {
        throw new Error(`No data found for the given timestamp: ${timestamp}`);
      } else {
        snapshot.docs.forEach(async (doc) => {
          await doc.ref.update({
            dailyPlays: admin.firestore.FieldValue.increment(1),
          });
        });
        return `Daily plays for ${timestamp} incremented successfully`;
      }
    } catch (error) {
      throw new Error(`Error incrementing daily plays: ${error}`);
    }
  }
}

module.exports = new WordsDao();
