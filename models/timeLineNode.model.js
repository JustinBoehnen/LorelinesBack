/** @format */

const mongoose = require('mongoose');

var pos = new mongoose.Schema({
  x: Number,
  y: Number
});

var TimelineNode = new mongoose.Schema({
  type: Number,
  position: pos,
  content: String
});

module.exports = mongoose.model('TimelineNode', EntityInstanceSchema);
