const { createLogger, transports, format } = require("winston");
const fs = require("fs");
const path = require("path");
const DailyRotateFile = require("winston-daily-rotate-file");
const { environment } = require("../config");
const EventEmitter = require("events");

EventEmitter.defaultMaxListeners = 100;

let dir = path.resolve("logs");

// create directory if it is not present
if (!fs.existsSync(dir)) {
  // Create the directory if it does not exist
  fs.mkdirSync(dir);
}

const logLevel = environment === "development" ? "debug" : "warn";

const dailyRotateFile = new DailyRotateFile({
  level: logLevel,
  filename: dir + "/%DATE%.log",
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  handleExceptions: true,
  maxSize: "20m",
  maxFiles: "14d",
  format: format.combine(
    format.errors({ stack: true }),
    format.timestamp(),
    format.json()
  ),
});

const Logger = createLogger({
  transports: [
    new transports.Console({
      level: logLevel,
      format: format.combine(
        format.errors({ stack: true }),
        format.prettyPrint()
      ),
    }),
    dailyRotateFile,
  ],
  exceptionHandlers: [dailyRotateFile],
  exitOnError: false, // do not exit on handled exceptions
});

module.exports = Logger;
