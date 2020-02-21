/** @format */

const mongoose = require('mongoose');

var FieldContent = new mongoose.Schema({
  type: {
    type: String,
    required: [true, 'field type is required'],
    enum: ['EVENT_NODE', 'BRANCH_NODE', 'WARP_NODE']
  },
  name: { type: String, required: [true, 'field name is required'] },
  content: [],
  _id: false
});

var EntityInstanceSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'instance name is required'] },
  content: {
    type: [FieldContent],
    required: [true, 'instance content is required']
  }
});

module.exports = mongoose.model('EntityInstance', EntityInstanceSchema);
