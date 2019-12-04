const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//Defaults for user accounts
var userSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: "Name can't be empty"
    },
    Email: {
        type : String,
        required: "Email can't be empty",
        unique: true
    },
    Password:{
        type: String,
        required: "Password can't be empty",
        minlength: [4, 'Password must be atleast 4 characters long']
    },
    saltSecret: String
});

// Custom validation for email
userSchema.path('Email').validate((val)=> {
    emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return emailRegex.test(val);
}, "Invalid Email.");


//Encrypt/Salt Password
userSchema.pre('save', function(next){
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(this.Password, salt, (err, hash) => {
            this.Password = hash;
            this.saltSecret = salt;
            next();
        });
    });
});

//comparing encrpted and plain text password
userSchema.methods.verifyPassword = function(Password) {
    return bcrypt.compareSync(Password, this.Password);
}

userSchema.methods.generateJwt = function () {
    return jwt.sign({ _id: this._id},
        process.env.JWT_SECRET,
    {
       expiresIn: process.env.JWT_EXP
    });
}

mongoose.model('UserAccounts', userSchema);