import { Db, MongoClient } from "mongodb";
import { getDB } from "../services/connectDB";
import { writeDataIntofile } from "./fileStream";

let startDate: Date = new Date(new Date().getTime() - 5 * 60 * 60 * 1000);
let endDate: Date = new Date(startDate.getTime() - 1 * 60 * 60 * 1000);
let performaStartTime = performance.now();

let outPutFileName = "outfile.csv";

if (process.argv.length > 3) {
  startDate = new Date(process.argv[2]);
  endDate = new Date(process.argv[3]);
}

if (process.argv.length > 4) {
  outPutFileName = process.argv[4];
}

const execScript = () => {
  let client: MongoClient;
  let db: Db;
  const resp = getDB();
  if (resp === null) return;
  [db, client] = resp;

  try {
    const ashieldmobtxnCollection = db.collection("ashieldmobtxn");
    ashieldmobtxnCollection
      .aggregate([
        {
          $match: {
            createdAt: { $gte: startDate },
            updatedAt: { $lte: endDate },
          },
        },
        {
          $project: {
            createdAt: 1,
            updatedAt: 1,
            timeDifference: { $subtract: ["$updatedAt", "$createdAt"] },
          },
        },
      ])
      .toArray()
      .then(async (data) => {
        writeDataIntofile(outPutFileName, (err, ws) => {
          data.forEach((item) => {
            ws.write(`${item["timeDifference"]}\n`);
          });
          if (err) {
            console.log(err);
          }
          return ws;
        });
      })
      .finally(() => {
        client.close();
      });
    console.log(
      "Time taken to connect to the MongoDB:",
      (performance.now() - performaStartTime).toFixed(2),
      "ms"
    );
    console.log(
      "Time taken to execute mongo queries:",
      (performance.now() - performaStartTime).toFixed(2),
      "ms"
    );
    console.log(
      "Program execution completed:",
      (performance.now() - performaStartTime).toFixed(2),
      "ms"
    );
  } catch (error) {
    console.error(error);
    client.close();
  }
};
execScript();
