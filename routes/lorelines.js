/** @format */

const express = require('express');
const router = express.Router();
const status = require('http-status-codes');
const Loreline = require('../models/loreline.model');
const CustomEntity = require('../models/customEntity.model');
const EntityInstance = require('../models/entityInstance.model');

// <<<<   api/lorelines   >>>>

/**
 * Purpose: Adds a custom entity to a lorline
 * Full path: /api/lorelines/:lorelineid/entities
 * req: :lorelineid: ObjectId of loreline to update
 *      name: String
 *      color: String
 *      content: FieldType List
 * res: status
 */
router.post('/:lorelineid/entities', (req, res) => {
  console.log('in here!');
  console.log('name: ', req.body.name);
  console.log('color: ', req.body.color);
  console.log('content: ', req.body.content);

  var customEntity = new CustomEntity({
    name: req.body.name,
    color: req.body.color,
    content: req.body.content,
    instances: []
  });
  customEntity.save(err => {
    if (!err) {
      Loreline.findByIdAndUpdate(
        req.params.lorelineid,
        { $push: { customEntities: customEntity.id } },
        (err, loreline) => {
          if (!err && loreline != null)
            res.status(status.OK).send(customEntity.id);
          else res.status(status.NOT_FOUND).send('loreline not found');
        }
      );
    } else {
      console.log(err.message);
      res.status(status.CONFLICT).send(err.message);
    }
  });
});

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
        select: '_id name'
      },
      select: '_id name color instances'
    })
    .exec((err, loreline) => {
      if (!err && loreline != null)
        res.status(status.OK).send(loreline.customEntities);
      else res.status(status.NOT_FOUND).send('loreline not found');
    });
});

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
        res.status(status.OK).send(entity);
      } else res.status(status.NOT_FOUND).send('custom entity not found');
    });
});

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
      $pull: { customEntities: req.params.ceid }
    },
    (err, loreline) => {
      if (!err && loreline != null)
        CustomEntity.findByIdAndDelete(req.params.ceid, (err, entity) => {
          if (!err && entity != null) res.sendStatus(status.OK);
          else res.status(status.NOT_FOUND).send('custom entity not found');
        });
      else res.status(status.NOT_FOUND).send('loreline not found');
    }
  );
});

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
  var entityInstance = new EntityInstance({
    name: req.body.name,
    content: req.body.content
  });
  entityInstance.save(err => {
    if (!err) {
      CustomEntity.findByIdAndUpdate(
        req.params.ceid,
        { $push: { instances: entityInstance.id } },
        (err, entity) => {
          if (!err && entity != null)
            res.status(status.OK).send(entityInstance.id);
          else res.status(status.NOT_FOUND).send('custom entity not found');
        }
      );
    } else res.status(status.CONFLICT).send(err.message);
  });
});

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
      res.status(status.OK).send(instance);
    } else res.status(status.NOT_FOUND).send('entity instance not found');
  });
});

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
      $pull: { instances: req.params.eiid }
    },
    (err, entity) => {
      if (!err && entity != null)
        EntityInstance.findByIdAndDelete(req.params.eiid, (err, instance) => {
          if (!err && instance != null) res.sendStatus(status.OK);
          else res.status(status.NOT_FOUND).send('entity instance not found');
        });
      else res.status(status.NOT_FOUND).send('custom entity not found');
    }
  );
});

// PLANNED ROUTES:

// Add Timeline node POST

// Get Timeline node GET

// Modify Timeline node PUT

// Remove Timeline node DELETE

// Get all Timeline nodes GET

module.exports = router;
