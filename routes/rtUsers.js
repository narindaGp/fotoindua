"use strict";
const express = require('express')
const {Controller, upload} = require('../controllers/controller')
// const upload = multer({ dest: 'uploads/' })
const router = express.Router();
// const multer  = require('multer')
// const path = require('path');


// const storege = multer.diskStorage({
//   destination: (req, file, cb ) => {
//     cb(null, 'Images' )
//   },
//   filename: (req, file, cb) => {
//     cb(null, new Date() + path.extname(file.originalname))
//   }
// })

// const upload = multer({
//   storage: storege,
//   limits: {fileSize: '1000000'},
//   fileFilter: (req, file, cb) => {
//     const fileTypes = /jpeg|jpg|png|gif/
//     const mimeType = fileTypes.test(file.mimetype)
//     const extname = fileTypes.test(path.extname(file.originalname))
//     if(mimeType && extname){
//       return cb(null, true)
//     }
//     cb('Give me proper files to upload')
//   }
// }).single('image')

router.get('/', Controller.getUsers);
router.get('/:id/detail', Controller.getUserDetail);
router.get(`/:id/delete`, Controller.deleteUser)
router.get('/:id/addService', Controller.getAddService);
router.get('/:id/edit', Controller.getEditService);
router.post('/:id/edit', Controller.postEditService);
router.get('/:id/detail/delete', Controller.getDeleteService);

router.get('/:id/add/gallery', Controller.getaddGalery);
router.post('/:id/add/gallery', upload.single('avatar'), Controller.postGalery);
// =======
// router.get('/:id/detail/add', Controller.getAddDetail);
// // router.post('/:id/detail/add', Controller.postAddDetail);
// router.get('/:id/add', Controller.getAddService);
// router.get('/:id/add/:ServiceId/detail', Controller.getAddDetail);

module.exports = router;