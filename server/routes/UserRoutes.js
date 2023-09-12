const {
  register,
  login,
  setAvatar,
  getAllContacts,
} = require("../controllers/usersController");
const router = require("express").Router();

router.post("/register", register);
router.post("/login", login);
router.post("/setAvatar/:id", setAvatar); //todo :id
router.get("/getAllContacts/:id", getAllContacts);
module.exports = router;
