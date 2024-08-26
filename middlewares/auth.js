const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('../utils/config');
const UnauthorizedError = require('../errors/unauthorized-error');

const handleAuthError = () => {
  throw new UnauthorizedError('Permission denied');
};

const extractBearerToken = (header) => header.replace('Bearer ', '')

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return handleAuthError();
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return handleAuthError(res);
  }

  req.user = payload;
  return next();
};