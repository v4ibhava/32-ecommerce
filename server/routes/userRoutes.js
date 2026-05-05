const express = require("express");
const router = express.Router();
const { authUser, registerUser } = require("../controllers/userController");
const { addToCart, getCart, updateCartQuantity, removeFromCart } = require("../controllers/cartController");
const { protect } = require("../middleware/auth");

router.post("/login", authUser);
router.post("/register", registerUser);
router.route("/cart").post(protect, addToCart).get(protect, getCart).put(protect, updateCartQuantity);
router.delete("/cart/:id", protect, removeFromCart);

module.exports = router;
