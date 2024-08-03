const User = require("../models/usermodel")
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const SECRETKEY = process.env.SECRETKEY;
// CREATE NEW USER
const signup = async (req, res) => {
    try {
        const { id, name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create new user
        const user = new User({ id:uuidv4(), name, email, password });

        // Save user
        await user.save();

        // Send success response
        res.status(201).json({ user });
    } catch (error) {
        console.error('Error during signup:', error);

        // Send error response if something goes wrong
        if (!res.headersSent) {  // Check if headers have already been sent
            res.status(500).json({ message: 'Server error' });
        }
    }
};


//generating JWT key


const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    try {
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid password' });
        }
        const token = jwt.sign({ userid: user._id }, SECRETKEY, {
            expiresIn: "24hr",
        });
        res.json({ token });
        console.log("Printing JWT", token)
    } catch (err) {
        console.log(err);
    }
};



module.exports = { signup, login }