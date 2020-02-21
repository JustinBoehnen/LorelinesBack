/** @format */

const express = require('express');
const router = express.Router();
const status = require('http-status-codes');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const User = require('../models/user.model');
const Loreline = require('../models/loreline.model');

// <<<<   api/users   >>>>

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

      user.save(err => {
        if (!err) res.send(User.generateJwt(user));
        else {
          res.status(status.CONFLICT).send(['failed to save user']);
          console.log(err);
        }
      });
    } else {
      res.status(status.CONFLICT).send(['failed to hash password']);
    }
  });
});

/**
 * Purpose: Adds a new loreline to a user
 * Full path: /api/users/:userid/lorelines
 * req: userid: ObjectId of user to add loreline to
 *      name: String name of loreline being added
 * res: lorelineId: ObjectId of new loreline
 */
router.post('/:userid/lorelines', (req, res) => {
  var loreline = new Loreline({
    name: req.body.name,
    modified: Date.now(),
    timelineData: [],
    customEntities: []
  });

  loreline.save(err => {
    if (!err) {
      User.findByIdAndUpdate(
        req.params.userid,
        { $push: { lorelines: loreline.id } },
        (err, user) => {
          if (!err && user != null) res.status(status.OK).send(loreline.id);
          else res.status(status.NOT_FOUND).send('user not found');
        }
      );
    } else res.status(status.CONFLICT).send('faild to save loreline');
  });
});

/**
 * Purpose: Fetches a loreline
 * Full path: /api/users/:userid/lorelines/:lorelineid
 * req: :userid: ObjectId of user
 *      :lorelineid: ObjectId of loreline to fetch
 * res: Loreline object with populated children
 */
router.get('/:userid/lorelines/:lorelineid', (req, res) => {
  var options = { path: 'customEntities.instances', model: 'EntityInstance' };

  Loreline.findById(req.params.lorelineid)
    .populate('timelineData')
    .populate({
      path: 'customEntities',
      populate: {
        path: 'instances',
        model: 'EntityInstance'
      }
    })
    .exec((err, loreline) => {
      if (!err && loreline != null) res.status(status.OK).send(loreline);
      else res.status(status.NOT_FOUND).send('loreline not found');
    });
});

// NOT YET DOCUMENTED: RETURNS SORTED ARRAY A USERS LORELINES
router.get('/:userid/lorelines', (req, res) => {
  User.findById(req.params.userid, (err, user) => {
    if (!err && user != null) {
      Loreline.find({ _id: { $in: user.lorelines } })
        .sort({ modified: 'descending' })
        .select('_id name modified')
        .exec((err, lorelines) => {
          if (!err && lorelines != null) res.status(status.OK).send(lorelines);
          else res.status(status.NOT_FOUND).send('lorelines not found');
        });
    } else res.status(status.NOT_FOUND).send('user not found');
  });
});

router.delete('/:userid/lorelines/:lorelineid', (req, res) => {
  User.findByIdAndUpdate(
    req.params.userid,
    {
      $pull: { lorelines: req.params.lorelineid }
    },
    (err, user) => {
      if (!err && user != null)
        Loreline.findByIdAndDelete(req.params.lorelineid, (err, loreline) => {
          if (!err && loreline != null) res.sendStatus(status.OK);
          else res.status(status.NOT_FOUND).send('loreline not found');
        });
      else res.status(status.NOT_FOUND).send('user not found');
    }
  );
});

/**
 * Purpose: Logs a user into the site
 * Full path: /api/users/token
 * req: email: String representing user email (unqiue)
 *      password: String (plaintext)
 * res: status
 */
router.post('/token', (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!err && user !== null) {
      bcrypt.compare(req.body.password, user.password, (err, result) => {
        if (result) res.status(status.OK).send(User.generateJwt(user));
        else res.status(status.UNAUTHORIZED).send('password does not match');
      });
    } else {
      res.status(status.NOT_FOUND).send('user not found');
    }
  });
});

/**
 * Purpose: Updates the users token with a
 *          new token if they enter the site
 *          before the old one expires ((Default 1 week))
 * Full path: /api/users/token
 * req: old/current token
 * res: new token
 */
router.put('/token', (req, res) => {
  jwt.verify(req.body.token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      res.status(status.UNAUTHORIZED).send('failed to verify token');
    } else if (Date.now() < decoded.exp * 1000) {
      User.findOne({ id: decoded.id }, (err, user) => {
        if (!err && user != null) {
          res.status(status.CREATED).send(User.generateJwt(user));
        } else {
          res.status(status.NOT_FOUND).send('user not found');
        }
      });
    } else {
      res.status(status.UNAUTHORIZED).send('token expired');
    }
  });
});

module.exports = router;
