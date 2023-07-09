const router = require("express").Router();
const {
  createUser,
  loginUser,
  getUserById,
  updateUser,
} = require("../controllers/userController");
const { auth } = require("../middleware/auth");
const {
  createProduct,
  getProduct,
  getProductById,
  updateProduct,
  deletedProduct,
} = require("../controllers/productController");
const {
  createCart,
  updateCart,
  getCart,
  deleteCart,
} = require("../controllers/cartController");
const { createOrder, updateOrder } = require("../controllers/orderController");

router.get("/test", (req, res) => {
  res.send("test");
});

// User Route
router.post("/register", createUser);
router.post("/login", loginUser);
router.put("/user/:userId/profile", auth, updateUser);
router.get("/user/:userId/profile", auth, getUserById);

// Product Route

router.post("/products", createProduct);
router.get("/products", getProduct);
router.get("/products/:productId", getProductById);
router.put("/products/:productId", updateProduct);
router.delete("/products/:productId", deletedProduct);

// Cart Route
router.post("/users/:userId/cart", auth, createCart);
router.get("/users/:userId/cart", auth, getCart);
router.put("/users/:userId/cart", auth, updateCart);
router.delete("/users/:userId/cart", auth, deleteCart);

// Order Route
router.post("/users/:userId/orders", auth, createOrder);
router.put("/users/:userId/orders", auth, updateOrder);
router.all("*", function (req, res) {
  res.status(404).send({ status: false, message: "you're on a wrong route" });
});

module.exports = router;
