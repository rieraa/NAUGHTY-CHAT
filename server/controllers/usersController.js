const User = require("../model/userModel");
const brycypt = require("bcryptjs");

module.exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    // console.log(username, email, password);
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
    delete user.password;
    return res.json({ status: true, user });
  } catch (ex) {
    next(ex);
  }
};

module.exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // 用户名和邮箱都能登录 此处是标识 从两个途径进行查询
    const userByUsername = await User.findOne({ username });
    const userByEmail = await User.findOne({ email: username });

    // 接受查询到的结果
    let user;

    if (userByUsername) {
      user = userByUsername;
    } else if (userByEmail) {
      user = userByEmail;
    } else {
      return res.json({
        msg: "Incorrect username or password",
        status: false,
      });
    }

    const isPasswordValid = await brycypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.json({ msg: "Incorrect username or password", status: false });
    }
    delete user.password;
    console.log("success login");
    return res.json({ status: true, user }); // todo
  } catch (ex) {
    next(ex);
  }
};

module.exports.setAvatar = async (req, res, next) => {
  try {
    const userID = req.params.id;
    const avatarImage = req.body.image;
    // console.log(req.body);
    const userData = await User.findByIdAndUpdate(
      userID,
      {
        isAvatarImageSet: true,
        avatarImage: avatarImage,
      },
      { new: true }
    );

    return res.json({
      isSet: userData.isAvatarImageSet,
      image: userData.avatarImage,
    }); // todo
  } catch (ex) {
    next(ex);
  }
};

module.exports.getAllContacts = async (req, res, next) => {
  try {
    // 查找所有 _id 不等于 req.params.id 的用户
    // MongoDB的查询运算符（$ne表示"不等于"）
    const users = await User.find({ _id: { $ne: req.params.id } }).select([
      "email",
      "username",
      "avatarImage",
      "_id",
    ]);

    return res.json(users);
  } catch (ex) {
    next(ex);
  }
};
