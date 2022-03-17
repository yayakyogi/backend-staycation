const mongoose = require("mongoose");
mongoose.connect(
  // "mongodb://127.0.0.1:27017/staycation",//
  "mongodb+srv://yayakyogi:GHyMnbiwiIUqDSUN@cluster0.zqxyq.mongodb.net/staycation?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
