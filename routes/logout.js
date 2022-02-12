const express = require('express');
const router = express.Router();
const config = require('config');
const jwt = require('jsonwebtoken');
const {UserModel} = require('../models/user-model');
const authorization = require('../middleware/authorization');





  //Only logged in users can view this page
module.exports = router.post('/', authorization, async (req, res,next)=>{
    res.header('x-auth-token', "").send(`You have been logged Out!!`);    
  });


