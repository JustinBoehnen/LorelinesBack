/** @format */

const express = require('express');
const router = express.Router();
const status = require('http-status-codes');
const Loreline = require('../models/loreline.model');

// These routes are in: api/lorelines

/**
 * Purpose: Adds a new loreline to the db
 * Full path: /api/lorelines/
 * req: name: String
 * res: id of loreline
 *      (send to /:userid/lorelines)
 */
router.post('/', (req, res) => {
  var loreline = new Loreline({
    name: req.body.name,
    timelineData: [],
    customEntities: []
  });

  loreline.save((err, doc) => {
    if (!err) res.status(status.CREATED).send(loreline.id);
    else {
      res.sendStatus(status.CONFLICT);
      console.log(err);
    }
  });
});

/**
 * Purpose: Update timeline and custom entity data
 * Full path: /api/lorelines/:lorelineid
 * req: loreline with updated info
 * res: status
 */
router.put('/:lorelineid', (req, res) => {
  Loreline.findByIdAndUpdate(
    req.params.lorelineid,
    {
      $set: {
        customEntities: req.body.customEntities
      }
    },
    (err, result) => {
      if (!err) res.sendStatus(status.OK);
      else res.sendStatus(status.NOT_FOUND);
    }
  );
});

/**
 * Purpose: Retreives a loreline with all its data
 * Full path: /api/lorelines/:lorelineid
 * req: null
 * res: loreline with timeline and ce data
 */
router.get('/:lorelineid', (req, res) => {
  var lorelineid = request.params.lorelineid;
  res.send('PUT request to loreline with id: ' + lorelineid);
});

module.exports = router;
