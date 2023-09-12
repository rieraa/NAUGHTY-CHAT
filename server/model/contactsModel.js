const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User", // 参考User模型
  },
  contactUserId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User", // 参考User模型
  },
});

module.exports = mongoose.model("Contact", contactSchema);
