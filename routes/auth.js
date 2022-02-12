const express = require('express');
const router = express.Router();
const Joi = require('joi');
const bcrypt = require('bcrypt');
const config = require('config');
const jwt = require('jsonwebtoken');
const {UserModel} = require('../models/user-model');






function validateAuth(requestBody){
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(8).pattern(new RegExp('^[a-zA-Z0-9!@#$%]{3,30}$')).required()
    })
    return schema.validate({
      email: requestBody.email,
      password: requestBody.password
    });
  }


  //Anyone with the url can create log in
module.exports = router.post('/', async (req, res,next)=>{
    //validate entry for user loggin using joi
    const {error} = validateAuth(req.body)
    if (error) return res.status(400).send(error.details[0].message);
  
    //search for corresponding supplied credentials
    let user = await UserModel.findOne({email : req.body.email});
    if (!user) return res.status(400).send('Invalid Email or Password!!!');

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) res.status(400).send("Invalid Email or Password!");

    const token = user.generateAuthToken();
    const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
        req.user = decoded;
    
    res.header('x-auth-token', token)
        .send(`Dear ${req.user.name}, you have been authenticated, your token is: \n ${token}`);    
  });


