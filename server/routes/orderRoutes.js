const express = require("express");
const router = express.Router();
const { createRazorpayOrder, verifyPayment, createOrder, getUserOrders, getOrderById } = require("../controllers/orderController");
const { protect } = require("../middleware/auth");

router.post("/create-razorpay-order", protect, createRazorpayOrder);
router.post("/verify-payment", protect, verifyPayment);
router.post("/", protect, createOrder);
router.get("/", protect, getUserOrders);
router.get("/:id", protect, getOrderById);

module.exports = router;