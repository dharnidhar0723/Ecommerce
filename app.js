const express = require('express');
const app = express();
const bodyparser =require('body-parser');
const ProductRouters = require("./routes/productRoutes")
const userrouter = require("./routes/userroutes")
const cartRoutes = require('./routes/cartRoutes');
const orderroutes=require('./routes/orderRoutes');
const cors = require("cors");
const mongoose = require('mongoose');
app.use(bodyparser.json())
app.use(cors());
require('dotenv').config();
const MONGODB_URI = process.env.MONGODB_URI;


mongoose.connect(
    MONGODB_URI

)
    .then(() => {
        console.log('Connected to MongoDB');
    }).catch((err)=>console.log("Er"))
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/",ProductRouters);
app.use("/",userrouter);
app.use("/",cartRoutes);
app.use("/",orderroutes);

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});