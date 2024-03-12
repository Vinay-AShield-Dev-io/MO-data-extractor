import { Db, MongoClient } from "mongodb";
import { RESULT_OUTPUT_FILE as outPutFileName } from "../../config/config";
import { BlobStorage } from "../services/blobStorage";
import { getDB } from "../services/connectDB";
import { writeDataIntofile } from "../services/fileStream";
import { logger } from "../services/logger";


let startDate: Date = new Date("2024-02-02T00:00:00.000Z");
let endDate: Date = new Date("2024-02-03T00:00:00.000");
let performaStartTime = performance.now();

if (process.argv.length > 3) {
    startDate = new Date(process.argv[2]);
    endDate = new Date(process.argv[3]);
}


const execScript = () => {
    let client: MongoClient
    let db: Db;
    const resp = getDB();
    if (resp === null) return;
    [db, client] = resp;

    try {
        const ashieldmobtxnCollection = db.collection("ashieldmobtxn");
        ashieldmobtxnCollection.aggregate([
            { "$match": { "createdAt": { $gte: startDate }, "updatedAt": { $lte: endDate } } },
            { "$project": { "timeDifference": { "$subtract": ["$updatedAt", "$createdAt"] } } }
        ]).toArray().then(async data => {
            writeDataIntofile(outPutFileName, (err, ws) => {
                let timeDiff = 0;
                let TimeDiffBelow1s = 0;
                let TimeDiffBelow4s = 0;
                let TimeDiffBelow6s = 0;
                let TimeDiffBelow10s = 0;
                let TimeDiffAfter10s = 0;
                data.forEach(item => {
                    timeDiff = parseInt(item["timeDifference"])
                    if (timeDiff < 1000) {
                        TimeDiffBelow1s += 1;
                    } else if (timeDiff < 4000) {
                        TimeDiffBelow4s++;
                    } else if (timeDiff < 6000) {
                        TimeDiffBelow6s++;
                    } else if (timeDiff < 10000) {
                        TimeDiffBelow10s++;
                    } else {
                        TimeDiffAfter10s++;
                    }
                    ws.write(`${timeDiff}\n`);
                });
                const bs = new BlobStorage();
                const blobContent = `
                Authentication completed below 1s: ${TimeDiffBelow1s}\n
                Authentication completed below 4s: ${TimeDiffBelow4s}\n
                Authentication completed below 6s: ${TimeDiffBelow6s}\n
                Authentication completed below 10s: ${TimeDiffBelow10s}\n
                Authentication completed after 10s: ${TimeDiffAfter10s}\n
                `
                logger.info(blobContent);
                bs.upladBlob(blobContent);
                if (err) {
                    logger.error("" + err)
                }
                return ws;
            });
        }).finally(() => {
            client.close();
            logger.info(`mongo execution completed: ${(performance.now() - performaStartTime).toFixed(2)} ms`);
        })
        logger.info(`Time taken to execute mongo queries: ${(performance.now() - performaStartTime).toFixed(2)}ms`);
    } catch (error) {
        logger.error("" + error)
        client.close();
    }
}
execScript();
