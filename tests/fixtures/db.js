const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Gateway = require("./../../models/gatewayModel");
const Device = require("./../../models/deviceModel");

dotenv.config({ path: "./test.env" });

const DB_LOCAL = process.env.DATABASE_LOCAL;

mongoose
  .connect(DB_LOCAL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("Test DB connection successful!");
  });

const gatewayID1 = new mongoose.Types.ObjectId();
const gateway1 = {
  _id: gatewayID1,
  serial: "ser89045ty",
  name: "My Gateway 1",
  ipv4: "192.168.93.3",
};

const gatewayID2 = new mongoose.Types.ObjectId();
const gateway2 = {
  _id: gatewayID2,
  serial: "46789fh4087lo98d7",
  name: "Gateway 4",
  ipv4: "192.168.93.4",
};

const deviceID1 = new mongoose.Types.ObjectId();
const device1 = {
  _id: deviceID1,
  uid: "67543",
  vendor: "Vendor 1",
  status: "ONLINE",
};

const deviceID2 = new mongoose.Types.ObjectId();
const device2 = {
  _id: deviceID2,
  uid: "67899",
  vendor: "Vendor 2",
  status: "OFFLINE",
};

const deviceID3 = new mongoose.Types.ObjectId();
const device3 = {
  _id: deviceID3,
  uid: "67839",
  vendor: "Vendor 3",
  status: "OFFLINE",
};

const setupDatabase = async () => {
  await Gateway.deleteMany();
  await Device.deleteMany();
  const g1 = new Gateway(gateway1);
  const d1 = new Device(device1);
  const d2 = new Device(device2);
  await d1.save();
  await d2.save();
  g1.devices.push(d1);
  g1.devices.push(d2);
  await g1.save();
};

const closeDBConnection = async () => {
  mongoose.connection.close();
};

module.exports = {
  setupDatabase,
  closeDBConnection,
  gateway1,
  gateway2,
  device1,
  device2,
  device3,
};
