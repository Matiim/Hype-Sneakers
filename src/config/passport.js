const passport = require('passport')
const githubstrategy = require('../strategies/githubStrategy')
const {loginLocal,registerLocal} =require('../strategies/localStrategy')
const UserManager = require('../dao/UserManagerMongo')
const userManager = new UserManager()
const jwtStrategy =require ('../strategies/jwtStrategy')

const initializePassport = () =>{
	passport.use('github', githubstrategy)
	passport.use('login',loginLocal)
	passport.use('register',registerLocal)
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