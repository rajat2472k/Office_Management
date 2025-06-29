const mongoose = require("mongoose");

const URI = process.env.MONGODB_URI;


const connectDB = async () => {
  try {
    await mongoose.connect(URI);
    console.log("connection successsful to DB");
  } catch (error) {
    console.error("database connection failed ");
    // process.exit(0)
  }
};

module.exports = connectDB;
