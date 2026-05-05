const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("./models/Product");
const products = require("./32-chip-data.json");

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log("DB connected for seeding");
        await Product.deleteMany();
        await Product.insertMany(products);
        console.log("Data Seeded Successfully");
        process.exit();
    })
    .catch(err => {
        console.log(err);
        process.exit(1);
    });
