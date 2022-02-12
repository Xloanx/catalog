const Joi = require('joi');
const { Schema, model } = require('mongoose');
const config = require('config');
const jwt = require('jsonwebtoken');

//Schema definition
const userSchema = new Schema({
  name: {
      type: String, 
      required: true,     
      minlength: 3,
      maxlength: 200        
  },

  email: { 
      type: String,
      unique: true, 
      required: true
  },

  phone: {
    type: String, 
    required: true,     
    minlength: 8,
    maxlength: 15        
},

password:{
  type: String,
  required: true,
  minlength: 8,
  maxlength: 1024
},

isAdmin: {
  type: Boolean,
  required: true
  //roles : []
  //operations : [{}]
},

roles: {
  type: Array,
  required: true
}

});

userSchema.methods.generateAuthToken = function(){
  return jwt.sign({ 
    id : this._id, 
    isAdmin: this.isAdmin, 
    roles: this.roles 
    }, 
    config.get('jwtPrivateKey'));
};

//Model Definition
const UserModel = model('User', userSchema);

  function validateUser(requestBody){
    const schema = Joi.object({
      name: Joi.string().min(3).max(200).required(),
      email: Joi.string().email().required(),
      phone:Joi.string().min(8).required(),
      password: Joi.string().min(8).pattern(new RegExp('^[a-zA-Z0-9!@#$%]{3,30}$')).required(),
      repeat_password: Joi.ref('password'),
      isAdmin: Joi.boolean().required(),
      roles: Joi.array().min(1).required()
    })
    return schema.validate({
      name: requestBody.name,
      email: requestBody.email,
      phone: requestBody.phone,
      password: requestBody.password,
      repeat_password: requestBody.repeat_password,
      isAdmin: requestBody.isAdmin,
      roles: requestBody.roles
    });
  }

  module.exports.userSchema = userSchema;
  module.exports.UserModel = UserModel;
  module.exports.validateUser = validateUser;