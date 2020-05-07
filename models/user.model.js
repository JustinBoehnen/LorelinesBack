/** @format */

const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Loreline = require("./loreline.model");

mongoose.set("useCreateIndex", true);

var UserSchema = new mongoose.Schema({
  name: { type: String, required: [true, "user name is required"] },
  email: {
    type: String,
    required: [true, "user email is required"],
    unique: true,
    validate: {
      validator: function (v) {
        return /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/.test(
          v
        );
      },
      message: (email) => `${email.value} is an invalid email`,
    },
  },
  password: { type: String, required: [true, "user password is required"] },
  securityQuestion: {
    type: String,
    required: [true, "user security question is required"],
  },
  securityPassword: {
    type: String,
    required: [true, "user security answer is required"],
  },
  lorelines: [{ type: mongoose.Types.ObjectId, ref: "Loreline" }],
  created: {
    type: Date,
    required: [true, "user creation (date) is required"],
  },
  limits: {
    instances: {
      current: { type: Number, required: true, default: 0 },
      maximum: { type: Number, required: true, default: 300 },
    },
    entities: {
      current: { type: Number, required: true, default: 0 },
      maximum: { type: Number, required: true, default: 70 },
    },
    lorelines: {
      current: { type: Number, required: true, default: 0 },
      maximum: { type: Number, required: true, default: 5 },
    },
  },
});

// Removes Lorelines
UserSchema.pre("remove", (next) => {
  Loreline.remove({ _id: { $in: this.lorelines } });
  next();
});

UserSchema.statics.generateJwt = (user) => {
  if (process.env.NODE_ENV !== "test") {
    return jwt.sign(
      {
        id: user._id,
        name: user.name,
        email: user.email,
        created: user.created,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXP,
      }
    );
  } else {
    return;
  }
};

module.exports = mongoose.model("User", UserSchema);
