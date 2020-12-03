const jwt = require("jsonwebtoken");

const createToken = async (user, secret, expiresIn) => {
  const { _id, email, username } = user;
  return jwt.sign({ _id, email, username }, secret, { expiresIn: expiresIn });
};

module.exports = createToken;
