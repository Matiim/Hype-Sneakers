const GitHubStrategy = require('passport-github2')
const UserManager = require('../dao/UserManagerMongo')
const userManager = new UserManager()
const settings=require('../commands/commands')
const CLIENT_ID= settings.client_Id
const CLIENT_SECRET = settings.client_Secret




	const githubstrategy = new GitHubStrategy({
		clientID: CLIENT_ID,
		clientSecret:CLIENT_SECRET,
		callbackURL:'http://localhost:8080/api/sessions/github-callback'
	}, async (accessToken, refreshToken, profile, done) => {

		try {
			let user = await userManager.getUserByUsername(profile.username);
			if (!user) {
				let data = { first_name: profile.username, last_name: '', email: profile._json.email, age: 18, password: '' }
				const newUser = await userManager.createUser(data)
				const token = generateToken({
					userId: newUser._id,
					first_name: newUser.first_name,
					age: newUser.age,
					role: newUser.role,
					cart: newUser.cart
				})
				newUser.token = token
				return done(null, newUser)
			} else {
				const token = generateToken({
					userId: user._id,
					first_name: user.first_name,
					age: user.age,
					role: user.role,
					cart: user.cart
				})
				user.token = token
				return done(null, user)
			}
	
		} catch (error) {
			return done(error)
		}
	})


module.exports = githubstrategy