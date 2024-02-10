const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect("mongodb+srv://sarkarjii534:%40sarkarop09@cluster0.kazdxwe.mongodb.net/PaytmApk");

const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  firstname: String,
  lastname: String,
});
const AccountSchema = new mongoose.Schema({
  username: { type: String, ref: "User", required: true },
  balance: {
    type: Number,
    required: true,
  },
});
const User = mongoose.model("User", UserSchema);
const Account = mongoose.model("Account", AccountSchema);
module.exports = { User, Account };
