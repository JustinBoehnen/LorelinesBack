const mongoose = require('mongoose')
const fieldType = require('./fieldType.model.js')

/*




*/
var customEntitySchema = new mongoose.Schema({
  name: String,
  color: Number,
  content: [fieldType],
  instances: []
})

module.exports = mongoose.model('customEntity', customEntitySchema)
