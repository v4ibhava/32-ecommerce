const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("./models/Product");

dotenv.config();

// Sample seed data - products are now primarily managed via Admin Dashboard
const sampleProducts = [
    {
        name: "ESP32-DevKitV1",
        description: "The classic ESP32 development board with CP2102. Perfect for beginners and IoT enthusiasts.",
        price: 450,
        image: "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&q=80&w=1000",
        stock: 100,
        category: "ESP32"
    },
    {
        name: "ESP32-S3-WROOM-1",
        description: "Powerful dual-core MCU with Wi-Fi, Bluetooth, and AI acceleration capabilities.",
        price: 850,
        image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1000",
        stock: 50,
        category: "ESP32"
    },
    {
        name: "ESP32-CAM",
        description: "Small form factor camera module based on ESP32. Great for surveillance and facial recognition.",
        price: 650,
        image: "https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&q=80&w=1000",
        stock: 75,
        category: "ESP32"
    }
];

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log("DB connected for seeding");
        await Product.deleteMany();
        await Product.insertMany(sampleProducts);
        console.log("Data Seeded Successfully (use Admin Dashboard for further product management)");
        process.exit();
    })
    .catch(err => {
        console.log(err);
        process.exit(1);
    });
