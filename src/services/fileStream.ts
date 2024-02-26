import * as fs from 'fs';
import { logger } from './logger';

export const writeDataIntofile = (filePath: string, callback: (arg0: null, arg1: fs.WriteStream) => fs.WriteStream) => {

    // Create a writable stream to a file
    let writeStream = fs.createWriteStream(filePath);

    writeStream = callback(null, writeStream);
    // Close the write stream
    writeStream.end();

    // Ensure the data is flushed to the file and then call fsync
    writeStream.on('finish', () => {
        logger.info("Write operation finished");
    });

    writeStream.on('error', (err) => {
        logger.error(`Error writing to file: ${err}`);
    });

}
