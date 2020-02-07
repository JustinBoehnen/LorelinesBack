const mongoose = require('mongoose')

var lorelineShema = new mongoose.Schema({
  timelineData: [],
  customEntities: []
})

module.exports = mongoose.model('loreline', lorelineShema)
