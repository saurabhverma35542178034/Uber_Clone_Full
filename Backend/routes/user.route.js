const express= require('express');
const router= express.Router();
const {body, validationResult} = require('express-validator');
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.post('/register', [
    body('fullname.firstname').isLength({ min: 4 }).withMessage('First name must be at least 4 characters long'),
    body('email').isEmail().withMessage('Please enter a valid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),],
    userController.registerUser
);

router.post('/login', [
    body('email').isEmail().withMessage('Please enter a valid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
], userController.loginUser);

router.get('/profile', authMiddleware.authenticateUser,userController.getUserProfile);

router.get('/logout',authMiddleware.authenticateUser,userController.logOutUser)

module.exports = router;