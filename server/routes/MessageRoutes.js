const {
  getAllMessage,
  addMessage,
} = require("../controllers/messagesController");
const router = require("express").Router();

router.post("/getAllMessage", getAllMessage);
router.post("/addMessage", addMessage);

module.exports = router;
