/** @format */

const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

mongoose.set('useCreateIndex', true)

//Defaults for user accounts
var UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  saltSecret: String,
  lorelines: [{ type: mongoose.Types.ObjectId, ref: 'Loreline' }]
})

UserSchema.statics.generateJwt = user => {
  return jwt.sign(
    { id: user._id, name: user.name, email: user.email },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXP
    }
  )
}

module.exports = mongoose.model('User', UserSchema)
