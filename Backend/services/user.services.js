const userModel = require('../models/user.model');


module.exports.createUser = async({firstname, lastname, email, password}) => {

    if (!firstname|| !email || !password) {
        throw new Error('All fields are required');
    }
    const user = new userModel({
        fullname: {
            firstname,
            lastname
        },
        email,
        password
    });
   
     return await user.save();
    // return await user.save()
    //     .then((user) => {
    //         return user;
    //     })
    //     .catch((error) => {
    //         throw new Error('Error creating user: ' + error.message);
    //     });
}