/** @format */

const mongoose = require('mongoose')
const CustomEntity = require('./customEntity.model')

var LorelineSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'loreline name is required'] },
  image: String,
  modified: {
    type: Date,
    required: [true, 'loreline modified (date) is required']
  },
  timelineData: [],
  customEntities: [{ type: mongoose.Types.ObjectId, ref: 'CustomEntity' }] //customEntity
})

// Removes Custom Entities
LorelineSchema.pre('remove', next => {
  CustomEntity.remove({ _id: { $in: this.customEntities } })
  next()
})

module.exports = mongoose.model('Loreline', LorelineSchema)
