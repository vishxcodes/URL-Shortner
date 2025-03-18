const {getUser} = require('../services/auth')

function checkForAuthentication(req,res,next){
    req.user = null;
    const tokenCookie = req.cookies?.token
    if(!tokenCookie)
        return next();

    const token = tokenCookie
    const user = getUser(token)
    req.user = user
    next( )
}

/*
//USER AUTHENTICATION USING HEADER VALUE.
function checkForAuthentication(req,res,next){
    const authorizatonHeaderValue = req.headers["authorization"]
    req.user = null;

    if(!authorizatonHeaderValue || !authorizatonHeaderValue.startsWith('Bearer'))
        return next()

    const token = authorizatonHeaderValue.split("Bearer ")[1]
    const user = getUser(token)
    req.user = user
    next()
}
*/

function restrictTo(roles = []){
    return function(req,res,next){
        if(!req.user) return res.redirect ("/login ")

        if(!roles.includes(req.user.role)) res.end ("Unauthorized!")
    return next();
    }
}

module.exports = {
    checkForAuthentication,
    restrictTo,
}