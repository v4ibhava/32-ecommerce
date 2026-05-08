const express = require("express");
const router = express.Router();
const { authUser, registerUser, getUserProfile } = require("../controllers/userController");
const { addToCart, getCart, updateCartQuantity, removeFromCart, clearCart } = require("../controllers/cartController");
const { protect } = require("../middleware/auth");

router.post("/login", authUser);
router.post("/register", registerUser);
router.get("/profile", protect, getUserProfile);
router.route("/cart").post(protect, addToCart).get(protect, getCart).put(protect, updateCartQuantity);
router.delete("/cart/clear", protect, clearCart);
router.delete("/cart/:id", protect, removeFromCart);

module.exports = router;
