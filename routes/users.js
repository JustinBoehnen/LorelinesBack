/** @format */

const express = require('express')
const router = express.Router()
const aws = require('aws-sdk')
const multerS3 = require('multer-s3')
const multer = require('multer')
const path = require('path')
const url = require('url')
const status = require('http-status-codes')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const User = require('../models/user.model')
const Loreline = require('../models/loreline.model')

const s3 = new aws.S3({
	accessKeyId: process.env.S3ACCESS,
	secretAccessKey: process.env.S3SECRET,
	Bucket: process.env.S3BUCKET,
})

/**
 * Single Upload
 */
const lorelineImageUpload = multer({
	storage: multerS3({
		s3: s3,
		bucket: 'lorelines-image-library',
		acl: 'public-read',
		key: function (req, file, cb) {
			cb(
				null,
				path.basename(file.originalname, path.extname(file.originalname)) +
					'-' +
					Date.now() +
					path.extname(file.originalname)
			)
		},
	}),
	limits: { fileSize: 2000000 }, // In bytes: 2000000 bytes = 2 MB
	fileFilter: function (req, file, cb) {
		checkFileType(file, cb)
	},
}).single('image')

function checkFileType(file, cb) {
	// Allowed ext
	const filetypes = /jpeg|jpg|png|gif/
	// Check ext
	const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
	// Check mime
	const mimetype = filetypes.test(file.mimetype)
	if (mimetype && extname) {
		return cb(null, true)
	} else {
		cb('Error: Images Only!')
	}
}

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
				password: hash,
				securityQuestion: req.body.securityQuestion,
				securityPassword: hash,
				created: Date.now(),
			})

			user.save((err) => {
				if (!err) res.status(status.OK).send(User.generateJwt(user))
				else {
					res.status(status.CONFLICT).send(err.message)
					console.log(err)
				}
			})
		} else {
			res.status(status.CONFLICT).send(['failed to hash password'])
		}
	})
})

/**
 * Purpose: Adds a new loreline to a user
 * Full path: /api/users/:userid/lorelines
 * req: userid: ObjectId of user to add loreline to
 *      name: String name of loreline being added
 * res: lorelineId: ObjectId of new loreline
 */
router.post('/:userid/images', (req, res) => {
	lorelineImageUpload(req, res, (error) => {
		// console.log( 'requestOkokok', req.file );
		// console.log( 'error', error );
		if (error) {
			console.log('errors', error)
			res.json({ error: error })
		} else {
			// If File not found
			if (req.file === undefined) {
				console.log('Error: No File Selected!')
				res.json('Error: No File Selected')
			} else {
				// If Success
				//const imageName = req.file.key
				const imageLocation = req.file.location // Save the file name into database into profile model
				res.status(status.OK).send(imageLocation)
			}
		}
	})
})

/**
 * Purpose: Fetches a users limits
 * Full path: /api/users/:userid/limits
 * req: :userid: ObjectId of user
 * res: Limits object containing current count and maximum
 *      for Instances, Entities, and Lorelines
 */
router.get('/:userid/limits', (req, res) => {
	User.findById(req.params.userid, (err, user) => {
		if (!err && user != null) res.status(status.OK).send(user.limits)
		else res.status(status.NOT_FOUND).send('user not found')
	})
})

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
		image: req.body.image,
		modified: Date.now(),
		timelineData: [],
		customEntities: [],
		ownerId: req.params.userid,
	})

	loreline.save((err) => {
		if (!err) {
			User.findByIdAndUpdate(
				req.params.userid,
				{ $push: { lorelines: loreline.id }, $inc: { 'limits.lorelines.current': 1 } },
				(err, user) => {
					console.log(user.limits)
					if (!err && user != null) res.status(status.OK).send(loreline.id)
					else res.status(status.NOT_FOUND).send('user not found')
				}
			)
		} else res.status(status.CONFLICT).send(err.message)
	})
})

/**
 * Purpose: Fetches a users specific loreline
 * Full path: /api/users/:userid/lorelines/:lorelineid
 * req: :userid: ObjectId of user
 *      :lorelineid: ObjectId of loreline to fetch
 * res: Loreline object with populated children
 */
