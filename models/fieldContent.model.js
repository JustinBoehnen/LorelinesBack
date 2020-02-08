/** @format */

const mongoose = require('mongoose');

//custom entity schema
var fieldContentSchema = new mongoose.Schema({
  type: Number,
  name: String,
  content: []
});

module.exports = mongoose.model('fieldContent', fieldContentSchema);
