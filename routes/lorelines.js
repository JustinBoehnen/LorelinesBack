/** @format */

const express = require('express')
const router = express.Router()
const status = require('http-status-codes')
const Loreline = require('../models/loreline.model')
const CustomEntity = require('../models/customEntity.model')
const EntityInstance = require('../models/entityInstance.model')
const User = require('../models/user.model')

// <<<<   api/lorelines   >>>>

/**
 * Purpose: Adds a custom entity to a loreline
 * Full path: /api/lorelines/:lorelineid/entities
 * req: :lorelineid: ObjectId of loreline to update
 *      name: String
 *      color: String
 *      content: FieldType List
 * res: status
 */
router.post('/:lorelineid/entities', (req, res) => {
	Loreline.findById(req.params.lorelineid, (err, loreline) => {
		if (!err && loreline != null) {
			User.findById(loreline.ownerId, (err, user) => {
				if (!err && user != null) {
					if (user.limits.entities.current < user.limits.entities.maximum) {
						var customEntity = new CustomEntity({
							name: req.body.name,
							color: req.body.color,
							content: req.body.content,
							instances: [],
							ownerId: loreline.ownerId,
						})
						customEntity.save((err) => {
							if (!err) {
								Loreline.findByIdAndUpdate(
									req.params.lorelineid,
									{ $push: { customEntities: customEntity.id } },
									(err, loreline) => {
										if (!err && loreline != null) {
											User.updateOne(
												{ _id: loreline.ownerId },
												{ $inc: { 'limits.entities.current': 1 } }
											)
											res.status(status.OK).send(customEntity.id)
										} else res.status(status.NOT_FOUND).send('loreline not found')
									}
								)
							} else res.status(status.CONFLICT).send(err.message)
						})
					} else res.status(status.CONFLICT).send('entity limit reached')
				} else res.status(status.NOT_FOUND).send('user not found')
			})
		}
	})
})

/**
 * Purpose: Fethes all custom entities from a loreline
 * Full path: /api/lorelines/:lorelineid/entities
 * req: :lorelineid: ObjectId of loreline to fetch frome
 * res: all customEntities and instances of a specific loreline
 */
router.get('/:lorelineid/directory', (req, res) => {
	Loreline.findById(req.params.lorelineid)
		.populate({
			path: 'customEntities',
			populate: {
				path: 'instances',
				model: 'EntityInstance',
				select: '_id name',
			},
			select: '_id name color instances',
		})
		.exec((err, loreline) => {
			if (!err && loreline != null) res.status(status.OK).send(loreline.customEntities)
			else res.status(status.NOT_FOUND).send('loreline not found')
		})
})

/**
 * Purpose: Fetches a custom entity from a loreline
 * Full path: /api/lorelines/:lorelineid/entities/:ceid
 * req: :lorelineid: ObjectId of loreline
 *      :ceid: ObjectId of custom entity to fetch
 * res: CustomEntity object with populated children
 */
router.get('/:lorelineid/entities/:ceid', (req, res) => {
	CustomEntity.findById(req.params.ceid)
		.populate('instances')
		.exec((err, entity) => {
			if (!err && entity != null) {
				res.status(status.OK).send(entity)
			} else res.status(status.NOT_FOUND).send('custom entity not found')
		})
})

/**
 * Purpose: Removes a custom entity from a loreline
 * Full path: /api/lorelines/:lorelineid/entities/:ceid
 * req: :lorelineid: ObjectId of loreline
 *      :ceid: ObjectId of custom entity to remove
 * res: status
 */
router.delete('/:lorelineid/entities/:ceid', (req, res) => {
	Loreline.findByIdAndUpdate(
		req.params.lorelineid,
		{
			$pull: { customEntities: req.params.ceid },
		},
		(err, loreline) => {
			if (!err && loreline != null)
				CustomEntity.findByIdAndDelete(req.params.ceid, (err, entity) => {
					if (!err && entity != null) {
						res.sendStatus(status.OK)
					} else res.status(status.NOT_FOUND).send('custom entity not found')
				})
			else res.status(status.NOT_FOUND).send('loreline not found')
		}
	)
})

/**
 * Purpose: Adds an instance to a custom entity
 * Full path: /api/lorelines/:lorelineid/entities/:ceid/instances
 * req: :lorelineid: ObjectId of loreline
 *      :ceid: ObjectId of custom entity to update
 *      name: String
 *      content: fieldContent list
 * res: status
 */
