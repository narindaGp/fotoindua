const { User, Service, Detail, Category, Gallery } = require('../models')
const serviceAvailable = require('../helpers')
const multer = require('multer')
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/Images')
  },
  filename: function (req, file, cb) {
    const mimeExtension = {
      'image/jpeg':'.jpeg',
      'image/jpg':'.jpg',
      'image/png':'.png',
      'image/gif':'.gif'
    }
    cb(null, file.fieldname + '-' + Date.now() + mimeExtension[file.mimetype])
  }
})

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if(file.mimetype == 'image/jpeg' || file.mimetype == 'image/jpg' || file.mimetype == 'image/png' || file.mimetype == 'image/gif' ){
      cb(null, true)
    } else {
      req.fileError = 'file is not valid'
    }
  }
})

class Controller {
  static showService(req, res) {

    let { search } = req.query

    Service.search(search)
      .then(data => {
        // console.log(data[0].Category)
        res.render('service', { data })
      })
      .catch(err => {
        console.log(err)
        res.send(err)
      })
  }


  static getDetail(req, res) {
    // console.log('test')
    let { id } = req.params
    let temp
    Service.findByPk(+id, {
      include:[Detail]
    })
      .then(data => {
        temp = data
        return Detail.findByPk(data.Detail.id,{
          include:[Gallery]
        })
      })
      .then(data => {
        // console.log(temp.name)
        // console.log(data.status)
        res.render('detail', { data, temp, serviceAvailable })
      })
      .catch(err => {
        console.log(err)
        res.send(err)
      })
  }

  


  static getAddService(req, res) {
    const { id } = req.params
    User.findByPk(id)
      .then(user => {
        // res.send(user)
        res.render('userAddSvcNar', { user })
      })
      .catch(err => {
        res.send(err)
      })
  }

  static getUsers(req, res) {
    User.findAll()
      .then(users => {
        // res.send(users)
        res.render('usersNar', { users })
      })
      .catch(err => {
        console.log(err)
        res.send(err)
      })
  }

  static getUserDetail(req, res) {
    const { id } = req.params
    User.findByPk(id, {
      include: {
        model: Service
      }
    })
      .then(user => {
        // res.send(user)
        // console.log(user.Services)
        res.render('usersDetailNar', { user, services: user.Services })
      })
      .catch(err => {
        res.send(err)
      })
  }

  static getAddService(req, res) {
    const { id } = req.params
    User.findByPk(id)
      .then(user => {
        // res.send(user)
        res.render('userAddSvcNar', { user })
      })
      .catch(err => {
        res.send(err)
      })

  }

  static postAddService(req, res) {
    const { id } = req.params
    const { name, description, price, imageUrl, CategoryId, status, requirement, timeOfContract } = req.body
    const valueService = { name, description, price, imageUrl, CategoryId, UserId: id }
    Service.create(valueService)
      .then(data => {
        return Service.findAll({
          order: [['id', 'desc']],
          limit: '1'
        })
      })
      .then(data => {
        return Detail.create({ status, requirement, timeOfContract, ServiceId: data[0].id })
      })
      .then(service => {
        return Service.findAll({
          order: [['id', 'desc']],
          limit: '1'
        })
      })
      .then(service => {
        return Detail.create({ status, requirement, timeOfContract, ServiceId: service.id })
      })
      .then(service => {
        res.redirect(`/users/${id}/detail`)
      })
      .catch(err => {
        if (err.name == 'SequelizeValidationError') {
          let errors = []
          err.errors.forEach(el => {
            errors.push(el.message)
          })
          res.send(errors)
        } else {
          res.send(err)
        }
      })

  }


  static getEditService(req, res) {
    let { id } = req.params
    Service.findByPk(+id, {
      include: [Detail]
    })
      .then(data => {
        // console.log(data.name)
        res.render('edit', { data })
      })
      .catch(err => {
        res.send(err)
      })
  }

  static postEditService(req, res) {
    let { id } = req.params
    let { name, description, price, imageUrl, CategoryId, status, requirement, timeOfContract } = req.body
    const valueService = { name, description, price, imageUrl, CategoryId }
    Service.update(valueService, {
      where: {
        id: +id
      }
    })
      .then(data => {
        return Service.findAll({
          order: [['updatedAt', 'desc']],
          limit: '1',
          include: [Detail]
        })
      })
      .then(data => {
        return Detail.update({ status, requirement, timeOfContract }, {
          where: {
            id: data[0].Detail.id
          }
        })
      })
      .then(service => {
        res.redirect(`/users`)
      })
      .catch(err => {
        if (err.name == 'SequelizeValidationError') {
          let errors = []
          err.errors.forEach(el => {
            errors.push(el.message)
          })
          res.send(errors)
        } else {
          res.send(err)
        }
      })
  }

  static deleteUser(req, res) {
    let { id } = req.params
    User.destroy({
      where: {
        id: +id
      }
    })
      .then(_ => {
        res.redirect(`/users`)
      })
      .catch(err => {
        res.send(err)
      })
  }

  static getDeleteService(req, res) {
    const { id } = req.params
    Service.destroy({
      where: {
        id: id
      }
    })
      .then(data=>{
        res.redirect('/users')
      })
      .catch(err => {
        res.send(err)
      })
  }

  static getaddGalery(req, res){
    const {id} = req.params 
    Service.findByPk(id)
      .then(service=>{
        res.render('userAddGallery', {service})
      })
      .catch(err => {
        console.log(err);
        res.send(err)
      })
  }

  static postGalery(req, res){
    const { id } = req.params
    const { alternate } = req.body
    // res.send(gallery, alternate)
    // console.log(req.file, 'galerryy ===', gallery, galery);
    const value = { id, name: req.file.path, alternate }
    Gallery.create(value)
      .then(gallery=>{
        console.log(gallery);
        res.redirect(`/users/${id}/add/gallery`)
      })
      .catch(err => {
        res.send(err)
      })
  }
}

module.exports = {
  Controller,
  upload
}