const env = require('../config/env');
const { AppError, ValidationError } = require('../utils/errors');

function notFound(req, res, next) {
  next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404));
}

function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);

  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';
  let errors = err.errors || [];

  if (err.name === 'SequelizeUniqueConstraintError') {
    statusCode = 409;
    message = 'A record with this value already exists';
    errors = err.errors?.map((e) => ({ field: e.path, message: e.message })) || [];
  }

  if (err.name === 'SequelizeForeignKeyConstraintError') {
    statusCode = 400;
    message = 'Invalid related record';
  }

  if (err.name === 'SequelizeValidationError') {
    statusCode = 400;
    message = 'Validation failed';
    errors = err.errors?.map((e) => ({ field: e.path, message: e.message })) || [];
  }

  if (!(err instanceof AppError) && statusCode === 500) {
    message = env.env === 'production' ? 'Internal server error' : err.message;
  }

  const body = {
    success: false,
    message,
    errors,
  };

  if (env.env !== 'production') {
    body.debug = err.stack;
  }

  res.status(statusCode).json(body);
}

module.exports = { notFound, errorHandler, ValidationError };
