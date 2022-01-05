const express = require("express");
const bcrypt = require("bcrypt");

const { User } = require("../models");
const { errorHandler } = require("./utils");
const { JwtService } = require("../services");

const authenticate = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && bcrypt.compareSync(password, user.passwordHash)) {
    const payload = { id: user._id, email: user.email, roles: [user.role] };
    const token = JwtService.sign(payload);
    return res.status(200).send({ success: true, data: { token } });
  } else {
    throw new Error("Invalid username or password");
  }
};

const router = express.Router();
router.post("/", errorHandler(authenticate));

module.exports = router;
