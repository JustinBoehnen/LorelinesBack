const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

//Defaults for user accounts
var userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  saltSecret: String,
  lorelineIds: [mongoose.schema.Types.ObjectId]
})

userSchema.statics.generateJwt = user => {
  return jwt.sign(
    { name: user.name, email: user.email },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXP
    }
  )
}

module.exports = mongoose.model('User', userSchema)
