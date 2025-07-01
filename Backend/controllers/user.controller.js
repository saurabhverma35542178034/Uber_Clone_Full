const userModel = require('../models/user.model');
const {validationResult} = require('express-validator');
const userservices = require('../services/user.services');
const blacklistTokenModel=require('../models/blacklistToken.model')


module.exports.registerUser = async (req, res) => {
    const errors= validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { fullname, lastname, email, password } = req.body;
    const hashedPassword = await userModel.hashPassword(password);

    const user = await userservices.createUser({
        firstname: fullname.firstname,
        lastname: fullname.lastname,
        email,
        password: hashedPassword
    });

    const token = user.generateAuthToken();
    res.cookie('token', token); // Set the token in a cookie
    // res.status(201).json({message: "User created successfully"});
    res.status(201).json({token,user});
}

module.exports.loginUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    const user =await userModel.findOne({email}).select('+password');

    if(!user)
    {
        res.status(401).json({"message": "Invalid email or Password"});
    }
    const isMatch = await user.comparePassword(password);

    if(!isMatch){
        res.status(401).json({"message": "Invalid email or Password"});
    }

    const token = user.generateAuthToken();
    
    res.status(200).json('We found the user');
    // res.status(200).json({token, user});
}


module.exports.getUserProfile = async (req, res) => {
   const user = req.user; // User is attached to the request object by the auth middleware
   if (!user) {
       return res.status(404).json({ message: 'User not found' });
   }    
   else {
       res.status(200).json({
           fullname: user.fullname,
           email: user.email,
           socketId: user.socketId
       });
   }
}

module.exports.logOutUser=async(req,res)=>{
    res.clearCookie('token');
    const token=req.cookies.token || req.headers.authorization.split(' ')[1];

     const alreadyBlacklisted = await blacklistTokenModel.findOne({ token });
    if (!alreadyBlacklisted) {
        await blacklistTokenModel.create({ token });
    }

    // await blacklistTokenModel.create({token});
    res.status(200).json({message:"LogOut"})

}