const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const { Schema, model } = require('mongoose');

//Schema definition
const platformSchema = new Schema({
  name: {
      type: String, 
      required: true,     
      minlength: 3,
      maxlength: 200,
      unique: true      
  },

  dateCreated: { 
    type: Date,
    required: true,
    default: Date.now 
  },

  // creator: {
  //   type: userSchema, 
  //   required: true 
  // },
  creator: {
    type: new Schema({
      name:{
        type: String,
        rquired: true,
        minlength: 3,
        maxlength: 200
      },
      email:{
        type: String,
        //unique: true, 
        required: true
      },
      phone:{
        type: String, 
        required: true,     
        minlength: 8,
        maxlength: 15
      }
    }), 
    required:true
  },

  isFree: {
    type: Boolean,
    required: true
  }
});


//Model Definition
const PlatformModel = model('Platform', platformSchema);

function validatePlatform(requestBody){
    const schema = Joi.object({
      name: Joi.string().min(3).max(30).required(),
      creatorId: Joi.objectId().required(),  
      isFree: Joi.boolean().required()
    })
    return schema.validate({
      name: requestBody.name,
      creatorId: requestBody.creatorId,
      isFree: requestBody.isFree
    });
  }


  module.exports.validatePlatform = validatePlatform;
  module.exports.PlatformModel = PlatformModel;
  module.exports.platformSchema= platformSchema;



