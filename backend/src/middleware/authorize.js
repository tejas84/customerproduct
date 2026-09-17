const { ForbiddenError } = require('../utils/errors');

function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user) return next(new ForbiddenError());
    if (!roles.includes(req.user.role)) {
      return next(new ForbiddenError('Insufficient permissions'));
    }
    next();
  };
}

module.exports = { authorize };
