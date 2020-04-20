/** @format */

process.on('unhandledRejection', function (err) {
	console.log(err)
})

const mongoose = require('mongoose')
const CustomEntity = require('./customEntity.model')

mongoose.set('useFindAndModify', false)

var LorelineSchema = new mongoose.Schema({
	name: { type: String, required: [true, 'loreline name is required'] },
	image: String,
	modified: {
		type: Date,
		required: [true, 'loreline modified (date) is required'],
	},
	timelineData: [],
	customEntities: [{ type: mongoose.Types.ObjectId, ref: 'CustomEntity' }],
	ownerId: { type: mongoose.Types.ObjectId, ref: 'User', required: [true, 'owner id is required'] },
})

// Removes Custom Entities
LorelineSchema.pre('remove', { document: true }, function (next) {
	CustomEntity.remove({ _id: { $in: this.customEntities } })
	next()
})

module.exports = mongoose.model('Loreline', LorelineSchema)
