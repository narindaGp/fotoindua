"use strict";
const express = require('express')
const router = express.Router();
const routeUsers = require('./rtUsers')
const routeServices = require('./rtServices')
const routeDetails = require('./rtDetails')
const UserController = require('../controllers/userController')


router.get('/');
router.get('/', UserController.getLogin)
router.post('/', UserController.postLogin)
router.get('/register', UserController.getRegister)
router.post('/register', UserController.postRegister)

router.use(function(req, res, next){
  // console.log(req.session)
  if(!req.session.userId){
    const errors = 'Please login first'
    res.redirect(`/?error=${errors}`)
  } else {
    next()
  }
})


const isAdmin = function(req, res, next){
  if(req.session.userId && req.session.role != "Admin"){
    const errors = 'You dont have access'
    res.redirect(`/?error=${errors}`)
  } else {
    next()
  }
}

router.get('/logout', UserController.getLogout)

router.use('/users', isAdmin, routeUsers);
router.use('/services', routeServices);


module.exports = router;