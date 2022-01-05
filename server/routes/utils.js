const errorHandler = (func) => async (req, res, next) => {
  try {
    await func(req, res, next);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ success: false, error: err.message });
  }
};

module.exports = {
  errorHandler,
};
