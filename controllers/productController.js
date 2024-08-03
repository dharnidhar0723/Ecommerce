const mongoose = require('mongoose');
const Product = require("../models/productModel");  // Ensure correct model import
const { v4: uuidv4 } = require('uuid');
// Function to get all products
const getAllproducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.send(products);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

const addProduct = async (req, res) => {
    try {
        const { id, title, price, description, category, image, rating } = req.body;

        // Check if all required fields are provided
        if (!id || !title || !price || !description || !category || !image || !rating.rate || !rating.count) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const product = new Product({  // Ensure this matches the model import
            id:uuidv4(),
            title,
            price,
            description,
            category,
            image,
            rating,
        });

        await product.save();
        res.status(201).json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, price, description, category, image, rating } = req.body;

        const updatedProduct = await Product.findOneAndUpdate(
            { id: id },
            { title, price, description, category, image, rating },
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json(updatedProduct);
    } catch (err) {
        console.error('Error updating product:', err);
        res.status(500).json({ error: 'An error occurred while updating the product' });
    }
};




const deleteProducts = async (req, res) => {
    try {
        const { id } = req.params; // Ensure 'id' is used consistently
        const deleteproduct = await Product.findOneAndDelete({ id: id }); // Use 'id' field as defined in your schema

        if (!deleteproduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({ message: 'Product deleted successfully', deleteproduct });
    } catch (err) {
        console.error('Error deleting product:', err);
        res.status(500).json({ error: 'An error occurred while deleting the product' });
    }
};






module.exports = {
    getAllproducts,
    addProduct,
    updateProduct,
    deleteProducts
};