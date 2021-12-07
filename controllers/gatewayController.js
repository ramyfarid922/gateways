const Gateway = require("./../models/gatewayModel");
const Device = require("./../models/deviceModel");
const APIFeatures = require("./../utils/apiFeatures");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

exports.getAllGateways = catchAsync(async (req, res, next) => {
  // I have added a feature for limiting, paginating, sorting, and filtering fetching requests
  const features = new APIFeatures(Gateway.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const gateways = await features.query;

  res.status(200).json({
    status: "success",
    results: gateways.length,
    data: {
      gateways,
    },
  });
});

exports.getGateway = catchAsync(async (req, res, next) => {
  const gateway = await Gateway.findById(req.params.id);

  if (!gateway) {
    return next(new AppError("No gateway found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      gateway,
    },
  });
});

exports.attachDeviceToGateway = catchAsync(async (req, res, next) => {
  const gateway = await Gateway.findById(req.params.id);

  if (!gateway) {
    return next(new AppError("No gateway found with that ID", 404));
  }

  const device = new Device(req.body);

  // I wanted to save the device first in a separate collection because I will build a REST endpoint for ////// devices only regardless of their parent gateways
  await device.save();

  // Still saving the devices in the gateway as embedded documents
  // This will introduce some redunduncy in the db
  // but since there's a bound on the number of devices per gateway, there won't be a problem with embedded /// docs
  if (gateway.devices.length >= 10) {
    return next(new AppError("Gateway can't have more than 10 devices", 400));
  }

  gateway.devices.push(device);

  await gateway.save();

  res.status(201).json({
    status: "success",
    data: {
      gateway,
    },
  });
});

exports.removeDeviceFromGateway = catchAsync(async (req, res, next) => {
  const gateway = await Gateway.findById(req.params.id);

  if (!gateway) {
    return next(new AppError("No gateway found with that ID", 404));
  }

  // Keep all the devices of  the gateway except for the one that was supposed to be removed
  // Notice that there will still be a backup version for the removed device in the db devices collection
  // If the device is required to be purged completely then it will have to be deleted from the devices /////// endpoint using its _id
  gateway.devices = gateway.devices.filter((device) => {
    return device._id.toString() !== req.params.devId;
  });

  await gateway.save();

  res.status(204).json({
    status: "success",
    data: {
      gateway,
    },
  });
});

exports.createGateway = catchAsync(async (req, res, next) => {
  const newGateway = new Gateway(req.body);
  await newGateway.save();

  res.status(201).json({
    status: "success",
    data: {
      gateway: newGateway,
    },
  });
});

exports.updateGateway = catchAsync(async (req, res, next) => {
  const gateway = await Gateway.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!gateway) {
    return next(new AppError("No gateway found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      gateway,
    },
  });
});

exports.deleteGateway = catchAsync(async (req, res, next) => {
  const gateway = await Gateway.findByIdAndDelete(req.params.id);

  if (!gateway) {
    return next(new AppError("No gateway found with that ID", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});
