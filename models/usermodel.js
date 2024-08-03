const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const userSchema = new mongoose.Schema({
    id: { type: String, required: [true, "ID is required" ], unique:true },
    name: { type: String, required: true },
    email: { type: String ,required: true,unique:true},
    password: { type: String, required: true }
    }
)

//hashing password before saving 
userSchema.pre('save', async function(next){
    if(!this.isModified("password")){
        return next();
    }
    const salt = await bcrypt.genSalt(10); //hashes the password under 10 bits
    this.password = await bcrypt.hash(this.password,salt); //decrypts the password and checks whether it matches teh password provided by user
    next();
})

const User = mongoose.model('User', userSchema);

module.exports = User;