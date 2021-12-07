const mongoose = require("mongoose");
const validator = require("validator");
const deviceSchema = require("./deviceModel").schema;

const gatewaySchema = new mongoose.Schema(
  {
    serial: {
      type: String,
      required: [true, "A gateway must have a serial number"],
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, "A gateway must have a human-readable name"],
      trim: true,
    },
    ipv4: {
      type: String,
      required: [true, "A gateway must have an IPv4 address"],
      trim: true,
      validate: {
        validator: function (ipaddress) {
          if (
            /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
              ipaddress
            )
          ) {
            return true;
          }
          return false;
        },
        message: "Invalid IPv4 address",
      },
    },
    devices: [{ type: deviceSchema }],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Gateway = mongoose.model("Gateway", gatewaySchema);

module.exports = Gateway;
