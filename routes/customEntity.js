// const express = require("express");
// const router = express.Router();
// const customEntity = require("../models/customEntity.model");
// /**
//  * Purpose: Adds a new person entity instance
//  * Full path: /test/placeEntity
//  * req: placeEntity fields
//  * res: token
//  */
// router.route("/").get((req, res) => {
//   customEntity
//     .find()
//     .then(customentities => res.json(customentities))
//     .catch(err => res.status(400).json("Error: " + err));
// });

// router.route("/addCustomEntity").post((req, res) => {
//   const loreline = req.body.loreline;
//   const name = req.body.name;
//   const jsondescription = req.body.jsondescription;

//   const newCustomEntity = new customEntity({
//     loreline,
//     name,
//     jsondescription
//   });

//   newCustomEntity
//     .save()
//     .then(() => res.json("Custom entity added!"))
//     .catch(err => res.status(400).json("Error: " + err));
// });

// module.exports = router;
