const express = require('express')
const router = express.Router()
const status = require('http-status-codes')
const Loreline = require('../models/loreline.model')
const jwt = require('jsonwebtoken')

// These routes are in: api/lorelines

/**
 * Purpose: Adds a new loreline to the db
 * Full path: /api/lorelines/
 * req: email and plaintext password
 * res: id of loreline
 */
router.post('/', (req, res) => {
  var loreline = new Loreline({
    name: req.body.name,
    timelineData: null,
    customEntities: null
  })

  res.status(status.CREATED).send(loreline)
})

/**
 * Purpose: Retreives a loreline with all its data
 * Full path: /api/lorelines/:lorelineid
 * req: null
 * res: loreline with timeline and ce data
 */
router.get('/:lorelineid', (req, res) => {
  var lorelineid = request.params.lorelineid
  res.send('GET request to loreline with id: ' + lorelineid)
})

/**
 * Purpose: Update timeline and custom entity data
 * Full path: /api/lorelines/:lorelineid/
 * req: loreline with updated info
 * res: status
 */
router.put('/:lorelineid/', (req, res) => {
  var lorelineid = request.params.lorelineid
  res.send('PUT request to loreline with id: ' + lorelineid)
})
