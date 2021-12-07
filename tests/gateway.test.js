const request = require("supertest");
const app = require("../app");
const Gateway = require("../models/gatewayModel");

const {
  setupDatabase,
  closeDBConnection,
  gateway1,
  gateway2,
  device1,
  device2,
  device3,
} = require("./fixtures/db");

beforeAll(setupDatabase);

test("Should fetch all stored gateways", async () => {
  // Fetches all stored gateways
  const response = await request(app)
    .get("/api/v1/gateways")
    .send()
    .expect(200);
});

test("Should fetch a single gateway", async () => {
  // Fetches gateway1 created in the db fixtures
  const response = await request(app)
    .get("/api/v1/gateways/" + gateway1._id)
    .send()
    .expect(200);

  // Asserts the name of the added gateway
  const gateway = response.body.data.gateway;
  expect(gateway.name).toBe(gateway1.name);
});

test("Should add a new gateway", async () => {
  // Adds new gateway in the db using gateway2 object from fixtures
  const response = await request(app)
    .post("/api/v1/gateways")
    .send(gateway2)
    .expect(201);

  // Asserts the name of the added gateway
  const gateway = response.body.data.gateway;
  expect(gateway.name).toBe(gateway2.name);
});

test("Should see devices attached to a gateway", async () => {
  // Fetches gateway1 created in the db fixtures
  const response = await request(app)
    .get("/api/v1/gateways/" + gateway1._id)
    .send()
    .expect(200);

  // Asserts the length of the devices array of the gateway
  const gateway = response.body.data.gateway;
  expect(gateway.devices.length).toBe(2);

  const d1 = gateway.devices[0];
  expect(d1.name).toBe(device1.name);

  const d2 = gateway.devices[1];
  expect(d2.name).toBe(device2.name);
});

test("Should attach a device to a gateway", async () => {
  // Attaches device3 to gateway2
  const response = await request(app)
    .post("/api/v1/gateways/" + gateway2._id + "/devices")
    .send(device3)
    .expect(201);

  // Asserts the length of the devices array of gateway2
  const gateway = response.body.data.gateway;
  expect(gateway.devices.length).toBe(1);
  expect(gateway.devices[0].vendor).toBe("Vendor 3");
});

test("Should remove a device from a gateway", async () => {
  // Removes device2 from gateway1
  const response = await request(app)
    .delete("/api/v1/gateways/" + gateway1._id + "/devices/" + device2._id)
    .send()
    .expect(204);

  const gateway = await Gateway.findById(gateway1._id);
  expect(gateway.devices.length).toBe(1);
  // Assert that only device1 remains attached to gateway1
  expect(gateway.devices[0].vendor).toBe("Vendor 1");
});

afterAll(closeDBConnection);
