const express = require("express");

const auth = require("./auth.router");
const users = require("./users.router");
const ms = require("./ms.router");
const calc = require("./calc.router");

const rootRouter = express.Router();

rootRouter.use("/auth", auth);
rootRouter.use("/users", users);
rootRouter.use("/ms", ms);
rootRouter.use("/calc", calc);

module.exports = rootRouter;
