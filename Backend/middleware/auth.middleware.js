const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports.authenticateUser = async (req, res, next) => {

    // tokenn humo do jagh se milega , ek toh cokkies se ek toh header se
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    const isBlacklist= await userModel.findOne({token:token});
    if(isBlacklist)
    {
        return res.json({messaage:"Unauthorized"})
    }
    console.log('AUTH HEADER:', req.headers.authorization);
    console.log('COOKIE:', req.cookies);

    if(!token){
        return res.status(401).json({"message":"Unauthorized access"});
    }
  
    try {
        const decoded=jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded._id);
        req.user = user; // Attach user to request object
        next(); // Call the next middleware or route handler

    } catch (error) {
        res.status(401).json({"message":"Unauthorized access"});
    }
}