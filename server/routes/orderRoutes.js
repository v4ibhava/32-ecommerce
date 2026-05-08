const express = require("express");
const router = express.Router();
const { createRazorpayOrder, verifyPayment, createOrder, getUserOrders, getOrderById } = require("../controllers/orderController");
<<<<<<< HEAD
=======

>>>>>>> 1558049f4fa5d377d921f15b1032ade793e65133
const { protect } = require("../middleware/auth");

router.post("/create-razorpay-order", protect, createRazorpayOrder);
router.post("/verify-payment", protect, verifyPayment);
router.post("/", protect, createOrder);
router.get("/", protect, getUserOrders);
router.get("/:id", protect, getOrderById);

module.exports = router;