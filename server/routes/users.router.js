const express = require("express");
const bcrypt = require("bcrypt");

const { User, MaterialSupport } = require("../models");
const { errorHandler, getHash } = require("./utils");
const { JwtService } = require("../services");
const { JwtMiddleware } = require("../middleware");

const getSelf = async (req, res) => {
  const token = req.header("X-Auth-Token");
  const { payload } = JwtService.decode(token);
  const user = await User.findById(payload.id);
  res.status(200).json({ success: true, data: { user } });
};

const getAll = async (req, res) => {
  const users = await User.find({});
  res.status(200).json({ success: true, data: { users } });
};

const createUser = async (req, res) => {
  const { password, ...userData } = req.body;
  userData.passwordHash = getHash(req.body.password);
  const { _id: id } = await User.create(userData);
  const user = await User.findById(id);
  res.status(200).json({ success: true, data: { user } });
};

const updateUser = async (req, res) => {
  const { password, ...userData } = req.body;
  if (password) userData.passwordHash = getHash(password);
  const user = await User.findByIdAndUpdate(req.params.id, userData, {
    new: true,
    useFindAndModify: false,
  });
  if (!user) throw new Error("User not found");
  else res.status(200).json({ success: true, data: { user } });
};

const deleteUser = async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id, {
    useFindAndModify: false,
  });
  if (!user) {
    throw new Error("User not found");
  } else {
    await MaterialSupport.deleteMany({ userId: user._id });
    res.status(200).json({ success: true });
  }
};

const router = express.Router();
const { verify, hasRole } = JwtMiddleware;
router.get("/self", verify, errorHandler(getSelf));
router.get("/all", verify, hasRole("admin"), errorHandler(getAll));
router.post("/", verify, hasRole("admin"), errorHandler(createUser));
router.put("/:id", verify, hasRole("admin"), errorHandler(updateUser));
router.delete("/:id", verify, hasRole("admin"), errorHandler(deleteUser));

module.exports = router;
