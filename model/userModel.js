//user schema and model=> /model/userModel.js

const mongoose = require("mongoose");

const UserSchema = mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true },
    pass: { type: String, required: true },
  },
  {
    versionKey: false,
  }
);

const UserModel = mongoose.model("users", UserSchema);

module.exports = {
  UserModel,
};
