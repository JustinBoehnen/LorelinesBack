/** @format */

const mongoose = require('mongoose')
const EntityInstance = require('./entityInstance.model')
const User = require('./user.model')

var FieldType = new mongoose.Schema({
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
	content: [], // used for radio lists
	_id: false,
})

// TEXT_FIELD       : A BLOCK OF TEXT (EX: BIO, NAME)
// NUMBER_FIELD     : A NUMBER (EX: AGE)
// LIST_FIELD       : A LIST OF OTHER INSTANCES (EX: FRIENDS)
// REFERENCE_FIELD  : A REFERENCE TO A SINGLE INSTANCE (EX: MOM)
// CHECKBOX_FIELD   : A BOOLEAN CHECKBOX (EX: MARRIED)
// RADIOLIST_FIELD  : A LIST OF RADIOS WHERE ONLY ONE CAN BE TRUE (EX: CLASS)
// IMAGE FIELD      : AN IMAGE
// SECTION_HEADER   : A LARGE FONT TEXT HEADER
// SECTION_DIVIDER  : A LINE REPRESENTING A SECTION BREAK

var CustomEntitySchema = new mongoose.Schema({
	name: { type: String, required: [true, 'entity name is required'] },
	color: {
		type: String,
		required: [true, 'entity color is required'],
		validate: {
			validator: function (v) {
				return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(v)
			},
			message: (color) => `${color} is an invalid color`,
		},
	},
	content: {
		type: [FieldType],
		required: [true, 'entity content is required'],
	},
	instances: [{ type: mongoose.Types.ObjectId, ref: 'EntityInstance' }],
	ownerId: { type: mongoose.Types.ObjectId, ref: 'User', required: [true, 'owner id is required'] },
})

// Removes Instances
CustomEntitySchema.pre('remove', (next) => {
	User.updateOne({ _id: this.ownerId }, { $inc: { 'limits.entities.count': -1 } })
	EntityInstance.remove({ _id: { $in: this.instances } })
	next()
})

module.exports = mongoose.model('CustomEntity', CustomEntitySchema)
