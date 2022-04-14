import dotenv from "dotenv";
const dotenvResult = dotenv.config();
if (dotenvResult.error) {
  throw dotenvResult.error;
}

import cors from "cors";
import http from "http";
import debug from "debug";
import expressWinston from "express-winston";
import winston from "winston";
import express, { Application } from "express";

const app: Application = express();
const server: http.Server = http.createServer(app);
const port: number = parseInt(process.env.PORT as string, 10);

const debugLog: debug.IDebugger = debug("app");

app.use(cors());
app.use(express.json());

const loggerOptions: expressWinston.LoggerOptions = {
  transports: [new winston.transports.Console()],
  format: winston.format.combine(
    winston.format.json(),
    winston.format.prettyPrint(),
    winston.format.colorize({ all: true })
  ),
};

// if (!process.env.DEBUG) {
//   // loggerOptions.meta = false;
//   if (typeof global.it === "function") {
//     loggerOptions.level = "http";
//   }
// }

app.use(expressWinston.logger(loggerOptions));

if (!port) {
  process.exit(1);
}

export default server.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
