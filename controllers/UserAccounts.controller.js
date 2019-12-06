// const mongoose = require('mongoose')
// const passport = require('passport')
// const _ = require('lodash')

// const User = mongoose.model('UserAccounts')

// module.exports.register = (req, res, next) => {
//   console.log('in register function')
//   var user = new User()
//   user.Name = req.body.Name
//   user.Email = req.body.Email
//   user.Password = req.body.Password
//   user.save((err, doc) => {
//     if (!err) res.send(doc)
//     else {
//       if (err.code === 11000) {
//         res.status(442).send(['Duplicate email adress found'])
//       } else {
//         next(err)
//       }
//       console.log(err)
//     }
//   })
// }

// module.exports.authenticate = (req, res, next) => {
//   //call for passport authentication
//   passport.authenticate('local', (err, User, info) => {
//     // error from passport middleware
//     console.log('in authenticate function')
//     if (err) return res.status(400).json(err)
//     else if (User) res.status(200).json({ token: User.generateJwt() })
//     else return res.status(404).json(info)
//   })(req, res)
// }

// module.exports.userProfile = (req, res, next) => {
//   User.findOne({ _id: req._id }, (err, user) => {
//     if (!user)
//       return res
//         .status(404)
//         .json({ status: false, message: 'User record not found' })
//     else
//       return res
//         .status(200)
//         .json({ status: true, user: _.pick(user, ['Name', 'Email']) })
//   })
// }
