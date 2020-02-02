const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

//custom entity schema
var customEntity = new mongoose.Schema({
  loreline: {
    type: Number,
    required: "custom entity needs a loreline"
  },
  name: {
    type: String,
    required: "custom entity needs a name"
  },
  JSONdescription: {
    type: String,
    required: "custom entity needs a description"
  }
});

module.exports = mongoose.model("customEntity", customEntity, "customEntities");
