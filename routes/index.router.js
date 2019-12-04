const express = require('express');
const passport = require('passport');
const router = express.Router();
const Status = require('http-status-codes')
const ctrlUser = require('../controllers/UserAccounts.controller');

const jwtHelper = require('../config/jwtHelper');

// Add a new user
router.route('/user/add').post((req, res) => {
    console.log("in register function");
    var user = new User();
    user.Name = req.body.Name;
    user.Email = req.body.Email;
    user.Password = req.body.Password;
    user.save((err, doc) => {
        if (!err)
            res.send(doc);
        else {
            if (err.code === 11000) {
                res.status(Status.CONFLICT).send(['User with that email already exists!']);
            }
            else {
                next(err);
            }
            console.log(err);
        }

    });
})

// Retreive user token
router.route('/user/auth').post((req, res) => {
    //call for passport authentication
    passport.authenticate('local', (err, User, info) => {
        // error from passport middleware
        console.log('in authenticate function');
        if (err)
            return res.status(Status.BAD_REQUEST).json(err);
        else if (User)
            res.status(Status.ACCEPTED).json({ 'token': User.generateJwt() });
        else
            return res.status(CStatus.ONFLICT).json(info);
    })(req, res);
})




//router.post('/register', ctrlUser.register);
//router.post('/authenticate', ctrlUser.authenticate);
//router.get('/userProfile', jwtHelper.verifyJwtToken, ctrlUser.userProfile);

module.exports = router;