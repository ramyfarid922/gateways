const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Gateway = require("./../../models/gatewayModel");

dotenv.config({ path: "./config.env" });

const DB_LOCAL = process.env.DATABASE_LOCAL;

mongoose
  .connect(DB_LOCAL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("DB connection successful!");
  });

// READ JSON FILE
const gateways = JSON.parse(
  fs.readFileSync(`${__dirname}/gateways.json`, "utf-8")
);

// IMPORT DATA INTO DB
const importData = async () => {
  try {
    await Gateway.create(gateways);
    console.log("Data successfully loaded!");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// DELETE ALL DATA FROM DB
const deleteData = async () => {
  try {
    await Gateway.deleteMany();
    console.log("Data successfully deleted!");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
}
