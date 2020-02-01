const express = require("express");
const router = express.Router();
const status = require("http-status-codes");
const personEntity = require("../models/personEntity.model");
const jwt = require("jsonwebtoken");
/**
 * Purpose: Adds a new person entity instance
 * Full path: /api/personEntity/addPersonEntity
 * req: personEntity fields
 * res: token
 */
router.route("/").get((req, res) => {
  personEntity
    .find()
    .then(personEntities => res.json(personEntities))
    .catch(err => res.status(400).json("Error: " + err));
});

router.route("/addPersonEntity").post((req, res) => {
  const loreline = req.body.loreline;
  const type = req.body.type;
  const color = req.body.color;
  const uuid = req.body.uuid;
  const age = req.body.age;
  const sex = req.body.sex;
  const height = req.body.height;
  const haircolor = req.body.haircolor;
  const eyecolor = req.body.eyecolor;
  const skincolor = req.body.skincolor;
  const definingtrait = req.body.definingtrait;
  const personality = req.body.personality;

  const newPersonEntity = new personEntity({
    loreline,
    type,
    color,
    uuid,
    age,
    sex,
    height,
    haircolor,
    eyecolor,
    skincolor,
    definingtrait,
    personality
  });

  newPersonEntity
    .save()
    .then(() => res.json("Person added!"))
    .catch(err => res.status(400).json("Error: " + err));
});

module.exports = router;
