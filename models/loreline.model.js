/** @format */

const mongoose = require('mongoose')

var LorelineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  modified: { type: Date, required: true },
  timelineData: [],
  customEntities: [{ type: mongoose.Types.ObjectId, ref: 'CustomEntity' }] //customEntity
})

module.exports = mongoose.model('Loreline', LorelineSchema)
