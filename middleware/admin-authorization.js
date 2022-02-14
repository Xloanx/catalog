const {UserModel} = require('../models/user-model');

function allAdmin(req, res, next){
    if (!req.user.isAdmin) return res.status(403).send("Access Denied for you on administrative functions!!!");
    next();
}

function creators(req, res, next){
    rolesArray = req.user.roles
    if (!rolesArray.includes('create resource')) return res.status(403)
                                                            .send("Access denied: You do not have rights to create resources!!!");
    next();
}

function editors(req, res, next){
    rolesArray = req.user.roles
    if (!rolesArray.includes('edit resource')) return res.status(403)
                                                            .send("Access denied: You do not have rights to edit resources!!!");
    next();
}

function removers(req, res, next){
    rolesArray = req.user.roles
    if (!rolesArray.includes('delete resource')) return res.status(403)
                                                            .send("Access denied: You do not have rights to delete resources!!!");
    next();
}

function viewers(req, res, next){
    rolesArray = req.user.roles
    if (!rolesArray.includes('read resource')) return res.status(403)
                                                            .send("Access denied: You do not have rights to view resources!!!");
    next();
}




module.exports.allAdmin = allAdmin;
module.exports.creators = creators;
module.exports.editors = editors;
module.exports.removers= removers;
module.exports.viewers = viewers;