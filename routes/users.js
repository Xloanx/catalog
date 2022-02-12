const _ = require('lodash');
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();
const authorization = require('../middleware/authorization');
const {removers} = require('../middleware/admin-authorization');
const { UserModel, validateUser} = require('../models/user-model');

//Anyone with the url can create a profile
router.post('/', async (req, res,next)=>{
  //validate for user using joi
  const {error} = validateUser(req.body)
  if (error) return res.status(400).send(error.details[0].message);

  //search for Existence of user using email as filter
  let user = await UserModel.findOne({email : req.body.email});
  if (user) return res.status(400).send('User already exists!!!');

  //create object to be saved 
  user = new UserModel({ 
              name: req.body.name,
              email: req.body.email,
              phone: req.body.phone,
              password:req.body.password,
              isAdmin: req.body.isAdmin,
              roles: req.body.roles
            });

  //Encrypt password 
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  //save the object
  await user.save();

  //grant auth after creating user 
  const token = user.generateAuthToken();

  //return result with a header containing the token
  res.header('x-auth-token', token)
      .send(_.pick(user, ['name', 'email', 'phone', 'isAdmin', 'roles']));
});

//My details can only be read by me only if I am logged in  
router.get('/me', authorization, async (req, res, next)=>{
  return res.send(await UserModel
                  .findById(req.user.id)
                  .select({name:1, email:1, phone:1, isAdmin:1, roles:1})
                );
});

//My details can only be updated by me only if I am logged in
router.put('/me', authorization, async (req, res, next)=>{
  const {error, value} = validateUser(req.body)
  if (error) return res.status(400).send(error.details[0].message);

  //no need to checkthe validity of req.user.id, it was fetched from the header
  const user = await UserModel.findById(req.user.id);
  user.name       = req.body.name;
  user.email      = req.body.email;
  user.password   = req.body.password;
  user.phone      = req.body.phone;
  user.isAdmin    = req.body.isAdmin;
  user.roles     = req.body.roles;

  //Encrypt password 
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();
  return res.send(user);
});

//Can be implemented for ULTIMATE Admin to view users on platforms 
// router.get('/', async function(req, res, next) {
//   res.send(await UserModel.find()
//                   .sort('email')
//                   .select({name:1, email:1, phone:1, isAdmin:1, roles:1})
// )});

//My Account can only be deleted by an Admin that has delete rights
router.delete('/:id',[authorization, removers], async(req, res, next)=>{
  const user = await UserModel.findByIdAndRemove(req.params.id);
  if(!user) return res.status(404).send('Invalid request');
  return res.send(`${user.name}'s Account has been been successfully deleted`);
});






module.exports = router;
