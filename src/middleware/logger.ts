import koaPino from "koa-pino-logger";
const devOpts = {
  prettyPrint: true,
};

const env = process.env.NODE_ENV;

const logger = env === "production" ? koaPino() : koaPino(devOpts);

export default logger;