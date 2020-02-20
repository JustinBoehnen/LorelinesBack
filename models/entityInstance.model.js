/** @format */

const mongoose = require('mongoose')

var FieldContent = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['EVENT_NODE', 'BRANCH_NODE', 'WARP_NODE']
  },
  name: { type: String, required: true },
  content: [],
  _id: false
})

var EntityInstanceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  content: { type: [FieldContent], required: true }
})

module.exports = mongoose.model('EntityInstance', EntityInstanceSchema)
