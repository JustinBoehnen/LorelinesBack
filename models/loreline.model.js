// const mongoose = require("mongoose");
// const jwt = require("jsonwebtoken");
// const node = require("./timeLineNode.model");
// /*********************************************
//  * Purpose: Provide a "template" for how each loreline is going to be stored.
//  * Required: The user Id of the author of the loreline
//  ********************************************/
// var loreLine = new mongoose.schema({
//   UserId: {
//     type: bigInt,
//     required: "Has to belong to an account"
//   },
//   nodes: {
//     //an array of the timeLineNode schemas, which (should) result in an array of all the nodes in a single timeline.
//     type: [timeLineNode]
//   },
//   entities: {
//     type: []
//   }
// });

// module.exports = mongoose.model("loreLine", loreLine);
