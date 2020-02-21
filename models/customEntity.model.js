/** @format */

const mongoose = require('mongoose');
const EntityInstance = require('./entityInstance.model');

var FieldType = new mongoose.Schema({
  type: {
    type: String,
    required: [true, 'field type is required'],
    enum: ['EVENT_NODE', 'BRANCH_NODE', 'WARP_NODE']
  },
  name: { type: String, required: [true, 'field name is required'] },
  _id: false
});

var CustomEntitySchema = new mongoose.Schema({
  name: { type: String, required: [true, 'entity name is required'] },
  color: {
    type: String,
    required: [true, 'entity color is required'],
    validate: {
      validator: function(v) {
        return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(v);
      },
      message: color => `${color} is an invalid color`
    }
  },
  content: {
    type: [FieldType],
    required: [true, 'entity content is required']
  },
  instances: [{ type: mongoose.Types.ObjectId, ref: 'EntityInstance' }] //entityInstance
});

// Removes Instances
CustomEntitySchema.pre('remove', next => {
  EntityInstance.remove({ _id: { $in: this.instances } });
  next();
});

module.exports = mongoose.model('CustomEntity', CustomEntitySchema);
