/** @format */

const mongoose = require('mongoose')

var FieldType = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['EVENT_NODE', 'BRANCH_NODE', 'WARP_NODE']
  },
  name: { type: String, required: true },
  _id: false
})

var CustomEntitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  color: {
    type: String,
    required: true,
    validate: function(v) {
      return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(v)
    }
  },
  content: { type: [FieldType], required: false },
  instances: [{ type: mongoose.Types.ObjectId, ref: 'EntityInstance' }] //entityInstance
})

module.exports = mongoose.model('CustomEntity', CustomEntitySchema)
