const express = require("express");
const userRouter = require("./user");
const accountRouter = require("./account");
const indexRouter = express.Router();

indexRouter.use("/user", userRouter);
indexRouter.use("/account", accountRouter);

module.exports = indexRouter;
