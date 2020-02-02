const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
/*********************************************
 * Purpose: Provide a "template" for how each node is going to be stored within a timeline.
 * Required: The loreline Id of what loreline the node belongs to, positioning coordinates for each node, and a node id
 ********************************************/
var timeLineNode = new mongoose.schema({
  loreline: {
    type: Number,
    required: "Has to belong to a loreLine"
  },
  nodeID: {
    type: Number,
    required: "Must have an node ID"
  },
  positionX: {
    type: Number,
    required: "Has to be placed"
  },
  positionY: {
    type: Number,
    required: "Has to be placed"
  },
  contents: {
    type: String
  },
  connectionsIN: {
    //Id's of each node thats connecting into this node. **May not be necessary, not sure yet
    type: [nodeID]
  },
  connectionsOUT: {
    //Id's of each node that this node is connecting to.
    type: [nodeID]
  }
});
module.exports = mongoose.model("timelineNode", timeLineNode);
