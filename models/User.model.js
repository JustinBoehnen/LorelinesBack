/** @format */

const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

mongoose.set('useCreateIndex', true);

//Defaults for user accounts
var userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  saltSecret: String,
  lorelines: {
    type: [{ lorelineId: mongoose.Types.ObjectId, name: String }],
    _id: false
  }
});

userSchema.statics.generateJwt = user => {
  return jwt.sign(
    { name: user.name, email: user.email },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXP
    }
  );
};

module.exports = mongoose.model('User', userSchema);
