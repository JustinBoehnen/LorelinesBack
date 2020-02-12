/** @format */

const mongoose = require('mongoose');

var FieldContent = new mongoose.Schema({
  type: Number,
  name: String,
  content: [],
  _id: false
});

var EntityInstanceSchema = new mongoose.Schema({
  name: String,
  content: [FieldContent]
});

module.exports = mongoose.model('EntityInstance', EntityInstanceSchema);
