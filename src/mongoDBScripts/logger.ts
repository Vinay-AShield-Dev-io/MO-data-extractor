import winston from 'winston';
const { combine, timestamp, label, prettyPrint } = winston.format

// const myFormat = printf(({ level, message, label, timestamp }) => {
//     return `${timestamp} [${label}] ${level}: ${message}`;
// });

const logger = winston.createLogger({
    // level: 'debug',
    format: combine(
        label({ label: process.env.NODE_ENV === 'prod' ? "prod" : "Debug" }),
        timestamp(),
        prettyPrint()
    ),
    // defaultMeta: { service: 'incremental mongo dump service' },
    transports: [
        //
        // - Write all logs with importance level of `error` or less to `error.log`
        // - Write all logs with importance level of `info` or less to `combined.log`
        //
        new winston.transports.File({ filename: 'Logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'Logs/combined.log', level: 'info' }),
    ],
});

//
// If we're not in prod then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'prod') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple(),
    }));
}

export { logger }