const express = require('express')
const users = express.Router()
const cors = require('cors')
const jwt = require('jsonwebtoken')
const User = require('../models/User.model')
users.use(cors())

users.post('/register', (req, res) => {
  const today = new Date()
  const userData = {
    name:req.body.name,
    roles:req.body.roles,
    email: req.body.email,
    password: req.body.password,
    created: today
  }
  User.findOne({
          email: req.body.email
  }).then(user => {
      if (!user) {
        User.create(userData)
          .then(user => {
            res.send({user})
          })
          .catch(err => {
            res.send('error: ' + err)
          })
      }else {
        res.json({ error: 'User already exists' })
      }
    }).catch(err => {
      res.send('error: ' + err)
    })
})

users.post('/login', (req, res) => {
  User.findOne({
    email: req.body.email,
    password: req.body.password,
    roles: req.body.roles
  }).then(user => {
      if (user) {
        const payload = {
          _id: user._id,
          name: user.name,
          roles: user.roles
        }
        let token = jwt.sign(payload, 'secret', {
          expiresIn: '24h'
        })
        res.json({ token: token })
      } else {
        res.json({ error: 'User does not exist' })
      }
    }).catch(err => {
      res.send('error: ' + err)
    })
})

users.get('/profile', (req, res) => {
  var decoded = jwt.verify(req.headers['authorization'], 'secret')
  User.findOne({
    _id: decoded._id
  }).then(user => {
        res.json(user)
    }).catch(err => {
      res.send('error: ' + err)
    })
})

users.put('/profile/:id', (req, res) => {
  var decoded = jwt.verify(req.headers['authorization'], 'secret')
  User.updateOne({ _id: req.params.id }, req.body).then((doc) => {
      res.json({ doc })
  }).catch((err) => {
      res.json({ err })
  })
})

users.get('/accounts', (req, res) => {
  var decoded = jwt.verify(req.headers['authorization'], 'secret')
    User.find({
      $or:[
        { roles:"faculty"},{roles:"club"}
      ]
    }).then((doc) => {
        res.json({ doc })
    }).catch((error) => {
        res.json({ error })
    })
})

users.delete('/account/:id', (req, res) => {
  var decoded = jwt.verify(req.headers['authorization'], 'secret')
    User.deleteOne({ _id: req.params.id }).then((doc) => {
        res.json({ doc })
    }).catch((err) => {
        res.json({ err })
    })
})

module.exports = users