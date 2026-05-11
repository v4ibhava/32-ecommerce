const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const importData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to Online MongoDB for Import...');

    // Read the products.json from the root directory
    const filePath = path.join(__dirname, '..', 'products.json');
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    
    // Parse the JSON lines format
    const products = fileContent.split('\n')
      .filter(line => line.trim() !== '')
      .map(line => {
        const item = JSON.parse(line);
        // Clean up the MongoDB export format (_id, dates)
        // Note: We remove the existing _id to avoid any duplicate key errors and let Mongo generate new ones
        // or we keep them if we're sure they are unique.
        const cleanedItem = { ...item };
        delete cleanedItem._id; 
        delete cleanedItem.__v;
        
        if (cleanedItem.createdAt && cleanedItem.createdAt.$date) cleanedItem.createdAt = cleanedItem.createdAt.$date;
        if (cleanedItem.updatedAt && cleanedItem.updatedAt.$date) cleanedItem.updatedAt = cleanedItem.updatedAt.$date;
        
        return cleanedItem;
      });

    // Clear the sample products first
    await Product.deleteMany();
    
    // Insert the new products
    await Product.insertMany(products);
    console.log(`${products.length} products imported successfully from products.json!`);
    
    process.exit();
  } catch (error) {
    console.error('Import failed:', error);
    process.exit(1);
  }
};

importData();
