const mongoose = require("mongoose");

const Image = mongoose.model("Image", {
  imageUrl: {
    type: String,
    required: true,
  },
});

module.exports = Image;