router.post('/:lorelineid/entities/:ceid/instances', (req, res) => {
	Loreline.findById(req.params.lorelineid, (err, loreline) => {
		if (!err && loreline != null) {
			User.findById(loreline.ownerId, (err, user) => {
				if (!err && user != null) {
					if (user.limits.instances.current < user.limits.instances.maximum) {
						var entityInstance = new EntityInstance({
							name: req.body.name,
							content: req.body.content,
							value: req.body.value,
							ownerId: loreline.ownerId,
						})
						entityInstance.save((err) => {
							if (!err) {
								CustomEntity.findByIdAndUpdate(
									req.params.ceid,
									{
										$push: { instances: entityInstance.id },
										$set: { ownerId: loreline.ownerId },
									},
									(err, entity) => {
										if (!err && entity != null) {
											User.updateOne(
												{ _id: entity.ownerId },
												{ $inc: { 'limits.instances.current': 1 } }
											)
											res.status(status.OK).send(entityInstance.id)
										} else res.status(status.NOT_FOUND).send('custom entity not found')
									}
								)
							} else res.status(status.CONFLICT).send(err.message)
						})
					} else res.status(status.CONFLICT).send('instance limit reached')
				} else res.status(status.NOT_FOUND).send('user not found')
			})
		}
	})
})

/**
 * Purpose: Fetches an entity instance from a custom entity
 * Full path: /api/lorelines/:lorelineid/entities/:ceid/instances/:eiid
 * req: :lorelineid: ObjectId of loreline
 *      :ceid: ObjectId of custom entity
 *      :eiid: ObjectId of entity instance to fetch
 * res: EntityInstance object
 */
router.get('/:lorelineid/entities/:ceid/instances/:eiid', (req, res) => {
	EntityInstance.findById(req.params.eiid, (err, instance) => {
		if (!err && instance != null) {
			res.status(status.OK).send(instance)
		} else res.status(status.NOT_FOUND).send('entity instance not found')
	})
})

/**
 * Purpose: Removes an instance from a custom entity
 * Full path: /api/lorelines/:lorelineid/entities/:ceid/instances/:eiid
 * req: :lorelineid: ObjectId of loreline
 *      :ceid: ObjectId of custom entity
 *      :eiid: ObjectId of entity instance to remove
 * res: status
 */
router.delete('/:lorelineid/entities/:ceid/instances/:eiid', (req, res) => {
	CustomEntity.findByIdAndUpdate(
		req.params.ceid,
		{
			$pull: { instances: req.params.eiid },
		},
		(err, entity) => {
			if (!err && entity != null)
				EntityInstance.findByIdAndDelete(req.params.eiid, (err, instance) => {
					if (!err && instance != null) {
						res.sendStatus(status.OK)
					} else res.status(status.NOT_FOUND).send('entity instance not found')
				})
			else res.status(status.NOT_FOUND).send('custom entity not found')
		}
	)
})

/**
 * Purpose: Adds a timeline node to a loreline
 * Full PAth: /api/lorelines/:lorelineid/timeline
 * Req: Node type,
 *      position
 * res: status
 */
router.post('/:lorelineid/timeline', (req, res) => {
	Loreline.findById(req.params.lorelineid, (err, loreline) => {
		if (!err && loreline != null) {
			var timelineNode = new TimelineNode({
				type: req.body.type,
				position: req.body.position,
				content: req.body.content,
				ownerId: loreline.ownerId,
			})

			timelineNode.save((err) => {
				if (!err) {
					Loreline.findByIdAndUpdate(
						req.params.lorelineid,
						{ $push: { timelineData: timelineNode.id } },
						(err, loreline) => {
							if (!err && loreline != null) {
								res.status(status.OK).send(timelineNode.id)
							} else {
								res.status(status.NOT_FOUND).send('loreline not found')
							}
						}
					)
				} else {
					res.status(status.CONFLICT).send(err.message)
				}
			})
		} else {
			res.status(status.NOT_FOUND).send('ownerID not found')
		}
	})
})
// PLANNED ROUTES:

// Add Timeline node POST

// Get Timeline node GET

// Modify Timeline node PUT

// Remove Timeline node DELETE

// Get all Timeline nodes GET

module.exports = router
