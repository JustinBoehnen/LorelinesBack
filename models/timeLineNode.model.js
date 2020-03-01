/** @format */

const mongoose = require('mongoose');

var pos = new mongoose.Schema({
  x: Number,
  y: Number
});
//enum: ['EVENT_NODE', 'BRANCH_NODE', 'WARP_NODE']

var TimelineNode = new mongoose.Schema({
  type: Number,
  position: pos,
  content: String
});

module.exports = mongoose.model('TimelineNode', EntityInstanceSchema);
