const GitHubStrategy = require('passport-github2')
const UserManager = require('../dao/UserManagerMongo')
const userManager = new UserManager()





	const githubstrategy = new GitHubStrategy({
		clientID: 'Iv1.03ccb75400076033',
		clientSecret:'ca8599418708ab30bdaa493e057ed87aa88a1eb4',
		callbackURL:'http://localhost:8080/api/sessions/github-callback'
	}, async (accessToken, refreshToken, profile, done) => {

		try {
			let user = await userManager.getUserByUsername(profile.username)
	
			if (!user) {
				let newUser = { name: profile.username, lastname: '', email: profile.email, age: 21, password: '' }
				let result = await userManager.createUser(newUser)
				
				return done(null, result)
			} else {
				return done(null, user)
			}
		} catch (error) {
			return done(error)
		}
	})



module.exports = githubstrategy