const router = require("express").Router();
const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateUserAvatar,
  login,
  getCurrentUser,
} = require("../controllers/user");

router.get("/", getUsers);
router.get("/:userId", getUserById);
router.get("/me", getCurrentUser);
router.patch("/me", updateUser);
router.patch("/me/avatar", updateUserAvatar);
// router.post("/", login);
// router.post("/", createUser);

module.exports = router;
