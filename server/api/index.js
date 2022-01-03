const express = require("express");

const users = require("./users");

const rootRouter = express.Router();

rootRouter.use("/", users);

module.exports = rootRouter;
