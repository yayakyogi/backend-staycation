const mongoose = require("mongoose");
const { string } = require("postcss-selector-parser");

const Member = mongoose.model("Member", {
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
});

module.exports = Member;