router.get('/:userid/lorelines/:lorelineid', (req, res) => {
	var options = { path: 'customEntities.instances', model: 'EntityInstance' }

	Loreline.findById(req.params.lorelineid)
		.populate('timelineData')
		.populate({
			path: 'customEntities',
			populate: {
				path: 'instances',
				model: 'EntityInstance',
			},
		})
		.exec((err, loreline) => {
			if (!err && loreline != null) res.status(status.OK).send(loreline)
			else res.status(status.NOT_FOUND).send('loreline not found')
		})
})

/**
 *  Purpose: Fetched the security question from a user
 *  Full path: /api/users/:userid/securityQuestion
 *  req: :user id
 *  res: returns the security question
 */
router.get('/:userid/securityQuestion', (req, res) => {
	User.findById(req.params.userid , (err, user) => {
		if(!err && user != null){
			res.status(status.OK).send(user.securityQuestion)
		}
		else res.status(status.NOT_FOUND).send('user not found')


	})
})

/**
 *  Purpose: Fetched the user:id off of a users email, later used to retrieve the security question
 *  Full path: /api/users/:useremail/
 *  req: :userid, which is the needed email, didnt know either other way to do this
 *  res: reutrns the userID
 */
router.get('/:email/getuser' , (req, res) => { 
	User.find( {email: req.params.email})
	.select('_id')
	.exec((err, user) => {
	    if(!err && user != null){
			res.status(status.OK).send(user)
		}
		else res.status(status.NOT_FOUND).send('user with this email not found')
	})
})

/**
 * Purpose: Fetches all of a users lorelines
 * Full path: /api/users/:userid/lorelines
 * req: :userid: ObjectId of user to fetch from
 * res: Array of loreline _ids, names, and modified dates
 *      [{_id, name, modified}]
 */
router.get('/:userid/lorelines', (req, res) => {
	User.findById(req.params.userid, (err, user) => {
		if (!err && user != null) {
			Loreline.find({ _id: { $in: user.lorelines } })
				.sort({ modified: 'descending' })
				.select('_id name image modified')
				.exec((err, lorelines) => {
					if (!err && lorelines != null) res.status(status.OK).send(lorelines)
					else res.status(status.NOT_FOUND).send('lorelines not found')
				})
		} else res.status(status.NOT_FOUND).send('user not found')
	})
})

/**
 * Purpose: Removes a loreline from a user
 * Full path: /api/users/:userid/lorelines/:lorelineid
 * req: :userid: ObjectId of user
 *      :lorelineid: ObjectId of loreline to delete
 * res: Status
 */
router.delete('/:userid/lorelines/:lorelineid', (req, res) => {
	User.findByIdAndUpdate(
		req.params.userid,
		{
			$pull: { lorelines: req.params.lorelineid },
			$inc: { 'limits.lorelines.current': -1 },
		},
		(err, user) => {
			if (!err && user != null) {
				Loreline.findOne({ _id: req.params.lorelineid }, (err, loreline) => {
					if (!err && loreline != null) {
						loreline.remove()
						res.sendStatus(status.OK)
					} else res.status(status.NOT_FOUND).send('loreline not found')
				})
			} else res.status(status.NOT_FOUND).send('user not found')
		}
	)
})

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
				if (result) res.status(status.OK).send(User.generateJwt(user))
				else res.status(status.UNAUTHORIZED).send('password does not match')
			})
		} else {
			res.status(status.NOT_FOUND).send('user not found')
		}
	})
})

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
			res.status(status.UNAUTHORIZED).send('failed to verify token')
		} else if (Date.now() < decoded.exp * 1000) {
			User.findById(decoded.id, (err, user) => {
				if (!err && user != null) {
					res.status(status.CREATED).send(User.generateJwt(user))
				} else {
					res.status(status.NOT_FOUND).send('user not found')
				}
			})
		} else {
			res.status(status.UNAUTHORIZED).send('token expired')
		}
	})
})

module.exports = router
