const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

//Place static entity schema
var placeEntity = new mongoose.Schema({
  loreline: {
    type: Number
  },
  type: {
    type: String,
    default: "place"
  },
  name: {
    type: String,
    required: "name can't be empty"
  },
  color: {
    type: String,
    default: "blue"
  },
  uuid: {
    type: Number,
    default: Math.random() * 1000000
  },
  location: {
    type: String
  },
  purpose: {
    type: String
  }
});

module.exports = mongoose.model("placeEntity", placeEntity, "entityinstances");
