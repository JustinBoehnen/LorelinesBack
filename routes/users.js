const express = require('express')
const router = express.Router()
const status = require('http-status-codes')
const User = require('../models/User.model')
const jwt = require('jsonwebtoken')

// These routes are in: api/user
// TODO: compare passwords to encrypted passwords

/**
 * Purpose: Adds a new user to the DB
 * Full path: /api/user/
 * req: email and encrypted password
 * res: token
 */
router.post('/', (req, res) => {
  var user = new User({
    id: req.body.id,
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
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
})

/**
 * Purpose: Logs a user into the site
 * Full path: /api/user/token
 * req: email and encrypted password
 * res: token
 */
router.post('/token', (req, res) => {
  User.findOne(
    { email: req.body.email, password: req.body.password },
    (err, user) => {
      if (!err && user !== null) {
        if (user.password === req.body.password) {
          res.status(status.OK).send(User.generateJwt(user))
        }
      } else {
        res.sendStatus(status.NOT_FOUND)
      }
    }
  )
})

/**
 * Purpose: Updates the users token with a
 *          newer token if they enter the site
 *          before the old one expires
 * Full path: /api/user/token
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
