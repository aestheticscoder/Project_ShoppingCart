const router = require("express").Router();
const {
  createUser,
  loginUser,
  updateUser,
  getUserById,
} = require("../controllers/userController");
const { authorization } = require("../middleware/auth");

router.get("/test", (req, res) => {
  res.send("test");
});

// ========================================== user routes ======================================================
router.post("/register", createUser);
router.post("/login", loginUser);
router.put("/user/:userId/profile", authorization, updateUser);
router.get("/user/:userId/profile", authorization, getUserById);

// ========================================= Product routes ======================================================

module.exports = router;
