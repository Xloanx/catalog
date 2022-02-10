const express = require('express');
const router = express.Router();

const users = require('../models/user-models');


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send(users);
});

router.get('/:id', (req, res, next)=>{
  const user = users.find( u => u._id === parseInt(req.params.id));
  if (!user) return res.status(404).send("Invalid Request");
  return res.send(user);
});

router.post('/', (req, res,next)=>{
  let lastId  = users[users.length-1]._id
  const user = { 
              _id: lastId+1, 
              email: req.body.email, 
              pass:req.body.pass,
              phone: req.body.phone,
              isAdmin: req.body.isAdmin,
              role: req.body.role
            }
  users.push(user);
  return res.send(users);
});

router.delete('/:id', (req, res, next)=>{
  const userIndex = users.findIndex(u => u._id === parseInt(req.params.id));
  if (!users[userIndex]) return res.status(404).send("Invalid Request");
  users.splice(userIndex, 1);
  return res.send(users);
});

router.put('/:id', (req, res, next)=>{
  const userIndex = users.findIndex( u => u._id === parseInt(req.params.id));
  console.log(users[userIndex].email);
  if (!users[userIndex]) return res.status(404).send("Invalid Request");
  users[userIndex].email    = req.body.email;
  users[userIndex].pass     = req.body.pass;
  users[userIndex].phone    = req.body.phone;
  users[userIndex].isAdmin  = req.body.isAdmin;
  users[userIndex].role     = req.body.role;
  return res.send(users);
});






module.exports = router;
