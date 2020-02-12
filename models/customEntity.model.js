/** @format */

const mongoose = require('mongoose');

var FieldType = new mongoose.Schema({
  type: Number,
  name: String,
  _id: false
});

var CustomEntitySchema = new mongoose.Schema({
  name: String,
  color: String,
  content: [FieldType],
  instances: [{ type: mongoose.Types.ObjectId, ref: 'EntityInstance' }] //entityInstance
});

module.exports = mongoose.model('CustomEntity', CustomEntitySchema);
