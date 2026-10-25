
const test = require("node:test");
const assert = require("node:assert/strict");
const mongoose = require("mongoose");
const request = require("supertest");
const { MongoMemoryServer } = require("mongodb-memory-server");

const app = require("../app");
const User = require("../models/user");

let mongoServer;

test.before(async () => {
  mongoServer = await MongoMemoryServer.create();

  await mongoose.connect(mongoServer.getUri());
});

test.after(async () => {
  await mongoose.disconnect();

  if (mongoServer) {
    await mongoServer.stop();
  }
});

test.beforeEach(async () => {
  await User.deleteMany({});
});

test("GET /api/users returns an empty list", async () => {
  const response = await request(app).get("/api/users");

  assert.equal(response.statusCode, 200);
  assert.equal(response.body.success, true);
  assert.equal(response.body.count, 0);
  assert.deepEqual(response.body.data, []);
});

test("POST /api/users creates a user", async () => {
  const response = await request(app)
    .post("/api/users")
    .send({
      name: "Rahul Sharma",
      email: "rahul@example.com",
      phone: "9876543210",
      role: "User",
      status: "Active",
    });

  assert.equal(response.statusCode, 201);
  assert.equal(response.body.success, true);
  assert.equal(response.body.data.email, "rahul@example.com");
});

test("POST /api/users rejects invalid email", async () => {
  const response = await request(app)
    .post("/api/users")
    .send({
      name: "Rahul Sharma",
      email: "invalid-email",
    });

  assert.equal(response.statusCode, 400);
  assert.equal(response.body.success, false);
});

test("PUT /api/users/:id updates a user", async () => {
  const user = await User.create({
    name: "Rahul Sharma",
    email: "rahul@example.com",
  });

  const response = await request(app)
    .put(`/api/users/${user._id}`)
    .send({ status: "Inactive" });

  assert.equal(response.statusCode, 200);
  assert.equal(response.body.data.status, "Inactive");
});

test("DELETE /api/users/:id deletes a user", async () => {
  const user = await User.create({
    name: "Rahul Sharma",
    email: "rahul@example.com",
  });

  const response = await request(app).delete(
    `/api/users/${user._id}`
  );

  assert.equal(response.statusCode, 200);
  assert.equal(await User.countDocuments(), 0);
});

test("GET /api/users/:id returns 400 for an invalid ID", async () => {
  const response = await request(app).get("/api/users/invalid-id");

  assert.equal(response.statusCode, 400);
  assert.equal(response.body.success, false);
});
