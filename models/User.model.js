const mongoose = require("mongoose");
//const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken");
const timeline = require("./loreline.model");

//Defaults for user accounts
var userSchema = new mongoose.Schema({
  id: {
    type: String,
    required: "id can't be empty",
    unique: true
  },
  name: {
    type: String,
    required: "name can't be empty"
  },
  email: {
    type: String,
    required: "email can't be empty",
    unique: true
  },
  password: {
    type: String,
    required: "password can't be empty",
    minlength: [8, "password must be at least 8 characters long"]
  },
  //Can't remember if we wanted to store the lorelines with each user account information or seperately, this seems like it'd work but we's end up with huge documents
  //If not, then this section can be deleted with no harm, since the loreline schema has a required User ID type.
  lorelines: {
    //an array of lorelines, which should in turn call the array of timeline nodes leading the the hiearchy thats desired??
    type: [loreline]
  },
  saltSecret: String
});

// // Custom validation for email
// userSchema.path('email').validate(val => {
//   emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
//   return emailRegex.test(val)
// }, 'Invalid Email.')

// //Encrypt/Salt Password before save
// userSchema.pre('save', next => {
//   bcrypt.genSalt(10, (err, salt) => {
//     bcrypt.hash(this.Password, salt, (err, hash) => {
//       this.Password = hash
//       this.saltSecret = salt
//       next()
//     })
//   })
// })

// //comparing encrpted and plain text password
// userSchema.methods.verifyPassword = Password => {
//   return bcrypt.compareSync(Password, this.Password)
// }

userSchema.statics.generateJwt = user => {
  return jwt.sign(
    { id: user.id, name: user.name, email: user.email },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXP
    }
  );
};

module.exports = mongoose.model("User", userSchema);
