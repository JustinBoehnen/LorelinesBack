/** @format */

const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Loreline = require('./loreline.model');

mongoose.set('useCreateIndex', true);

var UserSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'user name is required'] },
  email: {
    type: String,
    required: [true, 'user email is required'],
    unique: true,
    validate: {
      validator: function(v) {
        return /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/.test(
          v
        );
      },
      message: email => `${email.value} is an invalid email`
    }
  },
  password: { type: String, required: [true, 'user password is required'] },
  lorelines: [{ type: mongoose.Types.ObjectId, ref: 'Loreline' }]
});

// Removes Lorelines
UserSchema.pre('remove', next => {
  Loreline.remove({ _id: { $in: this.lorelines } });
  next();
});

UserSchema.statics.generateJwt = user => {
  return jwt.sign(
    { id: user._id, name: user.name, email: user.email },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXP
    }
  );
};

module.exports = mongoose.model('User', UserSchema);
