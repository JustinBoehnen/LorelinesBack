const express = require("express");
const router = express.Router();
const status = require("http-status-codes");
const Directory = require("../models/Directory.model");

/**
 * Purpose: Getter to return a users directory
 */

router.get('/', async (req, res) => {
  const directory = await Directory.find({});
  try {
    res.send(directory);
  } catch(err) {
    res.status(500).send(err);
  }
});
router.get('/:id', async (req, res) => {
  try {
    const directory = await Directory.findById(req.params.id);
    if(!directory) res.status(404).send("No collection found");
    res.status(200).send(directory);
  } catch(err) {
    res.status(500).send(err);
  }
});
router.post('/', async (req, res) => {
  const directory = new Directory(req.body);
  try {
    await directory.save();
    res.send(directory);
  } catch(err) {
    res.status(500).send(err);
  }
})
module.exports = router