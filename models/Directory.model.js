const mongoose = require("mongoose");

var directorySchema = new mongoose.Schema({
    lorelineId: {
        type: String,
        unique: true
    },
    ceObject: {
        type: Object
    },
    instancesObject: {
        type: Object
    }
});