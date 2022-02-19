const mongoose = require("mongoose");
const logger = require('./winston');
const {MONGO_URI} = require('./config')

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    logger.info("mongo db connected");
  } catch (err) {
    console.error(err);
    // exit process with failure.
    process.exit(1);
  }
};
module.exports = connectDB;
