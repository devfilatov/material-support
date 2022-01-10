const express = require("express");
const bcrypt = require("bcrypt");

const { User } = require("../models");
const { errorHandler } = require("./utils");
const { JwtService } = require("../services");

const authenticate = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+passwordHash");
  if (user && password && bcrypt.compareSync(password, user.passwordHash)) {
    const { _id: id, email, role } = user;
    const token = JwtService.sign({ id, email, role });
    res.status(200).send({ success: true, data: { token } });
  } else {
    throw new Error("Invalid email or password");
  }
};

const router = express.Router();
router.post("/", errorHandler(authenticate));

module.exports = router;
