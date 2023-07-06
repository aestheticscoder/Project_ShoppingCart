const router = require("express").Router();
const {
  createUser,
  loginUser,
  updateUser,
  getUserById,
} = require("../controllers/userController");
const { authorization } = require("../middleware/auth");

const {
  createProduct,
  getProduct,
  getProductById,
  updateProduct,
  deletedProduct,
} = require("../controllers/productController");

// User Routes

router.post("/register", createUser);
router.post("/login", loginUser);
router.put("/user/:userId/profile", authorization, updateUser);
router.get("/user/:userId/profile", authorization, getUserById);

// Product Routes

router.post("/products", createProduct);
router.get("/products", getProduct);
router.get("/products/:productId", getProductById);
router.put("/products/:productId", updateProduct);
router.delete("/products/:productId", deletedProduct);

module.exports = router;
