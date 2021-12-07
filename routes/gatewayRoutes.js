const express = require("express");
const gatewayController = require("./../controllers/gatewayController");

const router = express.Router();

router
  .route("/")
  .get(gatewayController.getAllGateways)
  .post(gatewayController.createGateway);

router
  .route("/:id")
  .get(gatewayController.getGateway)
  .patch(gatewayController.updateGateway)
  .delete(gatewayController.deleteGateway);

router.route("/:id/devices/").post(gatewayController.attachDeviceToGateway);
router
  .route("/:id/devices/:devId")
  .delete(gatewayController.removeDeviceFromGateway);

module.exports = router;
