const jwt = require("jsonwebtoken");
const config = require('config');


module.exports = function (req, res, next){
    const token = req.header('x-auth-token');
    if(!token) return res.status(401).send("Access Denied. No Token Provided!");

    try {
        const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
        if(decoded === "expired") return res.status(401).send("You have been logged out! Please re-login togain access");
        req.user = decoded;
        next();      
    } catch (error) {
        return res.status(400).send( "Access Denied. Invalid Token Provided!");
    }

}