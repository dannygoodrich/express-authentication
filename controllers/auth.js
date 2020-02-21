const express = require('express');
const router = express.Router();
const db = require('../models');
const passport = require('../config/ppConfig');

router.get('/signup', function(req, res) {
  res.render('auth/signup');
});

router.post('/signup', (req, res) => {
  db.user.findOrCreate({
    where: {
      email: req.body.email
    }, defaults: {
      name: req.body.name,
      password: req.body.password
    }
  }).then(([user, created]) => {
    if (created) {
      console.log('user created');
      passport.authenticate('local', {
        successRedirect: '/'
      })(req, res);
    } else {
      console.log('email already exist')
      res.redirect('/auth/signup');
    }
  }).catch(err => {
    console.log('Error occured finding or creating user');
    console.log(err)
    res.redirect('/auth/signup');
  })
});

// router.post('/signup', (req,res) => {
//   db.user.findOrCreate({
//     where: {
//       email: req.body.email
//     }, defaults: {
//       name: req.body.name,
//       password: req.body.password
//     }
//   }).then(([user, created])=> {
//     if(created){
//       console.log('user created')
//       res.redirect('/');
//     } else {
//       console.log('email already exists')
//       res.redirect('/auth/signup')
//     }
//   })
//   .catch(err => {
//     console.log('Error occured finding or creating user');
//     console.log(err);
//     res.redirect('/auth/signup');
//   })
// })

router.get('/login', function(req, res) {
  res.render('auth/login');
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/auth/login'
}));

router.get('/logout', (req, res)=> {
  req.logout();
  res.redirect('/');
});

module.exports = router;
