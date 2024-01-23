
import { Collection } from 'mongodb';
import { performance } from 'perf_hooks';
import { exit } from 'process';
import { sendMail } from './azureEmailService';
import { getDB } from './connectDB';


if (process.argv.length < 4) {
    console.log("Usage: ts-node moFailsData.ts ISODatetime1 ISODatetime2");
    exit(0);
}

const startDate: Date = new Date(process.argv[2]);
const endDate: Date = new Date(process.argv[3]);
const startTime = performance.now();
const longCodesInfo = [{ "name": "Gupshup airtel", "code": 1644033266 },
{ "name": "Gupshup vodafoneidea", "code": 463069304 },
{ "name": "Routemobile VodafoneIdea", "code": 2027425935 },
]

const getLongCodeDataSummary = async (ashieldmobtxnCollection: Collection, smshlc: number) => {
    let dataCollector = ""
    await ashieldmobtxnCollection.aggregate([
        {
            "$match": { "smshlc": smshlc, "createdAt": { $gt: startDate, $lt: endDate } }
        },
        { $group: { _id: "$status", sum: { $count: {} } } }
    ]).toArray().then(async data => {
        data.forEach(data => {
            dataCollector += data?._id + " = " + data?.sum + "<br>"
        })
    });
    return dataCollector;
}


getDB().then(async (resp) => {
    if (resp === null) return;
    const [db, client] = resp;
    const ashieldmobtxnCollection = db.collection("ashieldmobtxn");
    console.log("Time taken to connect to the MongoDB:", (performance.now() - startTime).toFixed(2), "ms");

    let finalFormattedOUtput = ""
    for (const item of longCodesInfo) {
        finalFormattedOUtput += `<h4> ${item.name} (${item.code}) </h4>`;
        finalFormattedOUtput += await getLongCodeDataSummary(ashieldmobtxnCollection, item.code) + "<br>";
    };
    await client.close();
    console.log("Time taken to execute mongo queries:", (performance.now() - startTime).toFixed(2), "ms");
    await sendMail(finalFormattedOUtput)
    console.log("Program execution completed:", (performance.now() - startTime).toFixed(2), "ms");
}).catch(err => {
    console.log(err);
})