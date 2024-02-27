import winston from "winston";
import { ENV_VALS } from "../../config/config";
const { combine, timestamp, printf, label } = winston.format;

const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

const logger = winston.createLogger({
  level: ENV_VALS.currEnv === "prod" ? "info" : "debug",
  format: combine(
    label({ label: ENV_VALS.currEnv === "prod" ? "prod" : "debug" }),
    timestamp(),
    myFormat
  ),
  defaultMeta: { service: "user-service" },
  transports: [
    //
    // - Write all logs with importance level of `error` or less to `error.log`
    // - Write all logs with importance level of `info` or less to `combined.log`
    //
    new winston.transports.File({
      filename: "logs/applogs.log",
      level: "info",
    }),
  ],
});

//
// If we're not in prod then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== "prod") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

export { logger };
