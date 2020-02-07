const mongoose = require('mongoose')
const fieldContent = require('./fieldContent.model.js')

//custom entity schema
var entityInstanceSchema = new mongoose.Schema({
  name: String,
  color: Number,
  content: [fieldContent]
})

module.exports = mongoose.model('entityInstance', entityInstanceSchema)
