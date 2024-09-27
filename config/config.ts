interface IEnv {
  port: number;
  currEnv: string;
  mongoURL: string;
  mongoDB_DBName: string;
}

interface IEnvHashType {
  [key: string]: IEnv;
}

// ---------------------- azure email service configurations --------------------------
// ---------------------- Slack configuration ends --------------------------

const MONGO_URL =
  typeof process.env.MONGO_URL === "string"
    ? process.env.MONGO_URL
    : // : "mongodb+srv://dawati66:Awatidb123@cluster0.9s6w0li.mongodb.net/college?retryWrites=true&w=majority";
      "mongodb+srv://dawati66:Awatidb123@cluster0.9s6w0li.mongodb.net/AshieldClickless";

export const longCodesInfo = [
  { name: "Gupshup airtel", code: 1644033266 },
  { name: "Gupshup vodafoneidea", code: 463069304 },
  { name: "Routemobile VodafoneIdea", code: 2027425935 },
];

const supportedEnvs: IEnvHashType = {
  dev: {
    port: 3001,
    currEnv: "dev",
    mongoURL: MONGO_URL,
    mongoDB_DBName: "AshieldClickless",
  },
  staging: {
    port: 3002,
    currEnv: "staging",
    mongoURL: MONGO_URL,
    mongoDB_DBName: "AshieldClickless",
  },
  prod: {
    port: 3003,
    currEnv: "prod",
    mongoURL: MONGO_URL,
    mongoDB_DBName: "AshieldClickless",
  },
};
const setEnv =
  typeof process.env.NODE_ENV == "string"
    ? process.env.NODE_ENV.toLowerCase()
    : "";
const ENV_VALS =
  typeof supportedEnvs[setEnv] == "object"
    ? supportedEnvs[setEnv]
    : supportedEnvs["dev"];

export { ENV_VALS };
