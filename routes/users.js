/** @format */

const express = require('express');
const router = express.Router();
const status = require('http-status-codes');
const User = require('../models/user.model');
const Loreline = require('../models/loreline.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// These routes are in: api/user

/**
 * Purpose: Adds a new user to the DB
 * Full path: /api/users/
 * req: name: String
 *      email: String (unique)
 *      password: String
 * res: token
 */
router.post('/', (req, res) => {
  bcrypt.hash(req.body.password, 10, (err, hash) => {
    if (!err) {
      var user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hash
      });

      user.save((err, doc) => {
        if (!err) res.send(User.generateJwt(user));
        else {
          res
            .status(status.CONFLICT)
            .send(['A user with that email already exists!']);
          console.log(err);
        }
      });
    } else {
      console.log(err);
    }
  });
});

/**
 * Purpose: Adds a loreline to a user
 * Full path: /api/users/:userid/lorelines
 * req: lorelineId: ObjectId
 *      name: String
 * res: Error message for use on frontend
 */
router.post('/:userid/lorelines', (req, res) => {
  //if (Loreline.findById(req.body.lorelineId) != null) {
  User.findByIdAndUpdate(
    req.params.userid,
    {
      $push: {
        lorelines: { lorelineId: req.body.lorelineId, name: req.body.name }
      }
    },
    (err, result) => {
      if (!err) res.sendStatus(status.CREATED);
      else res.sendStatus(status.NOT_FOUND);
    }
  );
  //} else res.sendStatus(status.NOT_FOUND);
});

/**
 * Purpose: Logs a user into the site
 * Full path: /api/users/token
 * req: email: String
 *      password: String (plaintext)
 * res:
 */
router.post('/token', (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!err && user !== null) {
      bcrypt.compare(req.body.password, user.password, (err, result) => {
        if (result) res.status(status.OK).send(User.generateJwt(user));
        else res.sendStatus(status.UNAUTHORIZED);
      });
    } else {
      res.sendStatus(status.NOT_FOUND);
    }
  });
});

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
      res.sendStatus(status.UNAUTHORIZED);
    } else if (Date.now() < decoded.exp * 1000) {
      User.findOne({ id: decoded.id }, (err, user) => {
        if (!err) {
          res.status(status.CREATED).send(User.generateJwt(user));
        } else {
          res.sendStatus(status.NOT_FOUND);
        }
      });
    } else {
      res.sendStatus(status.UNAUTHORIZED);
    }
  });
});

module.exports = router;
