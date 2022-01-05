const jwt = require("jsonwebtoken");

const config = require("../config.json");

const { secret, options } = config.jwt;

class JwtService {
  sign(payload) {
    return jwt.sign(payload, secret, options);
  }

  verify(token) {
    try {
      return jwt.verify(token, secret, options);
    } catch (err) {
      return false;
    }
  }

  decode(token) {
    return jwt.decode(token, { complete: true });
  }
}

module.exports = new JwtService();
