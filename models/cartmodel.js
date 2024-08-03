const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    userid: { type: String, required: true },
    products: [{
        productid: String,
        quantity: String,
    }],
});

let Cart;

try {
    // Check if the model is already defined
    Cart = mongoose.model('Cart');
} catch (error) {
    // If not defined, define the model
    Cart = mongoose.model('Cart', cartSchema);
}

module.exports = { Cart };  // Ensure correct export
