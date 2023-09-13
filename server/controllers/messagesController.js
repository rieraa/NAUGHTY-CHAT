const mesagesModel = require("../model/messageModel");
const brycypt = require("bcrypt");
module.exports.addMessage = async (req, res, next) => {
  try {
    const { from, to, message } = req.body;
    const data = await mesagesModel.create({
      // todo
      message: { text: message },
      users: [from, to],
      sender: from,
    });

    if (data) {
      return res.json({ msg: "Message added 😃" });
    } else {
      return res.json({ msg: "Message added failed 😭" });
    }
  } catch (ex) {
    next(ex);
  }
};
module.exports.getAllMessage = async (req, res, next) => {
  try {
    const { from, to } = req.body;
    //todo
    const messages = await mesagesModel
      .find({
        // 同时包含from, to
        users: {
          $all: [from, to],
        },
        // 按照 updatedAt 字段的升序排列
      })
      .sort({ updatedAt: 1 });

    const projectedMessages = messages.map((msg) => {
      return {
        // 表示消息是否来自请求中的 from 用户
        fromSelf: msg.sender.toString() === from,
        message: msg.message.text,
      };
    });
    res.json(projectedMessages);
  } catch (ex) {
    next(ex);
  }
};
