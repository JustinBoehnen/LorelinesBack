const mongoose = require('mongoose')

//custom entity schema
var fieldContentShema = new mongoose.Schema({
  type: Number,
  name: String,
  content: String
})

module.exports = mongoose.model('fieldContent', fieldContentShema)
