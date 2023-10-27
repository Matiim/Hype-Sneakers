const passport = require('passport')
const githubstrategy = require('../strategies/githubStrategy')
const loginLocalStrategy = require('../strategies/loginLocalStrategy')
const registerLocalStrategy = require('../strategies/registerLocalStrategy')
const jwtStrategy =require ('../strategies/jwtStrategy')


const initializePassport = () =>{
	passport.use('register',registerLocalStrategy)
	passport.use('login',loginLocalStrategy)
	passport.use('github', githubstrategy)
	passport.use('jwt',jwtStrategy)
}

module.exports = initializePassport