<<<<<<< HEAD
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    orderItems: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true }
        }
    ],
    shippingAddress: {
        fullName: { type: String, required: true },
        address: { type: String, required: true },
        city: { type: String, required: true },
        pincode: { type: String, required: true }
    },
    paymentMethod: { type: String, enum: ["cod", "cashless"], default: "cod" },
    paymentStatus: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"], default: "pending" }
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
=======
const mongoose = require('mongoose');
const { getProducts } = require('../controllers/productController');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true
    },
    orderItems: [{
        products: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            require: true
        },
        quantity: {
            type: Number, 
            require: true
        },
        Price: {
            type: Number,
            required: true
        }
    }],
    ShippingAdress: {
        fullName : {
            type: String, 
            required: true
        },
        address: {
            type: String,
             required: true
        },
        city: {
            type: String,
            required: true
        },
        pincode: {
            type: String,
            required: true
        }
    },
    paymentMethod: {
        type: String,
        enum: ["pending","paid","failed"],
        default: 'pending'
    },
    razorpayOrderId: { type: String},
    reazorpayPaymentId: { type: String },
    totalAmount: { type: Number,
        required: true
    },
    status: {
        type: String, 
        enum: ["pending", "confirmed", "shipped","delivered","cancelled"],
        default: "pending",
    }
}, { timestamps: true })

module.exports = mongoose.model("order", orderSchema);
>>>>>>> 1558049f4fa5d377d921f15b1032ade793e65133
