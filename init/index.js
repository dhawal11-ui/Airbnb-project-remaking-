const mongoose = require("mongoose");
const initData = require("./data.js"); // object
const Listing = require("../models/listing.js");

const MONGO_URl = "mongodb://127.0.0.1:27017/wanderlust";
async function main() {
  // making main function
  await mongoose.connect(MONGO_URl);
}
main();

const initDB = async () => {
  // making initDb function
  await Listing.deleteMany({});
  await Listing.insertMany(initData.data); // object ke ander ki key ko access karna hai .
  console.log("DB was initilized");
};

//calling init Db
initDB();
