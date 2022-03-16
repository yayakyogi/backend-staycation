const mongoose = require("mongoose");

const User = mongoose.model("User", {
  name: {
    type: String,
    required: true,
  },
  nomorHandphone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "admin",
  },
});

module.exports = User;
