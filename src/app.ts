import { Db, MongoClient } from "mongodb";
import { performance } from "perf_hooks";
import { longCodesInfo } from "../config/config";
import { sendMail } from "./azureEmailService";
import { getDB } from "./services/connectDB";
import { getLongCodeDataSummary } from "./getLongCodeDataSummary";
import { logger } from "./services/logger";

let startDate: Date = new Date();
let endDate: Date = new Date(startDate.getTime() - 1 * 60 * 60 * 1000);
let performaStartTime = performance.now();

if (process.argv.length > 3) {
  startDate = new Date(process.argv[2]);
  endDate = new Date(process.argv[3]);
}

// 'This function runs at every hour\'s 5th minute'
const execScript = async () => {
  let client: MongoClient;
  let db: Db;
  const resp = getDB();
  if (resp === null) return;
  [db, client] = resp;
  const ashieldmobtxnCollection = db.collection("ashieldmobtxn");
  logger.info(
    "Time taken to connect to the MongoDB:" +
      (performance.now() - performaStartTime).toFixed(2) +
      "ms"
  );
  let finalFormattedOUtput = "";
  for (const item of longCodesInfo) {
    finalFormattedOUtput += `<h4> ${item.name} (${item.code}) </h4>`;
    const [data, completed = 0, expired = 0, failed = 0] =
      await getLongCodeDataSummary(
        ashieldmobtxnCollection,
        item.code,
        startDate,
        endDate
      );
    finalFormattedOUtput += data;
    const totalRequests: number = completed + failed + expired;
    finalFormattedOUtput += "Total requests = " + totalRequests + "<br>";
    const PercentageOfExpiredRate =
      expired === 0 ? 0 : ((expired / totalRequests) * 100).toFixed(2);
    const PercentageOfFailedRate =
      failed === 0 ? 0 : ((failed / totalRequests) * 100).toFixed(2);
    finalFormattedOUtput += `Expired rate in % = ${PercentageOfExpiredRate} <br>`;
    finalFormattedOUtput += `Failed rate in % = ${PercentageOfFailedRate}<br>`;
  }
  client.close();
  logger.info(
    "Time taken to execute mongo queries:",
    (performance.now() - performaStartTime).toFixed(2),
    "ms"
  );
  sendMail(finalFormattedOUtput);
  logger.info(
    "Program execution completed:",
    (performance.now() - performaStartTime).toFixed(2),
    "ms"
  );
};

function scheduleNextExecution() {
  const now = new Date();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  const milliseconds = now.getMilliseconds();

  // Calculate the delay until the next occurrence of the 5th minute of the hour
  const delay =
    (60 - (minutes % 60) + 5) * 60 * 1000 - seconds * 1000 - milliseconds;

  // Schedule the function to run after the calculated delay
  setTimeout(() => {
    execScript();
    // Schedule the next execution
    scheduleNextExecution();
  }, delay);
}

// Start scheduling the next execution
scheduleNextExecution();

// Call the function immediately (for the very first time)
execScript();
