import { Db, MongoClient, } from 'mongodb';
import { performance } from 'perf_hooks';
import { exit } from 'process';
import { ENV_VALS } from '../config/config';
import { sendMail } from './azureEmailService';
// database access
const dbName = 'AShieldClickless';
const MONGO_URL = ENV_VALS.mongoURL;
const startTime = performance.now();

export const getDB = async (): Promise<[Db, MongoClient] | null> => {

    if (MONGO_URL === "") { console.error("MONGO_URL is not set"); return null };
    const client = new MongoClient(MONGO_URL);
    try {
        // Connect to the MongoDB cluster
        client.connect();
        const db = client.db(dbName);
        const endTime = performance.now();
        return [db, client]
    } catch (e) {
        console.error(e);
        throw new Error("" + e);
    }
}

if (process.argv.length < 4) {
    console.log("Usage: ts-node moFailsData.ts ISODatetime1 ISODatetime2");
    exit(0);
}

const startDateStr = process.argv[2]
const endDateStr = process.argv[3]
const startDate: Date = new Date(startDateStr);
const endDate: Date = new Date(endDateStr);

getDB().then(async (resp) => {
    if (resp === null) return;
    const [db, client] = resp;
    

    const ashieldmobtxnCollection = db.collection("ashieldmobtxn");
    console.log("Time taken to connect to the MongoDB:", (performance.now() - startTime).toFixed(2), "ms");

    let airtelDataCollector = ""
    await ashieldmobtxnCollection.aggregate([
        {
            "$match": { "smshlc": 1644033266, "createdAt": { $gt: startDate, $lt: endDate } }
        },
        { $group: { _id: "$status", sum: { $count: {} } } }
    ]).toArray().then(async data => {
        data.forEach(data => {
            airtelDataCollector += data?._id + " = " + data?.sum + "<br>"
        })
    });


    // ------------------------ vodafone data collection -----------------------
    let vodaIdeaDataCollector = ""
    await ashieldmobtxnCollection.aggregate([
        {
            "$match":
                { "smshlc": 463069304, "createdAt": { $gt: startDate, $lte: endDate } }
        },
        { $group: { _id: "$status", "sum": { $count: {} } } }
    ]).toArray().then(async data => {
        data.forEach(data => {
            vodaIdeaDataCollector += data?._id + " = " + data?.sum + "<br>"
        })
    });

    // ------------------------- data collection ends -------------------------------
    let routemobileData = ""
    await ashieldmobtxnCollection.aggregate([
        {
            "$match":
                { "smshlc": 2027425935, "createdAt": { $gt: startDate, $lte: endDate } }
        },
        { $group: { _id: "$status", "sum": { $count: {} } } }
    ]).toArray().then(async data => {
        data.forEach(data => {
            routemobileData += data?._id + " = " + data?.sum + "<br>"
        })
    });

    console.log("Time taken to execute mongo queries:", (performance.now() - startTime).toFixed(2), "ms");
    // ----------------- Final formatting ---------------------
    const finalFormattedOUtput =
        `
    <h4> Gupshup airtel (1644033266) </h4>
    ${airtelDataCollector} <br>
    <h4> Gupshup vodafoneidea (463069304) </h4>
    ${vodaIdeaDataCollector} <br>
    <h4> Routemobile VodafoneIdea (2027425935) </h4>
    ${routemobileData === "" ? "--" : routemobileData} <br>
    `
    sendMail(finalFormattedOUtput).catch(err => {
        console.log("SendMail function failed", err);
    });

    await client.close();

    console.log("Program execution completed:", (performance.now() - startTime).toFixed(2), "ms");
}).catch(err => {
    console.log(err);
})