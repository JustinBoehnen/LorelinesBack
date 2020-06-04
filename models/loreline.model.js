/** @format */

process.on('unhandledRejection', function(err) {
  console.log(err)
})

const mongoose = require('mongoose')
const CustomEntity = require('./customEntity.model')
const Timeline = require('./timeline.model')

mongoose.set('useFindAndModify', false)

var LorelineSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'loreline name is required'] },
  image: String,
  modified: {
    type: Date,
    required: [true, 'loreline modified (date) is required']
  },
  timelineId: {
    type: mongoose.Types.ObjectId,
    ref: 'Timeline',
    required: [true, 'timeline id is required']
  },
  customEntities: [{ type: mongoose.Types.ObjectId, ref: 'CustomEntity' }],
  ownerId: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: [true, 'owner id is required']
  },
  entityCount: { type: Number, default: 0 }
})

// Removes Custom Entities
LorelineSchema.pre('remove', { document: true }, function(next) {
  User.updateOne(
    { _id: this.ownerId },
    { $inc: { 'limits.lorelines.current': -1 } }
  )
  CustomEntity.remove({ _id: { $in: this.customEntities } })
  Timeline.remove({ _id: this.timelineId })
  next()
})

module.exports = mongoose.model('Loreline', LorelineSchema)
