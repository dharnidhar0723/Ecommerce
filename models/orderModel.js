const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productid: { type: String, required: true },
  title: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  quantity: { type: Number, required: true },
  amount: { type: Number, required: true },
  rating: {
    rate: { type: Number, required: true },
    count: { type: Number, required: true }
  }
});

const orderSchema = new mongoose.Schema({
  order_id: { type: String, required: true },
  custname: { type: String, required: true },
  custphone: { type: String, required: true },
  custaddress: { type: String, required: true },
  orderdate: { type: Date, default: Date.now },
  estdeldate: { type: Date, required: true },
  products: [productSchema],
  totalamount: { type: Number, required: true },
  orderstatus: { type: String, required: true },
  userid: { type: String, required: true },
  useremail: { type: String, required: true }
});

module.exports = mongoose.model('Order', orderSchema);