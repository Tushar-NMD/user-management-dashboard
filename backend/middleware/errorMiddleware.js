
const errorMiddleware = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";
  let errors;

  // Invalid MongoDB ObjectId or malformed database value
  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid resource ID or value";
  }

  // Mongoose schema validation errors
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = "Validation failed";

    errors = Object.values(err.errors).map((item) => ({
      field: item.path,
      message: item.message,
    }));
  }

  // Duplicate MongoDB unique index (for example, email)
  if (err.code === 11000) {
    statusCode = 409;
    message = "A user with this email already exists";
  }

  // Invalid JSON request body
  if (
    err instanceof SyntaxError &&
    err.status === 400 &&
    "body" in err
  ) {
    statusCode = 400;
    message = "Invalid JSON request body";
  }

  const response = {
    success: false,
    message:
      statusCode === 500 && process.env.NODE_ENV === "production"
        ? "Internal Server Error"
        : message,
  };

  if (errors) {
    response.errors = errors;
  }

  if (process.env.NODE_ENV !== "production" && statusCode === 500) {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

module.exports = errorMiddleware;
