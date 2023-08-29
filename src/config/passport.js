const passport = require('passport')
const githubstrategy = require('../strategies/github-strategy')
const {loginLocal,registerLocal} =require('../strategies/local.strategy')
const UserManager = require('../dao/UserManagerMongo')
const userManager = new UserManager()


const initializePassport = () =>{
	passport.use('github', githubstrategy)
	passport.use('login',loginLocal)
	passport.use('register',registerLocal)







	passport.serializeUser((user,done)=>{
		done(null, user._id)
	})

	passport.deserializeUser(async(id,done)=>{
		const user = await userManager.getUserById(id)
		done(null,user)
	})
}

module.exports = initializePassport