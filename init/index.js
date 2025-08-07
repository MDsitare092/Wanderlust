const mongoose = require("mongoose");
const data = require("./data.js"); 
const Listing = require("../models/listing.js");

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

const initDB = async () => {
  await Listing.deleteMany({});
  //user ka khud ka id 'listing' hoga
const modifiedData = data.map((obj) => ({
  ...obj,
  owner: '688bc6642003940a362ac3a3',
}));
await Listing.insertMany(modifiedData);
  
// await Listing.insertMany(data);
  console.log("data was initDB success");
};

initDB();
