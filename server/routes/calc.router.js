const express = require("express");

const { User, MaterialSupport } = require("../models");
const { errorHandler, getHash } = require("./utils");
const { JwtMiddleware } = require("../middleware");

const DEFAULT_USER_PASSWORD = "0000";

const save = async (req, res) => {
  const entries = req.body || [];
  const users = await Promise.all(
    entries.map(async (entry) => {
      if (await User.exists({ email: entry.email })) {
        return await User.findOne({ email: entry.email });
      }
      const passwordHash = getHash(DEFAULT_USER_PASSWORD);
      return await User.create({ ...entry, passwordHash });
    })
  );
  await Promise.all(
    entries.map(async (entry, index) => {
      const userId = users[index]._id;
      return await MaterialSupport.create({ ...entry, userId });
    })
  );
  res.status(200).json({ success: true });
};

const router = express.Router();
const { verify, hasRole } = JwtMiddleware;
router.post("/save", verify, hasRole("admin"), errorHandler(save));

module.exports = router;
