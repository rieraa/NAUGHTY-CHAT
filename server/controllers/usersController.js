const User = require("../model/userModel");
const brycypt = require("bcrypt");

module.exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    // console.log(password);
    const usernameCheck = await User.findOne({ username });
    if (usernameCheck) {
      return res.json({ msg: "Username already used", status: false });
    }
    const emailCheck = await User.findOne({ email });
    if (emailCheck) {
      return res.json({ msg: "Email already used", status: false });
    }

    // 加密密码并添加到数据库
    const hashPassword = await brycypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password: hashPassword,
    });
    console.log("success add");
    delete user.password;
    return res.json({ status: true, user });
  } catch (ex) {
    next(ex);
  }
};
