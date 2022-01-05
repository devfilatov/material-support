const express = require("express");
const bcrypt = require("bcrypt");
const _ = require("lodash");

const { User } = require("../models");
const { errorHandler } = require("./utils");
const { JwtService } = require("../services");
const { JwtMiddleware } = require("../middleware");

const AVAILABLE_FIELDS = ["fullName", "email", "birthdate", "group", "course"];

const getHash = (content) => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(content, salt);
};

const createUser = async (req, res) => {
  const userData = _.pick(req.body, AVAILABLE_FIELDS);
  userData.passwordHash = getHash(req.body.password);
  const user = new User(userData);
  await user.save();
  return res.status(200).json({ success: true, data: { user } });
};

const updateUser = async (req, res) => {
  const { password, ...userData } = req.body;
  if (password) userData.passwordHash = getHash(password);
  const user = await User.findOneAndUpdate({ _id: req.params.id }, userData, {
    new: true,
  });
  if (!user) throw new Error("User not found");
  return res.status(200).json({ success: true, data: { user } });
};

const deleteUser = async (req, res) => {
  const user = await User.findOneAndDelete({ _id: req.params.id });
  if (!user) throw new Error("User not found");
  return res.status(200).json({ success: true, data: { user } });
};

const getSelf = async (req, res) => {
  const token = req.header("X-Auth-Token");
  const { payload } = JwtService.decode(token);
  const user = await User.findOne({ _id: payload.id });
  const userData = _.pick(user, AVAILABLE_FIELDS);
  return res.status(200).json({ success: true, data: { user: userData } });
};

const getUsers = async (req, res) => {
  const users = await User.find({});
  return res.status(200).json({ success: true, data: { users } });
};

const router = express.Router();
const { verify, hasRole } = JwtMiddleware;
router.get("/self", verify, errorHandler(getSelf));
router.get("/all", verify, hasRole("admin"), errorHandler(getUsers));
router.post("/", verify, hasRole("admin"), errorHandler(createUser));
router.put("/:id", verify, hasRole("admin"), errorHandler(updateUser));
router.delete("/:id", verify, hasRole("admin"), errorHandler(deleteUser));

module.exports = router;
