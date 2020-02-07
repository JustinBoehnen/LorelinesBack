const mongoose = require('mongoose')

//custom entity schema
var fieldTypeSchema = new mongoose.Schema({
  type: Number,
  name: String
})

module.exports = mongoose.model('fieldType', fieldTypeSchema)
