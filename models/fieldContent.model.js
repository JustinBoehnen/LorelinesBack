const mongoose = require('mongoose')

//custom entity schema
var fieldContentSchema = new mongoose.Schema({
  type: Number,
  name: String,
  content: String
})

module.exports = mongoose.model('fieldContent', fieldContentSchema)
