const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const orderRoutes = require('./routes/orderRoutes.js')

dotenv.config({ path: path.resolve(__dirname, ".env") });

const port = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json());

const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("DB connected"))
    .catch((err) => console.log(err));

app.get("/", (req, res) => { res.send("API running") });

app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use('/api/orders', orderRoutes);

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
})