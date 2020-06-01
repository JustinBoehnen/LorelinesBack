/** @format */

const mongoose = require('mongoose')
const User = require('./user.model')

var FieldContent = new mongoose.Schema({
	type: {
		type: String,
		required: [true, 'field type is required'],
		enum: [
			'TEXT_FIELD',
			'NUMBER_FIELD',
			'LIST_FIELD',
			'REFERENCE_FIELD',
			'CHECKBOX_FIELD',
			'RADIOLIST_FIELD',
			'IMAGE_FIELD',
			'SECTION_HEADER',
			'SECTION_DIVIDER',
		],
	},
	name: { type: String, required: [true, 'field name is required'] },
	content: [],
	value: { type: String, required: false }, // used for radiolist
	_id: false,
})

// TEXT_FIELD       : A BLOCK OF TEXT (EX: BIO, NAME)
// NUMBER_FIELD		: A NUMBER (EX: AGE)
// LIST_FIELD       : A LIST OF OTHER INSTANCES (EX: FRIENDS)
// REFERENCE_FIELD  : A REFERENCE TO A SINGLE INSTANCE (EX: MOM)
// CHECKBOX_FIELD   : A BOOLEAN CHECKBOX (EX: MARRIED)
// RADIOLIST_FIELD  : A LIST OF RADIOS WHERE ONLY ONE CAN BE TRUE (EX: CLASS)
// IMAGE FIELD      : AN IMAGE
// SECTION_HEADER   : A LARGE FONT TEXT HEADER
// SECTION_DIVIDER  : A LINE REPRESENTING A SECTION BREAK

var EntityInstanceSchema = new mongoose.Schema({
	name: { type: String, required: [true, 'instance name is required'] },
	content: {
		type: [FieldContent],
		required: [true, 'instance content is required'],
	},
	ownerId: {
		type: mongoose.Types.ObjectId,
		ref: 'User',
		required: [true, 'owner id is required'],
	},
})

EntityInstanceSchema.pre('remove', { document: true }, (next) => {
	User.updateOne({ _id: this.ownerId }, { $inc: { 'limits.instances.current': -1 } }) // remove one instance
	next()
})

module.exports = mongoose.model('EntityInstance', EntityInstanceSchema)
