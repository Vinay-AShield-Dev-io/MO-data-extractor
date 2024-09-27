import { Db, MongoClient } from "mongodb";
import { ENV_VALS } from "../../config/config";
const MONGO_URL = ENV_VALS.mongoURL;
const dbName = ENV_VALS.mongoDB_DBName;

export const getDB = (): [Db, MongoClient] | null => {
  //   console.log(MONGO_URL);
  console.log("Connection Successful !");
  if (MONGO_URL === "") {
    console.error("MONGO_URL is not set");
    return null;
  }
  const client = new MongoClient(MONGO_URL);
  try {
    client.connect();
    const db = client.db(dbName);
    return [db, client];
  } catch (e) {
    console.error(e);
    throw new Error("" + e);
  }
};
