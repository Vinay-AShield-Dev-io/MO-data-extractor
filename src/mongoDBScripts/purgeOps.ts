import { exit } from "process";
import { getDB } from "../connectDB";

let startDate = new Date();
let endDate = new Date();

if (process.argv.length > 3) {
  startDate = new Date(process.argv[2]);
  endDate = new Date(process.argv[3]);
} else {
  console.log("Usage: node purgeOps.js fromDate toDate");
  exit(0);
}
const query = { updatedAt: { $gte: startDate, $lte: endDate } };

function runMongoBackupAndCleanup() {
  try {
    const [db, client] = getDB()!;
    const col = db.collection("ashieldauthshare");
    // deleting backuped data
    col
      .deleteMany(query)
      .then((results) => {
        if (results.acknowledged) {
          console.log("Number of records deleted: " + results.deletedCount);
        }
      })
      .finally(() => {
        client.close();
      });
    console.info("Mongo DB records backup and deletion completed.");
    return;
  } catch (error) {
    console.error("--------runMongoBackupAndCleanup--------------");
    console.error(error);
  }
}
// Update document fields

// function runMongoUpdate() {
//   try {
//     const [db, client] = getDB()!;
//     const col = db.collection("ashieldauthshare");
//     // deleting backuped data
//     col
//       .updateMany(query, { $set: { share2: "" } })
//       .then((results) => {
//         if (results.acknowledged) {
//           console.log("Number of records updated: " + results.modifiedCount);
//         }
//       })
//       .finally(() => {
//         client.close();
//       });
//     console.info("Mongo DB records updation completed.");
//     return;
//   } catch (err) {
//     console.error("----------Mongo Update Error ----------");
//     console.error(err);
//   }
// }
runMongoBackupAndCleanup();
// runMongoUpdate();
