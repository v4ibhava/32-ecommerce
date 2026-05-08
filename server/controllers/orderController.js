const Razorpay = require("razorpay");
const Order = require("../models/Order");
const User = require("../models/User");

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// @desc    Create Razorpay order
// @route   POST /api/orders/create-razorpay-order
// @access  Private
const createRazorpayOrder = async (req, res) => {
    try {
        const { amount } = req.body;
        
        const razorpayOrder = await razorpay.orders.create({
            amount: amount * 100,
            currency: "INR",
            receipt: `order_${Date.now()}`
        });

        res.json(razorpayOrder);
    } catch (error) {
        console.error("Razorpay order creation error:", error);
        res.status(500).json({ message: "Failed to create order" });
    }
};

// @desc    Verify Razorpay payment
// @route   POST /api/orders/verify-payment
// @access  Private
const verifyPayment = async (req, res) => {
    try {
        const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;
        
        const crypto = require("crypto");
        const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
        hmac.update(`${razorpayOrderId}|${razorpayPaymentId}`);
        const generatedSignature = hmac.digest("hex");

        if (generatedSignature === razorpaySignature) {
            res.json({ verified: true });
        } else {
            res.status(400).json({ verified: false, message: "Invalid signature" });
        }
    } catch (error) {
        console.error("Payment verification error:", error);
        res.status(500).json({ message: "Payment verification failed" });
    }
};

// @desc    Create order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
    try {
        const { orderItems, shippingAddress, paymentMethod, razorpayOrderId, razorpayPaymentId, totalAmount } = req.body;
        
        const order = new Order({
            user: req.user._id,
            orderItems,
            shippingAddress,
            paymentMethod,
            razorpayOrderId,
            razorpayPaymentId,
            totalAmount,
            paymentStatus: paymentMethod === "cashless" ? "paid" : "pending"
        });

        await order.save();

        const user = await User.findById(req.user._id);
        user.cart = [];
        await user.save();

        res.status(201).json(order);
    } catch (error) {
        console.error("Order creation error:", error);
        res.status(500).json({ message: "Failed to create order" });
    }
};

// @desc    Get user orders
// @route   GET /api/orders
// @access  Private
const getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .populate("orderItems.product")
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ message: "Failed to fetch orders" });
    }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate("orderItems.product");
        if (order) {
            res.json(order);
        } else {
            res.status(404).json({ message: "Order not found" });
        }
    } catch (error) {
        console.error("Error fetching order:", error);
        res.status(500).json({ message: "Failed to fetch order" });
    }
};

module.exports = {
    createRazorpayOrder,
    verifyPayment,
    createOrder,
    getUserOrders,
    getOrderById
};