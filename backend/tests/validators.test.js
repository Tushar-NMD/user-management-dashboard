
const test = require("node:test");
const assert = require("node:assert/strict");

const {
  validateCreateUser,
  validateUpdateUser,
} = require("../utils/validators");

test("valid user data should pass validation", () => {
  const result = validateCreateUser({
    name: "Rahul Sharma",
    email: "rahul@example.com",
    phone: "9876543210",
    role: "User",
    status: "Active",
  });

  assert.equal(result.isValid, true);
  assert.deepEqual(result.errors, {});
});

test("missing name should fail validation", () => {
  const result = validateCreateUser({
    name: "",
    email: "rahul@example.com",
  });

  assert.equal(result.isValid, false);
  assert.ok(result.errors.name);
});

test("invalid email should fail validation", () => {
  const result = validateCreateUser({
    name: "Rahul Sharma",
    email: "invalid-email",
  });

  assert.equal(result.isValid, false);
  assert.ok(result.errors.email);
});

test("invalid role should fail validation", () => {
  const result = validateCreateUser({
    name: "Rahul Sharma",
    email: "rahul@example.com",
    role: "SuperAdmin",
  });

  assert.equal(result.isValid, false);
  assert.ok(result.errors.role);
});

test("empty update should fail validation", () => {
  const result = validateUpdateUser({});

  assert.equal(result.isValid, false);
  assert.ok(result.errors.body);
});

test("valid partial update should pass validation", () => {
  const result = validateUpdateUser({
    status: "Inactive",
  });

  assert.equal(result.isValid, true);
});
