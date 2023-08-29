const pasportLocal = require('passport-local')
const UserManager = require('../dao/UserManagerMongo')
const userManager = new UserManager()
const {isValidPassword}=require('../utils/passwordHash')

const LocalStrategy = pasportLocal.Strategy



	const registerLocal = new LocalStrategy(
	  { passReqToCallback: true, usernameField: 'email' },
	  async (req, username, password, done) => {
		const {name,lastname,email,age} = req.body

		try {
		  let user = await userManager.getUserByUsername(username)
	
		  if (user) {
			console.log('Usuario ya existe')
			return done(null, false)
		  }
		  if (!name || !lastname || !email || !age) {
			console.log('Completar todos los campos')
			return done(null, false)
		  }
	
		  let newUser = {name,lastname,email,age,password}
		  let result = await userManager.createUser(newUser)
	
		  return done(null, result)
		} catch (error) {
		  return done('Error al registrar el usuario')
		}
	  }
	)

	 
	const loginLocal=new LocalStrategy(
		{usernameField: 'email'},
		async (email, password, done) => {
			try {
	
				let user = await userManager.getUserByEmail(email)
	
				if (!user) {
					return done(null, false, { message: 'The user does not exist in the system' })
				}
	
				if (!isValidPassword(password, user.password)) {
					return done(null, false, { message: 'Incorrect Data' })
				}
	
				user = await userManager.userAuthenticate(user)
	
				return done(null, user)
			} catch (error) {
				return done(error)
			}
		}
	)


module.exports = {loginLocal,registerLocal}