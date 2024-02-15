
import { performance } from 'perf_hooks';
import { exit } from 'process';
import { sendMail } from './azureEmailService';
import { getDB } from './connectDB';
import { getLongCodeDataSummary } from './getLongCodeDataSummary';


if (process.argv.length < 4) {
    console.log("Usage: ts-node src/app.ts ISODatetime1 ISODatetime2");
    exit(0);
}

const startDate: Date = new Date(process.argv[2]);
const endDate: Date = new Date(process.argv[3]);
const startTime = performance.now();
const longCodesInfo = [{ "name": "Gupshup airtel", "code": 1644033266 },
{ "name": "Gupshup vodafoneidea", "code": 463069304 },
{ "name": "Routemobile VodafoneIdea", "code": 2027425935 },
]

getDB().then(async (resp) => {
    if (resp === null) return;
    const [db, client] = resp;
    const ashieldmobtxnCollection = db.collection("ashieldmobtxn");
    console.log("Time taken to connect to the MongoDB:", (performance.now() - startTime).toFixed(2), "ms");

    let finalFormattedOUtput = ""
    for (const item of longCodesInfo) {
        finalFormattedOUtput += `<h4> ${item.name} (${item.code}) </h4>`;
        const [data, completed = 0, expired = 0, failed = 0] = await getLongCodeDataSummary(ashieldmobtxnCollection, item.code, startDate, endDate);
        finalFormattedOUtput += data;
        const totalRequests: number = completed + failed + expired;
        finalFormattedOUtput += "Total requests = " + totalRequests + "<br>";
        const PercentageOfExpiredRate = expired === 0 ? 0 : ((expired / totalRequests) * 100).toFixed(2)
        const PercentageOfFailedRate = failed === 0 ? 0 : ((failed / totalRequests) * 100).toFixed(2)
        finalFormattedOUtput += `Expired rate in % = ${PercentageOfExpiredRate} <br>`;
        finalFormattedOUtput += `Failed rate in % = ${PercentageOfFailedRate}<br>`;
    };
    await client.close();
    console.log("Time taken to execute mongo queries:", (performance.now() - startTime).toFixed(2), "ms");
    await sendMail(finalFormattedOUtput);
    console.log("Program execution completed:", (performance.now() - startTime).toFixed(2), "ms");
}).catch(err => {
    console.log(err);
})
