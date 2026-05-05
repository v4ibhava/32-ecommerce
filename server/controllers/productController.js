const Product = require("../models/Product");

// @desc    Get all products with pagination and search
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
    const pageSize = 8;
    const page = Number(req.query.pageNumber) || 1;

    const keyword = req.query.keyword
        ? {
            name: {
                $regex: req.query.keyword,
                $options: "i",
            },
        }
        : {};

    const count = await Product.countDocuments({ ...keyword });
    const products = await Product.find({ ...keyword })
        .limit(pageSize)
        .skip(pageSize * (page - 1));

    res.json({ products, page, pages: Math.ceil(count / pageSize) });
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ message: "Product not found" });
    }
};

// @desc    Create product (Admin only)
const createProduct = async (req, res) => {
    const { name, price, description, image, stock } = req.body;
    const product = new Product({ name, price, description, image, stock });
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
};

module.exports = { getProducts, getProductById, createProduct };
