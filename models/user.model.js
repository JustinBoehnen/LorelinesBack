/** @format */

const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const Loreline = require('./loreline.model')

mongoose.set('useCreateIndex', true)

var UserSchema = new mongoose.Schema({
  name: { type: String, require: true },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: function(v) {
      return /^([a-zA-Z0-9_-.]+)@([a-zA-Z0-9_-.]+).([a-zA-Z]{2,5})$/.test(v)
    }
  },
  password: { type: String, require: true },
  lorelines: [{ type: mongoose.Types.ObjectId, ref: 'Loreline' }]
})

// Removes Lorelines
UserSchema.pre('remove', next => {
  Loreline.remove({ _id: { $in: this.lorelines } })
  next()
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
