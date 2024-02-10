const express = require("express");
const authMiddleware = require("../middleware");
const { Account } = require("../db/db");
const accountRouter = express.Router();
const zod = require("zod");
const { mongoose } = require("mongoose");
const transferSchema = zod.object({
  to: zod.string(),
  amount: zod.number().min(1),
});

accountRouter.get("/balance", authMiddleware, async (req, res) => {
  const account = await Account.findOne({ username: req.userId });
  res.status(200).json({
    balance: account.balance,
  });
});

accountRouter.post("/transfer", authMiddleware, async (req, res) => {
  const response = transferSchema.safeParse(req.body);
  if (!response.success) {
    res.status(400).json({
      message: "Invalid details",
    });
    return;
  }
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const account = await Account.findOne({ username: req.userId }).session(
      session
    );
    const balance = account.balance;
    if (balance < req.body.amount) {
      await session.abortTransaction();

      res.status(400).json({
        message: "Insufficient balance",
      });
      return;
    }
    const transferAccount = await Account.findOne({
      username: req.body.to,
    }).session(session);

    if (!transferAccount) {
      await session.abortTransaction();

      res.status(400).json({
        message: "Invalid receiver",
      });
      return;
    }
    await Account.updateOne(
      { username: req.userId },
      { $inc: { balance: -req.body.amount } }
    ).session(session);
    await Account.updateOne(
      { username: transferAccount.username },
      { $inc: { balance: req.body.amount } }
    ).session(session);
    await session.commitTransaction();
    return res.status(200).json({
      msg: "Transaction success",
    });
  } catch (e) {
    await session.abortTransaction();
    res.status(400).json({
      message: "something went wrong",
    });
  }
});

module.exports = accountRouter;
