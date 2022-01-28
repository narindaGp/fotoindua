"use strict";
const express = require('express')
const {Controller, upload} = require('../controllers/controller')
const router = express.Router();


router.get('/', Controller.showService);
router.get('/:id', Controller.getDetail);
router.post('/:id/add', Controller.postAddService);
// router.get('/details', Controller.getDetail);

module.exports = router;