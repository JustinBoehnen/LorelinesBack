const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const status = require("http-status-codes");
//const Directory = require("../models/directory.model");

/**
 * Purpose: Getter to return a users directory
 */
if(mongoose.Types.ObjectId.isValid(lorelineId.id)) {
router.findById({})
.then((data)=>{
    console.log(data);
})
.catch((err)=>{
    console.log(err);
});
} else {
    console.log("Please provide correct loreline id");
}