/** @format */

const mongoose = require("mongoose");
const User = require('./user.model')

//var pos = new mongoose.Schema({
//  x: Number,
//  y: Number,
//  required: [true, "position is required"]
//});

//var Type = new mongoose.Schema({
 // type:{
 //   type: String,
 //   required: [true, "type is required"],
 //   enum: [
   //   'EVENT_NODE',
  //    'BRANCH_NODE', 
  //    'WARP_NODE'
  //  ],
 // }
//})

var TimelineNode = new mongoose.Schema({
  type: {
    type: String,
    required: [true, "type is required"],
    enum: [
      'EVENT_NODE',
      'BRANCH_NODE', 
      'WARP_NODE',
    ],
  },
  position:{ 
    x: {
      type: Number 
    },
    y: { 
      type: Number
    },
    //required: [true, "position is required"],
  },
  content:{ 
    type: String
  },
  ownerId: { type: mongoose.Types.ObjectId, ref: 'User', required: [true, 'owner id is required'] },
});

module.exports = mongoose.model("TimelineNode", TimelineNode);
