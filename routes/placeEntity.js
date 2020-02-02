const express = require("express");
const router = express.Router();
const placeEntity = require("../models/placeEntity.model");
/**
 * Purpose: Adds a new person entity instance
 * Full path: /api/personEntity/addPersonEntity
 * req: placeEntity fields
 * res: token
 */
router.route("/").get((req, res) => {
  placeEntity
    .find({ type: "place" })
    .then(entityinstances => res.json(entityinstances))
    .catch(err => res.status(400).json("Error: " + err));
});

router.route("/addPlaceEntity").post((req, res) => {
  const loreline = req.body.loreline;
  const type = req.body.type;
  const name = req.body.name;
  const color = req.body.color;
  const uuid = req.body.uuid;
  const location = req.body.location;
  const purpose = req.body.purpose;

  const newPlaceEntity = new placeEntity({
    loreline,
    type,
    name,
    color,
    uuid,
    location,
    purpose
  });

  newPlaceEntity
    .save()
    .then(() => res.json("Place added!"))
    .catch(err => res.status(400).json("Error: " + err));
});

module.exports = router;
