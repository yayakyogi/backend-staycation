const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const Activity = mongoose.model("Activity", {
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  isPopular: {
    type: Boolean,
    default: false,
  },
  itemId: {
    type: ObjectId,
    ref: "Item",
  },
});

module.exports = Activity;
