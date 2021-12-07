const Device = require("./../models/deviceModel");
const APIFeatures = require("./../utils/apiFeatures");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

exports.getAllDevices = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Device.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const devices = await features.query;

  // SEND RESPONSE
  res.status(200).json({
    status: "success",
    results: devices.length,
    data: {
      devices,
    },
  });
});

exports.getDevice = catchAsync(async (req, res, next) => {
  const device = await Device.findById(req.params.id);

  if (!device) {
    return next(new AppError("No device found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      device,
    },
  });
});

exports.createDevice = catchAsync(async (req, res, next) => {
  const newDevice = await Device.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      device: newDevice,
    },
  });
});

exports.updateDevice = catchAsync(async (req, res, next) => {
  const device = await Device.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!device) {
    return next(new AppError("No device found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      device,
    },
  });
});

exports.deleteDevice = catchAsync(async (req, res, next) => {
  const device = await Device.findByIdAndDelete(req.params.id);

  if (!device) {
    return next(new AppError("No device found with that ID", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});
