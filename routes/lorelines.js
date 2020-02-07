const express = require('express')
const router = express.Router()
const status = require('http-status-codes')
const Loreline = require('../models/loreline.model')
const jwt = require('jsonwebtoken')

// These routes are in: api/lorelines

/**
 * Purpose: Adds a new loreline
 * Full path: /api/lorelines/
 * req: email and plaintext password
 * res: token
 */
router.post('/', (req, res) => {
  bcrypt.hash(req.body.password, 10, (err, hash) => {
    if (!err) {
      var user = new User({
        id: req.body.id,
        name: req.body.name,
        email: req.body.email,
        password: hash
      })

      user.save((err, doc) => {
        if (!err) res.send(User.generateJwt(user))
        else {
          res
            .status(status.CONFLICT)
            .send(['ERR: user with that email already exists'])
          console.log(err)
        }
      })
    } else {
      console.log(err)
    }
  })
})

/**
 * Purpose: Update custom entities of a loreline
 * Full path: /api/lorelines/:lorelineid/customentities
 * req: email and plaintext password
 * res: token
 */
router.put('/:lorelineid/customentities', (req, res) => {
  bcrypt.hash(req.body.password, 10, (err, hash) => {
    if (!err) {
      var user = new User({
        id: req.body.id,
        name: req.body.name,
        email: req.body.email,
        password: hash
      })

      user.save((err, doc) => {
        if (!err) res.send(User.generateJwt(user))
        else {
          res
            .status(status.CONFLICT)
            .send(['ERR: user with that email already exists'])
          console.log(err)
        }
      })
    } else {
      console.log(err)
    }
  })
})

/**
 * Purpose: Update timeline
 * Full path: /api/lorelines/:lorelineid/timeline
 * req: email and plaintext password
 * res: token
 */
router.put('/:lorelineid/timeline', (req, res) => {
  bcrypt.hash(req.body.password, 10, (err, hash) => {
    if (!err) {
      var user = new User({
        id: req.body.id,
        name: req.body.name,
        email: req.body.email,
        password: hash
      })

      user.save((err, doc) => {
        if (!err) res.send(User.generateJwt(user))
        else {
          res
            .status(status.CONFLICT)
            .send(['ERR: user with that email already exists'])
          console.log(err)
        }
      })
    } else {
      console.log(err)
    }
  })
})

/**
 * Purpose: Updates the users token with a
 *          newer token if they enter the site
 *          before the old one expires
 * Full path: /api/users/token
 * req: token
 * res: new token
 */
router.put('/token', (req, res) => {
  jwt.verify(req.body.token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      res.sendStatus(status.UNAUTHORIZED)
    } else if (Date.now() < decoded.exp * 1000) {
      User.findOne({ id: decoded.id }, (err, user) => {
        if (!err) {
          res.status(status.CREATED).send(User.generateJwt(user))
        } else {
          res.sendStatus(status.NOT_FOUND)
        }
      })
    } else {
      res.sendStatus(status.UNAUTHORIZED)
    }
  })
})

module.exports = router
