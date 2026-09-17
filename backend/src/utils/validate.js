const { ValidationError } = require('./errors');

function formatZodError(error) {
  return error.issues.map((issue) => ({
    field: issue.path.join('.') || 'root',
    message: issue.message,
  }));
}

function parseOrThrow(schema, payload) {
  const result = schema.safeParse(payload);
  if (!result.success) {
    throw new ValidationError('Validation failed', formatZodError(result.error));
  }
  return result.data;
}

module.exports = { formatZodError, parseOrThrow };
