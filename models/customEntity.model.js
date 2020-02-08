/** @format */

const mongoose = require('mongoose');
const fieldType = require('./fieldType.model');
const entityInstance = require('./entityInstance.model');

var customEntitySchema = new mongoose.Schema({
  name: String,
  color: String,
  content: [], //fieldType
  instances: [] //entityInstance
});

module.exports = mongoose.model('customEntity', customEntitySchema);
