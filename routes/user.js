const router = require("express").Router();
const {
  getUsers,
  getUserId,
  createUser,
  updateUser,
  updateUserAvatar,
} = require("../controllers/user");

router.get("/", getUsers);
router.get("/:userId", getUserId);
router.post("/", createUser);
router.patch("/me", updateUser);
router.patch("/me/avatar", updateUserAvatar);

module.exports = router;
