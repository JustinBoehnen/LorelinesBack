/** @format */

const mongoose = require('mongoose')
const User = require('./user.model')

var Event = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'event title is required']
  },
  subheader: {
    type: String,
    required: [true, 'event subheader is required']
  },
  description: {
    type: String,
    required: [true, 'event description is required']
  },
  _id: false
})

var TimelineSchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: [true, 'owner id is required']
  },
  events: {
    type: [Event]
  }
})

module.exports = mongoose.model('Timeline', TimelineSchema)
