import { exit } from "process";
import { getDB } from "../services/connectDB";
import { logger } from "../services/logger";
import { exec } from "child_process";
import { promisify } from "util";
import { ENV_VALS } from "../../config/config";
const MONGO_URL = ENV_VALS.mongoURL;

let startDate = new Date();
let endDate = new Date();
// Define MongoDB connection options
const mongoURI = MONGO_URL;

const collectionName = "ashieldauthshare";

//  Promisifying the exec
const execAsync = promisify(exec);

// Define the command to export data using mongoexport
const beforeExportCommand = `mongoexport --uri="${mongoURI}" --collection="${collectionName}" --out="beforeDelete.json"`;
const afterExportCommand = `mongoexport --uri="${mongoURI}" --collection="${collectionName}" --out="afterDelete.json"`;

if (process.argv.length > 3) {
  startDate = new Date(process.argv[2]);
  endDate = new Date(process.argv[3]);
} else {
  logger.info("Usage: node purgeOps.js fromDate toDate");
  exit(0);
}
const query = { updatedAt: { $gte: startDate, $lte: endDate }, authed: true };

async function runMongoBackup() {
  try {
    // counting and taking backup data
    const [db, client] = getDB()!;
    const col = db.collection("ashieldauthshare");

    await col.countDocuments().then((res) => {
      logger.info(`number of documents before delete operation: ${res}`);
    });
    await execAsync(beforeExportCommand).finally(() => {
      client.close();
    });
  } catch (error) {
    logger.error("--------runMongoBackup Error--------------");
    logger.error(error);
  }
}
async function runMongoCleanup() {
  try {
    // counting and deleting data
    const [db, client] = getDB()!;
    const col = db.collection("ashieldauthshare");

    await col.deleteMany(query).then((results) => {
      if (results.acknowledged) {
        logger.info("Number of records deleted: " + results.deletedCount);
      }
    });

    await execAsync(afterExportCommand);

    await col
      .countDocuments()
      .then((res) => {
        logger.info("Mongo DB records backup and deletion completed.");
        logger.info(`number of documents after delete operation: ${res}`);
      })
      .finally(() => {
        client.close();
        return;
      });
  } catch (error) {
    logger.error("--------runMongoCleanup Error--------------");
    logger.error(error);
  }
}

runMongoBackup().then(() => {
  runMongoCleanup();
});
