const User = require("../models/User");

// @desc    Add item to cart
// @route   POST /api/users/cart
// @access  Private
const addToCart = async (req, res) => {
    const { productId, quantity } = req.body;
    const user = await User.findById(req.user._id);

    if (user) {
        const cartItem = user.cart.find(item => item.product.toString() === productId);

        if (cartItem) {
            cartItem.quantity += (quantity || 1);
        } else {
            user.cart.push({ product: productId, quantity: quantity || 1 });
        }

        await user.save();
        res.status(200).json(user.cart);
    } else {
        res.status(404).json({ message: "User not found" });
    }
};

// @desc    Get user cart
// @route   GET /api/users/cart
// @access  Private
const getCart = async (req, res) => {
    const user = await User.findById(req.user._id).populate("cart.product");
    if (user) {
        res.json(user.cart);
    } else {
        res.status(404).json({ message: "User not found" });
    }
};

// @desc    Update cart quantity
// @route   PUT /api/users/cart
// @access  Private
const updateCartQuantity = async (req, res) => {
    const { productId, quantity } = req.body;
    const user = await User.findById(req.user._id);

    if (user) {
        const cartItem = user.cart.find(item => item.product.toString() === productId);
        if (cartItem) {
            cartItem.quantity = Math.max(1, quantity);
            await user.save();
            res.json(user.cart);
        } else {
            res.status(404).json({ message: "Item not in cart" });
        }
    } else {
        res.status(404).json({ message: "User not found" });
    }
};

// @desc    Remove from cart
// @route   DELETE /api/users/cart/:id
// @access  Private
const removeFromCart = async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
        user.cart = user.cart.filter(item => item.product.toString() !== req.params.id);
        await user.save();
        res.json(user.cart);
    } else {
        res.status(404).json({ message: "User not found" });
    }
};

// @desc    Clear cart
// @route   DELETE /api/users/cart/clear
// @access  Private
const clearCart = async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
        user.cart = [];
        await user.save();
        res.json(user.cart);
    } else {
        res.status(404).json({ message: "User not found" });
    }
};

module.exports = { addToCart, getCart, updateCartQuantity, removeFromCart, clearCart };
