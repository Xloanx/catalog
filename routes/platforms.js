const express = require('express');
const router = express.Router();
const { platformSchema, PlatformModel, validatePlatform } = require('../models/platform-model');
const { UserModel } = require('../models/user-model');
const authorization = require('../middleware/authorization');
const {creators} = require('../middleware/admin-authorization');

router.post('/', [authorization, creators], async (req, res,next)=>{
    //check to confirm that all required fields are adequately & appropriately completed
    const {error} = validatePlatform(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //If all entries are correct, check that selected platform name isn't existing
    let platform = await PlatformModel.findOne(req.body.name);
    if(platform) return res.send(400).send('A Platform already existswith this name!');

    //Also check to be sure that a creator is existing on db 
    const creator = await UserModel.findById(req.body.userId);
    if (!creator) res.status(400).send('Non-Existent User Cannot create a Platform');

    //create platform data
    platform = new PlatformModel({
        name: req.body.name,
        creator: {
            _id : user._id,
            name: user.name,
            email: user.phone,
            phone: user.phone
        },
        studentCount: req.body.studentCount
    })

    await platform.save();
    return res.send(`Your Platform, ${platform.name}, has been succesfully created.`);
});

// router.get('/', (req, res, next)=>{
//     res.send(platforms);
// });

// router.get('/:id', (req, res, next)=>{
//     const platform = platforms.find( p => p._id === parseInt(req.params.id));
//     if (!platform) return res.status(404).send("Invalid Request");
//     return res.send(platform);
// });

// router.delete('/:id', (req, res, next)=>{
//     const platformIndex = platforms.findIndex(p => p._id === parseInt(req.params.id));
//     if (!platforms[platformIndex]) return res.status(404).send("Invalid Request");
//     platforms.splice(platformIndex, 1);
//     return res.send(platforms);
// });

// router.put('/:id', (req, res, next)=>{
//     const platformIndex = platforms.findIndex( p => p._id === parseInt(req.params.id));
//     if (!platforms[platformIndex]) return res.status(404).send("Invalid Request");

//     const {error} = validatePlatform(req.body)
//     if (error) return res.status(400).send(error.details[0].message);

//     platforms[platformIndex].name = req.body.name;
//     platforms[platformIndex].creator = req.body.creator;
//     platforms[platformIndex].date = req.body.date;
//     return res.send(platforms);
// });




module.exports = router;