const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

//Person static entity schema
var personEntity = new mongoose.Schema({
  loreline: {
    type: BigInt
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
    type: BigInt,
    default: Math.random() * 1000000
  },
  age: {
    type: BigInt
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

module.exports = mongoose.model("personEntity", personEntity);
