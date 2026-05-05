const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/User");

dotenv.config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const adminExists = await User.findOne({ role: "admin" });

        if (adminExists) {
            console.log("Admin already exists");
            process.exit();
        }

        const admin = new User({
            name: "Admin User",
            email: "admin@example.com",
            password: "adminpassword123",
            role: "admin"
        });

        await admin.save();
        console.log("Admin created successfully: admin@example.com / adminpassword123");
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

createAdmin();
