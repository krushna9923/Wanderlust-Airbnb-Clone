if (process.env.NODE_ENV != "production") {
  require('dotenv').config();
}

const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = process.env.ATLASDB_URL;

main()
   .then(() => {
    console.log("connected to DB");
    return initDB();
   })
   .catch((err) => {
    console.log(err);
   });

async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({
        ...obj,
        owner: "69d7cf79ed52e0b0565e57eb",
    }));
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
    process.exit(0);
}