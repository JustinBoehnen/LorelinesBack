const express = require("express");
const router = express.Router();
const status = require("http-status-codes");
const User = require("../models/personEntity.model");
const jwt = require("jsonwebtoken");

app.post("/addPersonEntity", (req, res) => {
  var myData = new personEntity(req.body);
  myData
    .save()
    .then(item => {
      res.send("item saved to database");
    })
    .catch(err => {
      res.status(400).send("unable to save to database");
    });
});
