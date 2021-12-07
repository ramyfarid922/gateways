const express = require("express");
const deviceController = require("./../controllers/deviceController");

const router = express.Router();

router
  .route("/")
  .get(deviceController.getAllDevices)
  .post(deviceController.createDevice);

router
  .route("/:id")
  .get(deviceController.getDevice)
  .patch(deviceController.updateDevice)
  .delete(deviceController.deleteDevice);

module.exports = router;
