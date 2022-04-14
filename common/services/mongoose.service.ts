import debug from "debug";
import mongoose from "mongoose";

const log: debug.IDebugger = debug("app::mogooses-service");

class MongooseService {
  private count = 0;
  private mongooseOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
  };

  constructor() {
    this.connectWithRetry();
  }

  getMongoose() {
    return mongoose;
  }

  connectWithRetry() {
    log("Attempting to connect to database");
    mongoose
      .connect(process.env.MONGODB_URL as string, this.mongooseOptions)
      .then(() => log("Database is connected!"))
      .catch((e) => {
        const retrySeconds = 5;
        log(
          `MongoDB connection unsuccessful(will retry #${++this
            .count} after ${retrySeconds} seconds): `,
          e
        );
        setTimeout(this.connectWithRetry, retrySeconds * 1000);
      });
  }
}

export default new MongooseService();
