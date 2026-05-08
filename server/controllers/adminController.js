const Product = require("../models/Product");

// @desc    Create product
// @route   POST /api/admin/products
// @access  Admin
const createProduct = async (req, res) => {
    try {
        const { name, price, description, stock, category, image } = req.body;

        if (!image) {
            return res.status(400).json({ message: "Product image URL is required" });
        }

        const product = new Product({
            name,
            price: Number(price),
            description,
            image,
            stock: Number(stock) || 0,
            category: category || "ESP32"
        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        console.error("Create product error:", error);
        res.status(500).json({ message: "Failed to create product" });
    }
};

// @desc    Update product
// @route   PUT /api/admin/products/:id
// @access  Admin
const updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const { name, price, description, stock, category, image } = req.body;

        product.name = name || product.name;
        product.price = price ? Number(price) : product.price;
        product.description = description || product.description;
        product.stock = stock !== undefined ? Number(stock) : product.stock;
        product.category = category || product.category;
        product.image = image || product.image;

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } catch (error) {
        console.error("Update product error:", error);
        res.status(500).json({ message: "Failed to update product" });
    }
};

// @desc    Delete product
// @route   DELETE /api/admin/products/:id
// @access  Admin
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error("Delete product error:", error);
        res.status(500).json({ message: "Failed to delete product" });
    }
};

// @desc    Get all products (admin view)
const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({}).sort({ createdAt: -1 });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch products" });
    }
};

// @desc    Get dashboard stats
const getDashboardStats = async (req, res) => {
    try {
        const Order = require("../models/Order");
        const User = require("../models/User");

        const [totalProducts, totalOrders, totalUsers, orders] = await Promise.all([
            Product.countDocuments(),
            Order.countDocuments(),
            User.countDocuments({ role: "customer" }),
            Order.find({}).sort({ createdAt: -1 }).limit(5).populate("user", "name email").populate("orderItems.product", "name image")
        ]);

        const revenueResult = await Order.aggregate([
            { $match: { paymentStatus: "paid" } },
            { $group: { _id: null, total: { $sum: "$totalAmount" } } }
        ]);

        const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;
        const pendingOrders = await Order.countDocuments({ status: "pending" });
        const failedPayments = await Order.countDocuments({ paymentStatus: "failed" });

        res.json({
            totalProducts,
            totalOrders,
            totalUsers,
            totalRevenue,
            pendingOrders,
            failedPayments,
            recentOrders: orders
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
};

module.exports = { createProduct, updateProduct, deleteProduct, getAllProducts, getDashboardStats };
