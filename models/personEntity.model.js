const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

//Person static entity schema
var personEntity = new mongoose.Schema({
  loreline: {
    type: Number
  },
  type: {
    type: String,
    default: "person"
  },
  name: {
    type: String,
    required: "name can't be empty"
  },
  color: {
    type: String,
    default: "purple"
  },
  uuid: {
    type: Number,
    default: Math.random() * 1000000
  },
  age: {
    type: Number
  },
  sex: {
    type: String
  },
  height: {
    type: String
  },
  haircolor: {
    type: String
  },
  eyecolor: {
    type: String
  },
  skincolor: {
    type: String
  },
  definingtrait: {
    type: String
  },
  personality: {
    type: String
  }
});

module.exports = mongoose.model("entityinstances", personEntity);
