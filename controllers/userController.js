const { User, Service, Detail } = require('../models')
const bcrypt = require('bcryptjs');


class UserController{
  static getRegister(req, res){
    let {error} = req.query
    res.render('register', {error})
  }
  
  static postRegister(req, res){
    let {username, email, password, role} = req.body
    User.create({username, email, password, role})
    .then(_=> res.redirect('/'))
    .catch(err => {
      // res.send(err)
      if(err.name == 'SequelizeValidationError'){
        let word = ''
        word = err.errors.map(el => el.message)
        res.redirect(`/register?error=${word.join(',')}`)
      } else if(err.name == 'SequelizeUniqueConstraintError'){
        let word = 'email is used'
        res.redirect(`/register?error=${word}`)
      } else {
        res.send(err)
      }
    })
  }
  
  static getLogin(req, res){ 
    // if(req.query)
    let {error} = req.query
    res.render('login', {error})
  }
  
  static postLogin(req, res){
    let {email, password} = req.body
    User.findOne({
          where: {email}
        })
        .then(data => {
          
          if(data){
            const isValidPass = bcrypt.compareSync(password, data.password)
            if(isValidPass){
              req.session.userId = data.id
              req.session.role = data.role
              return res.redirect('/services')
            } else {
              let errors = "invalid password"
              return res.redirect(`/?error=${errors}`)
            }
          } else {
            let errors = "invalid password/username"
            return res.redirect(`/?error=${errors}`)
          }
        })
        .catch(err => {
          console.log(err)
          res.send(err)
        })
  }

  static getLogout(req, res){
    req.session.destroy(err => {
      if(err) res.send(err)
      else {
        res.redirect('/')
      }
    })
  }
  
}

module.exports = UserController