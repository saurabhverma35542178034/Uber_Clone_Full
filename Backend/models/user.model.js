const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const jwt = require('jsonwebtoken');
require('dotenv').config(); // Load environment variables from .env file


const userSchema= new mongoose.Schema({
    fullname:
    {
        firstname:{
        type: String,
        required: true,
        minlength:[4, 'First name must be at least 4 characters long'],
    },
    lastname:{
        type: String,
        
    }
},

password:{
    type: String,
    required: true,
    select: false // Exclude password from queries by default
},
email:{
    type: String,
    required: true,
    unique: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
},
socketId:{
    type: String,
    default: null
}
})           


userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({ _id: this._id, email: this.email }, process.env.JWT_SECRET, { expiresIn: '24h' });
    return token;       
}

userSchema.methods.comparePassword = async function(password) {
    const isMatch = await bcrypt.compare(password, this.password);
    return isMatch;
}

userSchema.statics.hashPassword = async function(password) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
}

const userModel = mongoose.model('User', userSchema);
module.exports = userModel;