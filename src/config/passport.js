const passport = require('passport')
const githubstrategy = require('../strategies/githubStrategy')
const loginLocalStrategy = require('../strategies/loginLocalStrategy')
const registerLocalStrategy = require('../strategies/registerLocalStrategy')
const jwtStrategy =require ('../strategies/jwtStrategy')
const UserManager = require('../dao/UserManagerMongo')
const userManager = new UserManager()

const initializePassport = () =>{
	passport.use('register',registerLocalStrategy)
	passport.use('login',loginLocalStrategy)
	passport.use('github', githubstrategy)
	passport.use('jwt',jwtStrategy)



	passport.serializeUser((user,done)=>{
		try{
			done(null, user._id)

		}catch(error){
			return done (error)
		}
		
	})

	passport.deserializeUser(async(id,done)=>{
		try{
			const user = await userManager.getUserById(id)
			done(null,user)
		}catch(error){
			return done(error)
		}
		
	})
}

module.exports = initializePassport