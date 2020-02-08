/** @format */

const mongoose = require('mongoose');

var lorelineSchema = new mongoose.Schema({
  name: String,
  timelineData: [],
  customEntities: [] //customEntity
});

module.exports = mongoose.model('loreline', lorelineSchema);
