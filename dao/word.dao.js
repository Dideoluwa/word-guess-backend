const db = require("../config/database");
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
}

module.exports = new WordsDao();
