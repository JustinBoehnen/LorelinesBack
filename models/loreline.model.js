/** @format */

const mongoose = require('mongoose')
const CustomEntity = require('./customEntity.model')
const User = require('./user.model')

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

LorelineSchema.pre('save', (next) => {
	User.findByIdAndUpdate(this.ownerId, { $inc: { 'limits.lorelines.count': 1 } })
	next()
})

// Removes Custom Entities
LorelineSchema.pre('remove', (next) => {
	User.findByIdAndUpdate(this.ownerId, { $inc: { 'limits.lorelines.count': -1 } })
	CustomEntity.remove({ _id: { $in: this.customEntities } })
	next()
})

module.exports = mongoose.model('Loreline', LorelineSchema)
