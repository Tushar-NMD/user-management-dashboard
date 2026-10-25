
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const VALID_ROLES = ["Admin", "User"];
const VALID_STATUSES = ["Active", "Inactive"];

const validateCreateUser = (data) => {
  const errors = {};

  if (typeof data.name !== "string" || !data.name.trim()) {
    errors.name = "Name is required";
  } else if (data.name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters";
  } else if (data.name.trim().length > 50) {
    errors.name = "Name cannot exceed 50 characters";
  }

  if (typeof data.email !== "string" || !data.email.trim()) {
    errors.email = "Email is required";
  } else if (!EMAIL_REGEX.test(data.email.trim())) {
    errors.email = "Please provide a valid email address";
  }

  if (data.phone !== undefined && typeof data.phone !== "string") {
    errors.phone = "Phone must be a string";
  } else if (typeof data.phone === "string" && data.phone.length > 20) {
    errors.phone = "Phone cannot exceed 20 characters";
  }

  if (data.role !== undefined && !VALID_ROLES.includes(data.role)) {
    errors.role = "Role must be Admin or User";
  }

  if (
    data.status !== undefined &&
    !VALID_STATUSES.includes(data.status)
  ) {
    errors.status = "Status must be Active or Inactive";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

const validateUpdateUser = (data) => {
  const allowedFields = ["name", "email", "phone", "role", "status"];
  const errors = {};

  const suppliedFields = Object.keys(data);
  const hasAllowedField = suppliedFields.some((field) =>
    allowedFields.includes(field)
  );

  if (!hasAllowedField) {
    errors.body = "Provide at least one valid field to update";
  }

  for (const field of suppliedFields) {
    if (!allowedFields.includes(field)) {
      errors[field] = `Field '${field}' cannot be updated`;
    }
  }

  const result = validateCreateUser({
    name: data.name === undefined ? "Valid Name" : data.name,
    email: data.email === undefined ? "valid@example.com" : data.email,
    phone: data.phone,
    role: data.role,
    status: data.status,
  });

  Object.assign(errors, result.errors);

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

module.exports = {
  validateCreateUser,
  validateUpdateUser,
};
