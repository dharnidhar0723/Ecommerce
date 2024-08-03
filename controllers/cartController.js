const cart = require('../models/cartmodel');
const Product = require('../models/productModel');

const addtocart = async (req, res) => {
    try {
      const { productid, quantity } = req.body;
      const userid = req.user;
  
      const data = await cart.findOne({ userid });
      if (data) {
        // Find if the product already exists in the cart
        const exist = data.products.find(p => p.productid === productid);
  
        if (exist) {
          // If the product exists, update the quantity
          if (quantity === 0) {
            // If the quantity is 0, remove the product from the cart
            data.products = data.products.filter(p => p.productid !== productid);
            if (data.products.length === 0) {
              // If the cart is empty, delete the cart
              await cart.deleteOne({ userid });
              return res.status(200).send({ msg: "Cart deleted Successfully!!" });
            }
          } else {
            exist.quantity = quantity;
          }
        } else {
          // If the product does not exist, add it to the cart
          if (quantity > 0) {
            data.products.push({
              productid,
              quantity
            });
          } else {
            return res.status(400).send({ msg: "Quantity must be greater than 0 to add a product" });
          }
        }
  
        await data.save();
        res.status(200).send({ msg: "Product updated in cart", cart: data });
      } else {
        // If the cart does not exist, create a new cart
        if (quantity > 0) {
          const newCart = new cart({
            userid,
            products: [{
              productid,
              quantity
            }]
          });
          await newCart.save();
          res.status(200).send({ msg: "Cart created and product added", cart: newCart });
        } else {
          return res.status(400).send({ msg: "Quantity must be greater than 0 to add a product" });
        }
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({ msg: "Internal server error" });
    }
  };
  

const getitem = async (req, res) => {
  try {
    const userid = req.user;
    const Cart = await cart.findOne({ userid });
    let totalprice = 0;

    if (Cart) {
      const arr = [];
      for (const item of Cart.products) {
        const product = await Product.findOne({ id: item.productid });
        let totalamt = product.price * item.quantity;
        totalprice += totalamt;
        if (product) {
          arr.push({
            title: product.title,
            description: product.description,
            price: product.price,
            category: product.category,
            image: product.image,
            quantity: item.quantity,
            amount: totalamt
          });
        }
      }

      res.status(200).json({ TotalPrice: totalprice, products: arr });
    } else {
      res.status(404).json({ msg: "Cart not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

const deleteproduct = async (req, res) => {
    try {
      const { productid }= req.body;
      const userid = req.user;
      const Cart = await cart.findOne({ userid });
  
      if (!Cart) {
        return res.status(404).json({ error: "Cart not found" });
      }
  
      console.log('Product ID to delete:', productid);
      console.log('Products in cart:', Cart.products);
  
      let productFound = false;
  
      for (let i = 0; i < Cart.products.length; i++) {
        if (Cart.products[i].productid.toString() === productid) {
          productFound = true;
          if (Cart.products.length <= 1) {
            await cart.deleteOne({ userid });
            return res.status(200).json({ msg: "Cart deleted Successfully" });
          } else {
            Cart.products.splice(i, 1);
            await Cart.save();
            return res.status(200).json({ msg: "Deletion successful" });
          }
        }
      }
  
      if (!productFound) {
        return res.status(404).json({ msg: "Product not found in the cart" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "Internal server error" });
    }
  };
  
  
  
  

  
const deletecart = async (req, res) => {
  try {
    const userid = req.user;
    const data = await cart.findOne({ userid });

    if (data) {
      await cart.deleteOne({ userid });
      res.status(200).send({ msg: "Cart deleted Successfully!!" });
    } else {
      res.status(404).send({ msg: "Cart not found" });
    }
  } catch (error) {
    res.status(500).send({ msg: "Internal server error" });
  }
};

module.exports = { addtocart, getitem, deleteproduct, deletecart };