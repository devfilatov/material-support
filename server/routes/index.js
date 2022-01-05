const express = require("express");

const auth = require("./auth.router");
const users = require("./users.router");

const rootRouter = express.Router();

rootRouter.use("/auth", auth);
rootRouter.use("/users", users);

module.exports = rootRouter;
