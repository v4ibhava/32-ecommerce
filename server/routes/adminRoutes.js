const express = require("express");
const router = express.Router();
const { createProduct, updateProduct, deleteProduct, getAllProducts, getDashboardStats } = require("../controllers/adminController");
const { protect, admin } = require("../middleware/auth");
const Order = require("../models/Order");

// Dashboard stats
router.get("/stats", protect, admin, getDashboardStats);

// Product CRUD
router.get("/products", protect, admin, getAllProducts);
router.post("/products", protect, admin, createProduct);
router.put("/products/:id", protect, admin, updateProduct);
router.delete("/products/:id", protect, admin, deleteProduct);

// Get all orders (admin)
router.get("/orders", protect, admin, async (req, res) => {
    try {
        const orders = await Order.find({})
            .populate("user", "name email")
            .populate("orderItems.product", "name image price")
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ message: "Failed to fetch orders" });
    }
});

// Update order status (admin)
router.put("/orders/:id", protect, admin, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        order.status = req.body.status || order.status;
        order.paymentStatus = req.body.paymentStatus || order.paymentStatus;

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } catch (error) {
        console.error("Error updating order:", error);
        res.status(500).json({ message: "Failed to update order" });
    }
});

module.exports = router;
