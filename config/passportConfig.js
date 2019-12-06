const passport = require('passport')
const localStrategy = require('passport-local').Strategy
const mongoose = require('mongoose')

var User = require('../models/User.model')

passport.use(
  new localStrategy(
    { usernameField: 'Email', passwordField: 'Password' },
    (username, password, done) => {
      User.findOne({ Email: username }, (err, User) => {
        if (err) return done(err)
        else if (!User)
          return done(null, false, { message: 'Email is not registered' })
        else if (!User.verifyPassword(password))
          return done(null, false, { message: 'Wrong Password.' })
        else return done(null, User)
      })
    }
  )
)
