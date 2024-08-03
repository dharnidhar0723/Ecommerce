const Order = require('../models/ordermodel');
const Cart = require('../models/cartmodel');
const Product = require('../models/productModel');
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();
const EMAIL=process.env.EMAIL;
const EPASSWORD = process.env.EPASSWORD;
// Configure the email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail', // Use your email service provider, e.g., 'gmail'
  auth: {
    user: EMAIL, // Your email address
    pass: EPASSWORD // Your email password or app-specific password
  }
});

const placeOrder = async (req, res) => {
  try {
    const userid = req.user;
    const { custname, custphone, custaddress, useremail } = req.body;

    const cart = await Cart.findOne({ userid });

    if (!cart || cart.products.length === 0) {
      return res.status(404).json({ msg: "Cart is empty or not found" });
    }

    const products = [];
    let totalamount = 0;

    for (const cartItem of cart.products) {
      const product = await Product.findOne({ id: cartItem.productid });

      if (product) {
        const amount = product.price * cartItem.quantity;
        totalamount += amount;

        products.push({
          productid: cartItem.productid,
          title: product.title,
          price: product.price,
          description: product.description,
          image: product.image,
          category: product.category,
          quantity: cartItem.quantity,
          amount: amount,
          rating: product.rating
        });
      }
    }

    const orderdate = new Date();
    const estdeldate = new Date();
    estdeldate.setDate(orderdate.getDate() + 5);

    const newOrder = new Order({
      order_id:uuidv4(),
      custname,
      custphone,
      custaddress,
      orderdate,
      estdeldate,
      products,
      totalamount,
      orderstatus: 'Order Placed',
      userid,
      useremail
    });

    await newOrder.save();

    // Clear the cart after placing the order
    await Cart.deleteOne({ userid });

    // Send order confirmation email
    const mailOptions = {
      from: EMAIL, // Your email address
      to: useremail,
      subject: 'Order Confirmation',
      text: `Dear ${custname},\n\nYour order has been placed successfully. Here are the details:\n\nOrder ID: ${newOrder._id}\nOrder Date: ${orderdate.toLocaleDateString()}\nEstimated Delivery Date: ${estdeldate.toLocaleDateString()}\n\nProducts:\n${products.map(p => `\n- ${p.title} (Quantity: ${p.quantity}) - ${p.amount}`).join('')}\n\nTotal Amount: ${totalamount}\n\nThank you for shopping with us!\n\nBest regards,\nYour Company`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });

    res.status(200).json({ msg: "Order placed successfully", order: newOrder });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal server error" });
  }
};




const getUserOrders = async (req, res) => {
    try {
        const userId = req.user; // Assumes the user ID is stored in the token as 'id'
        const orders = await Order.find({ userid: userId }).exec();

        if (!orders.length) {
            return res.status(404).json({ message: 'No orders found for this user' });
        }

        let grandTotal = 0;

        // Format the order details and calculate the grand total
        const formattedOrders = orders.map(order => {
            const orderTotal = order.products.reduce((acc, product) => acc + (product.price * product.quantity), 0);
            grandTotal += orderTotal;

            return {
                order_id: order.order_id,
                totalamount: order.totalamount,
                orderdate: order.orderdate,
                estdeldate: order.estdeldate,
                products: order.products.map(product => ({
                    title: product.title,
                    description: product.description,
                    price: product.price,
                    quantity: product.quantity,
                    subtotal: product.price * product.quantity
                }))
            };
        });

        res.status(200).json({ orders: formattedOrders, grandTotal });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving orders', error });
    }
};

module.exports = { getUserOrders };


module.exports = { getUserOrders };



module.exports = { placeOrder, getUserOrders  };