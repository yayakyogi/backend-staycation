const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const Category = mongoose.model("Category", {
  name: {
    type: String,
    required: true,
  },
  itemId: [
    {
      type: ObjectId,
      ref: "Item",
    },
  ],
});

module.exports = Category;
