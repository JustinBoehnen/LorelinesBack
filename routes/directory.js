// const express = require("express");
// const router = express.Router();
// const status = require("http-status-codes");
// const Directory = require("../models/Directory.model");

// //Gets all directories in database
// router.get('/', async (req, res) => {
//   const directory = await Directory.find({});
//   try {
//     res.send(directory);
//   } catch(err) {
//     res.status(500).send(err);
//   }
// });
// //Gets one directory by id in database
// router.get('/:id', async (req, res) => {
//   try {
//     const directory = await Directory.findById(req.params.id);
//     if(!directory) res.status(404).send("No collection found");
//     res.status(200).send(directory);
//   } catch(err) {
//     res.status(500).send(err);
//   }
// });
// //Finds one directory and updates by id
// router.patch('/update/:id', async (req, res) => {
//   try {
//     await Directory.findByIdAndUpdate(req.params.id, req.body);
//     await Directory.save();
//     res.send(directory);
//   } catch(err) {
//     res.status(500).send(err);
//   }
// });
// //Adds a new directory
// router.post('/', async (req, res) => {
//   const directory = new Directory(req.body);
//   try {
//     await directory.save();
//     res.send(directory);
//   } catch(err) {
//     res.status(500).send(err);
//   }
// });
// //Deletes a directory
// router.delete('/delete/:id', async (req, res) => {
//   try {
//     const directory = await Directory.findByIdAndDelete(req.params.id);
//     if(!directory) res.status(404).send("No directory found");
//     res.status(200).send();
//   } catch(err) {
//     res.status(500).send(err);
//   }
// });
// module.exports = router;
