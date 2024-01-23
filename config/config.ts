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


// azure emai service configurations
const stagingToEmails = [
    {
        address: "vinay.kumara@ashield.co",
        displayName: "Vinay",
    },
]

const prodToEmails = [
    {
        address: "vinay.kumara@ashield.co",
        displayName: "Vinay",
    },
    {
        address: "subhodip.datta@ashield.co",
        displayName: "Subhodip",
    },

    {
        address: "siddarth.bellur@ashield.co",
        displayName: "Siddarth",
    },

    {
        address: "prashanta.n@ashield.co",
        displayName: "Prashant",
    },
    {
        address: "yashraaj@ashield.co",
        displayName: "Yashraaj",
    },
    {
        address: "a.admin@ashield.co",
        displayName: "AShield admin"
    },
    {
        address: "ajay@ashield.co",
        displayName: "Ajay",
    },
    {
        address: "nithya.m@ashield.co",
        displayName: "Nithya",
    }
]

// Slack configurations
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


const HOST_CLUSTER_NAME = typeof (process.env.HOST_CLUSTER_NAME) == "string" ? process.env.HOST_CLUSTER_NAME : "Bajaj"
const MONGO_URL = typeof (process.env.MONGO_URL) === "string" ? process.env.MONGO_URL : "mongodb://ashieldUser:ASh1e19U_21@localhost:27017"

const supportedEnvs: IEnvHashType = {
    "dev": {
        port: 3001,
        currEnv: "dev",
        toEmailAdress: stagingToEmails,
        slackReportBot: stagingSlackReportBot,
        clusterName: "Test-dev",
        mongoURL: MONGO_URL,
        mongoDB_DBName: 'clickless-stats-dev'

    },
    "staging": {
        port: 3002,
        currEnv: "staging",
        toEmailAdress: stagingToEmails,
        slackReportBot: stagingSlackReportBot,
        clusterName: "Test-staging",
        mongoURL: MONGO_URL,
        mongoDB_DBName:'clickless-stats-stag'
    },
    "prod": {
        port: 3003,
        currEnv: "prod",
        toEmailAdress: prodToEmails,
        slackReportBot: prodSlackReportBot,
        clusterName: HOST_CLUSTER_NAME,
        mongoURL: MONGO_URL,
        mongoDB_DBName:'clickless-stats'
    }
}
const ASHIELD_ENCRYPT_DECRYPT_URL = process.env.ASHIELD_ENCRYPT_DECRYPT_URL ? process.env.ASHIELD_ENCRYPT_DECRYPT_URL : "http://localhost:8081"
const LOG_PATH = process.env.LOG_PATH ? process.env.LOG_PATH : "/datassd/prodlogs/auth/cdrs/"
const COMPUTE_MACHINES_IP_LIST = process.env.COMPUTE_MACHINES_IP_LIST ? process.env.COMPUTE_MACHINES_IP_LIST : "[\"192.168.2.14\", \"192.168.2.15\", \"192.168.2.16\"]"

const setEnv = typeof (process.env.NODE_ENV) == "string" ? process.env.NODE_ENV.toLowerCase() : "";
const ENV_VALS = typeof (supportedEnvs[setEnv]) == "object" ? supportedEnvs[setEnv] : supportedEnvs['dev'];
export { ASHIELD_ENCRYPT_DECRYPT_URL, COMPUTE_MACHINES_IP_LIST, ENV_VALS, LOG_PATH };
