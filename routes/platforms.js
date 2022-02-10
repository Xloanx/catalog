const express = require('express');
const router = express.Router();


const platforms = require('../models/platform-model');


router.get('/', (req, res, next)=>{
    res.send(platforms);
});

router.get('/:id', (req, res, next)=>{
    const platform = platforms.find( p => p._id === parseInt(req.params.id));
    if (!platform) return res.status(404).send("Invalid Request");
    return res.send(platform);
});

router.post('/', (req, res,next)=>{
    let lastId  = platforms[platforms.length-1]._id
    const platform = { 
                        _id: lastId+1, 
                        name: req.body.name,
                        creator : req.body.creator,
                        date : req.body.date
                    }
    platforms.push(platform);
    return res.send(platforms);
});

router.delete('/:id', (req, res, next)=>{
    const platformIndex = platforms.findIndex(p => p._id === parseInt(req.params.id));
    if (!platforms[platformIndex]) return res.status(404).send("Invalid Request");
    platforms.splice(platformIndex, 1);
    return res.send(platforms);
});

router.put('/:id', (req, res, next)=>{
    const platformIndex = platforms.findIndex( p => p._id === parseInt(req.params.id));
    if (!platforms[platformIndex]) return res.status(404).send("Invalid Request");
    platforms[platformIndex].name = req.body.name;
    platforms[platformIndex].creator = req.body.creator;
    platforms[platformIndex].date = req.body.date;
    return res.send(platforms);
});




module.exports = router;