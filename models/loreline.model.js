/** @format */

const mongoose = require('mongoose');

var LorelineSchema = new mongoose.Schema({
  name: String,
  timelineData: [],
  customEntities: [{ type: mongoose.Types.ObjectId, ref: 'CustomEntity' }] //customEntity
});

module.exports = mongoose.model('Loreline', LorelineSchema);
