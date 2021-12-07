const mongoose = require("mongoose");
// const validator = require('validator');

const deviceSchema = new mongoose.Schema(
  {
    uid: {
      type: Number,
      maxLength: 16,
      required: [true, "A device must have a universal ID"],
      unique: true,
      sparse: true,
      index: true,
    },
    vendor: {
      type: String,
      required: [true, "A device must have a vendor"],
    },
    created_at: Date,
    status: {
      type: String,
      required: [true, "A device must have a status"],
      enum: {
        values: ["OFFLINE", "ONLINE"],
        message: "Status is either: OFFLINE, ONLINE",
      },
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

deviceSchema.pre("save", function (next) {
  if (!this.created_at) {
    let currentDate = new Date();
    this.created_at = currentDate;
  }
  next();
});

const Device = mongoose.model("Device", deviceSchema);

module.exports = Device;
