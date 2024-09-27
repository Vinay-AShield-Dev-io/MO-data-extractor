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

let collectionName = "authregistry";
let dfArray: [] = [];
//  Promisifying the exec
const execAsync = promisify(exec);

// Define the command to export data using mongoexport
function exportCommand(fileName: string) {
  return `mongoexport --uri="${mongoURI}" --collection="${collectionName}" --out="${fileName}.json"`;
}
// const beforeExportCommand = `mongoexport --uri="${mongoURI}" --collection="${collectionName}" --out="beforeDelete.json"`;
// const afterExportCommand = `mongoexport --uri="${mongoURI}" --collection="${collectionName}" --out="afterDelete.json"`;

if (process.argv.length > 3) {
  startDate = new Date(process.argv[2]);
  endDate = new Date(process.argv[3]);
} else {
  logger.info("Usage: node purgeOps.js fromDate toDate");
  exit(0);
}
const findQuery = [
  {
    $match: {
      updatedAt: { $gte: startDate, $lte: endDate },
    },
  },
  {
    $project: {
      _id: 0,
      dfs: "$_id.df",
    },
  },
  {
    $group: {
      _id: null,
      dfs: { $push: "$dfs" },
    },
  },
];

async function beforeDeleteBackup() {
  try {
    // counting and taking backup data
    const [db, client] = getDB()!;
    collectionName = "ashieldauthshare";
    const col = db.collection(collectionName);

    await col.countDocuments().then((res) => {
      logger.info(`number of documents before delete operation: ${res}`);
    });
    await execAsync(exportCommand("beforeDelete")).finally(() => {
      client.close();
    });
  } catch (error) {
    logger.error("--------beforeDeleteBackup Error--------------");
    logger.error(error);
  }
}
async function findMongoDBRecords() {
  const [db, client] = getDB()!;
  const col = db.collection(collectionName);
  try {
    // counting and deleting data
    let dataArray = await col.aggregate(findQuery).toArray();
    console.log(dataArray[0].dfs.length);
    dfArray = dataArray[0].dfs;
    // await execAsync(exportCommand("afterDelete"));

    // await col
    //   .countDocuments()
    //   .then((res) => {
    //     logger.info("Mongo DB records backup and deletion completed.");
    //     logger.info(`number of documents after delete operation: ${res}`);
    //   })
  } catch (error) {
    logger.error("--------findMongoDB Records Error--------------");
    logger.error(error);
  } finally {
    await client.close();
  }
}
async function deleteMongoDB(recordsArray: []) {
  try {
    // counting and deleting data
    const [db, client] = getDB()!;
    collectionName = "ashieldauthshare";
    const col = db.collection(collectionName);
    const deleteQuery = {
      devicefin: { $in: recordsArray },
    };
    await col
      .deleteMany(deleteQuery)
      .then((results) => {
        if (results.acknowledged) {
          logger.info("Number of records deleted: " + results.deletedCount);
        }
      })

      // await execAsync(exportCommand("afterDelete"));

      // await col
      //   .countDocuments()
      //   .then((res) => {
      //     logger.info("Mongo DB records backup and deletion completed.");
      //     logger.info(`number of documents after delete operation: ${res}`);
      //   })
      .finally(() => {
        client.close();
      });
  } catch (error) {
    logger.error("--------deleteMongoDB Error--------------");
    logger.error(error);
  }
}
async function afterDeleteBackup() {
  try {
    // counting and taking backup data
    const [db, client] = getDB()!;
    collectionName = "ashieldauthshare";
    const col = db.collection(collectionName);

    await col.countDocuments().then((res) => {
      logger.info("Mongo DB records backup and deletion completed.");
      logger.info(`number of documents after delete operation: ${res}`);
    });
    await execAsync(exportCommand("afterDelete")).finally(() => {
      client.close();
      return;
    });
  } catch (error) {
    logger.error("--------afterDeleteBackup Error--------------");
    logger.error(error);
  }
}

findMongoDBRecords().then(() => {
  beforeDeleteBackup().then(() => {
    deleteMongoDB(dfArray).then(() => {
      afterDeleteBackup();
    });
  });
});
