const bcrypt = require("bcrypt");

const errorHandler = (func) => async (req, res, next) => {
  try {
    await func(req, res, next);
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, error: err.message });
  }
};

const getHash = (content) => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(content, salt);
};

module.exports = {
  errorHandler,
  getHash,
};
