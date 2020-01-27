const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const status = require("http-status-codes");
const Directory = require("../models/Directory.model");

/**
 * Purpose: Getter to return a users directory
 */
if(mongoose.Types.ObjectId.isValid(lorelineId)) {
router.findById({lorelineId})
.then((data)=>{
    console.log(data);
})
.catch((err)=>{
    console.log(err);
});
} else {
    console.log("Not a correct loreline id");
}