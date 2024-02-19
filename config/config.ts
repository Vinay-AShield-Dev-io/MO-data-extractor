interface IEnv {
    port: number;
    currEnv: string;
    toEmailAdress: { address: string, displayName: string }[];
    slackReportBot: { SLACK_ALERT_URL: string, SLACK_HOURLY_REPORT_URL: string };
    clusterName: string;
    mongoURL: string;
    mongoDB_DBName: string;
}

interface IEnvHashType {
    [key: string]: IEnv
}

// ---------------------- azure emai service configurations --------------------------

// this is a staging email to test the application
const stagingToEmails = [
    {
        address: "vinay.kumara@ashield.co",
        displayName: "Vinay",
    },
]

const prodToEmails = [
    {
        address: "analytics@ashield.co",
        displayName: "AShield Analytics",
    },
]
// ---------------------- azure emai service configurations ends --------------------------


// ---------------------- Slack configurations --------------------------
const SLACK_ALERT_URL = process.env.SLACK_ALERT_URL ? process.env.SLACK_ALERT_URL : 'https://hooks.slack.com/services/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'; // bajajFinAlert
const SLACK_HOURLY_REPORT_URL = process.env.SLACK_HOURLY_REPORT_URL ? process.env.SLACK_HOURLY_REPORT_URL : 'https://hooks.slack.com/services/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'; // bajajHourlyReport
const SLACK_TEST_URL = 'https://hooks.slack.com/services/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'

const prodSlackReportBot = {
    SLACK_ALERT_URL,
    SLACK_HOURLY_REPORT_URL
}
const stagingSlackReportBot = {
    SLACK_ALERT_URL: SLACK_TEST_URL,
    SLACK_HOURLY_REPORT_URL: SLACK_TEST_URL
}
// ---------------------- Slack configuration ends --------------------------

const HOST_CLUSTER_NAME = typeof (process.env.HOST_CLUSTER_NAME) == "string" ? process.env.HOST_CLUSTER_NAME : "Bajaj"
const MONGO_URL = typeof (process.env.MONGO_URL) === "string" ? process.env.MONGO_URL : "mongodb://ashieldUser:ASh1e19U_21@localhost:27017"



export const longCodesInfo = [{ "name": "Gupshup airtel", "code": 1644033266 },
{ "name": "Gupshup vodafoneidea", "code": 463069304 },
{ "name": "Routemobile VodafoneIdea", "code": 2027425935 },
]


const supportedEnvs: IEnvHashType = {
    "dev": {
        port: 3001,
        currEnv: "dev",
        toEmailAdress: stagingToEmails,
        slackReportBot: stagingSlackReportBot,
        clusterName: "Test-dev",
        mongoURL: MONGO_URL,
        mongoDB_DBName: 'AShieldClickless'

    },
    "staging": {
        port: 3002,
        currEnv: "staging",
        toEmailAdress: stagingToEmails,
        slackReportBot: stagingSlackReportBot,
        clusterName: "Test-staging",
        mongoURL: MONGO_URL,
        mongoDB_DBName: 'AShieldClickless'
    },
    "prod": {
        port: 3003,
        currEnv: "prod",
        toEmailAdress: prodToEmails,
        slackReportBot: prodSlackReportBot,
        clusterName: HOST_CLUSTER_NAME,
        mongoURL: MONGO_URL,
        mongoDB_DBName: 'AShieldClickless'
    }
}
const setEnv = typeof (process.env.NODE_ENV) == "string" ? process.env.NODE_ENV.toLowerCase() : "";
const ENV_VALS = typeof (supportedEnvs[setEnv]) == "object" ? supportedEnvs[setEnv] : supportedEnvs['dev'];
const AZURE_CONNECTION_STRING = process.env.AZURE_CONNECTION_STRING ? process.env.AZURE_CONNECTION_STRING : "";
const SENDER_ADDRESS = process.env.SENDER_ADDRESS ? process.env.SENDER_ADDRESS : "donotreply@bb59c0cb-0df5-47e4-b90f-00b671521401.azurecomm.net";

export { AZURE_CONNECTION_STRING, ENV_VALS, SENDER_ADDRESS };

