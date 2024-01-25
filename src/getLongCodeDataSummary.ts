import { Collection } from 'mongodb';

export const getLongCodeDataSummary = async (ashieldmobtxnCollection: Collection, smshlc: number, startDate: Date, endDate: Date): Promise<[string, number, number, number]> => {
    let dataCollector = ""
    let completed: number = 0
    let expired: number = 0
    let failed: number = 0

    await ashieldmobtxnCollection.aggregate([
        {
            "$match": { "smshlc": smshlc, "createdAt": { $gt: startDate, $lt: endDate } }
        },
        { $group: { _id: "$status", sum: { $count: {} } } }
    ]).toArray().then(async data => {
        data.forEach(data => {
            if (data?._id === "expired") {
                expired += parseInt(data?.sum);
                dataCollector += "Expired" + " = " + data?.sum + "<br>"
            }
            else if (data?._id === "completed") {
                completed += parseInt(data?.sum);
                dataCollector += "Completed" + " = " + data?.sum + "<br>"
            }
            else if (data?._id === "initiated") {
                failed += parseInt(data?.sum);
                dataCollector += "Initiated" + " = " + data?.sum + "<br>"
            }
        })
    });
    return [dataCollector, completed, expired, failed];
}