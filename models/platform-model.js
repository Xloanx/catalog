const Joi = require('joi');
require('joi-objectid');
const { date } = require('joi');
const { Schema, model } = require('mongoose');
const { userSchema, UserModel } = require('./user-model');

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

  creator: {
    type: userSchema, 
    required: true 
  },

  studentCount: {
    type: Number
  }
});


//Model Definition
const PlatformModel = model('Platform', platformSchema);

function validatePlatform(requestBody){
    const schema = Joi.object({
      name: Joi.string().min(3).max(30).required(),
      creator: Joi.objectId().required(),  
      studentCount: Joi.number.max(20).required()
    })
    return schema.validate({
      name: requestBody.name,
      creator: requestBody.creator,
    });
  }


  module.exports.validatePlatform = validatePlatform;
  module.exports.PlatformModel = PlatformModel;
  module.exports.platformSchema= platformSchema;






  // module.exports.platforms = [
//     {_id: 88993,
//      name:"smedav",
//      creator : "admin1",
//      date : "09-02-2022"
//     },
//     {_id: 88994,
//      name:"itf",
//      creator : "admin1",
//      date : "09-02-2022"
//     },
//     {_id: 88995,
//      name:"nitda",
//      creator : "admin1",
//      date : "09-02-2022"
//     }
// ];
