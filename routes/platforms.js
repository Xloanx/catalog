const express = require('express');
const router = express.Router();
const { PlatformModel, validatePlatform } = require('../models/platform-model');
const { UserModel } = require('../models/user-model');
const authorization = require('../middleware/authorization');
const {creators, removers, editors, viewers } = require('../middleware/admin-authorization');

router.get('/', [authorization, viewers], async (req, res, next)=>{
    res.send(await PlatformModel.find()
                        .select({name:1,creator:1,dateCreated:1,isFree:1})
                        .sort('-dateCreated')
)});

//Only the currently logged in Admin (with creation rights) can create a platform (w)
router.post('/', [authorization, creators], async (req, res,next)=>{
    //check to confirm that all required fields are adequately & appropriately completed
    const {error} = validatePlatform(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //platform name MUST be unique
    let platform = await PlatformModel.findOne({name: req.body.name});
    if(platform) return res.status(400).send('A Platform already exists with this name!');

    //Platform registar MUST be the currently logged-in user
    if(req.body.creatorId !== req.user.id){
        return res.status(400)
                .send('Prospective Platform Registrar is different from logged in user!');
    }
        
    //Currently logged-in user MUST be registered on db
    const user = await UserModel.findById(req.user.id);
    if (!user) return res.status(400).send('Non-Existent User Cannot create a Platform');

    //create platform data
    platform = new PlatformModel({
        name: req.body.name,
        creator: {
            _id :   user._id,
            name:   user.name,
            email:  user.email,
            phone:  user.phone
        },
        isFree: req.body.isFree
    })

    await platform.save();
    return res.send(`Your Platform, ${platform.name}, has been succesfully created.`);
});



router.get('/:id', [authorization, viewers], async (req, res, next)=>{
    const platform = await PlatformModel.findById(req.params.id);
    if (!platform) return res.status(404).send("Invalid Request");
    return res.send(platform);
});

router.delete('/:id', [authorization, removers], async (req, res, next)=>{
    //check for the id on db
    const platform = await PlatformModel.findByIdAndRemove(req.params.id);
    if(!platform) return res.status(404).send('Invalid Request');

    //check that the creator is the remover
    if(platform.creator._id !== req.user.id){
        return res.status(400)
                .send('Only the Platform Registrar is authorized to perform this task!');
    }

    return res.send(`Your Platform, ${platform.name} has been successfully deleted`);    
});

router.put('/:id', [authorization, editors], async (req, res, next)=>{
    //validate entry
    const {error} = validatePlatform(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //platform id MUST exist on db
    const platform = await PlatformModel.findById(req.params.id);
    if(!platform) return res.status(404).send('Invalid Request');

    //Get the details of editor from db
    const user = await UserModel.findById(req.user.id);
    if (!user) return res.status(400).send('Non-Existent User Cannot create a Platform');

    //creator MUST be the editor
    if(!platform.creator._id.equals(user._id))
        return res.status(400)
                .send('Only the Platform Registrar is authorized to perform this task!');

    //set data
    platform.name       = req.body.name,
    platform.creator    = {
                            _id :   user._id,
                            name:   user.name,
                            email:  user.email,
                            phone:  user.phone
                        },
    platform.isFree     = req.body.isFree
    await platform.save();
    return res.send(`The Platform, ${platform.name} was successfully edited`);
});




module.exports = router;