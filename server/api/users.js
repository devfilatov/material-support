const express = require("express");

const { User } = require("../models");

const createUser = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    return res.status(200).json({ success: true, data: user });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ success: false, error: err.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const user = await User.findOneAndUpdate({ _id: req.params.id }, req.body, {
      new: true,
    });
    if (!user) throw new Error("User not found");
    return res.status(200).json({ success: true, data: user });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ success: false, error: err.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findOneAndDelete({ _id: req.params.id });
    if (!user) throw new Error("User not found");
    return res.status(200).json({ success: true, data: user });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ success: false, error: err.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) throw new Error("User not found");
    return res.status(200).json({ success: true, data: user });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ success: false, error: err.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    return res.status(200).json({ success: true, data: users });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ success: false, error: err.message });
  }
};

const router = express.Router();
router.post("/user", createUser);
router.put("/user/:id", updateUser);
router.delete("/user/:id", deleteUser);
router.get("/user/:id", getUserById);
router.get("/users", getUsers);

module.exports = router;
