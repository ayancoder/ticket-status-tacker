const mongoose = require("mongoose");
const config = require("config");
const dbURI = config.get("mongoURI");

const connectDB = async () => {
  try {
    await mongoose.connect(dbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    console.log("mongo db connected");
  } catch (err) {
    console.error(err.mssage);
    // exit process with failure.
    process.exit(1);
  }
};
module.exports = connectDB;
